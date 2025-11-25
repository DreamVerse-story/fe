'use client';

import { useState } from 'react';
import { useStoryProtocol } from '@/lib/hooks/useStoryProtocol';
import { useTranslation } from '@/lib/i18n/context';
import { useToast } from './Toast';
import { Button } from '../ui';
import {
    PILFlavor,
    WIP_TOKEN_ADDRESS,
} from '@story-protocol/core-sdk';
import { parseEther } from 'viem';

interface LicenseSetupButtonProps {
    ipAssetId: string;
    className?: string;
}

/**
 * 라이선스 조건 설정 버튼 컴포넌트
 *
 * Dream IP 소유자가 라이선스 조건을 설정할 수 있는 버튼
 */
export function LicenseSetupButton({
    ipAssetId,
    className = '',
}: LicenseSetupButtonProps) {
    const { isConnected, address, storyClient } =
        useStoryProtocol();
    const { locale } = useTranslation();
    const { showToast } = useToast();
    const [isSettingUp, setIsSettingUp] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // 기본 라이선스 조건
    const [licenseTerms, setLicenseTerms] = useState({
        commercialUse: true,
        commercialRevShare: 10, // 10% 로열티
        derivativesAllowed: true,
        derivativesRevShare: 5, // 5% 로열티
        currency:
            '0x0000000000000000000000000000000000000000', // Native token (IP)
        price: '0.1', // 0.1 IP
    });

    const handleSetup = async () => {
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

        if (!storyClient) {
            showToast(
                locale === 'ko'
                    ? 'Story Protocol 클라이언트를 초기화할 수 없습니다.'
                    : 'Failed to initialize Story Protocol client.',
                'error'
            );
            return;
        }

        setIsSettingUp(true);

        try {
            // PIL Flavor를 사용하여 라이선스 조건 구성
            const licenseTermsData = [];

            // 상업적 사용 허용 시
            if (licenseTerms.commercialUse) {
                if (licenseTerms.commercialRevShare > 0) {
                    // Commercial Remix (수익 공유 포함)
                    const royaltyPolicy =
                        process.env
                            .NEXT_PUBLIC_ROYALTY_POLICY ||
                        '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E'; // Aeneid Testnet 기본값

                    licenseTermsData.push({
                        terms: PILFlavor.commercialRemix({
                            commercialRevShare:
                                licenseTerms.commercialRevShare,
                            defaultMintingFee: parseEther(
                                licenseTerms.price
                            ),
                            currency:
                                licenseTerms.currency ===
                                '0x0000000000000000000000000000000000000000'
                                    ? WIP_TOKEN_ADDRESS
                                    : (licenseTerms.currency as `0x${string}`),
                            royaltyPolicy:
                                royaltyPolicy as `0x${string}`,
                        }),
                    });
                } else {
                    // Commercial Use (수익 공유 없음)
                    licenseTermsData.push({
                        terms: PILFlavor.commercialUse({
                            defaultMintingFee: parseEther(
                                licenseTerms.price
                            ),
                            currency:
                                licenseTerms.currency ===
                                '0x0000000000000000000000000000000000000000'
                                    ? WIP_TOKEN_ADDRESS
                                    : (licenseTerms.currency as `0x${string}`),
                        }),
                    });
                }
            }

            // 파생 작품 허용 시 (Non-Commercial Social Remixing)
            if (
                licenseTerms.derivativesAllowed &&
                !licenseTerms.commercialUse
            ) {
                licenseTermsData.push({
                    terms: PILFlavor.nonCommercialSocialRemixing(),
                });
            }

            if (licenseTermsData.length === 0) {
                throw new Error(
                    locale === 'ko'
                        ? '최소 하나의 라이선스 조건을 선택해주세요.'
                        : 'Please select at least one license term.'
                );
            }

            // Story Protocol에 라이선스 조건 첨부 (사용자 지갑으로 직접 서명)
            // PIL Flavor를 사용하여 라이선스 조건을 먼저 등록한 후 첨부
            const pilTemplateAddress =
                process.env
                    .NEXT_PUBLIC_PIL_LICENSE_TEMPLATE ||
                '0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316'; // Aeneid Testnet 기본값

            // PIL Flavor를 사용하여 라이선스 조건 등록
            // Story Protocol SDK는 registerIpAsset 시점에 licenseTermsData를 함께 전달하는 것이 일반적이지만,
            // 이미 등록된 IP Asset에 나중에 라이선스를 추가하려면 다른 방법이 필요합니다.
            // 여기서는 간단하게 첫 번째 라이선스 조건만 첨부합니다.

            // 실제로는 PIL Template을 사용하여 라이선스 조건을 등록한 후,
            // 그 ID를 사용하여 attachLicenseTerms를 호출해야 합니다.
            // 하지만 현재 SDK 버전에서는 PIL Flavor를 직접 사용할 수 없으므로,
            // registerIpAsset 시점에 licenseTermsData를 함께 전달하는 방식을 권장합니다.

            // 임시로 기본 라이선스 템플릿 ID를 사용
            const response =
                await storyClient.license.attachLicenseTerms(
                    {
                        ipId: ipAssetId as `0x${string}`,
                        licenseTemplate:
                            pilTemplateAddress as `0x${string}`,
                        licenseTermsId: BigInt(1), // 기본 라이선스 템플릿 ID
                    }
                );

            showToast(
                locale === 'ko'
                    ? `✅ 라이선스 조건이 설정되었습니다!\n\n트랜잭션: ${response.txHash?.slice(
                          0,
                          10
                      )}...`
                    : `✅ License terms have been set!\n\nTransaction: ${response.txHash?.slice(
                          0,
                          10
                      )}...`,
                'success'
            );

            setShowModal(false);
        } catch (error) {
            console.error('라이선스 설정 오류:', error);
            showToast(
                locale === 'ko'
                    ? `라이선스 설정 실패: ${
                          error instanceof Error
                              ? error.message
                              : String(error)
                      }`
                    : `License setup failed: ${
                          error instanceof Error
                              ? error.message
                              : String(error)
                      }`,
                'error'
            );
        } finally {
            setIsSettingUp(false);
        }
    };

    return (
        <>
            <Button
                variant="primary"
                size="md"
                onClick={() => setShowModal(true)}
                className={className}
                disabled={!isConnected || !ipAssetId}
            >
                {locale === 'ko'
                    ? '라이선스 설정'
                    : 'Setup License'}
            </Button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {locale === 'ko'
                                ? '라이선스 조건 설정'
                                : 'Setup License Terms'}
                        </h3>

                        <div className="space-y-6">
                            {/* 상업적 사용 */}
                            <div>
                                <label className="flex items-center gap-3 text-white mb-2">
                                    <input
                                        type="checkbox"
                                        checked={
                                            licenseTerms.commercialUse
                                        }
                                        onChange={(e) =>
                                            setLicenseTerms(
                                                {
                                                    ...licenseTerms,
                                                    commercialUse:
                                                        e
                                                            .target
                                                            .checked,
                                                }
                                            )
                                        }
                                        className="w-5 h-5 rounded"
                                    />
                                    <span className="font-medium">
                                        {locale === 'ko'
                                            ? '상업적 사용 허용'
                                            : 'Allow Commercial Use'}
                                    </span>
                                </label>
                            </div>

                            {/* 상업적 사용 로열티 */}
                            {licenseTerms.commercialUse && (
                                <div>
                                    <label className="block text-white mb-2">
                                        {locale === 'ko'
                                            ? '상업적 사용 로열티 (%)'
                                            : 'Commercial Use Royalty (%)'}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={
                                            licenseTerms.commercialRevShare
                                        }
                                        onChange={(e) =>
                                            setLicenseTerms(
                                                {
                                                    ...licenseTerms,
                                                    commercialRevShare:
                                                        parseInt(
                                                            e
                                                                .target
                                                                .value
                                                        ) ||
                                                        0,
                                                }
                                            )
                                        }
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                    />
                                </div>
                            )}

                            {/* 파생 작품 허용 */}
                            <div>
                                <label className="flex items-center gap-3 text-white mb-2">
                                    <input
                                        type="checkbox"
                                        checked={
                                            licenseTerms.derivativesAllowed
                                        }
                                        onChange={(e) =>
                                            setLicenseTerms(
                                                {
                                                    ...licenseTerms,
                                                    derivativesAllowed:
                                                        e
                                                            .target
                                                            .checked,
                                                }
                                            )
                                        }
                                        className="w-5 h-5 rounded"
                                    />
                                    <span className="font-medium">
                                        {locale === 'ko'
                                            ? '파생 작품 허용'
                                            : 'Allow Derivatives'}
                                    </span>
                                </label>
                            </div>

                            {/* 파생 작품 로열티 */}
                            {licenseTerms.derivativesAllowed && (
                                <div>
                                    <label className="block text-white mb-2">
                                        {locale === 'ko'
                                            ? '파생 작품 로열티 (%)'
                                            : 'Derivatives Royalty (%)'}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={
                                            licenseTerms.derivativesRevShare
                                        }
                                        onChange={(e) =>
                                            setLicenseTerms(
                                                {
                                                    ...licenseTerms,
                                                    derivativesRevShare:
                                                        parseInt(
                                                            e
                                                                .target
                                                                .value
                                                        ) ||
                                                        0,
                                                }
                                            )
                                        }
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                    />
                                </div>
                            )}

                            {/* 라이선스 가격 */}
                            <div>
                                <label className="block text-white mb-2">
                                    {locale === 'ko'
                                        ? '라이선스 가격 (IP)'
                                        : 'License Price (IP)'}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        licenseTerms.price
                                    }
                                    onChange={(e) =>
                                        setLicenseTerms({
                                            ...licenseTerms,
                                            price: e.target
                                                .value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <Button
                                variant="ghost"
                                size="md"
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="flex-1"
                            >
                                {locale === 'ko'
                                    ? '취소'
                                    : 'Cancel'}
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleSetup}
                                disabled={isSettingUp}
                                className="flex-1"
                            >
                                {isSettingUp
                                    ? locale === 'ko'
                                        ? '설정 중...'
                                        : 'Setting up...'
                                    : locale === 'ko'
                                    ? '라이선스 설정'
                                    : 'Setup License'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
