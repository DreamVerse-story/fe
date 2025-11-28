'use client';

import { useState } from 'react';
import { useStoryProtocol } from '@/lib/hooks/useStoryProtocol';
import { useTranslation } from '@/lib/i18n/context';
import { useToast } from './Toast';
import { Button } from '../ui';
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk';
import { parseEther, zeroAddress } from 'viem';

interface PayRoyaltyButtonProps {
    receiverIpId: string; // 로열티를 받을 IP Asset ID
    payerIpId?: string; // 로열티를 지불하는 IP Asset ID (선택사항, 팁인 경우 zeroAddress)
    amount?: string; // 지불할 금액 (IP 단위, 기본값: '1')
    className?: string;
}

/**
 * 로열티 지불 버튼 컴포넌트
 *
 * IP Asset에 로열티를 지불하는 버튼
 * - 팁 시나리오: payerIpId를 zeroAddress로 설정
 * - 부모 IP에 지불 시나리오: payerIpId를 자식 IP Asset ID로 설정
 */
export function PayRoyaltyButton({
    receiverIpId,
    payerIpId,
    amount = '1',
    className = '',
}: PayRoyaltyButtonProps) {
    const { isConnected, address, storyClient } =
        useStoryProtocol();
    const { locale } = useTranslation();
    const { showToast } = useToast();
    const [isPaying, setIsPaying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [customAmount, setCustomAmount] =
        useState(amount);

    const handlePay = async () => {
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
                    ? 'Story Protocol 클라이언트를 초기화할 수 없습니다.'
                    : 'Failed to initialize Story Protocol client.',
                'error'
            );
            return;
        }

        if (!receiverIpId) {
            showToast(
                locale === 'ko'
                    ? 'IP Asset ID가 필요합니다.'
                    : 'IP Asset ID is required.',
                'error'
            );
            return;
        }

        const payAmount = parseFloat(customAmount);
        if (isNaN(payAmount) || payAmount <= 0) {
            showToast(
                locale === 'ko'
                    ? '유효한 금액을 입력해주세요.'
                    : 'Please enter a valid amount.',
                'error'
            );
            return;
        }

        if (
            !confirm(
                locale === 'ko'
                    ? `IP Asset에 로열티를 지불하시겠습니까?\n\n받는 IP: ${receiverIpId.slice(
                          0,
                          10
                      )}...\n금액: ${customAmount} WIP\n\n지갑에서 트랜잭션을 승인해주세요.`
                    : `Pay royalty to IP Asset?\n\nReceiver: ${receiverIpId.slice(
                          0,
                          10
                      )}...\nAmount: ${customAmount} WIP\n\nPlease approve the transaction in your wallet.`
            )
        ) {
            return;
        }

        setIsPaying(true);
        setShowModal(false);

        try {
            showToast(
                locale === 'ko'
                    ? '🔐 지갑에서 트랜잭션을 승인해주세요...'
                    : '🔐 Please approve the transaction in your wallet...',
                'info'
            );

            // payRoyaltyOnBehalf 호출
            // payerIpId가 없으면 팁 시나리오 (zeroAddress)
            // payerIpId가 있으면 부모 IP에 지불 시나리오
            const response =
                await storyClient.royalty.payRoyaltyOnBehalf(
                    {
                        receiverIpId:
                            receiverIpId as `0x${string}`,
                        payerIpId: payerIpId
                            ? (payerIpId as `0x${string}`)
                            : zeroAddress, // 팁인 경우 zeroAddress
                        token: WIP_TOKEN_ADDRESS,
                        amount: parseEther(customAmount),
                    }
                );

            showToast(
                locale === 'ko'
                    ? `✅ 로열티를 지불했습니다!\n\n트랜잭션: ${response.txHash?.slice(
                          0,
                          10
                      )}...`
                    : `✅ Royalty paid successfully!\n\nTransaction: ${response.txHash?.slice(
                          0,
                          10
                      )}...`,
                'success'
            );
        } catch (error: any) {
            console.error('로열티 지불 오류:', error);
            showToast(
                locale === 'ko'
                    ? `로열티 지불 실패: ${
                          error.message || '알 수 없는 오류'
                      }`
                    : `Royalty payment failed: ${
                          error.message || 'Unknown error'
                      }`,
                'error'
            );
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <>
            <Button
                variant="primary"
                size="md"
                onClick={() => setShowModal(true)}
                disabled={
                    !isConnected ||
                    !receiverIpId ||
                    isPaying
                }
                className={className}
            >
                {locale === 'ko'
                    ? '로열티 지불'
                    : 'Pay Royalty'}
            </Button>

            {/* 금액 입력 모달 */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {locale === 'ko'
                                ? '로열티 지불'
                                : 'Pay Royalty'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white mb-2">
                                    {locale === 'ko'
                                        ? '지불할 금액 (WIP)'
                                        : 'Amount to Pay (WIP)'}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={customAmount}
                                    onChange={(e) =>
                                        setCustomAmount(
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                    placeholder="1.0"
                                />
                            </div>

                            <div className="text-sm text-white/70">
                                {locale === 'ko'
                                    ? `받는 IP Asset: ${receiverIpId.slice(
                                          0,
                                          10
                                      )}...`
                                    : `Receiver IP Asset: ${receiverIpId.slice(
                                          0,
                                          10
                                      )}...`}
                            </div>

                            {payerIpId && (
                                <div className="text-sm text-white/70">
                                    {locale === 'ko'
                                        ? `지불하는 IP Asset: ${payerIpId.slice(
                                              0,
                                              10
                                          )}...`
                                        : `Payer IP Asset: ${payerIpId.slice(
                                              0,
                                              10
                                          )}...`}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
                                >
                                    {locale === 'ko'
                                        ? '취소'
                                        : 'Cancel'}
                                </button>
                                <button
                                    onClick={handlePay}
                                    disabled={isPaying}
                                    className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPaying
                                        ? locale === 'ko'
                                            ? '지불 중...'
                                            : 'Paying...'
                                        : locale === 'ko'
                                        ? '지불하기'
                                        : 'Pay'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
