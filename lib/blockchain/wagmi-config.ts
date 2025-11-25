import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { defineChain } from 'viem';

// Story Protocol Testnet (Aeneid) 체인 설정
export const storyAeneid = defineChain({
    id: 1315,
    name: 'Story Aeneid Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'IP',
        symbol: 'IP',
    },
    rpcUrls: {
        default: {
            http: ['https://aeneid.storyrpc.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Story Explorer',
            url: 'https://aeneid.explorer.story.foundation',
        },
    },
    testnet: true,
});

// Wagmi 설정
export const wagmiConfig = getDefaultConfig({
    appName: 'Dream IP',
    projectId:
        process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
        '',
    chains: [storyAeneid],
    transports: {
        [storyAeneid.id]: http(),
    },
    ssr: true, // Next.js SSR 지원
});
