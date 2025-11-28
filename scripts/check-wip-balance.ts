/**
 * WIP 토큰 잔액 확인 스크립트
 *
 * 사용법:
 * bun run scripts/check-wip-balance.ts <address>
 *
 * 예시:
 * bun run scripts/check-wip-balance.ts 0x1234...
 */

import {
    createPublicClient,
    http,
    formatEther,
} from 'viem';
import { storyAeneid } from '../lib/blockchain/chains';
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk';

// ERC20 balanceOf 함수 ABI
const ERC20_ABI = [
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'mintFeeToken',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'address' }], // 주소 반환
    },
] as const;

async function main() {
    const address = process.argv[2] as `0x${string}`;

    if (!address) {
        console.error('❌ 주소를 입력해주세요.');
        console.log(
            '사용법: bun run scripts/check-wip-balance.ts <address>'
        );
        process.exit(1);
    }

    if (
        !address.startsWith('0x') ||
        address.length !== 42
    ) {
        console.error(
            '❌ 유효한 이더리움 주소가 아닙니다.'
        );
        process.exit(1);
    }

    console.log('🔍 WIP 토큰 잔액 확인 중...\n');
    console.log(`📋 정보:`);
    console.log(
        `   - WIP Token Contract: ${
            process.env
                .NEXT_PUBLIC_SPG_NFT_IMPL as `0x${string}`
        }`
    );
    console.log(`   - 조회 주소: ${address}`);
    console.log(
        `   - Network: Aeneid Testnet (Chain ID: 1315)\n`
    );

    // Public Client 생성
    const publicClient = createPublicClient({
        chain: storyAeneid,
        transport: http('https://aeneid.storyrpc.io'),
    });

    try {
        // balanceOf 호출
        console.log('📞 RPC 호출:');
        console.log(`   - Method: eth_call`);
        console.log(
            `   - Contract: ${
                process.env
                    .NEXT_PUBLIC_SPG_NFT_IMPL as `0x${string}`
            }`
        );
        console.log(`   - Function: balanceOf(${address})`);
        console.log(
            `   - Function Signature: 0x70a08231\n`
        );

        const balance = await publicClient.readContract({
            address: process.env
                .NEXT_PUBLIC_SPG_NFT_IMPL as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address],
        });

        console.log('✅ 결과:');
        console.log(
            `   - Raw Balance: ${balance.toString()}`
        );
        console.log(
            `   - Formatted Balance: ${formatEther(
                balance
            )} WIP`
        );
        console.log(
            `   - Balance (Wei): ${balance.toString()}\n`
        );

        if (balance === BigInt(0)) {
            console.log('⚠️  WIP 토큰 잔액이 0입니다.');
            console.log(
                '   mintFeeToken 오류는 잔액 부족 때문일 수 있습니다.'
            );
        } else {
            console.log('✅ WIP 토큰 잔액이 있습니다.');
        }

        // mintFeeToken 호출
        console.log('\n📞 mintFeeToken 호출:');
        console.log(`   - Method: eth_call`);
        console.log(
            `   - Contract: ${
                process.env
                    .NEXT_PUBLIC_SPG_NFT_IMPL as `0x${string}`
            }`
        );
        console.log(`   - Function: mintFeeToken()`);
        console.log(
            `   - Function Signature: (확인 필요)\n`
        );

        try {
            const mintFeeTokenAddress =
                await publicClient.readContract({
                    address: process.env
                        .NEXT_PUBLIC_SPG_NFT_IMPL as `0x${string}`,
                    abi: ERC20_ABI,
                    functionName: 'mintFeeToken',
                    args: [],
                });

            console.log('✅ mintFeeToken 결과:');
            console.log(
                `   - Fee Token Address: ${mintFeeTokenAddress}`
            );
            console.log(
                `   - Type: ${typeof mintFeeTokenAddress}\n`
            );

            // WIP_TOKEN_ADDRESS와 비교
            if (mintFeeTokenAddress) {
                console.log('📊 비교:');
                console.log(
                    `   - mintFeeToken 반환값: ${mintFeeTokenAddress}`
                );
                console.log(
                    `   - WIP_TOKEN_ADDRESS: ${WIP_TOKEN_ADDRESS}`
                );
                if (
                    mintFeeTokenAddress.toLowerCase() ===
                    WIP_TOKEN_ADDRESS.toLowerCase()
                ) {
                    console.log('   ✅ 일치합니다!');
                } else {
                    console.log(
                        '   ⚠️  일치하지 않습니다.'
                    );
                }
            }
        } catch (mintError: any) {
            console.error('❌ mintFeeToken 호출 오류:');
            console.error(
                `   - Message: ${mintError.message}`
            );
            console.error(`   - Error: ${mintError}`);

            if (mintError.message?.includes('0x')) {
                console.error(
                    '\n⚠️  mintFeeToken 함수가 존재하지 않거나 호출에 실패했습니다.'
                );
                console.error(
                    '   - 컨트랙트에 이 함수가 없을 수 있습니다.'
                );
            }
        }
    } catch (error: any) {
        console.error('❌ 오류 발생:');
        console.error(`   - Message: ${error.message}`);
        console.error(`   - Error: ${error}`);

        if (error.message?.includes('0x')) {
            console.error(
                '\n⚠️  컨트랙트 호출이 실패했습니다.'
            );
            console.error(
                '   - 컨트랙트 주소가 올바른지 확인하세요.'
            );
            console.error(
                '   - 네트워크 연결을 확인하세요.'
            );
        }
    }
}

main().catch(console.error);
