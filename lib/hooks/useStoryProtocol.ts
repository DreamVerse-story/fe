'use client';

import { useAccount, useWalletClient } from 'wagmi';
import { useMemo } from 'react';
import { getStoryClientWithWallet } from '../blockchain/story-client';

/**
 * Story Protocol + 지갑 연동 Hook
 *
 * wagmi의 지갑 정보를 Story Protocol SDK와 연동
 *
 * @returns {
 *   isConnected: 지갑 연결 여부,
 *   address: 지갑 주소,
 *   storyClient: Story Protocol 클라이언트 (지갑 연결 시),
 *   isLoading: 로딩 상태
 * }
 */
export function useStoryProtocol() {
    const { address, isConnected } = useAccount();
    const { data: walletClient, isLoading } =
        useWalletClient();

    // Story Protocol 클라이언트 생성 (지갑 연결 시)
    const storyClient = useMemo(() => {
        if (!walletClient || !isConnected || !address) {
            return null;
        }

        try {
            // Aeneid Testnet 사용 (Chain ID: 1315)
            // walletClient 전체를 전달 (account 속성 포함)
            return getStoryClientWithWallet(walletClient);
        } catch (error) {
            console.error(
                'Story Protocol 클라이언트 생성 실패:',
                error
            );
            return null;
        }
    }, [walletClient, isConnected, address]);

    return {
        isConnected,
        address,
        storyClient,
        isLoading,
    };
}
