'use client';

import { useState } from 'react';
import { useStoryProtocol } from '@/lib/hooks/useStoryProtocol';
import { useTranslation } from '@/lib/i18n/context';
import { useToast } from './Toast';
import { Button } from '../ui';

interface ClaimRoyaltyButtonProps {
    ipAssetId: string;
    snapshotIds?: string[]; // 로열티 스냅샷 ID 배열
    className?: string;
}

/**
 * 로열티 청구 버튼 컴포넌트
 *
 * Dream IP 소유자가 로열티를 청구할 수 있는 버튼
 */
export function ClaimRoyaltyButton({
    ipAssetId,
    snapshotIds = [],
    className = '',
}: ClaimRoyaltyButtonProps) {
    const { isConnected, address } = useStoryProtocol();
    const { locale } = useTranslation();
    const { showToast } = useToast();
    const [isClaiming, setIsClaiming] = useState(false);

    const handleClaim = async () => {
        if (!isConnected || !address) {
            showToast(
                locale === 'ko'
                    ? '먼저 지갑을 연결해주세요.'
                    : 'Please connect your wallet first.',
                'error'
            );
            return;
        }

        if (!ipAssetId) {
            showToast(
                locale === 'ko'
                    ? 'IP Asset ID가 필요합니다.'
                    : 'IP Asset ID is required.',
                'error'
            );
            return;
        }

        if (snapshotIds.length === 0) {
            showToast(
                locale === 'ko'
                    ? '청구할 로열티가 없습니다.'
                    : 'No royalties to claim.',
                'warning'
            );
            return;
        }

        if (
            !confirm(
                locale === 'ko'
                    ? `로열티를 청구하시겠습니까?\n\n스냅샷 수: ${snapshotIds.length}개\n\n지갑에서 트랜잭션을 승인해주세요.`
                    : `Claim royalties?\n\nSnapshots: ${snapshotIds.length}\n\nPlease approve the transaction in your wallet.`
            )
        ) {
            return;
        }

        setIsClaiming(true);

        try {
            showToast(
                locale === 'ko'
                    ? '🔐 지갑에서 트랜잭션을 승인해주세요...'
                    : '🔐 Please approve the transaction in your wallet...',
                'info'
            );

            const response = await fetch(
                '/api/story/royalty',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ipAssetId,
                        snapshotIds,
                    }),
                }
            );

            const data = await response.json();

            if (!data.success) {
                throw new Error(
                    data.error ||
                        '로열티 청구에 실패했습니다.'
                );
            }

            showToast(
                locale === 'ko'
                    ? '✅ 로열티를 청구했습니다!'
                    : '✅ Royalties claimed successfully!',
                'success'
            );
        } catch (error) {
            console.error('로열티 청구 오류:', error);
            showToast(
                locale === 'ko'
                    ? `로열티 청구 실패: ${
                          error instanceof Error
                              ? error.message
                              : String(error)
                      }`
                    : `Royalty claim failed: ${
                          error instanceof Error
                              ? error.message
                              : String(error)
                      }`,
                'error'
            );
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <Button
            variant="primary"
            size="md"
            onClick={handleClaim}
            disabled={
                !isConnected ||
                !ipAssetId ||
                snapshotIds.length === 0 ||
                isClaiming
            }
            className={className}
        >
            {isClaiming
                ? locale === 'ko'
                    ? '청구 중...'
                    : 'Claiming...'
                : locale === 'ko'
                ? `로열티 청구 (${snapshotIds.length}개)`
                : `Claim Royalties (${snapshotIds.length})`}
        </Button>
    );
}
