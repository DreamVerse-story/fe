/**
 * Dream IP 메타데이터 IPFS 업로드
 */

import { PinataSDK } from 'pinata-web3';
import type {
    DreamIPPackage,
    DreamIPMetadata,
} from '../types';

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
 * Dream IP 패키지를 IPFS에 업로드
 * IP 메타데이터와 NFT 메타데이터를 모두 업로드하고 CID를 반환
 *
 * @param dream - Dream IP 패키지
 * @returns { ipMetadataCid: string, nftMetadataCid: string }
 */
export async function uploadToIPFS(
    dream: DreamIPPackage
): Promise<{
    ipMetadataCid: string;
    nftMetadataCid: string;
}> {
    const pinata = getPinataClient();

    // NFT 메타데이터는 무조건 영어 사용 (분석 단계에서 이미 생성됨)
    console.log('📝 NFT 메타데이터 준비 중 (영어)...');

    // 분석 단계에서 생성된 영어 데이터 사용
    const titleEn =
        dream.analysis.title_en || dream.analysis.title;
    const summaryEn =
        dream.analysis.summary_en || dream.analysis.summary;
    const genresEn =
        dream.analysis.genres_en || dream.analysis.genres;
    const tonesEn =
        dream.analysis.tones_en || dream.analysis.tones;

    console.log('✅ NFT 메타데이터 준비 완료 (영어)');
    console.log('  - Title (EN):', titleEn);
    console.log('  - Genres (EN):', genresEn.join(', '));

    // 1. IP 메타데이터 (Story Protocol IPA Metadata Standard)
    // 원본 언어 유지
    const ipMetadata: DreamIPMetadata = {
        version: '1.0',
        dreamHash: dream.dreamHash,
        title: dream.analysis.title,
        summary: dream.analysis.summary,
        genres: dream.analysis.genres as any[],
        tones: dream.analysis.tones as any[],
        characters: dream.analysis.characters,
        world: dream.analysis.world,
        visualsUrls: dream.visuals.map(
            (v) => v.ipfsUrl || v.imageUrl
        ),
        storyContentUrl: '', // 스토리 컨텐츠 URL (별도 업로드 필요 시)
        createdAt: dream.createdAt,
    };

    // 2. NFT 메타데이터 (ERC-721 Metadata Standard)
    // 무조건 영어로 생성 (분석 단계에서 이미 생성된 영어 데이터 사용)
    const nftMetadata = {
        name: titleEn, // ✅ 영어 제목 (분석 단계에서 생성)
        description: summaryEn, // ✅ 영어 요약 (분석 단계에서 생성)
        image:
            dream.visuals[0]?.ipfsUrl ||
            dream.visuals[0]?.imageUrl ||
            '',
        attributes: [
            {
                trait_type: 'Dream Hash',
                value: dream.dreamHash,
            },
            {
                trait_type: 'Genres',
                value: genresEn.join(', '), // ✅ 영어 장르 (분석 단계에서 생성)
            },
            {
                trait_type: 'Tones',
                value: tonesEn.join(', '), // ✅ 영어 톤 (분석 단계에서 생성)
            },
            {
                trait_type: 'Characters',
                value: dream.analysis.characters.length,
            },
            {
                trait_type: 'Created At',
                value: new Date(
                    dream.createdAt
                ).toISOString(),
            },
        ],
    };

    // IP 메타데이터 업로드
    const ipUpload = await pinata.upload.json(ipMetadata, {
        metadata: {
            name: `${dream.analysis.title} - IP Metadata`,
            keyValues: {
                type: 'ip-metadata',
                dreamId: dream.id,
                userId: dream.dreamRecord.userId,
                genres: dream.analysis.genres.join(','),
            },
        },
    });

    // NFT 메타데이터 업로드
    const nftUpload = await pinata.upload.json(
        nftMetadata,
        {
            metadata: {
                name: `${dream.analysis.title} - NFT Metadata`,
                keyValues: {
                    type: 'nft-metadata',
                    dreamId: dream.id,
                    userId: dream.dreamRecord.userId,
                },
            },
        }
    );

    console.log(
        '✅ IP 메타데이터 IPFS 업로드 완료:',
        ipUpload.IpfsHash
    );
    console.log(
        '✅ NFT 메타데이터 IPFS 업로드 완료:',
        nftUpload.IpfsHash
    );

    return {
        ipMetadataCid: ipUpload.IpfsHash,
        nftMetadataCid: nftUpload.IpfsHash,
    };
}

/**
 * IPFS에서 메타데이터 조회
 *
 * @param cid - IPFS CID
 * @returns 메타데이터 객체
 */
export async function getFromIPFS(
    cid: string
): Promise<DreamIPMetadata> {
    const pinata = getPinataClient();

    const url = await pinata.gateways.convert(cid);
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `IPFS 조회 실패: ${response.statusText}`
        );
    }

    return response.json();
}
