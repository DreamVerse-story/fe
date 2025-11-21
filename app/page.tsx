/**
 * 메인 홈 페이지
 * Design Concept: "The Lucid Anchor"
 * Chaos Background + Stable Central Asset
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DreamIPCard } from './components/DreamIPCard';
import { DreamIPDetail } from './components/DreamIPDetail';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ChaosBackground } from './components/ChaosBackground';
import { useTranslation } from '@/lib/i18n/context';
import type { DreamIPPackage } from '@/lib/types';

export default function HomePage() {
    const { t } = useTranslation();
    const [recentDreams, setRecentDreams] = useState<DreamIPPackage[]>([]);
    const [selectedDream, setSelectedDream] = useState<DreamIPPackage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecentDreams();
    }, []);

    const loadRecentDreams = async () => {
        try {
            const response = await fetch('/api/dreams');
            const data = await response.json();

            if (data.success) {
                setRecentDreams(
                    data.dreams
                        .filter((d: DreamIPPackage) => d.status === 'completed')
                        .slice(0, 3)
                );
            }
        } catch (error) {
            console.error('Dream load error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
            {/* 1. The Chaos (Dynamic Background) */}
            <ChaosBackground />
            
            {/* Overlay Gradient for readability */}
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/80 via-transparent to-background pointer-events-none" />

            {/* Header - Minimal & Floating */}
            <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-black/20 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold tracking-wider text-white mix-blend-difference hover:opacity-80 transition-opacity">
                        IDI <span className="text-base opacity-50 font-normal ml-1">BETA</span>
                    </Link>
                    
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex gap-8 text-base font-bold tracking-wide">
                            {[
                                { href: '/record', label: 'RECORD' },
                                { href: '/market', label: 'MARKET' },
                                { href: '/stats', label: 'STATS' },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-white/80 hover:text-primary transition-colors uppercase text-base tracking-widest"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            {/* 2. The Anchor (Hero Section) */}
            <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20">
                
                {/* Central Asset Card */}
                <div className="relative group perspective-1000 animate-fade-in">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    
                    {/* The Card Itself */}
                    <div className="relative w-[340px] md:w-[420px] aspect-[3/4] glass-panel rounded-2xl border border-white/10 p-6 flex flex-col shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-1 bg-black/40">
                        
                        {/* Card Header */}
                        <div className="flex justify-between items-center mb-6 text-base font-mono text-white/90 uppercase tracking-widest">
                            <span>Dream Asset #8821</span>
                            <span className="flex items-center gap-2 text-primary">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                Live
                            </span>
                        </div>

                        {/* Main Visual Area */}
                        <div className="flex-1 rounded-xl bg-black/50 overflow-hidden relative group-hover:ring-1 ring-white/20 transition-all mb-6">
                            {/* Placeholder for Hero Image - In real app, this would be dynamic */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 mix-blend-overlay" />
                            <div className="absolute inset-0 flex items-center justify-center text-white/10 font-bold text-7xl select-none">
                                ?
                            </div>
                            
                            {/* Floating Elements inside card */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <h2 className="text-3xl font-bold text-white leading-tight mb-2 drop-shadow-lg">
                                    Cosmic Whale
                                </h2>
                                <p className="text-base text-white/90 line-clamp-2 font-light leading-relaxed">
                                    A giant whale consuming starlight in the middle of a silent desert...
                                </p>
                            </div>
                        </div>

                        {/* Card Footer / Action */}
                        <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                            <div className="flex justify-between text-base text-white/90 font-mono">
                                <span>Est. Value</span>
                                <span className="text-white">0.4 ETH</span>
                            </div>
                            
                            <Link 
                                href="/record"
                                className="w-full py-4 bg-primary hover:bg-primary/90 text-black font-bold text-lg uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] hover:-translate-y-0.5"
                            >
                                <span>Mint Your Dream</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Background Text (Behind Card) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full text-center pointer-events-none select-none">
                    <h1 className="text-[13vw] md:text-[16vw] font-black text-white/[0.04] leading-none tracking-tighter blur-sm">
                        DREAM
                        <br />
                        ASSET
                    </h1>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60 animate-bounce">
                    <span className="text-base uppercase tracking-widest text-white/80 font-medium">Scroll to Explore</span>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
            </section>

            {/* 3. Content Section (Features & Recent) */}
            <section className="relative z-10 bg-background border-t border-white/10">
                <div className="container mx-auto px-4 py-32">
                    
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Recent Minted Dreams</h2>
                            <p className="text-xl text-white/90 max-w-xl leading-relaxed">
                                Freshly extracted from the subconscious, now immutable on Story Protocol.
                            </p>
                        </div>
                        <Link href="/market" className="text-primary text-lg font-bold uppercase tracking-wider hover:underline underline-offset-8 flex items-center gap-2">
                            View Full Market <span className="text-2xl">→</span>
                        </Link>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="py-32 flex justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-10">
                            {recentDreams.length > 0 ? (
                                recentDreams.map((dream) => (
                                    <div key={dream.id} className="transform hover:-translate-y-3 transition-transform duration-300">
                                        <DreamIPCard
                                            dream={dream}
                                            onClick={() => setSelectedDream(dream)}
                                        />
                                    </div>
                                ))
                            ) : (
                                // Empty State
                                <div className="col-span-3 py-32 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-white/5">
                                    <div className="text-6xl mb-6 opacity-50">💤</div>
                                    <h3 className="text-2xl font-bold text-white mb-3">No Dreams Minted Yet</h3>
                                    <p className="text-white/90 mb-8 text-xl">Be the first to crystallize your imagination.</p>
                                    <Link href="/record" className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-lg font-medium transition-all hover:scale-105">
                                        Start Recording
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 bg-black py-16">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-base text-white/90 uppercase tracking-wider font-medium">
                    <div>
                        © 2025 IDI Incubation.
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Protocol</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    </div>
                </div>
            </footer>

            {/* Detail Modal */}
            {selectedDream && (
                <DreamIPDetail
                    dream={selectedDream}
                    onClose={() => setSelectedDream(null)}
                />
            )}
        </div>
    );
}
