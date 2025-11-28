'use client';

import { useState } from 'react';
import { useStoryProtocol } from '@/lib/hooks/useStoryProtocol';
import { useTranslation } from '@/lib/i18n/context';
import { useToast } from './Toast';
import { Button } from '../ui';

interface BuyLicenseButtonProps {
    ipAssetId: string;
    licenseTermsId?: string | bigint; // 라이선스 조건 ID (IP Asset에 첨부된 라이선스 조건)
    price?: string; // IP 단위 가격
    amount?: number; // 민팅할 라이선스 토큰 수량 (기본값: 1)
    className?: string;
}

/**
 * 라이선스 구매 버튼 컴포넌트
 *
 * 스튜디오/개인 창작자가 Dream IP 라이선스를 구매할 수 있는 버튼
 */
export function BuyLicenseButton({
    ipAssetId,
    licenseTermsId,
    price = '0.1',
    amount = 1,
    className = '',
}: BuyLicenseButtonProps) {
    const { isConnected, address } = useStoryProtocol();
    const { locale } = useTranslation();
    const { showToast } = useToast();
    const [isBuying, setIsBuying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [purchaseAmount, setPurchaseAmount] =
        useState(amount);
    const [termsId, setTermsId] = useState<
        string | bigint | undefined
    >(licenseTermsId);

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

        // storyClient 체크 제거 (블록체인 통신하지 않으므로 불필요)

        if (!ipAssetId) {
            showToast(
                locale === 'ko'
                    ? 'IP Asset ID가 필요합니다.'
                    : 'IP Asset ID is required.',
                'error'
            );
            return;
        }

        // licenseTermsId가 없으면 IP Asset에 첨부된 라이선스 조건 조회 (선택적)
        let currentTermsId = termsId || licenseTermsId;
        if (!currentTermsId) {
            try {
                // API를 통해 IP Asset에 첨부된 라이선스 조건 조회 (선택적)
                const termsResponse = await fetch(
                    `/api/story/license/${ipAssetId}`
                );
                const termsData =
                    await termsResponse.json();

                if (
                    termsData.success &&
                    termsData.licenseTermsId
                ) {
                    // 조회된 라이선스 조건 ID 사용
                    currentTermsId =
                        termsData.licenseTermsId;
                    setTermsId(currentTermsId);
                } else {
                    // 라이선스 조건이 없어도 구매 가능 (기본값 사용)
                    currentTermsId = 'default';
                    setTermsId('default');
                }
            } catch (error: any) {
                console.log(
                    '라이선스 조건 조회 실패 (기본값 사용):',
                    error
                );
                // 조회 실패해도 구매 가능 (기본값 사용)
                currentTermsId = 'default';
                setTermsId('default');
            }
        }

        // 모달에서 구매 개수 선택 후 구매 진행
        setShowModal(true);
    };

    const handleConfirmPurchase = async () => {
        if (purchaseAmount < 1) {
            showToast(
                locale === 'ko'
                    ? '구매 개수는 1개 이상이어야 합니다.'
                    : 'Purchase amount must be at least 1.',
                'error'
            );
            return;
        }

        setShowModal(false);
        setIsBuying(true);

        try {
            showToast(
                locale === 'ko'
                    ? '💾 라이선스 구매 처리 중...'
                    : '💾 Processing license purchase...',
                'info'
            );

            const currentTermsId =
                termsId || licenseTermsId || 'default';

            const response = await fetch(
                '/api/story/license',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ipAssetId,
                        licenseTermsId:
                            typeof currentTermsId ===
                            'bigint'
                                ? currentTermsId.toString()
                                : currentTermsId,
                        amount: purchaseAmount, // 선택한 구매 개수
                        price: price, // 가격 정보 전달
                        receiverAddress: address, // 구매자 주소
                    }),
                }
            );

            const data = await response.json();

            if (!data.success) {
                throw new Error(
                    data.error ||
                        '라이선스 구매에 실패했습니다.'
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

    const totalPrice = parseFloat(price) * purchaseAmount;

    return (
        <>
            <Button
                variant="primary"
                size="md"
                onClick={handleBuy}
                disabled={
                    !isConnected || !ipAssetId || isBuying
                }
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

            {/* 구매 개수 선택 모달 */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {locale === 'ko'
                                ? '라이선스 구매'
                                : 'Purchase License'}
                        </h3>

                        <div className="space-y-6">
                            {/* 가격 정보 */}
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white/60">
                                        {locale === 'ko'
                                            ? '개당 가격'
                                            : 'Price per license'}
                                    </span>
                                    <span className="text-white font-semibold">
                                        {price} IP
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/60">
                                        {locale === 'ko'
                                            ? '총 가격'
                                            : 'Total price'}
                                    </span>
                                    <span className="text-primary font-bold text-xl">
                                        {totalPrice.toFixed(
                                            2
                                        )}{' '}
                                        IP
                                    </span>
                                </div>
                            </div>

                            {/* 구매 개수 입력 */}
                            <div>
                                <label className="block text-white mb-2">
                                    {locale === 'ko'
                                        ? '구매 개수'
                                        : 'Purchase Amount'}
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            setPurchaseAmount(
                                                Math.max(
                                                    1,
                                                    purchaseAmount -
                                                        1
                                                )
                                            )
                                        }
                                        disabled={
                                            purchaseAmount <=
                                            1
                                        }
                                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={
                                            purchaseAmount
                                        }
                                        onChange={(e) => {
                                            const value =
                                                parseInt(
                                                    e.target
                                                        .value
                                                );
                                            if (
                                                !isNaN(
                                                    value
                                                ) &&
                                                value >= 1
                                            ) {
                                                setPurchaseAmount(
                                                    value
                                                );
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center font-semibold"
                                    />
                                    <button
                                        onClick={() =>
                                            setPurchaseAmount(
                                                purchaseAmount +
                                                    1
                                            )
                                        }
                                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* 버튼 */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setPurchaseAmount(
                                            amount
                                        );
                                    }}
                                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
                                >
                                    {locale === 'ko'
                                        ? '취소'
                                        : 'Cancel'}
                                </button>
                                <button
                                    onClick={
                                        handleConfirmPurchase
                                    }
                                    disabled={
                                        isBuying ||
                                        purchaseAmount < 1
                                    }
                                    className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isBuying
                                        ? locale === 'ko'
                                            ? '구매 중...'
                                            : 'Purchasing...'
                                        : locale === 'ko'
                                        ? '구매하기'
                                        : 'Purchase'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
