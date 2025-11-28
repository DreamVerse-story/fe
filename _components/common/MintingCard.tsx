'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/_components/ui';
import { useTranslation } from '@/lib/i18n/context';
import type { DreamIPPackage } from '@/lib/types';

const DEFAULT_THEMES = [
    {
        title: 'NEON NIGHTMARE',
        gradient:
            'from-purple-600 via-pink-600 to-blue-600',
        metadata: 'GENRE: CYBERPUNK // TONE: DARK',
        image: null,
        id: 'DEMO-001',
    },
    {
        title: 'LUCID OCEAN',
        gradient:
            'from-blue-400 via-teal-500 to-emerald-600',
        metadata: 'GENRE: FANTASY // TONE: CALM',
        image: null,
        id: 'DEMO-002',
    },
    {
        title: 'VOID WALKER',
        gradient: 'from-gray-900 via-purple-900 to-black',
        metadata: 'GENRE: HORROR // TONE: EERIE',
        image: null,
        id: 'DEMO-003',
    },
    {
        title: 'SOLAR FLARE',
        gradient:
            'from-orange-500 via-red-500 to-yellow-500',
        metadata: 'GENRE: SCI-FI // TONE: INTENSE',
        image: null,
        id: 'DEMO-004',
    },
];

interface MintingCardProps {
    dreams?: DreamIPPackage[];
}

export function MintingCard({
    dreams = [],
}: MintingCardProps) {
    const { t, locale } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isGlitching, setIsGlitching] = useState(false);

    // Prepare display data
    const displayItems =
        dreams.length > 0
            ? dreams.map((dream) => {
                  const title =
                      locale === 'ko'
                          ? dream.analysis.title
                          : dream.analysis.title_en ||
                            dream.analysis.title;
                  const genre =
                      (locale === 'ko'
                          ? dream.analysis.genres[0]
                          : dream.analysis
                                .genres_en?.[0]) ||
                      'UNKNOWN';
                  const tone =
                      (locale === 'ko'
                          ? dream.analysis.tones[0]
                          : dream.analysis.tones_en?.[0]) ||
                      'UNKNOWN';
                  const keyVisual = dream.visuals.find(
                      (v) => v.type === 'key_visual'
                  );
                  const image =
                      keyVisual?.ipfsUrl ||
                      keyVisual?.imageUrl ||
                      dream.visuals[0]?.imageUrl;

                  return {
                      title: title.toUpperCase(),
                      gradient: 'from-gray-900 to-black', // Fallback if image fails
                      metadata: `GENRE: ${genre.toUpperCase()} // TONE: ${tone.toUpperCase()}`,
                      image: image,
                      id:
                          (dream as any).ipAssetId ||
                          dream.id
                              .substring(0, 8)
                              .toUpperCase(),
                  };
              })
            : DEFAULT_THEMES;

    useEffect(() => {
        const interval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => {
                setCurrentIndex(
                    (prev) =>
                        (prev + 1) % displayItems.length
                );
                setIsGlitching(false);
            }, 200);
        }, 3000);

        return () => clearInterval(interval);
    }, [displayItems.length]);

    const currentItem = displayItems[currentIndex];

    return (
        <div className="relative w-80 h-96 perspective-1000 mx-auto mb-12 animate-float-3d">
            {/* Main Card */}
            <div className="relative w-full h-full transform-style-3d transition-all duration-500 group">
                {/* Cyberpunk Frame with Cut Corners */}
                <div
                    className="absolute inset-0 animate-dream-colors shadow-[0_0_30px_rgba(139,92,246,0.3)] border border-purple-500/30"
                    style={{
                        clipPath:
                            'polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)',
                    }}
                >
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-20">
                        <div className="w-full h-2 bg-primary/50 blur-sm animate-scanline" />
                    </div>

                    {/* Full Height Image Area */}
                    <div className="absolute inset-0 overflow-hidden">
                        {currentItem.image ? (
                            <img
                                src={currentItem.image}
                                alt={currentItem.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div
                                className={`w-full h-full bg-gradient-to-br ${currentItem.gradient} flex items-center justify-center`}
                            >
                                <span className="text-4xl opacity-50 animate-pulse">
                                    ⚡
                                </span>
                            </div>
                        )}

                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        {/* Glitch Overlay */}
                        {isGlitching && (
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay animate-glitch-1" />
                        )}
                    </div>

                    {/* Content Overlay (Bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-30 flex flex-col justify-end h-full pointer-events-none">
                        {/* Dreamy Fog Animation (Text Area Only) */}
                        <div className="absolute bottom-0 right-0 w-full h-1/2 z-0 pointer-events-none mix-blend-hard-light">
                            <div className="absolute inset-0 bg-gradient-to-l from-black via-black/50 to-transparent animate-breathe" />
                        </div>

                        {/* Tech Lines */}
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-4 relative z-10" />

                        <div className="flex items-end justify-between gap-4 relative z-10">
                            {/* Title */}
                            <h3 className="text-2xl font-black text-white cyber-text tracking-wider leading-tight line-clamp-2">
                                {currentItem.title}
                            </h3>
                        </div>

                        {/* Decorative Corner */}
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 opacity-50" />
                    </div>
                </div>

                {/* Glowing Border Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none border border-primary/50 opacity-50"
                    style={{
                        clipPath:
                            'polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)',
                    }}
                />
            </div>

            {/* Reflection/Shadow */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-40 h-4 bg-primary/20 blur-xl rounded-full animate-pulse" />
        </div>
    );
}
