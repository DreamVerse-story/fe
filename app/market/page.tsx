/**
 * Dream IP 검색 페이지
 * Design Concept: "The Lucid Anchor" - Discovery Mode
 */

'use client';
export const dynamic = 'force-dynamic';
import {
    useState,
    useEffect,
    useMemo,
    Suspense,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { DreamIPCard } from '../components/DreamIPCard';
import { DreamIPDetail } from '../components/DreamIPDetail';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { LoadingPage } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ChaosBackground } from '../components/ChaosBackground';
import { useTranslation } from '@/lib/i18n/context';
import Link from 'next/link';
import type { DreamIPPackage } from '@/lib/types';

function SearchPageContent() {
    const { t, locale } = useTranslation();
    const searchParams = useSearchParams();

    // State
    const [dreams, setDreams] = useState<DreamIPPackage[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [selectedDream, setSelectedDream] =
        useState<DreamIPPackage | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<
        string[]
    >([]);
    const [selectedTones, setSelectedTones] = useState<
        string[]
    >([]);
    const [sortBy, setSortBy] = useState<
        'newest' | 'oldest' | 'popular'
    >('newest');

    // Initial Load
    useEffect(() => {
        loadDreams();

        // URL params for initial search
        const query = searchParams.get('q');
        if (query) setSearchQuery(query);
    }, [searchParams]);

    const loadDreams = async () => {
        try {
            const response = await fetch('/api/dreams');
            const data = await response.json();

            if (data.success) {
                setDreams(
                    data.dreams.filter(
                        (d: DreamIPPackage) =>
                            d.status === 'completed'
                    )
                );
            }
        } catch (error) {
            console.error('Dream load error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredDreams = useMemo(() => {
        return dreams
            .filter((dream) => {
                // Text Search
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    const title = (
                        dream.analysis.title || ''
                    ).toLowerCase();
                    const titleEn = (
                        dream.analysis.title_en || ''
                    ).toLowerCase();
                    const summary = (
                        dream.analysis.summary || ''
                    ).toLowerCase();
                    const summaryEn = (
                        dream.analysis.summary_en || ''
                    ).toLowerCase();

                    const matchesTitle =
                        title.includes(query) ||
                        titleEn.includes(query);
                    const matchesDesc =
                        summary.includes(query) ||
                        summaryEn.includes(query);

                    // Search in arrays
                    const matchesGenres = (
                        dream.analysis.genres || []
                    ).some((g) =>
                        g.toLowerCase().includes(query)
                    );
                    const matchesTones = (
                        dream.analysis.tones || []
                    ).some((t) =>
                        t.toLowerCase().includes(query)
                    );
                    const matchesCharacters = (
                        dream.analysis.characters || []
                    ).some((c) =>
                        c.toLowerCase().includes(query)
                    );

                    if (
                        !matchesTitle &&
                        !matchesDesc &&
                        !matchesGenres &&
                        !matchesTones &&
                        !matchesCharacters
                    )
                        return false;
                }

                // Genre Filter
                if (selectedGenres.length > 0) {
                    const dreamGenres =
                        dream.analysis.genres || [];
                    // Check if dream has ANY of the selected genres
                    const hasSelectedGenre =
                        dreamGenres.some((genre) =>
                            selectedGenres.includes(genre)
                        );
                    if (!hasSelectedGenre) return false;
                }

                // Tone Filter
                if (selectedTones.length > 0) {
                    const dreamTones =
                        dream.analysis.tones || [];
                    // Check if dream has ANY of the selected tones
                    const hasSelectedTone = dreamTones.some(
                        (tone) =>
                            selectedTones.includes(tone)
                    );
                    if (!hasSelectedTone) return false;
                }

                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'newest':
                        return (
                            new Date(
                                b.createdAt
                            ).getTime() -
                            new Date(a.createdAt).getTime()
                        );
                    case 'oldest':
                        return (
                            new Date(
                                a.createdAt
                            ).getTime() -
                            new Date(b.createdAt).getTime()
                        );
                    // TODO: Implement popularity metric
                    default:
                        return 0;
                }
            });
    }, [
        dreams,
        searchQuery,
        selectedGenres,
        selectedTones,
        sortBy,
    ]);

    // Unique values for filters
    const allGenres = useMemo(() => {
        const genres = new Set<string>();
        dreams.forEach((d) => {
            (d.analysis.genres || []).forEach((g) =>
                genres.add(g)
            );
        });
        return Array.from(genres).sort();
    }, [dreams]);

    const allTones = useMemo(() => {
        const tones = new Set<string>();
        dreams.forEach((d) => {
            (d.analysis.tones || []).forEach((t) =>
                tones.add(t)
            );
        });
        return Array.from(tones).sort();
    }, [dreams]);

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
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-wider text-white mix-blend-difference hover:opacity-80 transition-opacity"
                    >
                        IDI{' '}
                        <span className="text-base opacity-50 font-normal ml-1">
                            BETA
                        </span>
                    </Link>

                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex gap-8 text-base font-bold tracking-wide">
                            {[
                                {
                                    href: '/record',
                                    label: 'RECORD',
                                },
                                {
                                    href: '/market',
                                    label: 'MARKET',
                                },
                                {
                                    href: '/stats',
                                    label: 'STATS',
                                },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`transition-colors uppercase text-base tracking-widest ${
                                        item.href ===
                                        '/market'
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
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-80 flex-shrink-0 space-y-8">
                        <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-black/40 backdrop-blur-xl sticky top-32">
                            <div className="mb-8">
                                <h3 className="text-base font-bold text-white/90 uppercase tracking-widest mb-4">
                                    Search
                                </h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Search dreams..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    <svg
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-base font-bold text-white/90 uppercase tracking-widest mb-4">
                                    Genres
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {allGenres.map(
                                        (genre) => (
                                            <label
                                                key={genre}
                                                className="flex items-center gap-3 group cursor-pointer"
                                            >
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedGenres.includes(
                                                            genre
                                                        )}
                                                        onChange={(
                                                            e
                                                        ) => {
                                                            if (
                                                                e
                                                                    .target
                                                                    .checked
                                                            ) {
                                                                setSelectedGenres(
                                                                    [
                                                                        ...selectedGenres,
                                                                        genre,
                                                                    ]
                                                                );
                                                            } else {
                                                                setSelectedGenres(
                                                                    selectedGenres.filter(
                                                                        (
                                                                            g
                                                                        ) =>
                                                                            g !==
                                                                            genre
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/20 bg-white/5 transition-all checked:border-primary checked:bg-primary hover:border-primary/50"
                                                    />
                                                    <svg
                                                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={
                                                                3
                                                            }
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                                <span className="text-white/80 group-hover:text-white transition-colors text-base">
                                                    {genre}
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-white/90 uppercase tracking-widest mb-4">
                                    Tones
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {allTones.map(
                                        (tone) => (
                                            <label
                                                key={tone}
                                                className="flex items-center gap-3 group cursor-pointer"
                                            >
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTones.includes(
                                                            tone
                                                        )}
                                                        onChange={(
                                                            e
                                                        ) => {
                                                            if (
                                                                e
                                                                    .target
                                                                    .checked
                                                            ) {
                                                                setSelectedTones(
                                                                    [
                                                                        ...selectedTones,
                                                                        tone,
                                                                    ]
                                                                );
                                                            } else {
                                                                setSelectedTones(
                                                                    selectedTones.filter(
                                                                        (
                                                                            t
                                                                        ) =>
                                                                            t !==
                                                                            tone
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/20 bg-white/5 transition-all checked:border-primary checked:bg-primary hover:border-primary/50"
                                                    />
                                                    <svg
                                                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={
                                                                3
                                                            }
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                                <span className="text-white/80 group-hover:text-white transition-colors text-base">
                                                    {tone}
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">
                                {filteredDreams.length}{' '}
                                <span className="text-white/90 text-xl font-normal">
                                    Results Found
                                </span>
                            </h2>

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(
                                        e.target
                                            .value as any
                                    )
                                }
                                className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-base text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
                            >
                                <option value="newest">
                                    Newest First
                                </option>
                                <option value="oldest">
                                    Oldest First
                                </option>
                                <option value="popular">
                                    Most Popular
                                </option>
                            </select>
                        </div>

                        {filteredDreams.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredDreams.map(
                                    (dream) => (
                                        <div
                                            key={dream.id}
                                            className="transform hover:-translate-y-2 transition-transform duration-300"
                                        >
                                            <DreamIPCard
                                                dream={
                                                    dream
                                                }
                                                onClick={() =>
                                                    setSelectedDream(
                                                        dream
                                                    )
                                                }
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="glass-panel rounded-2xl p-16 text-center border-dashed border-2 border-white/10 bg-black/20">
                                <div className="text-4xl mb-4 opacity-50">
                                    🔍
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    No Dreams Found
                                </h3>
                                <p className="text-white/90 text-lg">
                                    Try adjusting your
                                    filters or search query.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

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

export default function SearchPage() {
    return (
        <Suspense
            fallback={<LoadingPage message="Loading..." />}
        >
            <SearchPageContent />
        </Suspense>
    );
}
