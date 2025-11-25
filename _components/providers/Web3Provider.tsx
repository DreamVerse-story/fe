'use client';

import { ReactNode } from 'react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/blockchain/wagmi-config';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

interface Web3ProviderProps {
    children: ReactNode;
}

/**
 * Web3 Provider
 *
 * wagmi + RainbowKit을 사용한 Web3 지갑 연결 Provider
 *
 * Features:
 * - 다중 지갑 지원 (MetaMask, WalletConnect 등)
 * - Story Protocol Aeneid Testnet 지원
 * - React Query 통합
 */
export function Web3Provider({
    children,
}: Web3ProviderProps) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
