/**
 * 로열티 대시보드 페이지
 * Dream IP 소유자가 로열티를 확인하고 청구할 수 있는 페이지
 */

'use client';

import { useState, useEffect } from 'react';
import { PageContainer } from '@/_components/layout';
import {
    LoadingSpinner,
    ClaimRoyaltyButton,
} from '@/_components/common';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n/context';
import type { DreamIPPackage } from '@/lib/types';

interface RoyaltyInfo {
    ipAssetId: string;
    dreamTitle: string;
    totalRoyalties: string; // IP 단위
    claimableSnapshots: string[]; // 스냅샷 ID 배열
    claimedSnapshots: string[]; // 이미 청구된 스냅샷 ID 배열
}

export default function RoyaltiesPage() {
    const { address, isConnected } = useAccount();
    const { locale } = useTranslation();
    const [royalties, setRoyalties] = useState<
        RoyaltyInfo[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isConnected && address) {
            loadRoyalties();
        } else {
            setLoading(false);
        }
    }, [isConnected, address]);

    const loadRoyalties = async () => {
        try {
            setLoading(true);

            // 1. 사용자의 모든 Dream IP 가져오기
            const dreamsResponse = await fetch(
                '/api/dreams'
            );
            const dreamsData = await dreamsResponse.json();

            if (!dreamsData.success) {
                throw new Error(
                    'Dream IP 목록을 불러올 수 없습니다.'
                );
            }

            const dreams: DreamIPPackage[] =
                dreamsData.dreams.filter(
                    (dream: DreamIPPackage) =>
                        (dream as any).ipAssetId &&
                        dream.status === 'completed'
                );

            // 2. 각 Dream IP의 로열티 정보 조회
            const royaltyPromises = dreams.map(
                async (dream) => {
                    const ipAssetId = (dream as any)
                        .ipAssetId;
                    try {
                        const royaltyResponse = await fetch(
                            `/api/story/royalty/${ipAssetId}`
                        );
                        const royaltyData =
                            await royaltyResponse.json();

                        if (royaltyData.success) {
                            return {
                                ipAssetId,
                                dreamTitle:
                                    locale === 'en' &&
                                    dream.analysis.title_en
                                        ? dream.analysis
                                              .title_en
                                        : dream.analysis
                                              .title,
                                totalRoyalties:
                                    royaltyData.data
                                        ?.totalRoyalties ||
                                    '0',
                                claimableSnapshots:
                                    royaltyData.data
                                        ?.claimableSnapshots ||
                                    [],
                                claimedSnapshots:
                                    royaltyData.data
                                        ?.claimedSnapshots ||
                                    [],
                            } as RoyaltyInfo;
                        }
                    } catch (error) {
                        console.error(
                            `로열티 정보 조회 실패 (${ipAssetId}):`,
                            error
                        );
                    }

                    return {
                        ipAssetId,
                        dreamTitle:
                            locale === 'en' &&
                            dream.analysis.title_en
                                ? dream.analysis.title_en
                                : dream.analysis.title,
                        totalRoyalties: '0',
                        claimableSnapshots: [],
                        claimedSnapshots: [],
                    } as RoyaltyInfo;
                }
            );

            const royaltyResults = await Promise.all(
                royaltyPromises
            );
            setRoyalties(
                royaltyResults.filter(
                    (r) => r.claimableSnapshots.length > 0
                )
            );
        } catch (error) {
            console.error('로열티 로드 오류:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <PageContainer
                showBackground={true}
                backgroundType="default"
            >
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="text-6xl mb-6 opacity-50">
                        💰
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                        {locale === 'ko'
                            ? '지갑을 연결해주세요'
                            : 'Please connect your wallet'}
                    </h1>
                    <p className="text-white/80 mb-6">
                        {locale === 'ko'
                            ? '로열티를 확인하려면 지갑을 연결해야 합니다.'
                            : 'You need to connect your wallet to view royalties.'}
                    </p>
                </div>
            </PageContainer>
        );
    }

    if (loading) {
        return (
            <PageContainer
                showBackground={true}
                backgroundType="default"
            >
                <div className="flex items-center justify-center min-h-[60vh]">
                    <LoadingSpinner size="lg" />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            showBackground={true}
            backgroundType="default"
        >
            <div className="w-full max-w-6xl mx-auto animate-fade-in py-8 sm:py-12">
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        {locale === 'ko'
                            ? '로열티 대시보드'
                            : 'Royalty Dashboard'}
                    </h1>
                    <p className="text-white/80 text-lg">
                        {locale === 'ko'
                            ? 'Dream IP에서 발생한 로열티를 확인하고 청구하세요.'
                            : 'View and claim royalties from your Dream IPs.'}
                    </p>
                </div>

                {royalties.length === 0 ? (
                    <div className="glass-panel rounded-2xl p-12 text-center border border-white/10">
                        <div className="text-6xl mb-6 opacity-50">
                            💰
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {locale === 'ko'
                                ? '청구 가능한 로열티가 없습니다'
                                : 'No claimable royalties'}
                        </h2>
                        <p className="text-white/80">
                            {locale === 'ko'
                                ? '아직 로열티가 발생하지 않았거나, 모든 로열티를 이미 청구했습니다.'
                                : 'No royalties have been generated yet, or all royalties have been claimed.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {royalties.map((royalty) => (
                            <div
                                key={royalty.ipAssetId}
                                className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                            {
                                                royalty.dreamTitle
                                            }
                                        </h3>
                                        <p className="text-white/60 text-sm font-mono">
                                            {
                                                royalty.ipAssetId
                                            }
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/60 text-sm mb-1">
                                            {locale === 'ko'
                                                ? '총 로열티'
                                                : 'Total Royalties'}
                                        </p>
                                        <p className="text-2xl sm:text-3xl font-bold text-primary">
                                            {
                                                royalty.totalRoyalties
                                            }{' '}
                                            IP
                                        </p>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                    <div className="glass-panel p-4 rounded-xl border border-white/5">
                                        <p className="text-white/60 text-sm mb-2">
                                            {locale === 'ko'
                                                ? '청구 가능'
                                                : 'Claimable'}
                                        </p>
                                        <p className="text-xl font-bold text-primary">
                                            {
                                                royalty
                                                    .claimableSnapshots
                                                    .length
                                            }{' '}
                                            {locale === 'ko'
                                                ? '개'
                                                : 'snapshots'}
                                        </p>
                                    </div>
                                    <div className="glass-panel p-4 rounded-xl border border-white/5">
                                        <p className="text-white/60 text-sm mb-2">
                                            {locale === 'ko'
                                                ? '이미 청구됨'
                                                : 'Already Claimed'}
                                        </p>
                                        <p className="text-xl font-bold text-white/80">
                                            {
                                                royalty
                                                    .claimedSnapshots
                                                    .length
                                            }{' '}
                                            {locale === 'ko'
                                                ? '개'
                                                : 'snapshots'}
                                        </p>
                                    </div>
                                </div>

                                {royalty.claimableSnapshots
                                    .length > 0 && (
                                    <ClaimRoyaltyButton
                                        ipAssetId={
                                            royalty.ipAssetId
                                        }
                                        snapshotIds={
                                            royalty.claimableSnapshots
                                        }
                                        className="w-full sm:w-auto"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
