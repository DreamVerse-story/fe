/**
 * Dream IP용 NFT 컬렉션 생성 스크립트
 *
 * 사용법:
 * bun run scripts/create-nft-collection.ts
 */

import { getStoryClientWithWallet } from '../lib/blockchain/story-client';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { storyAeneid } from '../lib/blockchain/wagmi-config';

async function main() {
    console.log('🎨 Dream IP NFT 컬렉션 생성 시작...\n');

    // 1. Private Key 확인
    const privateKey = process.env.STORY_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error(
            '❌ STORY_PRIVATE_KEY 환경 변수가 설정되지 않았습니다.\n' +
                '   .env.local 파일에 STORY_PRIVATE_KEY를 추가하세요.'
        );
    }

    // 2. Account 생성
    const account = privateKeyToAccount(
        privateKey as `0x${string}`
    );
    console.log(`📝 계정 주소: ${account.address}\n`);

    // 3. Wallet Client 생성
    const walletClient = createWalletClient({
        account,
        chain: storyAeneid,
        transport: http('https://aeneid.storyrpc.io'),
    });

    // 4. Story Protocol Client 생성
    const storyClient = getStoryClientWithWallet(
        walletClient.account
    );

    // 5. NFT 컬렉션 생성
    console.log('🎨 NFT 컬렉션 생성 중...\n');

    const newCollection =
        await storyClient.nftClient.createNFTCollection({
            name: 'Dream IP Collection',
            symbol: 'DREAM',
            isPublicMinting: true, // 누구나 민팅 가능
            mintOpen: true, // 민팅 오픈
            mintFeeRecipient: account.address, // 민팅 수수료 수령자
            contractURI: '', // 컨트랙트 메타데이터 URI (선택사항)
        });

    console.log('✅ NFT 컬렉션 생성 완료!\n');
    console.log('📋 컬렉션 정보:');
    console.log(
        `   - SPG NFT Contract: ${newCollection.spgNftContract}`
    );
    console.log(
        `   - Transaction Hash: ${newCollection.txHash}`
    );
    console.log(
        `   - Block Explorer: https://aeneid.explorer.story.foundation/tx/${newCollection.txHash}`
    );

    console.log(
        '\n✨ 이제 이 컨트랙트 주소를 환경 변수에 추가하세요:'
    );
    console.log(
        `   NEXT_PUBLIC_SPG_NFT_IMPL=${newCollection.spgNftContract}\n`
    );
}

main()
    .then(() => {
        console.log('✅ 완료!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ 에러 발생:', error);
        process.exit(1);
    });
