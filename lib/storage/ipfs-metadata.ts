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
    // 무조건 영어로 생성 (분석 단계에서 이미 생성된 영어 데이터 사용)
    const ipMetadata: DreamIPMetadata = {
        version: '1.0',
        dreamHash: dream.dreamHash,
        // 기본 정보 (영어 사용)
        title: titleEn, // ✅ 영어 제목
        title_en: titleEn,
        summary: summaryEn, // ✅ 영어 요약
        summary_en: summaryEn,
        // 분류 정보 (영어 사용)
        genres: genresEn as any[], // ✅ 영어 장르
        genres_en: genresEn,
        tones: tonesEn as any[], // ✅ 영어 톤
        tones_en: tonesEn,
        // 캐릭터 정보 (영어 사용)
        characters:
            dream.analysis.characters_en ||
            dream.analysis.characters, // ✅ 영어 캐릭터
        characters_en:
            dream.analysis.characters_en ||
            dream.analysis.characters,
        // 세계관 정보 (영어 사용)
        world:
            dream.analysis.world_en || dream.analysis.world, // ✅ 영어 세계관
        world_en:
            dream.analysis.world_en || dream.analysis.world,
        // 추가 정보
        objects: dream.analysis.objects || [],
        locations: dream.analysis.locations || [],
        emotions: dream.analysis.emotions || [],
        // 스토리 정보 (영어 사용)
        synopsis:
            dream.story.synopsis_en || dream.story.synopsis, // ✅ 영어 시놉시스
        synopsis_en:
            dream.story.synopsis_en || dream.story.synopsis,
        sceneBits:
            dream.story.sceneBits_en ||
            dream.story.sceneBits, // ✅ 영어 장면 비트
        sceneBits_en:
            dream.story.sceneBits_en ||
            dream.story.sceneBits,
        lore: dream.story.lore_en || dream.story.lore, // ✅ 영어 로어
        lore_en: dream.story.lore_en || dream.story.lore,
        // 시각적 에셋 상세 정보 (영어 사용)
        visuals: dream.visuals.map((v) => ({
            id: v.id,
            type: v.type,
            url: v.ipfsUrl || v.imageUrl,
            title: v.title_en || v.title, // ✅ 영어 제목
            title_en: v.title_en || v.title,
            description: v.description_en || v.description, // ✅ 영어 설명
            description_en:
                v.description_en || v.description,
        })),
        // 타임스탬프
        createdAt: dream.createdAt,
        updatedAt: dream.updatedAt,
    };

    // 2. NFT 메타데이터 (ERC-721 Metadata Standard)
    // 무조건 영어로 생성 (분석 단계에서 이미 생성된 영어 데이터 사용)
    // 더 풍부한 description과 attributes 추가
    const nftDescription = [
        summaryEn,
        dream.story.synopsis_en
            ? `\n\nSynopsis:\n${dream.story.synopsis_en}`
            : '',
        dream.story.lore_en
            ? `\n\nWorld:\n${dream.story.lore_en.substring(
                  0,
                  500
              )}...`
            : '',
    ]
        .filter(Boolean)
        .join('');

    const nftMetadata = {
        name: titleEn, // ✅ 영어 제목 (분석 단계에서 생성)
        description: nftDescription, // ✅ 풍부한 설명 (요약 + 시놉시스 + 세계관)
        image:
            dream.visuals[0]?.ipfsUrl ||
            dream.visuals[0]?.imageUrl ||
            '',
        external_url: `https://dream-ip.app/dreams/${dream.id}`, // Dream IP 상세 페이지 링크
        attributes: [
            {
                trait_type: 'Dream Hash',
                value: dream.dreamHash,
                display_type: 'string',
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
                trait_type: 'World',
                value:
                    dream.analysis.world_en ||
                    dream.analysis.world,
            },
            {
                trait_type: 'Character Count',
                value: dream.analysis.characters.length,
                display_type: 'number',
            },
            {
                trait_type: 'Characters',
                value:
                    dream.analysis.characters_en?.join(
                        ', '
                    ) ||
                    dream.analysis.characters.join(', '),
            },
            {
                trait_type: 'Visual Assets',
                value: dream.visuals.length,
                display_type: 'number',
            },
            {
                trait_type: 'Created At',
                value: new Date(
                    dream.createdAt
                ).toISOString(),
                display_type: 'date',
            },
        ],
        // 추가 메타데이터 (OpenSea 등에서 표시)
        properties: {
            synopsis:
                dream.story.synopsis_en ||
                dream.story.synopsis,
            lore: dream.story.lore_en || dream.story.lore,
            sceneBits:
                dream.story.sceneBits_en?.join('\n') ||
                dream.story.sceneBits.join('\n'),
        },
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
