/**
 * Dream IP 탐색 페이지 (Explore/Market)
 * 민팅된 Dream IP를 검색하고 필터링
 */

'use client';
export const dynamic = 'force-dynamic';

import {
    useState,
    useEffect,
    useMemo,
    Suspense,
} from 'react';
import { useAtom } from 'jotai';
import { useAccount } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import {
    DreamIPCard,
    LoadingSpinner,
} from '@/_components/common';
import { PageContainer } from '@/_components/layout';
import { Input, Card, Button } from '@/_components/ui';
import { useTranslation } from '@/lib/i18n/context';
import {
    dreamsAtom,
    searchQueryAtom,
    selectedGenresAtom,
    selectedTonesAtom,
    sortByAtom,
} from '@/store';
import type { DreamIPPackage } from '@/lib/types';

function SearchPageContent() {
    const { t, locale } = useTranslation();
    const { address } = useAccount();
    const searchParams = useSearchParams();

    // State from Jotai
    const [dreams, setDreams] = useAtom(dreamsAtom);
    const [searchQuery, setSearchQuery] =
        useAtom(searchQueryAtom);
    const [selectedGenres, setSelectedGenres] = useAtom(
        selectedGenresAtom
    );
    const [selectedTones, setSelectedTones] = useAtom(
        selectedTonesAtom
    );
    const [sortBy, setSortBy] = useAtom(sortByAtom);

    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

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
                            d.status === 'completed' &&
                            (d as any).ipAssetId
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

                // Genre Filter (compare using original Korean values)
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

                // Tone Filter (compare using original Korean values)
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
        locale,
    ]);

    // Unique values for filters (using original Korean values as keys, but display in current locale)
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

    // Helper functions to get display text for genre/tone based on locale
    const getGenreDisplayText = (
        originalGenre: string
    ): string => {
        if (locale === 'en') {
            // Find a dream with this genre to get English version
            const dreamWithGenre = dreams.find((d) =>
                (d.analysis.genres || []).includes(
                    originalGenre
                )
            );
            if (dreamWithGenre) {
                const index =
                    dreamWithGenre.analysis.genres?.indexOf(
                        originalGenre
                    );
                if (
                    index !== undefined &&
                    index >= 0 &&
                    dreamWithGenre.analysis.genres_en
                ) {
                    return (
                        dreamWithGenre.analysis.genres_en[
                            index
                        ] || originalGenre
                    );
                }
            }
        }
        return originalGenre;
    };

    const getToneDisplayText = (
        originalTone: string
    ): string => {
        if (locale === 'en') {
            // Find a dream with this tone to get English version
            const dreamWithTone = dreams.find((d) =>
                (d.analysis.tones || []).includes(
                    originalTone
                )
            );
            if (dreamWithTone) {
                const index =
                    dreamWithTone.analysis.tones?.indexOf(
                        originalTone
                    );
                if (
                    index !== undefined &&
                    index >= 0 &&
                    dreamWithTone.analysis.tones_en
                ) {
                    return (
                        dreamWithTone.analysis.tones_en[
                            index
                        ] || originalTone
                    );
                }
            }
        }
        return originalTone;
    };

    // 활성 필터 개수
    const activeFiltersCount =
        selectedGenres.length + selectedTones.length;

    // 필터 초기화
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedGenres([]);
        setSelectedTones([]);
    };

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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                        {locale === 'ko'
                            ? 'Dream IP 탐색'
                            : 'Explore Dream IPs'}
                    </h1>
                    <p className="text-white/60 text-lg">
                        {locale === 'ko'
                            ? `${dreams.length}개의 민팅된 Dream IP를 둘러보세요`
                            : `Browse ${dreams.length} minted Dream IPs`}
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Input
                            variant="search"
                            type="text"
                            value={searchQuery}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setSearchQuery(
                                    e.target.value
                                )
                            }
                            placeholder={
                                t.search.filters
                                    .keywordPlaceholder
                            }
                            className="pl-12"
                            icon={
                                <svg
                                    className="w-5 h-5 text-white/40"
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
                            }
                        />
                    </div>

                    {/* Filter Toggle & Sort */}
                    <div className="flex gap-3">
                        <Button
                            variant={
                                showFilters
                                    ? 'primary'
                                    : 'ghost'
                            }
                            onClick={() =>
                                setShowFilters(!showFilters)
                            }
                            className="relative"
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
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                            <span className="hidden sm:inline">
                                {locale === 'ko'
                                    ? '필터'
                                    : 'Filters'}
                            </span>
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-xs font-bold rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>

                        <select
                            value={sortBy}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) =>
                                setSortBy(
                                    e.target.value as
                                        | 'newest'
                                        | 'oldest'
                                        | 'popular'
                                )
                            }
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 min-w-[140px]"
                        >
                            <option value="newest">
                                {
                                    t.search.filters
                                        .sortRecent
                                }
                            </option>
                            <option value="oldest">
                                {locale === 'ko'
                                    ? '오래된순'
                                    : 'Oldest'}
                            </option>
                            <option value="popular">
                                {locale === 'ko'
                                    ? '인기순'
                                    : 'Popular'}
                            </option>
                        </select>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <Card
                        variant="glass"
                        padding="md"
                        className="mb-8 animate-slide-in-up"
                    >
                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Genres */}
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                                    {t.search.filters.genre}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {allGenres.map(
                                        (genre) => (
                                            <button
                                                key={genre}
                                                onClick={() => {
                                                    if (
                                                        selectedGenres.includes(
                                                            genre
                                                        )
                                                    ) {
                                                        setSelectedGenres(
                                                            selectedGenres.filter(
                                                                (
                                                                    g
                                                                ) =>
                                                                    g !==
                                                                    genre
                                                            )
                                                        );
                                                    } else {
                                                        setSelectedGenres(
                                                            [
                                                                ...selectedGenres,
                                                                genre,
                                                            ]
                                                        );
                                                    }
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                    selectedGenres.includes(
                                                        genre
                                                    )
                                                        ? 'bg-primary text-black'
                                                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                {getGenreDisplayText(
                                                    genre
                                                )}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Tones */}
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                                    {t.search.filters.tone}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {allTones.map(
                                        (tone) => (
                                            <button
                                                key={tone}
                                                onClick={() => {
                                                    if (
                                                        selectedTones.includes(
                                                            tone
                                                        )
                                                    ) {
                                                        setSelectedTones(
                                                            selectedTones.filter(
                                                                (
                                                                    t
                                                                ) =>
                                                                    t !==
                                                                    tone
                                                            )
                                                        );
                                                    } else {
                                                        setSelectedTones(
                                                            [
                                                                ...selectedTones,
                                                                tone,
                                                            ]
                                                        );
                                                    }
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                    selectedTones.includes(
                                                        tone
                                                    )
                                                        ? 'bg-secondary text-white'
                                                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                {getToneDisplayText(
                                                    tone
                                                )}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {activeFiltersCount > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-white/60 hover:text-white transition-colors"
                                >
                                    {locale === 'ko'
                                        ? '필터 초기화'
                                        : 'Clear all filters'}
                                </button>
                            </div>
                        )}
                    </Card>
                )}

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-white/60">
                        <span className="text-white font-semibold">
                            {filteredDreams.length}
                        </span>{' '}
                        {t.search.results.items}
                    </p>
                </div>

                {/* Results Grid */}
                {filteredDreams.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDreams.map((dream) => {
                            const isOwner = !!(
                                address &&
                                dream.creatorAddress &&
                                dream.creatorAddress.toLowerCase() ===
                                    address.toLowerCase()
                            );
                            return (
                                <DreamIPCard
                                    key={dream.id}
                                    dream={dream}
                                    isOwner={isOwner}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <Card
                        variant="glass"
                        padding="lg"
                        className="text-center py-16"
                    >
                        <div className="text-5xl mb-6 opacity-30">
                            🔍
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                            {t.search.results.empty}
                        </h3>
                        <p className="text-white/60 mb-6">
                            {locale === 'ko'
                                ? '검색 조건에 맞는 Dream IP가 없습니다.'
                                : 'No Dream IPs match your search criteria.'}
                        </p>
                        {activeFiltersCount > 0 && (
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                            >
                                {locale === 'ko'
                                    ? '필터 초기화'
                                    : 'Clear Filters'}
                            </Button>
                        )}
                    </Card>
                )}
            </div>
        </PageContainer>
    );
}

export default function ExplorePage() {
    return (
        <Suspense
            fallback={
                <PageContainer
                    showBackground={true}
                    backgroundType="default"
                >
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <LoadingSpinner size="lg" />
                    </div>
                </PageContainer>
            }
        >
            <SearchPageContent />
        </Suspense>
    );
}
