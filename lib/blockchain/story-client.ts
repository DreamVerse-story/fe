/**
 * Story Protocol SDK 클라이언트
 * Dream IP를 블록체인에 등록하고 관리
 */

import {
    StoryClient,
    StoryConfig,
} from '@story-protocol/core-sdk';
import { http, custom } from 'viem';
import {
    privateKeyToAccount,
    Address,
} from 'viem/accounts';

/**
 * Story Protocol 네트워크 설정
 */
export type StoryNetwork = 'aeneid';

/**
 * Story Protocol 클라이언트 싱글톤
 */
let storyClient: StoryClient | null = null;
let currentAccount: Address | null = null;

/**
 * Story Protocol 클라이언트 초기화
 */
export function getStoryClient(): StoryClient {
    if (!storyClient) {
        // 환경 변수 체크
        const privateKey = process.env.STORY_PRIVATE_KEY;
        const network = (process.env.STORY_NETWORK ||
            'aeneid') as StoryNetwork;

        if (!privateKey) {
            throw new Error(
                'STORY_PRIVATE_KEY 환경 변수가 설정되지 않았습니다.'
            );
        }

        // Account 생성
        const account = privateKeyToAccount(
            privateKey as Address
        );

        // Aeneid Testnet 설정
        const chainId = 1315; // Aeneid Testnet
        const rpcUrl = 'https://aeneid.storyrpc.io';

        // Story Protocol 설정
        const config: StoryConfig = {
            account: account,
            transport: http(rpcUrl),
            chainId: chainId as any,
        };

        storyClient = StoryClient.newClient(config);
    }

    return storyClient;
}

/**
 * Web3 지갑 계정으로 Story Protocol 클라이언트 생성
 * (Aeneid Testnet 전용)
 *
 * @param walletClient - Web3 Wallet Client (wagmi에서 가져온 전체 클라이언트)
 */
export function getStoryClientWithWallet(
    walletClient: any
): StoryClient {
    // 같은 계정이면 기존 클라이언트 재사용
    if (
        storyClient &&
        walletClient.account &&
        currentAccount === walletClient.account.address
    ) {
        return storyClient;
    }

    // Aeneid Testnet 설정 (테스트넷 전용)
    const chainId = 1315; // Aeneid Testnet
    const rpcUrl = 'https://aeneid.storyrpc.io';

    // walletClient에서 account 추출
    if (!walletClient.account) {
        throw new Error('지갑 계정이 연결되지 않았습니다.');
    }

    // custom transport를 사용하여 window.ethereum과 연동
    // 이렇게 하면 eth_sendTransaction이 올바르게 호출됨
    const config: StoryConfig = {
        account: walletClient.account, // ← account만 전달
        transport: custom((window as any).ethereum), // ← window.ethereum 사용
        chainId: chainId as any,
    };

    storyClient = StoryClient.newClient(config);
    currentAccount = walletClient.account.address;

    return storyClient;
}

/**
 * 클라이언트 리셋 (테스트용)
 */
export function resetStoryClient(): void {
    storyClient = null;
    currentAccount = null;
}
