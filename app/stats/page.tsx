/**
 * Dream IP 통계 페이지
 * Design Concept: "The Lucid Anchor" - Analytics View
 */

'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';
import { LoadingPage } from '@/_components/common';
import { PageContainer } from '@/_components/layout';
import { Card, Button } from '@/_components/ui';
import { useTranslation } from '@/lib/i18n/context';
import { dreamsAtom, statsAtom } from '@/store';
import Link from 'next/link';
import type { DreamIPPackage } from '@/lib/types';

// Lucid Anchor Theme Colors
const COLORS = [
    '#ccff00',
    '#4f46e5',
    '#ff00ff',
    '#00ccff',
    '#ffcc00',
];

export default function StatsPage() {
    const { t, locale } = useTranslation();
    const [dreams, setDreams] = useAtom(dreamsAtom);
    const [stats] = useAtom(statsAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDreams();
    }, []);

    const loadDreams = async () => {
        try {
            const response = await fetch('/api/dreams');
            const data = await response.json();

            if (data.success) {
                setDreams(data.dreams);
            }
        } catch (error) {
            console.error('Dream load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const genreData = Object.entries(
        dreams.reduce((acc, dream) => {
            const genres = dream.analysis.genres?.length
                ? dream.analysis.genres
                : [
                      locale === 'ko'
                          ? '알 수 없음'
                          : 'Unknown',
                  ];
            genres.forEach((genre) => {
                acc[genre] = (acc[genre] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({
        name:
            locale === 'en' &&
            t.genres[name as keyof typeof t.genres]
                ? t.genres[name as keyof typeof t.genres]
                : name,
        value,
    }));

    const toneData = Object.entries(
        dreams.reduce((acc, dream) => {
            const tones = dream.analysis.tones?.length
                ? dream.analysis.tones
                : [
                      locale === 'ko'
                          ? '알 수 없음'
                          : 'Unknown',
                  ];
            tones.forEach((tone) => {
                acc[tone] = (acc[tone] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({
        name:
            locale === 'en' &&
            t.tones[name as keyof typeof t.tones]
                ? t.tones[name as keyof typeof t.tones]
                : name,
        value,
    }));

    if (loading) {
        return <LoadingPage message={t.common.loading} />;
    }

    return (
        <PageContainer
            showBackground={true}
            backgroundType="default"
        >
            <div className="w-full animate-fade-in">
                <div className="text-center mb-10 sm:mb-12 md:mb-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 md:mb-6 tracking-tight text-white">
                        {t.stats.title}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed px-4">
                        {t.stats.subtitle}
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
                    <StatCard
                        label={t.stats.cards.totalLabel}
                        value={stats.total}
                        icon="🌙"
                        delay={0}
                    />
                    <StatCard
                        label={t.stats.cards.mintedLabel}
                        value={stats.minted}
                        icon="💎"
                        highlight
                        delay={0.1}
                    />
                    <StatCard
                        label={
                            t.stats.cards.processingLabel
                        }
                        value={stats.processing}
                        icon="⚡"
                        delay={0.2}
                    />
                    <StatCard
                        label={
                            t.stats.cards.successRateLabel
                        }
                        value={`${
                            stats.total
                                ? Math.round(
                                      (stats.minted /
                                          stats.total) *
                                          100
                                  )
                                : 0
                        }%`}
                        icon="📈"
                        delay={0.3}
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
                    <Card
                        variant="glass"
                        padding="md"
                        className="animate-slide-in-up"
                        style={{
                            animationDelay: '0.4s',
                        }}
                    >
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
                            <span className="w-1.5 sm:w-2 h-6 sm:h-7 md:h-8 bg-primary rounded-full"></span>
                            {t.stats.charts.genres}
                        </h3>
                        <div className="h-[250px] sm:h-[280px] md:h-[300px] lg:h-[350px] w-full">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart data={genreData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.1)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke="rgba(255,255,255,0.7)"
                                        tick={{
                                            fill: 'rgba(255,255,255,0.8)',
                                            fontSize: 14,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.7)"
                                        tick={{
                                            fill: 'rgba(255,255,255,0.8)',
                                            fontSize: 14,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                'rgba(5, 5, 10, 0.9)',
                                            borderColor:
                                                'rgba(255,255,255,0.1)',
                                            borderRadius:
                                                '12px',
                                            color: '#fff',
                                        }}
                                        cursor={{
                                            fill: 'rgba(255,255,255,0.05)',
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="#ccff00"
                                        radius={[
                                            4, 4, 0, 0,
                                        ]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card
                        variant="glass"
                        padding="md"
                        className="animate-slide-in-up"
                        style={{
                            animationDelay: '0.5s',
                        }}
                    >
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
                            <span className="w-1.5 sm:w-2 h-6 sm:h-7 md:h-8 bg-secondary rounded-full"></span>
                            {t.stats.charts.tones}
                        </h3>
                        <div className="h-[250px] sm:h-[280px] md:h-[300px] lg:h-[350px] w-full">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={toneData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {toneData.map(
                                            (
                                                entry,
                                                index
                                            ) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                    stroke="rgba(0,0,0,0.5)"
                                                    strokeWidth={
                                                        2
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                'rgba(5, 5, 10, 0.9)',
                                            borderColor:
                                                'rgba(255,255,255,0.1)',
                                            borderRadius:
                                                '12px',
                                            color: '#fff',
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            paddingTop:
                                                '20px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Call to Action */}
                <Card
                    variant="glass"
                    padding="lg"
                    className="text-center border border-white/10 bg-linear-to-b from-primary/5 to-transparent animate-slide-in-up"
                    style={{ animationDelay: '0.6s' }}
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                        {t.stats.cta.title}
                    </h2>
                    <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg px-4">
                        {t.stats.cta.description}
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        asChild
                    >
                        <Link href="/record">
                            <span>
                                {t.stats.cta.button}
                            </span>
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </Link>
                    </Button>
                </Card>
            </div>
        </PageContainer>
    );
}

function StatCard({
    label,
    value,
    icon,
    highlight = false,
    delay = 0,
}: {
    label: string;
    value: string | number;
    icon: string;
    highlight?: boolean;
    delay?: number;
}) {
    return (
        <Card
            variant="glass"
            padding="md"
            hover={true}
            className="animate-scale-in group"
            style={{
                animationDelay: `${delay}s`,
                animationFillMode: 'backwards',
            }}
        >
            <div className="flex justify-between items-start mb-2 sm:mb-3 md:mb-4">
                <span className="text-2xl sm:text-2.5xl md:text-3xl group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </span>
                {highlight && (
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
                )}
            </div>
            <div
                className={`text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1 ${
                    highlight
                        ? 'text-primary'
                        : 'text-white'
                }`}
            >
                {value}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-white/90 font-medium uppercase tracking-wider">
                {label}
            </div>
        </Card>
    );
}
