/**
 * 메인 홈 페이지
 * Dream IP Incubator - 꿈을 IP 자산으로
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    DreamIPCard,
    LoadingSpinner,
    MintingCard,
} from '@/_components/common';
import { PageContainer } from '@/_components/layout';
import { Button, Card } from '@/_components/ui';
import { useTranslation } from '@/lib/i18n/context';
import type { DreamIPPackage } from '@/lib/types';

export default function HomePage() {
    const { t, locale } = useTranslation();
    const [recentDreams, setRecentDreams] = useState<
        DreamIPPackage[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        minted: 0,
    });

    useEffect(() => {
        loadRecentDreams();
    }, []);

    const loadRecentDreams = async () => {
        try {
            const response = await fetch('/api/dreams');
            const data = await response.json();

            if (data.success) {
                const completed = data.dreams.filter(
                    (d: DreamIPPackage) =>
                        d.status === 'completed'
                );
                const minted = completed.filter(
                    (d: any) => d.ipAssetId
                );
                setStats({
                    total: completed.length,
                    minted: minted.length,
                });
                setRecentDreams(minted.slice(0, 6));
            }
        } catch (error) {
            console.error('Dream load error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer
            showBackground={true}
            backgroundType="default"
        >
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center -mt-20 pt-20">
                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-[10%] w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
                    <div
                        className="absolute bottom-1/4 right-[15%] w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float"
                        style={{ animationDelay: '2s' }}
                    />
                    <div
                        className="absolute top-1/3 right-[20%] w-24 h-24 bg-accent/10 rounded-full blur-3xl animate-float"
                        style={{ animationDelay: '4s' }}
                    />
                </div>

                <div className="text-center max-w-4xl mx-auto px-4 relative z-10">
                    {/* 3D Minting Card */}
                    <MintingCard dreams={recentDreams} />

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border-2 border-primary/30 mb-8 animate-fade-in shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-primary text-sm font-semibold">
                            {locale === 'ko'
                                ? 'Story Protocol 기반'
                                : 'Powered by Story Protocol'}
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-slide-in-up">
                        {locale === 'ko' ? (
                            <>
                                당신의{' '}
                                <span className="text-primary">
                                    꿈
                                </span>
                                을<br />
                                <span className="text-gradient-primary">
                                    IP 자산
                                </span>
                                으로
                            </>
                        ) : (
                            <>
                                Turn Your{' '}
                                <span className="text-primary">
                                    Dreams
                                </span>
                                <br />
                                Into{' '}
                                <span className="text-gradient-primary">
                                    IP Assets
                                </span>
                            </>
                        )}
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="text-lg sm:text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-in-up"
                        style={{ animationDelay: '0.1s' }}
                    >
                        {locale === 'ko'
                            ? 'DreamVerse는 개인의 꿈을 온체인 IP로 변환하는 AI 기반 Web3 플랫폼입니다. 당신의 꿈을 기록하고, 수익을 창출하는 디지털 자산으로 만드세요.'
                            : 'DreamVerse is an AI-powered Web3 platform that transforms personal dreams into fully on-chain intellectual property.'}
                    </p>

                    {/* CTA Buttons */}
                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-up"
                        style={{ animationDelay: '0.2s' }}
                    >
                        <Link
                            href="/record"
                            className="w-full sm:w-auto"
                        >
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full sm:w-auto px-8"
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
                                    ? '꿈 기록하기'
                                    : 'Record Dream'}
                            </Button>
                        </Link>
                        <Link
                            href="/market"
                            className="w-full sm:w-auto"
                        >
                            <Button
                                variant="ghost"
                                size="lg"
                                className="w-full sm:w-auto px-8"
                            >
                                {locale === 'ko'
                                    ? 'DreamVerse 탐색'
                                    : 'Explore DreamVerse'}
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
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div
                        className="flex items-center justify-center gap-8 sm:gap-12 mt-12 animate-fade-in"
                        style={{ animationDelay: '0.3s' }}
                    >
                        <div className="text-center">
                            <p className="text-3xl sm:text-4xl font-bold text-white">
                                {stats.total}
                            </p>
                            <p className="text-white/50 text-sm">
                                {locale === 'ko'
                                    ? '총 IP 자산'
                                    : 'Total IP Assets'}
                            </p>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="text-center">
                            <p className="text-3xl sm:text-4xl font-bold text-primary">
                                {stats.minted}
                            </p>
                            <p className="text-white/50 text-sm">
                                {locale === 'ko'
                                    ? '민팅 완료'
                                    : 'Minted'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 sm:py-24 lg:py-32 relative">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        {locale === 'ko'
                            ? '어떻게 작동하나요?'
                            : 'How It Works'}
                    </h2>
                    <p className="text-white/60 text-lg max-w-xl mx-auto">
                        {locale === 'ko'
                            ? '세 단계로 당신의 꿈을 IP 자산으로 만드세요'
                            : 'Three steps to turn your dreams into IP assets'}
                    </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
                    {[
                        {
                            step: '01',
                            icon: '✍️',
                            title:
                                locale === 'ko'
                                    ? '꿈 기록'
                                    : 'Record Dream',
                            description:
                                locale === 'ko'
                                    ? '오늘 꾼 꿈을 텍스트로 기록하세요. 상세할수록 좋습니다.'
                                    : 'Write down your dream in text. The more detailed, the better.',
                        },
                        {
                            step: '02',
                            icon: '🤖',
                            title:
                                locale === 'ko'
                                    ? 'AI 분석 & 생성'
                                    : 'AI Analysis',
                            description:
                                locale === 'ko'
                                    ? 'AI가 꿈을 분석하고 스토리, 캐릭터, 키 비주얼을 생성합니다.'
                                    : 'AI analyzes your dream and generates story, characters, and visuals.',
                        },
                        {
                            step: '03',
                            icon: '⛓️',
                            title:
                                locale === 'ko'
                                    ? 'NFT 민팅'
                                    : 'Mint NFT',
                            description:
                                locale === 'ko'
                                    ? 'Story Protocol에 IP로 등록하고 라이선스 판매로 수익을 얻으세요.'
                                    : 'Register as IP on Story Protocol and earn from license sales.',
                        },
                    ].map((item, index) => (
                        <Card
                            key={index}
                            variant="glass"
                            padding="lg"
                            className="relative group hover:border-primary/30 transition-all duration-500"
                        >
                            {/* Step Number */}
                            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <span className="text-primary font-bold text-sm">
                                    {item.step}
                                </span>
                            </div>

                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-3">
                                {item.title}
                            </h3>
                            <p className="text-white/60 leading-relaxed">
                                {item.description}
                            </p>

                            {/* Connector Line (except last) */}
                            {index < 2 && (
                                <div className="hidden sm:block absolute top-1/2 -right-4 lg:-right-5 w-8 lg:w-10 h-0.5 bg-linear-to-r from-white/10 to-primary/30" />
                            )}
                        </Card>
                    ))}
                </div>
            </section>

            {/* Recent Dreams */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 sm:mb-12">
                    <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                            {locale === 'ko'
                                ? '최근 등록된 꿈'
                                : 'Recent Dreams'}
                        </h2>
                        <p className="text-white/60 text-lg">
                            {locale === 'ko'
                                ? '방금 민팅된 꿈 IP를 확인하세요'
                                : 'Check out the freshly minted Dream IP Assets'}
                        </p>
                    </div>
                    <Link
                        href="/market"
                        className="text-primary font-semibold hover:underline underline-offset-4 flex items-center gap-2 shrink-0"
                    >
                        {locale === 'ko'
                            ? '전체 보기'
                            : 'View All'}
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : recentDreams.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentDreams.map((dream) => (
                            <DreamIPCard
                                key={dream.id}
                                dream={dream}
                            />
                        ))}
                    </div>
                ) : (
                    <Card
                        variant="glass"
                        padding="lg"
                        className="text-center py-16 border-dashed border-2 border-white/10"
                    >
                        <div className="text-5xl mb-6 opacity-30">
                            🌙
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                            {locale === 'ko'
                                ? '아직 민팅된 Dream IP가 없습니다'
                                : 'No Dream IPs Minted Yet'}
                        </h3>
                        <p className="text-white/60 mb-8 max-w-md mx-auto">
                            {locale === 'ko'
                                ? '첫 번째 Dream IP를 만들고 Story Protocol에 등록하세요!'
                                : 'Create the first Dream IP and register it on Story Protocol!'}
                        </p>
                        <Link href="/record">
                            <Button variant="primary">
                                {locale === 'ko'
                                    ? '지금 시작하기'
                                    : 'Get Started'}
                            </Button>
                        </Link>
                    </Card>
                )}
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 lg:py-24">
                <Card
                    variant="elevated"
                    padding="lg"
                    className="text-center bg-linear-to-br from-primary/10 via-transparent to-secondary/10 border-primary/20"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        {locale === 'ko'
                            ? '지금 바로 시작하세요'
                            : 'Start Now'}
                    </h2>
                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                        {locale === 'ko'
                            ? '당신의 꿈은 독특한 IP가 될 수 있습니다. 지금 기록하고 소유하세요.'
                            : 'Your dreams can become unique IP. Record and own them now.'}
                    </p>
                    <Link href="/record">
                        <Button variant="primary" size="lg">
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
                                ? '꿈 기록하기'
                                : 'Record Your Dream'}
                        </Button>
                    </Link>
                </Card>
            </section>
        </PageContainer>
    );
}
