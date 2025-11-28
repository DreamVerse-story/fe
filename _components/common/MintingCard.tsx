'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/_components/ui';
import { useTranslation } from '@/lib/i18n/context';
import type { DreamIPPackage } from '@/lib/types';

const DEFAULT_THEMES = [
    {
        title: 'NEON NIGHTMARE',
        gradient: 'from-purple-600 via-pink-600 to-blue-600',
        metadata: 'GENRE: CYBERPUNK // TONE: DARK',
        image: null,
        id: 'DEMO-001',
    },
    {
        title: 'LUCID OCEAN',
        gradient: 'from-blue-400 via-teal-500 to-emerald-600',
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
        gradient: 'from-orange-500 via-red-500 to-yellow-500',
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
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Prepare display data
    const safeDreams = dreams || [];
    const displayItems =
        safeDreams.length > 0
            ? safeDreams.map((dream) => {
                  const title =
                      locale === 'ko'
                          ? dream.analysis.title
                          : dream.analysis.title_en ||
                            dream.analysis.title;
                  const genre =
                      (locale === 'ko'
                          ? dream.analysis.genres[0]
                          : dream.analysis.genres_en?.[0]) ||
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
                      gradient: 'from-indigo-900 to-purple-900',
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
            // Pause rotation on hover
            if (isHovering) return;
            
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(
                    (prev) =>
                        (prev + 1) % displayItems.length
                );
                setIsTransitioning(false);
            }, 500);
        }, 4000);

        return () => clearInterval(interval);
    }, [displayItems.length, isHovering]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        // Use currentTarget (the container) for stable coordinates
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // 3D Tilt Effect
        // Rotate X based on Y position (up/down)
        // Rotate Y based on X position (left/right)
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    };

    const currentItem = displayItems[currentIndex];

    return (
        <div 
            className="relative w-80 h-[28rem] mx-auto mb-12 group z-10"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
        >
            {/* Idle Float Animation Wrapper */}
            {/* Pauses animation on hover to prevent conflict with mouse tilt */}
            <div 
                className="w-full h-full animate-float-3d"
                style={{ animationPlayState: isHovering ? 'paused' : 'running' }}
            >
                
                {/* Main 3D Card */}
                <div
                    ref={cardRef}
                    className="relative w-full h-full rounded-3xl transition-transform duration-100 ease-out shadow-2xl"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
                    }}
                >
                    {/* Glassmorphism Background */}
                    <div className="absolute inset-0 rounded-3xl bg-[#05050a]/80 backdrop-blur-md border border-white/10 overflow-hidden z-0 shadow-inner">
                        {/* Animated Background Blobs */}
                        <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute top-40 -right-20 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
                        <div className="absolute -bottom-20 left-20 w-60 h-60 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-700" />
                        
                        {/* Floating Particles/Stars */}
                        <div className="absolute top-10 left-10 w-1 h-1 bg-white/80 rounded-full animate-ping duration-1000" />
                        <div className="absolute top-20 right-10 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse delay-300" />
                        <div className="absolute bottom-32 left-1/2 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-500" />
                    </div>

                    {/* Content Container */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden z-10 flex flex-col">
                        
                        {/* Image Area (Top 2/3) */}
                        <div className="relative h-2/3 w-full overflow-hidden group-hover:brightness-110 transition-all duration-500">
                            {currentItem.image ? (
                                <img
                                    src={currentItem.image}
                                    alt={currentItem.title}
                                    className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                                        isTransitioning ? 'opacity-0 scale-110 blur-sm' : 'opacity-100 scale-100 blur-0'
                                    }`}
                                />
                            ) : (
                                <div
                                    className={`w-full h-full bg-gradient-to-br ${currentItem.gradient} flex items-center justify-center transition-opacity duration-500 ${
                                        isTransitioning ? 'opacity-50' : 'opacity-100'
                                    }`}
                                >
                                    <span className="text-4xl opacity-50 animate-pulse">✨</span>
                                </div>
                            )}
                            
                            {/* Soft Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/20 to-transparent opacity-80" />
                        </div>

                        {/* Text Content (Bottom 1/3) */}
                        <div className="absolute bottom-0 w-full p-6 flex flex-col justify-end h-full pointer-events-none">
                            <div className={`transition-all duration-500 transform ${isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px] tracking-widest text-purple-200 font-medium backdrop-blur-sm">
                                        {currentItem.metadata.split('//')[0].replace('GENRE: ', '')}
                                    </span>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-white mb-1 tracking-wide drop-shadow-lg">
                                    {currentItem.title}
                                </h3>
                                
                                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4" />
                            </div>
                            
                            {/* Button Area - Pointer events enabled for button */}
                            <div className="pt-4 pointer-events-auto">
                                <Button 
                                    variant="outline" 
                                    className="w-full border-white/20 bg-white/5 hover:bg-white/20 hover:border-white/40 text-white backdrop-blur-sm transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <span>Mint Dream</span>
                                        <span className="text-xs opacity-70">0.01 IP</span>
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Shine/Reflection Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                </div>
            </div>
        </div>
    );
}