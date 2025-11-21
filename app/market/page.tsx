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
import { useAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import {
    DreamIPCard,
    LoadingPage,
} from '@/_components/common';
import { PageContainer } from '@/_components/layout';
import {
    Input,
    Checkbox,
    Select,
    Badge,
    Card,
} from '@/_components/ui';
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

    if (loading) {
        return <LoadingPage message={t.common.loading} />;
    }

    return (
        <PageContainer
            showBackground={true}
            backgroundType="default"
        >
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 xl:w-80 shrink-0 space-y-4 sm:space-y-6 md:space-y-8">
                    <Card
                        variant="glass"
                        padding="md"
                        className="sticky top-16 sm:top-20 md:top-24 lg:top-28 max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar"
                    >
                        <div className="mb-4 sm:mb-6 md:mb-8">
                            <h3 className="text-sm sm:text-base font-bold text-white/90 uppercase tracking-widest mb-3 sm:mb-4">
                                {t.search.filters.keyword}
                            </h3>
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
                                icon={
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
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="mb-4 sm:mb-6 md:mb-8">
                            <h3 className="text-sm sm:text-base font-bold text-white/90 uppercase tracking-widest mb-3 sm:mb-4">
                                {t.search.filters.genre}
                            </h3>
                            <div className="space-y-1.5 sm:space-y-2 max-h-40 sm:max-h-48 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                                {allGenres.map((genre) => (
                                    <Checkbox
                                        key={genre}
                                        checked={selectedGenres.includes(
                                            genre
                                        )}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            if (
                                                e.target
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
                                        label={getGenreDisplayText(
                                            genre
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-white/90 uppercase tracking-widest mb-3 sm:mb-4">
                                {t.search.filters.tone}
                            </h3>
                            <div className="space-y-1.5 sm:space-y-2 max-h-40 sm:max-h-48 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                                {allTones.map((tone) => (
                                    <Checkbox
                                        key={tone}
                                        checked={selectedTones.includes(
                                            tone
                                        )}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            if (
                                                e.target
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
                                        label={getToneDisplayText(
                                            tone
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </Card>
                </aside>

                {/* Results Grid */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
                            {filteredDreams.length}{' '}
                            <span className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-normal">
                                {t.search.results.items}
                            </span>
                        </h2>

                        <Select
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
                            className="w-full sm:w-auto min-w-[160px]"
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
                                    : 'Oldest First'}
                            </option>
                            <option value="popular">
                                {locale === 'ko'
                                    ? '인기순'
                                    : 'Most Popular'}
                            </option>
                        </Select>
                    </div>

                    {filteredDreams.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                            {filteredDreams.map((dream) => (
                                <div
                                    key={dream.id}
                                    className="transform hover:-translate-y-2 transition-transform duration-300"
                                >
                                    <DreamIPCard
                                        dream={dream}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Card
                            variant="default"
                            padding="lg"
                            className="text-center border-dashed border-2 border-white/10 bg-black/20"
                        >
                            <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 opacity-50">
                                🔍
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
                                {t.search.results.empty}
                            </h3>
                            <p className="text-white/90 text-sm sm:text-base md:text-lg">
                                {locale === 'ko'
                                    ? '필터나 검색어를 조정해보세요.'
                                    : 'Try adjusting your filters or search query.'}
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </PageContainer>
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
