/**
 * 다국어 지원 타입 정의
 */

export type Locale = 'ko' | 'en';

export interface Translation {
    // Navigation
    nav: {
        home: string;
        record: string;
        gallery: string;
        search: string;
        stats: string;
    };

    // Home Page
    home: {
        hero: {
            title: string;
            subtitle: string;
            description: string;
            recordButton: string;
            galleryButton: string;
            searchLink: string;
            statsLink: string;
        };
        features: {
            title: string;
            record: {
                title: string;
                description: string;
            };
            analyze: {
                title: string;
                description: string;
            };
            visualize: {
                title: string;
                description: string;
            };
            store: {
                title: string;
                description: string;
            };
        };
        recentDreams: {
            title: string;
            empty: string;
            viewAll: string;
        };
    };

    // Record Page
    record: {
        title: string;
        subtitle: string;
        placeholder: string;
        minLength: string;
        submitButton: string;
        submitting: string;
        success: string;
        error: string;
        progress: {
            starting: string;
            analyzing: string;
            generatingStory: string;
            generatingKeyVisual: string;
            generatingCharacter: string;
            generatingWorld: string;
            uploadingIPFS: string;
            completed: string;
        };
    };

    // Gallery Page
    gallery: {
        title: string;
        subtitle: string;
        loading: string;
        empty: string;
        recordFirst: string;
    };

    // Search Page
    search: {
        title: string;
        subtitle: string;
        filters: {
            title: string;
            reset: string;
            keyword: string;
            keywordPlaceholder: string;
            genre: string;
            tone: string;
            sort: string;
            sortRecent: string;
            sortTitle: string;
        };
        results: {
            found: string;
            items: string;
            empty: string;
            resetFilters: string;
        };
    };

    // Stats Page
    stats: {
        title: string;
        subtitle: string;
        cards: {
            total: string;
            totalLabel: string;
            minted: string;
            mintedLabel: string;
            processing: string;
            processingLabel: string;
            successRate: string;
            successRateLabel: string;
            completed: string;
            public: string;
            recent7days: string;
        };
        charts: {
            genres: string;
            tones: string;
        };
        topGenres: string;
        topTones: string;
        successRate: string;
        cta: {
            title: string;
            description: string;
            button: string;
        };
    };

    // Dream IP Detail
    detail: {
        buttons: {
            share: string;
            export: string;
            public: string;
            private: string;
            delete: string;
        };
        tabs: {
            overview: string;
            story: string;
            visuals: string;
        };
        overview: {
            title: string;
            summary: string;
            genres: string;
            tones: string;
            characters: string;
            world: string;
            createdAt: string;
        };
        story: {
            synopsis: string;
            sceneBits: string;
            lore: string;
        };
        visuals: {
            title: string;
            ipfsStored: string;
            temporary: string;
        };
        alerts: {
            linkCopied: string;
            deleteConfirm: string;
        };
    };

    // Genres
    genres: {
        SF: string;
        판타지: string;
        호러: string;
        로맨스: string;
        초현실: string;
        액션: string;
        미스터리: string;
        드라마: string;
    };

    // Tones
    tones: {
        몽환적: string;
        공포: string;
        따뜻함: string;
        웅장함: string;
        슬픔: string;
        경쾌함: string;
        긴장감: string;
    };

    // Common
    common: {
        loading: string;
        error: string;
        close: string;
        cancel: string;
        confirm: string;
        save: string;
        edit: string;
        delete: string;
        viewMore: string;
        viewLess: string;
    };
}
