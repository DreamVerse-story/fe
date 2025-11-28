import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { storyAeneid } from './chains';

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
