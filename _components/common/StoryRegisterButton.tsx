'use client';

import { useState, useEffect } from 'react';
import { useStoryProtocol } from '@/lib/hooks/useStoryProtocol';
import { useTranslation } from '@/lib/i18n/context';
import { useToast } from './Toast';

interface StoryRegisterButtonProps {
    dreamId: string;
    dream?: any; // Dream IP 객체 (선택사항, 이미 등록 여부 확인용)
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
    dream,
    className = '',
    autoTrigger = false,
}: StoryRegisterButtonProps & { autoTrigger?: boolean }) {
    const { isConnected, address, storyClient, isLoading } =
        useStoryProtocol();
    const { locale } = useTranslation();
    const { showToast } = useToast();
    const [isRegistering, setIsRegistering] =
        useState(false);
    const [hasAutoTriggered, setHasAutoTriggered] =
        useState(false);

    // 이미 등록된 IP Asset이 있는지 확인
    const dreamAny = dream as any;
    const isAlreadyRegistered = !!dreamAny?.ipAssetId;
    const registeredOwnerAddress =
        dreamAny?.ownerAddress ||
        dreamAny?.registeredAddress;
    const isCurrentOwner =
        isAlreadyRegistered &&
        registeredOwnerAddress &&
        address &&
        registeredOwnerAddress.toLowerCase() ===
            address.toLowerCase();

    // Auto trigger effect
    useEffect(() => {
        if (
            autoTrigger &&
            !hasAutoTriggered &&
            isConnected &&
            address &&
            !isLoading &&
            storyClient &&
            !isAlreadyRegistered &&
            !isRegistering
        ) {
            setHasAutoTriggered(true);
            // Give a small delay for UI to settle
            setTimeout(() => {
                handleRegister();
            }, 500);
        }
    }, [
        autoTrigger,
        hasAutoTriggered,
        isConnected,
        address,
        isLoading,
        storyClient,
        isAlreadyRegistered,
        isRegistering,
    ]);

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

        // Story Protocol 클라이언트 로딩 중이면 대기
        if (isLoading) {
            showToast(
                locale === 'ko'
                    ? 'Story Protocol 클라이언트를 초기화하는 중입니다...'
                    : 'Initializing Story Protocol client...',
                'info'
            );
            return;
        }

        if (!storyClient) {
            showToast(
                locale === 'ko'
                    ? 'Story Protocol 클라이언트를 초기화할 수 없습니다. 잠시 후 다시 시도해주세요.'
                    : 'Failed to initialize Story Protocol client. Please try again later.',
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
            // 1. Dream IP 데이터 가져오기 (prop이 없으면 API 호출)
            let dreamData: any;
            if (dream) {
                // prop으로 전달된 dream 사용
                dreamData = { success: true, dream };
            } else {
                // API로 가져오기
                showToast(
                    locale === 'ko'
                        ? '📦 Dream IP 데이터를 가져오는 중...'
                        : '📦 Fetching Dream IP data...',
                    'info'
                );

                const dreamResponse = await fetch(
                    `/api/dreams/${dreamId}`
                );
                dreamData = await dreamResponse.json();

                if (
                    !dreamData.success ||
                    !dreamData.dream
                ) {
                    throw new Error(
                        'Dream IP를 찾을 수 없습니다.'
                    );
                }
            }

            const dreamPackage = dreamData.dream;

            // 2. 생성자 검증 (가장 중요!)
            // Dream IP를 생성한 사용자만 Story Protocol에 등록할 수 있음
            const dreamAny = dreamPackage as any;
            const creatorAddress = dreamAny?.creatorAddress;

            if (creatorAddress) {
                // 생성자 지갑 주소와 현재 연결된 지갑 주소 비교
                const isCreator =
                    creatorAddress.toLowerCase() ===
                    address.toLowerCase();

                if (!isCreator) {
                    throw new Error(
                        locale === 'ko'
                            ? '이 Dream IP는 다른 사용자가 생성했습니다.\n\n생성자만 Story Protocol에 등록할 수 있습니다.'
                            : 'This Dream IP was created by another user.\n\nOnly the creator can register it to Story Protocol.'
                    );
                }
            }

            // 3. 이미 등록된 IP Asset이 있는지 확인 및 소유자 검증
            if (dreamAny?.ipAssetId) {
                // 이미 등록된 경우, 소유자 확인
                const registeredOwnerAddress =
                    dreamAny?.ownerAddress ||
                    dreamAny?.registeredAddress;

                if (registeredOwnerAddress) {
                    // 지갑 주소 비교 (대소문자 무시)
                    const isOwner =
                        registeredOwnerAddress.toLowerCase() ===
                        address.toLowerCase();

                    if (!isOwner) {
                        throw new Error(
                            locale === 'ko'
                                ? '이 Dream IP는 이미 다른 지갑으로 등록되었습니다.\n\n소유자만 다시 등록할 수 있습니다.'
                                : 'This Dream IP is already registered to another wallet.\n\nOnly the owner can re-register.'
                        );
                    }

                    // 소유자인 경우, 이미 등록되었다는 안내
                    showToast(
                        locale === 'ko'
                            ? '이미 Story Protocol에 등록된 Dream IP입니다.'
                            : 'This Dream IP is already registered to Story Protocol.',
                        'info'
                    );
                    return; // 등록 중단
                }
            }

            // 4. IPFS에 메타데이터 업로드 (서버에서 처리)
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

            // 5. Story Protocol에 IP Asset 등록 (사용자 지갑으로 직접 서명!)
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
                dreamPackage.dreamHash.startsWith('0x')
                    ? dreamPackage.dreamHash
                    : `0x${dreamPackage.dreamHash}`
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

            // 6. MongoDB에 결과 저장 (지갑 주소도 함께 저장)
            await fetch(`/api/dreams/${dreamId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ipfsCid: ipfsData.ipMetadataCid, // IP Metadata CID 저장
                    nftMetadataCid: ipfsData.nftMetadataCid, // NFT Metadata CID 저장
                    ipAssetId: response.ipId,
                    ownerAddress: address, // 소유자 지갑 주소 저장
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

            // 페이지 새로고침하여 라이선스 설정 버튼 표시
            setTimeout(() => {
                window.location.reload();
            }, 2000);
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

    // 이미 등록되었고 현재 사용자가 소유자인 경우 버튼 비활성화
    // 또는 Story Protocol 클라이언트가 로딩 중일 때도 비활성화
    const isDisabled =
        !isConnected ||
        isLoading ||
        isRegistering ||
        !storyClient ||
        (isAlreadyRegistered && isCurrentOwner);

    return (
        <button
            onClick={handleRegister}
            disabled={isDisabled}
            className={`glass-button px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 min-h-[44px] ${
                isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'text-white hover:text-secondary'
            } ${className}`}
            title={
                isAlreadyRegistered && isCurrentOwner
                    ? locale === 'ko'
                        ? '이미 등록된 Dream IP입니다.'
                        : 'This Dream IP is already registered.'
                    : undefined
            }
        >
            {isLoading ? (
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
                            ? '초기화 중...'
                            : 'Initializing...'}
                    </span>
                </>
            ) : isRegistering ? (
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
