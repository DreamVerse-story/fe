'use client';

import { useState } from 'react';
import { useStoryProtocol } from '@/lib/hooks/useStoryProtocol';
import { useTranslation } from '@/lib/i18n/context';
import { useToast } from './Toast';
import { Button } from '../ui';

interface BuyLicenseButtonProps {
    ipAssetId: string;
    price?: string; // IP 단위 가격
    className?: string;
}

/**
 * 라이선스 구매 버튼 컴포넌트
 *
 * 스튜디오/개인 창작자가 Dream IP 라이선스를 구매할 수 있는 버튼
 */
export function BuyLicenseButton({
    ipAssetId,
    price = '0.1',
    className = '',
}: BuyLicenseButtonProps) {
    const { isConnected, address, storyClient } =
        useStoryProtocol();
    const { locale } = useTranslation();
    const { showToast } = useToast();
    const [isBuying, setIsBuying] = useState(false);

    const handleBuy = async () => {
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

        if (
            !confirm(
                locale === 'ko'
                    ? `라이선스를 구매하시겠습니까?\n\n가격: ${price} IP\n\n지갑에서 트랜잭션을 승인해주세요.`
                    : `Purchase license?\n\nPrice: ${price} IP\n\nPlease approve the transaction in your wallet.`
            )
        ) {
            return;
        }

        setIsBuying(true);

        try {
            showToast(
                locale === 'ko'
                    ? '🔐 지갑에서 트랜잭션을 승인해주세요...'
                    : '🔐 Please approve the transaction in your wallet...',
                'info'
            );

            const response = await fetch('/api/story/license', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ipAssetId,
                    amount: 1, // 라이선스 1개 구매
                    receiverAddress: address, // 구매자 주소
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(
                    data.error || '라이선스 구매에 실패했습니다.'
                );
            }

            showToast(
                locale === 'ko'
                    ? '✅ 라이선스를 구매했습니다!'
                    : '✅ License purchased successfully!',
                'success'
            );
        } catch (error) {
            console.error('라이선스 구매 오류:', error);
            showToast(
                locale === 'ko'
                    ? `라이선스 구매 실패: ${
                          error instanceof Error
                              ? error.message
                              : String(error)
                      }`
                    : `License purchase failed: ${
                          error instanceof Error
                              ? error.message
                              : String(error)
                      }`,
                'error'
            );
        } finally {
            setIsBuying(false);
        }
    };

    return (
        <Button
            variant="default"
            size="md"
            onClick={handleBuy}
            disabled={!isConnected || !ipAssetId || isBuying}
            className={className}
        >
            {isBuying
                ? locale === 'ko'
                    ? '구매 중...'
                    : 'Purchasing...'
                : locale === 'ko'
                  ? `라이선스 구매 (${price} IP)`
                  : `Buy License (${price} IP)`}
        </Button>
    );
}

