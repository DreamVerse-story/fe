/**
 * English translations
 */

import type { Translation } from '../types';

export const en: Translation = {
    nav: {
        home: 'Home',
        record: 'Record',
        gallery: 'Gallery',
        search: 'Search',
        stats: 'Stats',
    },

    home: {
        hero: {
            title: 'Turn Your Dreams Into IP Assets',
            subtitle: 'IP Dream Incubator',
            description:
                'AI analyzes your dreams and automatically generates stories and visuals. Experience a world where dreams become creative works.',
            recordButton: 'Record a Dream',
            galleryButton: 'Explore Gallery',
            searchLink: '🔍 Search',
            statsLink: '📊 Stats',
        },
        features: {
            title: 'Key Features',
            record: {
                title: 'Dream Recording',
                description: 'Freely record your dreams',
            },
            analyze: {
                title: 'AI Analysis',
                description:
                    'Automatically analyze and structure dreams',
            },
            visualize: {
                title: 'Visual Generation',
                description:
                    'AI generates images from your dream scenes',
            },
            store: {
                title: 'IP Storage',
                description:
                    'IP assets permanently stored on IPFS',
            },
        },
        recentDreams: {
            title: 'Recent Dream IPs',
            empty: 'No Dream IPs created yet',
            viewAll: 'View All',
        },
    },

    record: {
        title: 'Record Your Dream',
        subtitle:
            'AI will turn your dream into an amazing IP',
        placeholder:
            'Describe your dream in detail...\n\nExample:\nLast night I was walking through a vast desert. Under a sky full of falling stars, a whale suddenly appeared from beyond the sand dunes. The whale flew through the sky, eating stars and glowing...',
        minLength: 'Please enter at least 50 characters',
        submitButton: 'Analyze Dream',
        submitting: 'AI is analyzing your dream...',
        success: 'Dream analysis completed!',
        error: 'An error occurred during processing',
        progress: {
            starting: 'Starting...',
            analyzing: 'Analyzing dream...',
            generatingStory: 'Generating story...',
            generatingKeyVisual: 'Generating Key Visual...',
            generatingCharacter:
                'Generating character image...',
            generatingWorld: 'Generating world image...',
            uploadingIPFS: 'Uploading to IPFS...',
            completed: 'Completed!',
        },
    },

    gallery: {
        title: 'Dream IP Gallery',
        subtitle: 'Explore generated Dream IP packages',
        loading: 'Loading...',
        empty: 'No Dream IPs created yet',
        recordFirst: 'Record your first dream',
    },

    search: {
        title: 'Search Dream IPs',
        subtitle: 'Find the Dream IP you want',
        filters: {
            title: 'Filters',
            reset: 'Reset',
            keyword: 'Keyword Search',
            keywordPlaceholder:
                'Title, summary, characters...',
            genre: 'Genre',
            tone: 'Tone',
            sort: 'Sort',
            sortRecent: 'Most Recent',
            sortTitle: 'By Title',
        },
        results: {
            found: '',
            items: ' Dream IPs found',
            empty: 'No results found',
            resetFilters: 'Reset Filters',
        },
    },

    stats: {
        title: 'Dream IP Statistics',
        subtitle:
            'View statistics and insights of generated Dream IPs',
        cards: {
            total: 'Total Dream IPs',
            completed: 'Completed IPs',
            public: 'Public IPs',
            recent7days: 'Last 7 Days',
        },
        topGenres: 'Top 5 Genres',
        topTones: 'Top 5 Tones',
        successRate: 'Dream IP Generation Success Rate',
        cta: {
            title: 'Create More Dream IPs!',
            description:
                'AI will turn your dreams into amazing IPs',
            button: 'Record New Dream',
        },
    },

    detail: {
        buttons: {
            share: '🔗 Share',
            export: '💾 Export',
            public: 'Public',
            private: 'Private',
            delete: 'Delete',
        },
        tabs: {
            overview: 'Overview',
            story: 'Story',
            visuals: 'Visuals',
        },
        overview: {
            title: 'Title',
            summary: 'Summary',
            genres: 'Genres',
            tones: 'Tones',
            characters: 'Characters',
            world: 'World',
            createdAt: 'Created At',
        },
        story: {
            synopsis: 'Synopsis',
            sceneBits: 'Key Scenes',
            lore: 'World Settings',
        },
        visuals: {
            title: 'Visual Assets',
            ipfsStored: 'IPFS Permanent Storage',
            temporary: 'Temporary URL (24 hours)',
        },
        alerts: {
            linkCopied: 'Link copied!',
            deleteConfirm:
                'Are you sure you want to delete?',
        },
    },

    genres: {
        SF: 'Sci-Fi',
        판타지: 'Fantasy',
        호러: 'Horror',
        로맨스: 'Romance',
        초현실: 'Surreal',
        액션: 'Action',
        미스터리: 'Mystery',
        드라마: 'Drama',
    },

    tones: {
        몽환적: 'Dreamy',
        공포: 'Horror',
        따뜻함: 'Warm',
        웅장함: 'Epic',
        슬픔: 'Sad',
        경쾌함: 'Cheerful',
        긴장감: 'Tense',
    },

    common: {
        loading: 'Loading...',
        error: 'An error occurred',
        close: 'Close',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        viewMore: 'View More',
        viewLess: 'View Less',
    },
};
