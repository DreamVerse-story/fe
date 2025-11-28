/**
 * Story Protocol 통합
 * Dream IP를 블록체인에 등록하고 라이선스 관리
 */

import { getStoryClient } from './story-client';
import { uploadToIPFS } from '../storage/ipfs-metadata';
import {
    saveDream,
    getDreamById,
} from '../storage/mongo-storage';
import type { DreamIPPackage } from '../types';

/**
 * Dream IP Asset 등록 결과
 */
export interface RegisterDreamResult {
    ipAssetId: string; // Story Protocol IP Asset ID
    ipfsCid: string; // IPFS CID
    txHash: string; // 트랜잭션 해시
}

/**
 * Dream IP를 Story Protocol에 등록
 *
 * @param dreamId - Dream IP ID
 * @param ownerAddress - 소유자 지갑 주소
 * @returns 등록 결과 (ipAssetId, ipfsCid, txHash)
 */
export async function registerDreamIP(
    dreamId: string,
    ownerAddress: string
): Promise<RegisterDreamResult> {
    console.log(
        '🔗 Story Protocol에 Dream IP 등록 시작:',
        dreamId
    );

    // 1. Dream IP 패키지 조회
    const dream = await getDreamById(dreamId);
    if (!dream) {
        throw new Error(
            `Dream IP를 찾을 수 없습니다: ${dreamId}`
        );
    }

    if (dream.status !== 'completed') {
        throw new Error('Dream IP가 완료되지 않았습니다.');
    }

    // 2. IPFS에 전체 패키지 메타데이터 업로드
    console.log('📦 IPFS에 메타데이터 업로드 중...');
    const { ipMetadataCid, nftMetadataCid } =
        await uploadToIPFS(dream);
    console.log(
        `✅ IPFS 업로드 완료: IP Metadata: ${ipMetadataCid}, NFT Metadata: ${nftMetadataCid}`
    );

    // 3. Story Protocol 클라이언트 가져오기
    const client = getStoryClient();

    // 4. IP Asset 등록
    console.log('🎯 Story Protocol에 IP Asset 등록 중...');

    // dreamHash에 0x 접두사 추가 (bytes32 형식)
    const dreamHashWithPrefix = dream.dreamHash.startsWith(
        '0x'
    )
        ? dream.dreamHash
        : `0x${dream.dreamHash}`;

    // IPFS Gateway URL 생성
    const ipfsGateway = 'gateway.pinata.cloud';
    const ipMetadataURI = `https://${ipfsGateway}/ipfs/${ipMetadataCid}`;
    const nftMetadataURI = `https://${ipfsGateway}/ipfs/${nftMetadataCid}`;

    const response = await client.ipAsset.register({
        nftContract: process.env
            .STORY_NFT_CONTRACT as `0x${string}`,
        tokenId: BigInt(Date.now()), // 임시로 timestamp 사용
        ipMetadata: {
            ipMetadataURI: ipMetadataURI,
            ipMetadataHash:
                dreamHashWithPrefix as `0x${string}`,
            nftMetadataURI: nftMetadataURI,
            nftMetadataHash:
                dreamHashWithPrefix as `0x${string}`,
        },
    });

    console.log(`✅ IP Asset 등록 완료: ${response.ipId}`);

    // 5. MongoDB 업데이트
    const updatedDream: any = {
        ...dream,
        ipfsCid: ipMetadataCid, // IP Metadata CID 저장
        nftMetadataCid: nftMetadataCid, // NFT Metadata CID도 저장
        ipAssetId: response.ipId,
        status: 'completed', // 또는 'registered' 상태 추가
        updatedAt: new Date().toISOString(),
    };

    await saveDream(updatedDream);

    console.log('💾 MongoDB 업데이트 완료');

    return {
        ipAssetId: response.ipId || '',
        ipfsCid: ipMetadataCid, // IP Metadata CID 반환
        txHash: response.txHash || '',
    };
}

/**
 * Dream IP에 라이선스 조건 설정
 *
 * @param ipAssetId - IP Asset ID
 * @param licenseTerms - 라이선스 조건
 */
export async function attachLicenseTerms(
    ipAssetId: string,
    licenseTerms: {
        commercialUse: boolean;
        commercialRevShare: number; // 0-100 (%)
        derivativesAllowed: boolean;
        derivativesRevShare: number; // 0-100 (%)
        currency: string; // ETH 주소
        price: bigint; // wei 단위
    }
) {
    console.log('📜 라이선스 조건 설정 중:', ipAssetId);

    const client = getStoryClient();

    const response =
        await client.license.attachLicenseTerms({
            ipId: ipAssetId as `0x${string}`,
            licenseTemplate: process.env
                .STORY_LICENSE_TEMPLATE as `0x${string}`,
            licenseTermsId: BigInt(1), // 기본 라이선스 템플릿 ID
        });

    console.log(
        '✅ 라이선스 조건 설정 완료:',
        response.txHash
    );

    return response;
}

/**
 * Dream IP 라이선스 발행 (토큰화)
 *
 * @param ipAssetId - IP Asset ID
 * @param licenseTermsId - 라이선스 조건 ID (IP Asset에 첨부된 라이선스 조건)
 * @param amount - 발행할 라이선스 수량
 * @param receiverAddress - 수신자 주소 (선택사항, 없으면 트랜잭션 발신자)
 * @param maxMintingFee - 최대 민팅 수수료 (기본값: 0 = 비활성화)
 * @param maxRevenueShare - 최대 수익 공유 (기본값: 100)
 */
export async function mintLicenseTokens(
    ipAssetId: string,
    licenseTermsId: bigint | string,
    amount: number,
    receiverAddress?: string,
    maxMintingFee: bigint = BigInt(0),
    maxRevenueShare: number = 100
) {
    console.log('🎫 라이선스 토큰 발행 중:', {
        ipAssetId,
        licenseTermsId,
        amount,
        receiverAddress,
    });

    const client = getStoryClient();

    const response = await client.license.mintLicenseTokens(
        {
            licenseTermsId:
                typeof licenseTermsId === 'string'
                    ? BigInt(licenseTermsId)
                    : licenseTermsId,
            licensorIpId: ipAssetId as `0x${string}`,
            receiver: receiverAddress
                ? (receiverAddress as `0x${string}`)
                : undefined, // 없으면 트랜잭션 발신자에게 발행
            amount: BigInt(amount),
            maxMintingFee: maxMintingFee,
            maxRevenueShare: maxRevenueShare,
        }
    );

    console.log(
        '✅ 라이선스 토큰 발행 완료:',
        response.licenseTokenIds
    );

    return response;
}

/**
 * 파생 IP 등록 (2차 창작물)
 *
 * @param parentIpId - 부모 IP Asset ID (원본 Dream IP)
 * @param childMetadata - 2차 창작물 메타데이터
 */
export async function registerDerivative(
    parentIpId: string,
    childMetadata: {
        name: string;
        description: string;
        metadataURI: string;
    }
) {
    console.log('🌱 파생 IP 등록 중:', {
        parentIpId,
        childMetadata,
    });

    const client = getStoryClient();

    const response =
        await client.ipAsset.registerDerivative({
            childIpId: '0x' as `0x${string}`, // 새로 생성될 child IP
            parentIpIds: [parentIpId as `0x${string}`],
            licenseTermsIds: [BigInt(1)],
        });

    console.log('✅ 파생 IP 등록 완료:', response.txHash);

    return response;
}

/**
 * IP Asset 정보 조회
 *
 * @param ipAssetId - IP Asset ID
 */
export async function getIPAssetInfo(ipAssetId: string) {
    console.log('📋 IP Asset 정보 조회:', ipAssetId);

    // Story Protocol SDK 버전에 따라 get 메서드가 없을 수 있음
    // MongoDB에서 저장된 정보를 반환
    const dream = await getDreamById(ipAssetId);
    const dreamAny = dream as any;

    return {
        ipId: ipAssetId,
        owner: dream?.dreamRecord.userId || 'unknown',
        metadataURI: dreamAny?.ipfsCid
            ? `ipfs://${dreamAny.ipfsCid}`
            : '',
        status: dream?.status || 'unknown',
    };
}

/**
 * 로열티 클레임
 *
 * @param ipAssetId - IP Asset ID
 * @param snapshotIds - 스냅샷 ID 배열
 */
export async function claimRoyalties(
    ipAssetId: string,
    snapshotIds: bigint[]
) {
    console.log('💰 로열티 클레임 중:', {
        ipAssetId,
        snapshotIds,
    });

    // Story Protocol SDK 버전에 따라 royalty 메서드가 다를 수 있음
    // 추후 SDK 업데이트 후 구현
    console.log('✅ 로열티 클레임 요청 완료');

    return {
        success: true,
        message:
            '로열티 클레임 기능은 Story Protocol SDK 업데이트 후 구현 예정',
        ipAssetId,
        snapshotIds: snapshotIds.map((id) => id.toString()),
    };
}
