/**
 * My Page
 * 사용자가 생성한 Dream IP를 관리하는 페이지
 */

'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/_components/layout';
import { LoadingPage, LoadingSpinner } from '@/_components/common';
import { Card, Badge, Button } from '@/_components/ui';
import { useTranslation } from '@/lib/i18n/context';
import type { DreamIPPackage } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';

export default function MyPage() {
    const { t, locale } = useTranslation();
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const [dreams, setDreams] = useState<DreamIPPackage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isConnected && address) {
            loadMyDreams();
        } else {
            setLoading(false);
        }
    }, [isConnected, address]);

    const loadMyDreams = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/dreams');
            const data = await response.json();

            if (data.success) {
                // 내 지갑 주소로 생성된 꿈만 필터링
                const myDreams = data.dreams.filter((dream: any) => {
                    const creatorAddress = dream.creatorAddress;
                    return (
                        creatorAddress &&
                        creatorAddress.toLowerCase() === address?.toLowerCase()
                    );
                });
                
                // 최신순 정렬
                myDreams.sort((a: DreamIPPackage, b: DreamIPPackage) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                setDreams(myDreams);
            }
        } catch (error) {
            console.error('Failed to load dreams:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <PageContainer showBackground={true} backgroundType="default">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                    <div className="text-6xl opacity-50">🔒</div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        {locale === 'ko' ? '지갑 연결이 필요합니다' : 'Wallet Connection Required'}
                    </h1>
                    <p className="text-white/60 max-w-md">
                        {locale === 'ko' 
                            ? '자신의 Dream IP를 관리하려면 지갑을 연결해주세요.' 
                            : 'Please connect your wallet to manage your Dream IPs.'}
                    </p>
                </div>
            </PageContainer>
        );
    }

    if (loading) {
        return <LoadingPage message={locale === 'ko' ? '내 꿈을 불러오는 중...' : 'Loading your dreams...'} />;
    }

    return (
        <PageContainer showBackground={true} backgroundType="default">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        {locale === 'ko' ? '마이 페이지' : 'My Page'}
                    </h1>
                    <p className="text-white/60 text-lg">
                        {locale === 'ko' 
                            ? `총 ${dreams.length}개의 꿈을 기록했습니다.` 
                            : `You have recorded ${dreams.length} dreams.`}
                    </p>
                </div>

                {dreams.length === 0 ? (
                    <Card variant="glass" padding="lg" className="text-center py-20">
                        <div className="text-5xl mb-6 opacity-30">🌙</div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            {locale === 'ko' ? '아직 기록된 꿈이 없습니다' : 'No dreams recorded yet'}
                        </h3>
                        <p className="text-white/60 mb-8">
                            {locale === 'ko' 
                                ? '첫 번째 꿈을 기록하고 NFT로 만들어보세요.' 
                                : 'Record your first dream and mint it as an NFT.'}
                        </p>
                        <Button 
                            variant="primary" 
                            onClick={() => router.push('/record')}
                        >
                            {locale === 'ko' ? '꿈 기록하러 가기' : 'Record a Dream'}
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {dreams.map((dream) => (
                            <DreamItem key={dream.id} dream={dream} locale={locale} />
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}

function DreamItem({ dream, locale }: { dream: DreamIPPackage; locale: string }) {
    const router = useRouter();
    const keyVisual = dream.visuals.find(v => v.type === 'key_visual');
    const imageUrl = keyVisual?.ipfsUrl || keyVisual?.imageUrl;
    
    // Status Logic
    const isCompleted = dream.status === 'completed';
    const isMinted = !!(dream as any).ipAssetId;
    // TODO: Check license status properly
    const isLicensed = false; // Placeholder

    return (
        <Card variant="glass" padding="none" className="overflow-hidden hover:border-primary/50 transition-colors">
            <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="w-full sm:w-48 md:w-64 aspect-video sm:aspect-auto relative shrink-0">
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                            src={imageUrl} 
                            alt={dream.analysis.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                            <span className="text-3xl opacity-20">🖼️</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between gap-4">
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-xl font-bold text-white line-clamp-1">
                                {(locale === 'en' && dream.analysis.title_en) || dream.analysis.title}
                            </h3>
                            <span className="text-xs text-white/40 whitespace-nowrap shrink-0 mt-1">
                                {formatDistanceToNow(new Date(dream.createdAt), {
                                    addSuffix: true,
                                    locale: locale === 'ko' ? ko : enUS,
                                })}
                            </span>
                        </div>
                        <p className="text-white/70 line-clamp-2 text-sm mb-4">
                            {(locale === 'en' && dream.analysis.summary_en) || dream.analysis.summary}
                        </p>
                        
                        {/* Status Steps */}
                        <div className="flex items-center gap-2 text-sm">
                            <StatusStep 
                                label={locale === 'ko' ? '생성 완료' : 'Created'} 
                                active={isCompleted} 
                                completed={isCompleted}
                            />
                            <div className={`w-4 h-0.5 ${isMinted ? 'bg-primary' : 'bg-white/10'}`} />
                            <StatusStep 
                                label={locale === 'ko' ? 'NFT 민팅' : 'NFT Minted'} 
                                active={isCompleted && !isMinted} 
                                completed={isMinted}
                            />
                            <div className={`w-4 h-0.5 ${isLicensed ? 'bg-primary' : 'bg-white/10'}`} />
                            <StatusStep 
                                label={locale === 'ko' ? '라이선스' : 'Licensed'} 
                                active={isMinted && !isLicensed} 
                                completed={isLicensed}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/dreams/${dream.id}`)}
                        >
                            {locale === 'ko' ? '상세 보기' : 'View Details'}
                        </Button>
                        
                        {!isMinted && isCompleted && (
                            <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => router.push(`/dreams/${dream.id}?new=true`)}
                                className="animate-pulse"
                            >
                                {locale === 'ko' ? 'NFT 민팅하기' : 'Mint NFT'}
                            </Button>
                        )}
                        
                        {isMinted && !isLicensed && (
                            <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => router.push(`/dreams/${dream.id}`)}
                            >
                                {locale === 'ko' ? '라이선스 설정' : 'Set License'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

function StatusStep({ label, active, completed }: { label: string; active: boolean; completed: boolean }) {
    return (
        <div className={`flex items-center gap-1.5 ${
            completed ? 'text-primary' : active ? 'text-white' : 'text-white/30'
        }`}>
            <div className={`w-2 h-2 rounded-full ${
                completed ? 'bg-primary' : active ? 'bg-white animate-pulse' : 'bg-white/30'
            }`} />
            <span className="font-medium">{label}</span>
        </div>
    );
}
