/**
 * Dashboard 페이지
 * 내 Dream IP 관리, 통계, 로열티를 한 곳에서 확인
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageContainer } from '@/_components/layout';
import { LoadingSpinner } from '@/_components/common';
import { Card, Button, Badge } from '@/_components/ui';
import { useTranslation } from '@/lib/i18n/context';
import type { DreamIPPackage } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';

type TabType = 'overview' | 'dreams' | 'royalties';

export default function DashboardPage() {
    const { t, locale } = useTranslation();
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const [dreams, setDreams] = useState<DreamIPPackage[]>(
        []
    );
    const [allDreams, setAllDreams] = useState<
        DreamIPPackage[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] =
        useState<TabType>('overview');

    useEffect(() => {
        loadDreams();
    }, [isConnected, address]);

    const loadDreams = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/dreams');
            const data = await response.json();

            if (data.success) {
                setAllDreams(data.dreams);

                if (isConnected && address) {
                    const myDreams = data.dreams.filter(
                        (dream: any) => {
                            const creatorAddress =
                                dream.creatorAddress;
                            return (
                                creatorAddress &&
                                creatorAddress.toLowerCase() ===
                                    address?.toLowerCase()
                            );
                        }
                    );
                    myDreams.sort(
                        (
                            a: DreamIPPackage,
                            b: DreamIPPackage
                        ) =>
                            new Date(
                                b.createdAt
                            ).getTime() -
                            new Date(a.createdAt).getTime()
                    );
                    setDreams(myDreams);
                } else {
                    setDreams([]);
                }
            }
        } catch (error) {
            console.error('Failed to load dreams:', error);
        } finally {
            setLoading(false);
        }
    };

    // 통계 계산
    const stats = useMemo(() => {
        const myMinted = dreams.filter(
            (d: any) => d.ipAssetId
        ).length;
        const myPending = dreams.filter(
            (d: any) =>
                !d.ipAssetId && d.status === 'completed'
        ).length;
        const totalMinted = allDreams.filter(
            (d: any) => d.ipAssetId
        ).length;

        return {
            total: dreams.length,
            minted: myMinted,
            pending: myPending,
            totalPlatform: allDreams.length,
            totalMintedPlatform: totalMinted,
        };
    }, [dreams, allDreams]);

    const tabs = [
        {
            id: 'overview' as TabType,
            label: locale === 'ko' ? '개요' : 'Overview',
            icon: '📊',
        },
        {
            id: 'dreams' as TabType,
            label: locale === 'ko' ? '내 꿈' : 'My Dreams',
            icon: '🌙',
        },
        {
            id: 'royalties' as TabType,
            label: locale === 'ko' ? '로열티' : 'Royalties',
            icon: '💎',
        },
    ];

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
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                            {locale === 'ko'
                                ? '대시보드'
                                : 'Dashboard'}
                        </h1>
                        <p className="text-white/60 text-lg">
                            {isConnected
                                ? locale === 'ko'
                                    ? '당신의 Dream IP를 관리하세요'
                                    : 'Manage your Dream IPs'
                                : locale === 'ko'
                                ? '지갑을 연결하여 시작하세요'
                                : 'Connect wallet to get started'}
                        </p>
                    </div>

                    {isConnected && (
                        <Button
                            variant="primary"
                            onClick={() =>
                                router.push('/record')
                            }
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            {locale === 'ko'
                                ? '새 꿈 기록'
                                : 'Record Dream'}
                        </Button>
                    )}
                </div>

                {!isConnected ? (
                    <WalletRequiredState locale={locale} />
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() =>
                                        setActiveTab(tab.id)
                                    }
                                    className={`
                                        px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base
                                        transition-all duration-300 flex items-center gap-2
                                        ${
                                            activeTab ===
                                            tab.id
                                                ? 'bg-primary text-black shadow-lg'
                                                : 'text-white/60 hover:text-white hover:bg-white/10'
                                        }
                                    `}
                                >
                                    <span>{tab.icon}</span>
                                    <span className="hidden sm:inline">
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="animate-fade-in">
                            {activeTab === 'overview' && (
                                <OverviewTab
                                    stats={stats}
                                    dreams={dreams}
                                    locale={locale}
                                    router={router}
                                />
                            )}
                            {activeTab === 'dreams' && (
                                <DreamsTab
                                    dreams={dreams}
                                    locale={locale}
                                    router={router}
                                />
                            )}
                            {activeTab === 'royalties' && (
                                <RoyaltiesTab
                                    dreams={dreams}
                                    locale={locale}
                                    address={address}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </PageContainer>
    );
}

function WalletRequiredState({
    locale,
}: {
    locale: string;
}) {
    return (
        <Card
            variant="glass"
            padding="lg"
            className="text-center py-20"
        >
            <div className="max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <svg
                        className="w-10 h-10 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">
                    {locale === 'ko'
                        ? '지갑 연결이 필요합니다'
                        : 'Wallet Connection Required'}
                </h3>
                <p className="text-white/60 text-lg">
                    {locale === 'ko'
                        ? '대시보드를 이용하려면 지갑을 연결해주세요.'
                        : 'Please connect your wallet to use the dashboard.'}
                </p>
            </div>
        </Card>
    );
}

function OverviewTab({
    stats,
    dreams,
    locale,
    router,
}: {
    stats: any;
    dreams: DreamIPPackage[];
    locale: string;
    router: any;
}) {
    const recentDreams = dreams.slice(0, 3);
    const pendingDreams = dreams.filter(
        (d: any) => !d.ipAssetId && d.status === 'completed'
    );

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label={
                        locale === 'ko'
                            ? '총 Dream IP'
                            : 'Total Dreams'
                    }
                    value={stats.total}
                    icon="🌙"
                    color="primary"
                />
                <StatCard
                    label={
                        locale === 'ko'
                            ? '민팅 완료'
                            : 'Minted'
                    }
                    value={stats.minted}
                    icon="✨"
                    color="secondary"
                />
                <StatCard
                    label={
                        locale === 'ko'
                            ? '민팅 대기'
                            : 'Pending Mint'
                    }
                    value={stats.pending}
                    icon="⏳"
                    color="warning"
                />
                <StatCard
                    label={
                        locale === 'ko'
                            ? '플랫폼 전체'
                            : 'Platform Total'
                    }
                    value={stats.totalPlatform}
                    icon="🌐"
                    color="accent"
                />
            </div>

            {/* Action Cards */}
            {pendingDreams.length > 0 && (
                <Card
                    variant="glass"
                    padding="md"
                    className="border-yellow-500/30 bg-yellow-500/5"
                >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                <span className="text-2xl">
                                    ⚡
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    {locale === 'ko'
                                        ? `${pendingDreams.length}개의 꿈이 민팅을 기다리고 있습니다!`
                                        : `${pendingDreams.length} dreams waiting to be minted!`}
                                </h3>
                                <p className="text-white/60 text-sm">
                                    {locale === 'ko'
                                        ? 'NFT로 등록하여 IP를 보호하세요'
                                        : 'Register as NFT to protect your IP'}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                                router.push(
                                    `/dreams/${pendingDreams[0].id}?new=true`
                                )
                            }
                        >
                            {locale === 'ko'
                                ? '지금 민팅하기'
                                : 'Mint Now'}
                        </Button>
                    </div>
                </Card>
            )}

            {/* Recent Dreams */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
                        {locale === 'ko'
                            ? '최근 Dream IP'
                            : 'Recent Dreams'}
                    </h2>
                    {dreams.length > 3 && (
                        <button
                            onClick={() => {}}
                            className="text-primary text-sm font-semibold hover:underline"
                        >
                            {locale === 'ko'
                                ? '모두 보기 →'
                                : 'View All →'}
                        </button>
                    )}
                </div>

                {recentDreams.length > 0 ? (
                    <div className="grid gap-4">
                        {recentDreams.map((dream) => (
                            <DreamListItem
                                key={dream.id}
                                dream={dream}
                                locale={locale}
                                router={router}
                            />
                        ))}
                    </div>
                ) : (
                    <Card
                        variant="glass"
                        padding="lg"
                        className="text-center"
                    >
                        <p className="text-white/60">
                            {locale === 'ko'
                                ? '아직 기록한 꿈이 없습니다.'
                                : 'No dreams recorded yet.'}
                        </p>
                        <Button
                            variant="ghost"
                            className="mt-4"
                            onClick={() =>
                                router.push('/record')
                            }
                        >
                            {locale === 'ko'
                                ? '첫 번째 꿈 기록하기'
                                : 'Record Your First Dream'}
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
}

function DreamsTab({
    dreams,
    locale,
    router,
}: {
    dreams: DreamIPPackage[];
    locale: string;
    router: any;
}) {
    const [filter, setFilter] = useState<
        'all' | 'minted' | 'pending'
    >('all');

    const filteredDreams = useMemo(() => {
        switch (filter) {
            case 'minted':
                return dreams.filter(
                    (d: any) => d.ipAssetId
                );
            case 'pending':
                return dreams.filter(
                    (d: any) =>
                        !d.ipAssetId &&
                        d.status === 'completed'
                );
            default:
                return dreams;
        }
    }, [dreams, filter]);

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex gap-2">
                {[
                    {
                        id: 'all' as const,
                        label:
                            locale === 'ko'
                                ? '전체'
                                : 'All',
                        count: dreams.length,
                    },
                    {
                        id: 'minted' as const,
                        label:
                            locale === 'ko'
                                ? '민팅됨'
                                : 'Minted',
                        count: dreams.filter(
                            (d: any) => d.ipAssetId
                        ).length,
                    },
                    {
                        id: 'pending' as const,
                        label:
                            locale === 'ko'
                                ? '대기중'
                                : 'Pending',
                        count: dreams.filter(
                            (d: any) =>
                                !d.ipAssetId &&
                                d.status === 'completed'
                        ).length,
                    },
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`
                            px-4 py-2 rounded-xl text-sm font-semibold transition-all
                            ${
                                filter === f.id
                                    ? 'bg-primary text-black'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }
                        `}
                    >
                        {f.label} ({f.count})
                    </button>
                ))}
            </div>

            {/* Dreams List */}
            {filteredDreams.length > 0 ? (
                <div className="grid gap-4">
                    {filteredDreams.map((dream) => (
                        <DreamListItem
                            key={dream.id}
                            dream={dream}
                            locale={locale}
                            router={router}
                            expanded
                        />
                    ))}
                </div>
            ) : (
                <Card
                    variant="glass"
                    padding="lg"
                    className="text-center"
                >
                    <p className="text-white/60">
                        {locale === 'ko'
                            ? '해당하는 꿈이 없습니다.'
                            : 'No dreams found.'}
                    </p>
                </Card>
            )}
        </div>
    );
}

function RoyaltiesTab({
    dreams,
    locale,
    address,
}: {
    dreams: DreamIPPackage[];
    locale: string;
    address?: string;
}) {
    const [licenseStats, setLicenseStats] = useState<{
        totalSales: number;
        totalAmount: number;
        totalRevenue: number;
        statsByIpAsset: Array<{
            ipAssetId: string;
            sales: number;
            amount: number;
            revenue: number;
        }>;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const mintedDreams = dreams.filter(
        (d: any) => d.ipAssetId
    );

    useEffect(() => {
        if (address) {
            loadLicenseStats();
        } else {
            setLoading(false);
        }
    }, [address]);

    const loadLicenseStats = async () => {
        if (!address) return;

        try {
            setLoading(true);
            const response = await fetch(
                `/api/story/license/stats?ownerAddress=${address}`
            );
            const data = await response.json();

            if (data.success && data.data) {
                setLicenseStats(data.data);
            }
        } catch (error) {
            console.error(
                '라이선스 통계 조회 오류:',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // IP Asset별 통계를 맵으로 변환
    const statsByIpAssetMap = useMemo(() => {
        if (!licenseStats) return new Map();
        const map = new Map();
        licenseStats.statsByIpAsset.forEach((stat) => {
            map.set(stat.ipAssetId.toLowerCase(), stat);
        });
        return map;
    }, [licenseStats]);

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid sm:grid-cols-3 gap-4">
                <StatCard
                    label={
                        locale === 'ko'
                            ? '총 수익'
                            : 'Total Earnings'
                    }
                    value={
                        loading
                            ? '...'
                            : `${(
                                  licenseStats?.totalRevenue ||
                                  0
                              ).toFixed(2)} IP`
                    }
                    icon="💰"
                    color="primary"
                    isText
                />
                <StatCard
                    label={
                        locale === 'ko'
                            ? '청구 가능'
                            : 'Claimable'
                    }
                    value={
                        loading
                            ? '...'
                            : `${(
                                  licenseStats?.totalRevenue ||
                                  0
                              ).toFixed(2)} IP`
                    }
                    icon="📥"
                    color="secondary"
                    isText
                />
                <StatCard
                    label={
                        locale === 'ko'
                            ? '라이선스 판매'
                            : 'Licenses Sold'
                    }
                    value={
                        loading
                            ? '...'
                            : (
                                  licenseStats?.totalAmount ||
                                  0
                              ).toString()
                    }
                    icon="📜"
                    color="accent"
                />
            </div>

            {/* Royalty History */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">
                    {locale === 'ko'
                        ? '라이선스 판매 현황'
                        : 'License Sales Status'}
                </h2>

                {loading ? (
                    <Card
                        variant="glass"
                        padding="lg"
                        className="text-center"
                    >
                        <LoadingSpinner />
                    </Card>
                ) : mintedDreams.length > 0 ? (
                    <div className="space-y-3">
                        {mintedDreams.map((dream: any) => {
                            const ipAssetId =
                                dream.ipAssetId?.toLowerCase();
                            const stat =
                                statsByIpAssetMap.get(
                                    ipAssetId
                                );
                            const sales = stat?.sales || 0;
                            const revenue =
                                stat?.revenue || 0;

                            return (
                                <Card
                                    key={dream.id}
                                    variant="glass"
                                    padding="sm"
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden">
                                            {dream
                                                .visuals?.[0]
                                                ?.ipfsUrl && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={
                                                        dream
                                                            .visuals[0]
                                                            .ipfsUrl
                                                    }
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white">
                                                {locale ===
                                                    'en' &&
                                                dream
                                                    .analysis
                                                    .title_en
                                                    ? dream
                                                          .analysis
                                                          .title_en
                                                    : dream
                                                          .analysis
                                                          .title}
                                            </h4>
                                            <p className="text-xs text-white/40">
                                                {locale ===
                                                'ko'
                                                    ? `라이선스 판매: ${
                                                          stat?.amount ||
                                                          0
                                                      }개 (${sales}건)`
                                                    : `Licenses sold: ${
                                                          stat?.amount ||
                                                          0
                                                      } (${sales} transactions)`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-primary font-bold">
                                            {revenue.toFixed(
                                                2
                                            )}{' '}
                                            IP
                                        </p>
                                        <p className="text-xs text-white/40">
                                            {locale === 'ko'
                                                ? '총 수익'
                                                : 'Total Revenue'}
                                        </p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card
                        variant="glass"
                        padding="lg"
                        className="text-center"
                    >
                        <p className="text-white/60 mb-2">
                            {locale === 'ko'
                                ? '아직 민팅된 Dream IP가 없습니다.'
                                : 'No minted Dream IPs yet.'}
                        </p>
                        <p className="text-white/40 text-sm">
                            {locale === 'ko'
                                ? 'Dream IP를 민팅하면 라이선스 판매로 로열티를 받을 수 있습니다.'
                                : 'Mint your Dream IP to earn royalties from license sales.'}
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
    color,
    isText = false,
}: {
    label: string;
    value: number | string;
    icon: string;
    color: 'primary' | 'secondary' | 'warning' | 'accent';
    isText?: boolean;
}) {
    const colorStyles = {
        primary:
            'from-primary/20 to-primary/5 border-primary/20',
        secondary:
            'from-secondary/20 to-secondary/5 border-secondary/20',
        warning:
            'from-yellow-500/20 to-yellow-500/5 border-yellow-500/20',
        accent: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
    };

    return (
        <Card
            variant="glass"
            padding="md"
            className={`bg-gradient-to-br ${colorStyles[color]} border`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-white/60 text-sm mb-1">
                        {label}
                    </p>
                    <p
                        className={`font-bold text-white ${
                            isText ? 'text-xl' : 'text-3xl'
                        }`}
                    >
                        {value}
                    </p>
                </div>
                <span className="text-2xl">{icon}</span>
            </div>
        </Card>
    );
}

function DreamListItem({
    dream,
    locale,
    router,
    expanded = false,
}: {
    dream: DreamIPPackage;
    locale: string;
    router: any;
    expanded?: boolean;
}) {
    const keyVisual = dream.visuals.find(
        (v) => v.type === 'key_visual'
    );
    const imageUrl =
        keyVisual?.ipfsUrl || keyVisual?.imageUrl;
    const isMinted = !!(dream as any).ipAssetId;

    return (
        <Card
            variant="glass"
            padding="none"
            className="overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
            onClick={() =>
                router.push(`/dreams/${dream.id}`)
            }
        >
            <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 overflow-hidden shrink-0">
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={imageUrl}
                            alt={dream.analysis.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">
                            🌙
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white truncate group-hover:text-primary transition-colors">
                            {(locale === 'en' &&
                                dream.analysis.title_en) ||
                                dream.analysis.title}
                        </h3>
                        <Badge
                            variant={
                                isMinted
                                    ? 'success'
                                    : 'warning'
                            }
                            className="shrink-0"
                        >
                            {isMinted
                                ? locale === 'ko'
                                    ? '민팅됨'
                                    : 'Minted'
                                : locale === 'ko'
                                ? '대기중'
                                : 'Pending'}
                        </Badge>
                    </div>
                    {expanded && (
                        <p className="text-white/60 text-sm line-clamp-1 mb-1">
                            {(locale === 'en' &&
                                dream.analysis
                                    .summary_en) ||
                                dream.analysis.summary}
                        </p>
                    )}
                    <p className="text-white/40 text-xs">
                        {formatDistanceToNow(
                            new Date(dream.createdAt),
                            {
                                addSuffix: true,
                                locale:
                                    locale === 'ko'
                                        ? ko
                                        : enUS,
                            }
                        )}
                    </p>
                </div>

                {/* Action */}
                {!isMinted && (
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                                `/dreams/${dream.id}?new=true`
                            );
                        }}
                        className="shrink-0 hidden sm:flex"
                    >
                        {locale === 'ko' ? '민팅' : 'Mint'}
                    </Button>
                )}

                <svg
                    className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </div>
        </Card>
    );
}
