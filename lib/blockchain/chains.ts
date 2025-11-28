/**
 * Story Protocol 체인 설정 (서버/클라이언트 공통)
 * wagmi-config와 분리하여 서버 사이드에서도 사용 가능
 */

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

