'use client';

import { useState } from 'react';
import { useStoryProtocol } from '@/lib/hooks/useStoryProtocol';
import { useTranslation } from '@/lib/i18n/context';
import { useToast } from './Toast';

interface StoryRegisterButtonProps {
    dreamId: string;
    className?: string;
}

/**
 * Story Protocol 등록 버튼 컴포넌트
 *
 * Dream IP를 Story Protocol 블록체인에 등록하는 버튼
 * 사용자의 지갑으로 직접 트랜잭션을 서명하고 전송합니다.
 */
export function StoryRegisterButton({
    dreamId,
    className = '',
}: StoryRegisterButtonProps) {
    const { isConnected, address, storyClient } =
        useStoryProtocol();
    const { locale } = useTranslation();
    const { showToast } = useToast();
    const [isRegistering, setIsRegistering] =
        useState(false);

    const handleRegister = async () => {
        if (!isConnected || !address) {
            showToast(
                locale === 'ko'
                    ? '먼저 지갑을 연결해주세요.'
                    : 'Please connect your wallet first.',
                'error'
            );
            return;
        }

        if (!storyClient) {
            showToast(
                locale === 'ko'
                    ? 'Story Protocol 클라이언트를 초기화하는 중입니다...'
                    : 'Initializing Story Protocol client...',
                'error'
            );
            return;
        }

        if (
            !confirm(
                locale === 'ko'
                    ? 'Story Protocol에 이 Dream IP를 등록하시겠습니까?\n\n지갑에서 트랜잭션을 승인해주세요.'
                    : 'Register this Dream IP to Story Protocol?\n\nPlease approve the transaction in your wallet.'
            )
        ) {
            return;
        }

        setIsRegistering(true);

        try {
            // 1. Dream IP 데이터 가져오기
            showToast(
                locale === 'ko'
                    ? '📦 Dream IP 데이터를 가져오는 중...'
                    : '📦 Fetching Dream IP data...',
                'info'
            );

            const dreamResponse = await fetch(
                `/api/dreams/${dreamId}`
            );
            const dreamData = await dreamResponse.json();

            if (!dreamData.success || !dreamData.dream) {
                throw new Error(
                    'Dream IP를 찾을 수 없습니다.'
                );
            }

            const dream = dreamData.dream;

            // 2. IPFS에 메타데이터 업로드 (서버에서 처리)
            showToast(
                locale === 'ko'
                    ? '☁️ IPFS에 메타데이터 업로드 중...'
                    : '☁️ Uploading metadata to IPFS...',
                'info'
            );

            const ipfsResponse = await fetch(
                '/api/story/prepare-metadata',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ dreamId }),
                }
            );

            const ipfsData = await ipfsResponse.json();

            if (
                !ipfsData.success ||
                !ipfsData.ipMetadataCid ||
                !ipfsData.nftMetadataCid
            ) {
                throw new Error(
                    'IPFS 업로드에 실패했습니다.'
                );
            }

            // 3. Story Protocol에 IP Asset 등록 (사용자 지갑으로 직접 서명!)
            showToast(
                locale === 'ko'
                    ? '🔐 지갑에서 트랜잭션을 승인해주세요...'
                    : '🔐 Please approve the transaction in your wallet...',
                'info'
            );

            // Story Protocol에 IP Asset 등록 (공식 문서 방식)
            // NFT 민팅 + IP Asset 등록을 한 번에 처리

            // IPFS URL 생성 (공식 문서 방식 - ipfs.io gateway 사용)
            const ipMetadataURI = `https://ipfs.io/ipfs/${ipfsData.ipMetadataCid}`;
            const nftMetadataURI = `https://ipfs.io/ipfs/${ipfsData.nftMetadataCid}`;

            // 메타데이터 해시 생성 (bytes32 형식)
            // dreamHash는 이미 64자 hex 문자열 (32 bytes)이므로 0x만 추가
            const ipMetadataHash = (
                dream.dreamHash.startsWith('0x')
                    ? dream.dreamHash
                    : `0x${dream.dreamHash}`
            ) as `0x${string}`;

            const nftMetadataHash = ipMetadataHash; // 같은 해시 사용

            const response =
                await storyClient.ipAsset.registerIpAsset({
                    nft: {
                        type: 'mint',
                        spgNftContract: process.env
                            .NEXT_PUBLIC_SPG_NFT_IMPL as `0x${string}`,
                    },
                    ipMetadata: {
                        ipMetadataURI,
                        ipMetadataHash,
                        nftMetadataURI,
                        nftMetadataHash,
                    },
                });

            showToast(
                locale === 'ko'
                    ? '⏳ 블록체인에서 처리 중...'
                    : '⏳ Processing on blockchain...',
                'info'
            );

            // 4. MongoDB에 결과 저장
            await fetch(`/api/dreams/${dreamId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ipfsCid: ipfsData.ipfsCid,
                    ipAssetId: response.ipId,
                    txHash: response.txHash,
                }),
            });

            showToast(
                locale === 'ko'
                    ? `🎉 Story Protocol에 등록 완료!\n\nIP Asset ID: ${response.ipId?.slice(
                          0,
                          10
                      )}...`
                    : `🎉 Registered to Story Protocol!\n\nIP Asset ID: ${response.ipId?.slice(
                          0,
                          10
                      )}...`,
                'success'
            );
        } catch (error: any) {
            console.error(
                'Story Protocol 등록 오류:',
                error
            );

            // 사용자가 트랜잭션을 거부한 경우
            if (
                error.message?.includes('User rejected') ||
                error.message?.includes('User denied')
            ) {
                showToast(
                    locale === 'ko'
                        ? '트랜잭션이 취소되었습니다.'
                        : 'Transaction was cancelled.',
                    'error'
                );
            } else {
                showToast(
                    locale === 'ko'
                        ? `등록에 실패했습니다.\n\n${
                              error.message ||
                              '알 수 없는 오류'
                          }`
                        : `Registration failed.\n\n${
                              error.message ||
                              'Unknown error'
                          }`,
                    'error'
                );
            }
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <button
            onClick={handleRegister}
            disabled={!isConnected || isRegistering}
            className={`glass-button px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 min-h-[44px] ${
                !isConnected || isRegistering
                    ? 'opacity-50 cursor-not-allowed'
                    : 'text-white hover:text-secondary'
            } ${className}`}
        >
            {isRegistering ? (
                <>
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span className="hidden sm:inline">
                        {locale === 'ko'
                            ? '등록 중...'
                            : 'Registering...'}
                    </span>
                </>
            ) : (
                <>
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                    </svg>
                    <span className="hidden sm:inline">
                        {locale === 'ko'
                            ? 'Story Protocol 등록'
                            : 'Register to Story'}
                    </span>
                    <span className="sm:hidden">
                        Register
                    </span>
                </>
            )}
        </button>
    );
}
