/**
 * 한국어 번역
 */

import type { Translation } from '../types';

export const ko: Translation = {
    nav: {
        home: '홈',
        record: '기록하기',
        gallery: '갤러리',
        search: '검색',
        stats: '통계',
    },

    home: {
        hero: {
            title: '당신의 꿈을 IP 자산으로',
            subtitle: 'IP Dream Incubator',
            description:
                'AI가 당신의 꿈을 분석하고, 스토리와 비주얼을 자동 생성합니다. 꿈이 곧 창작물이 되는 세상을 경험하세요.',
            recordButton: '꿈 기록하기',
            galleryButton: '갤러리 둘러보기',
            searchLink: '🔍 검색',
            statsLink: '📊 통계',
        },
        features: {
            title: '주요 기능',
            record: {
                title: '꿈 기록',
                description: '자유롭게 꿈을 기록하세요',
            },
            analyze: {
                title: 'AI 분석',
                description:
                    '자동으로 꿈을 분석하고 구조화합니다',
            },
            visualize: {
                title: '비주얼 생성',
                description:
                    'AI가 꿈의 장면을 이미지로 생성합니다',
            },
            store: {
                title: 'IP 저장',
                description: 'IPFS에 영구 보관되는 IP 자산',
            },
        },
        recentDreams: {
            title: '최근 Dream IP',
            empty: '아직 생성된 Dream IP가 없습니다',
            viewAll: '모두 보기',
        },
    },

    record: {
        title: '꿈 기록하기',
        subtitle:
            'AI가 당신의 꿈을 멋진 IP로 만들어드립니다',
        placeholder:
            '꿈의 내용을 자세히 적어주세요...\n\n예시:\n어젯밤 꿈에서 나는 거대한 사막을 걷고 있었다. 별빛이 쏟아지는 하늘 아래, 갑자기 모래언덕 너머로 고래 한 마리가 나타났다. 그 고래는 하늘을 날았고, 별을 먹으며 빛을 냈다...',
        minLength: '최소 50자 이상 입력해주세요',
        submitButton: '꿈 분석하기',
        submitting: 'AI가 꿈을 분석 중입니다...',
        success: '꿈 분석이 완료되었습니다!',
        error: '처리 중 오류가 발생했습니다',
        progress: {
            starting: '시작 중...',
            analyzing: '꿈 분석 중...',
            generatingStory: '스토리 생성 중...',
            generatingKeyVisual: 'Key Visual 생성 중...',
            generatingCharacter: '캐릭터 이미지 생성 중...',
            generatingWorld: '세계관 이미지 생성 중...',
            uploadingIPFS: 'IPFS 업로드 중...',
            completed: '완료!',
        },
    },

    gallery: {
        title: 'Dream IP 갤러리',
        subtitle: '생성된 Dream IP 패키지를 둘러보세요',
        loading: '로딩 중...',
        empty: '아직 생성된 Dream IP가 없습니다',
        recordFirst: '첫 번째 꿈을 기록해보세요',
    },

    search: {
        title: 'Dream IP 검색',
        subtitle: '원하는 Dream IP를 찾아보세요',
        filters: {
            title: '필터',
            reset: '초기화',
            keyword: '키워드 검색',
            keywordPlaceholder: '제목, 요약, 캐릭터...',
            genre: '장르',
            tone: '분위기',
            sort: '정렬',
            sortRecent: '최신순',
            sortTitle: '제목순',
        },
        results: {
            found: '',
            items: '개의 Dream IP 발견',
            empty: '검색 결과가 없습니다',
            resetFilters: '필터 초기화',
        },
    },

    stats: {
        title: 'Dream IP 통계',
        subtitle:
            '생성된 Dream IP의 통계와 인사이트를 확인하세요',
        cards: {
            total: '전체 Dream IP',
            totalLabel: '전체 꿈',
            minted: '민팅된 IP',
            mintedLabel: 'IP 민팅',
            processing: '처리 중',
            processingLabel: '처리 중',
            successRate: '성공률',
            successRateLabel: '성공률',
            completed: '완료됨',
            public: '공개',
            recent7days: '최근 7일',
        },
        charts: {
            genres: '꿈 장르',
            tones: '감정 분위기',
        },
        topGenres: '인기 장르 Top 5',
        topTones: '인기 분위기 Top 5',
        successRate: 'Dream IP 생성 성공률',
        cta: {
            title: '기여할 준비가 되셨나요?',
            description:
                '당신의 꿈이 집단 무의식 데이터베이스를 확장하는 데 도움이 됩니다. 오늘 꿈 IP를 민팅하고 네트워크에 참여하세요.',
            button: '기록 시작하기',
        },
    },

    detail: {
        buttons: {
            share: '🔗 공유',
            export: '💾 내보내기',
            public: '공개',
            private: '비공개',
            delete: '삭제',
        },
        tabs: {
            overview: '개요',
            story: '스토리',
            visuals: '비주얼',
        },
        overview: {
            title: '제목',
            summary: '요약',
            genres: '장르',
            tones: '분위기',
            characters: '등장인물',
            world: '세계관',
            createdAt: '생성일',
        },
        story: {
            synopsis: '시놉시스',
            sceneBits: '주요 장면',
            lore: '세계관 설정',
        },
        visuals: {
            title: '비주얼 에셋',
            ipfsStored: 'IPFS 영구 저장',
            temporary: '임시 URL (24시간)',
        },
        alerts: {
            linkCopied: '링크가 복사되었습니다!',
            deleteConfirm: '정말 삭제하시겠습니까?',
        },
    },

    genres: {
        SF: 'SF',
        판타지: '판타지',
        호러: '호러',
        로맨스: '로맨스',
        초현실: '초현실',
        액션: '액션',
        미스터리: '미스터리',
        드라마: '드라마',
    },

    tones: {
        몽환적: '몽환적',
        공포: '공포',
        따뜻함: '따뜻함',
        웅장함: '웅장함',
        슬픔: '슬픔',
        경쾌함: '경쾌함',
        긴장감: '긴장감',
    },

    common: {
        loading: '로딩 중...',
        error: '오류가 발생했습니다',
        close: '닫기',
        cancel: '취소',
        confirm: '확인',
        save: '저장',
        edit: '수정',
        delete: '삭제',
        viewMore: '더 보기',
        viewLess: '접기',
    },
};
