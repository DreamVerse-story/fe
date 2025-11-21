/**
 * Dream IP 통계 페이지
 * Design Concept: "The Lucid Anchor" - Analytics View
 */

'use client';

import { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { LoadingPage } from '../components/LoadingSpinner';
import { ChaosBackground } from '../components/ChaosBackground';
import { useTranslation } from '@/lib/i18n/context';
import Link from 'next/link';
import type { DreamIPPackage } from '@/lib/types';

// Lucid Anchor Theme Colors
const COLORS = ['#ccff00', '#4f46e5', '#ff00ff', '#00ccff', '#ffcc00'];

export default function StatsPage() {
    const { t } = useTranslation();
    const [dreams, setDreams] = useState<DreamIPPackage[]>([]);
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

    // Calculate Stats
    const stats = {
        total: dreams.length,
        minted: dreams.filter(d => d.status === 'completed').length,
        processing: dreams.filter(d => d.status === 'processing').length,
        failed: dreams.filter(d => d.status === 'failed').length,
    };

    const genreData = Object.entries(
        dreams.reduce((acc, dream) => {
            const genres = dream.analysis.genres?.length ? dream.analysis.genres : ['Unknown'];
            genres.forEach(genre => {
                acc[genre] = (acc[genre] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    const toneData = Object.entries(
        dreams.reduce((acc, dream) => {
            const tones = dream.analysis.tones?.length ? dream.analysis.tones : ['Unknown'];
            tones.forEach(tone => {
                acc[tone] = (acc[tone] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    if (loading) {
        return <LoadingPage message={t.common.loading} />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
            {/* Background Elements */}
            <ChaosBackground />
            <div className="fixed inset-0 z-0 bg-background/80 backdrop-blur-[2px] pointer-events-none" />

            {/* Header */}
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
                                    className={`transition-colors uppercase text-base tracking-widest ${
                                        item.href === '/stats' 
                                        ? 'text-primary' 
                                        : 'text-white/80 hover:text-primary'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 py-32">
                <div className="max-w-6xl mx-auto animate-fade-in">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                            {t.stats.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            {t.stats.subtitle}
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <StatCard 
                            label="Total Dreams" 
                            value={stats.total} 
                            icon="🌙" 
                            delay={0}
                        />
                        <StatCard 
                            label="IP Minted" 
                            value={stats.minted} 
                            icon="💎" 
                            highlight 
                            delay={0.1}
                        />
                        <StatCard 
                            label="Processing" 
                            value={stats.processing} 
                            icon="⚡" 
                            delay={0.2}
                        />
                        <StatCard 
                            label="Success Rate" 
                            value={`${stats.total ? Math.round((stats.minted / stats.total) * 100) : 0}%`} 
                            icon="📈" 
                            delay={0.3}
                        />
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="glass-panel rounded-2xl p-8 border border-white/10 bg-black/40 backdrop-blur-xl animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                Dream Genres
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={genreData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke="rgba(255,255,255,0.7)" 
                                            tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 14 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis 
                                            stroke="rgba(255,255,255,0.7)" 
                                            tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 14 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(5, 5, 10, 0.9)', 
                                                borderColor: 'rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: '#fff'
                                            }}
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        />
                                        <Bar dataKey="value" fill="#ccff00" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-panel rounded-2xl p-8 border border-white/10 bg-black/40 backdrop-blur-xl animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-2 h-8 bg-secondary rounded-full"></span>
                                Emotional Tones
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
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
                                            {toneData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(5, 5, 10, 0.9)', 
                                                borderColor: 'rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="glass-panel rounded-2xl p-12 text-center border border-white/10 bg-gradient-to-b from-primary/5 to-transparent animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Contribute?</h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg">
                            Your dreams help expand the collective unconscious database.
                            Mint your dream IP today and join the network.
                        </p>
                        <Link 
                            href="/record"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-black font-bold text-lg uppercase tracking-wider rounded-xl transition-all hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] hover:-translate-y-1"
                        >
                            <span>Start Recording</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, icon, highlight = false, delay = 0 }: { label: string, value: string | number, icon: string, highlight?: boolean, delay?: number }) {
    return (
        <div 
            className={`glass-panel rounded-2xl p-6 border border-white/10 bg-black/40 backdrop-blur-xl animate-scale-in hover:border-primary/50 transition-colors group`}
            style={{ animationDelay: `${delay}s`, animationFillMode: 'backwards' }}
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
                {highlight && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
            </div>
            <div className={`text-3xl font-bold mb-1 ${highlight ? 'text-primary' : 'text-white'}`}>
                {value}
            </div>
            <div className="text-base text-white/90 font-medium uppercase tracking-wider">
                {label}
            </div>
        </div>
    );
}
