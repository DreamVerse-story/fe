/**
 * Story Protocol NFT 등록 스크립트
 *
 * 사용법:
 * bun run scripts/register-nft.ts <privateKey>
 *
 * 예시:
 * bun run scripts/register-nft.ts 0x1234...
 *
 * 또는 환경변수 사용:
 * STORY_PRIVATE_KEY=0x1234... bun run scripts/register-nft.ts
 *
 * 주의: 이 스크립트는 DB 조회 없이 샘플 데이터를 생성하여 등록합니다.
 */

import {
    StoryClient,
    StoryConfig,
} from '@story-protocol/core-sdk';
import { http } from 'viem';
import {
    privateKeyToAccount,
    Address,
} from 'viem/accounts';
import { uploadToIPFS } from '../lib/storage/ipfs-metadata';
import type { DreamIPPackage } from '../lib/types';
import { createHash } from 'crypto';

/**
 * 샘플 Dream IP 데이터 생성
 */
function createSampleDream(
    accountAddress: string
): DreamIPPackage {
    const timestamp = Date.now();
    const dreamText = `I had a dream about a futuristic city where AI and humans coexist. The city was floating in the clouds, with neon lights illuminating the night sky. I met a mysterious character who showed me a hidden world beneath the surface.`;
    const dreamHash = createHash('sha256')
        .update(dreamText)
        .digest('hex');

    return {
        id: `test-${timestamp}`,
        dreamRecord: {
            id: `test-${timestamp}`,
            userId: 'test-user',
            dreamText,
            recordedAt: new Date().toISOString(),
        },
        analysis: {
            title: '미래 도시의 비밀',
            title_en: 'Secrets of the Future City',
            summary:
                'AI와 인간이 공존하는 미래 도시에서 숨겨진 세계를 발견하는 꿈',
            summary_en:
                'A dream about discovering a hidden world in a futuristic city where AI and humans coexist',
            characters: ['신비한 인물', 'AI 가이드'],
            characters_en: [
                'Mysterious Character',
                'AI Guide',
            ],
            world: '구름 위에 떠있는 네온 도시',
            world_en: 'A neon city floating in the clouds',
            objects: ['네온 조명', '홀로그램', '비행 차량'],
            locations: ['미래 도시', '지하 세계'],
            tones: ['몽환적', '신비로움', '미래적'],
            tones_en: [
                'Dreamy',
                'Mysterious',
                'Futuristic',
            ],
            genres: ['SF', '판타지'],
            genres_en: ['Sci-Fi', 'Fantasy'],
            emotions: ['호기심', '경이로움', '긴장감'],
        },
        visuals: [
            {
                id: `visual-${timestamp}-1`,
                type: 'key_visual',
                imageUrl:
                    'https://via.placeholder.com/1024x1024/4A90E2/FFFFFF?text=Future+City',
                prompt: 'A futuristic city floating in clouds with neon lights',
                title: '미래 도시의 전경',
                title_en: 'Panoramic View of Future City',
                description:
                    '구름 위에 떠있는 미래 도시의 장관',
                description_en:
                    'A magnificent view of a futuristic city floating in the clouds',
            },
        ],
        story: {
            synopsis:
                'AI와 인간이 공존하는 미래 도시에서 주인공이 숨겨진 세계를 발견하고, 신비한 인물과 함께 모험을 시작하는 이야기',
            synopsis_en:
                'A story about a protagonist discovering a hidden world in a futuristic city where AI and humans coexist, starting an adventure with a mysterious character',
            sceneBits: [
                '구름 위에 떠있는 도시의 첫 인상',
                '신비한 인물과의 만남',
                '지하 세계로의 여행',
            ],
            sceneBits_en: [
                'First impression of the floating city',
                'Meeting with the mysterious character',
                'Journey to the underground world',
            ],
            lore: '이 도시는 AI와 인간이 완벽하게 조화를 이루며 살아가는 곳이다. 하지만 표면 아래에는 아무도 모르는 비밀이 숨겨져 있다.',
            lore_en:
                'This city is where AI and humans live in perfect harmony. However, beneath the surface lies a secret that no one knows.',
        },
        dreamHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        status: 'completed',
        creatorAddress: accountAddress,
    };
}

async function main() {
    // 1. 인자 파싱
    const privateKey =
        process.argv[2] || process.env.STORY_PRIVATE_KEY;

    if (!privateKey) {
        console.error('❌ 프라이빗 키를 입력해주세요.');
        console.log(
            '사용법: bun run scripts/register-nft.ts <privateKey>'
        );
        console.log(
            '또는: STORY_PRIVATE_KEY=0x... bun run scripts/register-nft.ts'
        );
        process.exit(1);
    }

    if (!privateKey.startsWith('0x')) {
        console.error(
            '❌ 프라이빗 키는 0x로 시작해야 합니다.'
        );
        process.exit(1);
    }

    // 2. 환경 변수 확인
    const spgNftContract =
        process.env.NEXT_PUBLIC_SPG_NFT_IMPL;
    if (!spgNftContract) {
        console.error(
            '❌ NEXT_PUBLIC_SPG_NFT_IMPL 환경 변수가 설정되지 않았습니다.'
        );
        console.log(
            '.env.local 파일에 NEXT_PUBLIC_SPG_NFT_IMPL을 추가하세요.'
        );
        process.exit(1);
    }

    console.log('🚀 Story Protocol NFT 등록 시작...\n');
    console.log(`📋 정보:`);
    console.log(`   - SPG NFT Contract: ${spgNftContract}`);
    console.log(
        `   - Network: Aeneid Testnet (Chain ID: 1315)\n`
    );

    try {
        // 3. Account 생성
        console.log('🔐 계정 생성 중...');
        const account = privateKeyToAccount(
            privateKey as Address
        );
        console.log(
            `   ✅ 계정 주소: ${account.address}\n`
        );

        // 4. Story Protocol 클라이언트 생성
        console.log(
            '🔗 Story Protocol 클라이언트 생성 중...'
        );
        const config: StoryConfig = {
            account: account,
            transport: http('https://aeneid.storyrpc.io'),
            chainId: 1315 as any,
        };
        const storyClient = StoryClient.newClient(config);
        console.log('   ✅ 클라이언트 생성 완료\n');

        // 5. 샘플 Dream IP 데이터 생성
        console.log('📦 샘플 Dream IP 데이터 생성 중...');
        const dream = createSampleDream(account.address);
        console.log(
            `   ✅ Dream IP 생성 완료: ${dream.analysis.title}`
        );
        console.log(`   - Dream ID: ${dream.id}`);
        console.log(
            `   - Dream Hash: ${dream.dreamHash}\n`
        );

        // 8. IPFS에 메타데이터 업로드
        console.log('☁️  IPFS에 메타데이터 업로드 중...');
        const { ipMetadataCid, nftMetadataCid } =
            await uploadToIPFS(dream);
        console.log(
            `   ✅ IP Metadata CID: ${ipMetadataCid}`
        );
        console.log(
            `   ✅ NFT Metadata CID: ${nftMetadataCid}\n`
        );

        // 9. 메타데이터 해시 생성
        const ipMetadataHash = (
            dream.dreamHash.startsWith('0x')
                ? dream.dreamHash
                : `0x${dream.dreamHash}`
        ) as `0x${string}`;
        const nftMetadataHash = ipMetadataHash;

        // IPFS URL 생성
        const ipMetadataURI = `https://ipfs.io/ipfs/${ipMetadataCid}`;
        const nftMetadataURI = `https://ipfs.io/ipfs/${nftMetadataCid}`;

        console.log('📝 등록 정보:');
        console.log(
            `   - IP Metadata URI: ${ipMetadataURI}`
        );
        console.log(
            `   - IP Metadata Hash: ${ipMetadataHash}`
        );
        console.log(
            `   - NFT Metadata URI: ${nftMetadataURI}`
        );
        console.log(
            `   - NFT Metadata Hash: ${nftMetadataHash}\n`
        );

        // 10. Story Protocol에 IP Asset 등록
        console.log(
            '🔐 Story Protocol에 IP Asset 등록 중...'
        );
        console.log('   ⏳ 트랜잭션 전송 중...\n');

        const response =
            await storyClient.ipAsset.registerIpAsset({
                nft: {
                    type: 'mint',
                    spgNftContract:
                        spgNftContract as `0x${string}`,
                    recipient: account.address, // 수신자 명시적 지정
                },
                ipMetadata: {
                    ipMetadataURI,
                    ipMetadataHash,
                    nftMetadataURI,
                    nftMetadataHash,
                },
            });

        console.log('✅ 등록 완료!\n');
        console.log('📋 결과:');
        console.log(`   - IP Asset ID: ${response.ipId}`);
        console.log(
            `   - Transaction Hash: ${response.txHash}`
        );
        console.log(
            `   - Explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`
        );
        console.log(
            `   - Transaction: https://aeneid.explorer.story.foundation/tx/${response.txHash}\n`
        );

        // 11. 결과 출력 (MongoDB 업데이트는 생략 - 샘플 데이터이므로)
        console.log('📝 등록된 Dream IP 정보:');
        console.log(`   - Dream ID: ${dream.id}`);
        console.log(`   - Title: ${dream.analysis.title}`);
        console.log(
            `   - Title (EN): ${dream.analysis.title_en}`
        );
        console.log(
            `   - IP Metadata CID: ${ipMetadataCid}`
        );
        console.log(
            `   - NFT Metadata CID: ${nftMetadataCid}\n`
        );

        console.log('🎉 모든 작업이 완료되었습니다!');
    } catch (error: any) {
        console.error('\n❌ 오류 발생:');
        console.error(`   - Message: ${error.message}`);
        console.error(`   - Error: ${error}`);

        if (error.message?.includes('mintFeeToken')) {
            console.error(
                '\n⚠️  mintFeeToken 오류가 발생했습니다.'
            );
            console.error(
                '   이는 NFT 컬렉션의 민팅 설정 문제일 수 있습니다.'
            );
            console.error(
                '   scripts/create-nft-collection.ts를 실행하여 자신만의 컬렉션을 생성하세요.'
            );
        }

        process.exit(1);
    }
}

main().catch(console.error);
