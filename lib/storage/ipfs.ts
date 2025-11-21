/**
 * IPFS 업로드 유틸리티
 * Pinata를 사용한 영구 이미지 저장
 */

import { PinataSDK } from 'pinata-web3';

/**
 * Pinata 클라이언트 초기화
 */
function getPinataClient(): PinataSDK {
    const jwt = process.env.PINATA_JWT;
    const gateway =
        process.env.PINATA_GATEWAY ||
        'gateway.pinata.cloud';

    if (!jwt) {
        throw new Error(
            'PINATA_JWT 환경 변수가 설정되지 않았습니다.'
        );
    }

    return new PinataSDK({
        pinataJwt: jwt,
        pinataGateway: gateway,
    });
}

/**
 * URL에서 이미지를 다운로드하여 Buffer로 반환
 */
async function downloadImage(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `이미지 다운로드 실패: ${response.statusText}`
        );
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

/**
 * 이미지 URL을 IPFS에 업로드
 * @param imageUrl - OpenAI 등에서 생성된 이미지 URL
 * @param metadata - 파일 메타데이터 (옵션)
 * @returns IPFS CID 및 Gateway URL
 */
export async function uploadImageToIPFS(
    imageUrl: string,
    metadata?: {
        name?: string;
        keyvalues?: Record<string, string>;
    }
): Promise<{
    cid: string;
    url: string;
}> {
    try {
        const pinata = getPinataClient();

        // 1. 이미지 다운로드
        const imageBuffer = await downloadImage(imageUrl);

        // 2. Blob 생성 (Buffer를 Uint8Array로 변환)
        const uint8Array = new Uint8Array(imageBuffer);
        const blob = new Blob([uint8Array], {
            type: 'image/png',
        });
        const file = new File(
            [blob],
            metadata?.name || 'dream-image.png',
            {
                type: 'image/png',
            }
        );

        // 3. Pinata에 업로드
        const upload = await pinata.upload.file(file);

        // 4. Gateway URL 생성
        const gatewayUrl = await pinata.gateways.convert(
            upload.IpfsHash
        );

        return {
            cid: upload.IpfsHash,
            url: gatewayUrl,
        };
    } catch (error) {
        console.error('IPFS 업로드 오류:', error);
        throw new Error(
            `IPFS 업로드 실패: ${
                error instanceof Error
                    ? error.message
                    : String(error)
            }`
        );
    }
}

/**
 * 여러 이미지를 병렬로 IPFS에 업로드
 * @param images - 업로드할 이미지 배열 {url, name}
 * @returns 각 이미지의 CID 및 URL 배열
 */
export async function uploadImagesToIPFS(
    images: Array<{ url: string; name: string }>
): Promise<
    Array<{
        originalUrl: string;
        cid: string;
        ipfsUrl: string;
    }>
> {
    const uploadPromises = images.map(async (image) => {
        try {
            const result = await uploadImageToIPFS(
                image.url,
                {
                    name: image.name,
                }
            );
            return {
                originalUrl: image.url,
                cid: result.cid,
                ipfsUrl: result.url,
            };
        } catch (error) {
            console.error(
                `${image.name} IPFS 업로드 실패:`,
                error
            );
            // 업로드 실패해도 원본 URL 유지
            return {
                originalUrl: image.url,
                cid: '',
                ipfsUrl: '',
            };
        }
    });

    return Promise.all(uploadPromises);
}
