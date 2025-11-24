/**
 * Dream IP 시스템의 핵심 타입 정의
 */

/**
 * 꿈의 장르 분류
 */
export type DreamGenre =
    | 'SF'
    | '판타지'
    | '호러'
    | '로맨스'
    | '초현실'
    | '액션'
    | '미스터리'
    | '드라마';

/**
 * AI 분석 모델 선택
 */
export type AnalysisModel = 'openai' | 'flock';

/**
 * 꿈의 톤/분위기
 */
export type DreamTone =
    | '몽환적'
    | '공포'
    | '따뜻함'
    | '웅장함'
    | '슬픔'
    | '경쾌함'
    | '긴장감';

/**
 * 원본 꿈 데이터 (사용자가 입력한 그대로)
 */
export interface DreamRecord {
    id: string;
    userId: string;
    dreamText: string;
    recordedAt: string; // ISO 8601 date string
    voiceRecordingUrl?: string;
}

/**
 * AI가 생성한 꿈 분석 결과 (다국어 지원)
 */
export interface DreamAnalysis {
    title: string; // 한국어 제목 (기본)
    title_en?: string; // 영어 제목
    summary: string; // 한국어 요약 (기본)
    summary_en?: string; // 영어 요약
    characters: string[]; // 한국어 캐릭터 (기본)
    characters_en?: string[]; // 영어 캐릭터
    world: string; // 한국어 세계관 (기본)
    world_en?: string; // 영어 세계관
    objects: string[];
    locations: string[];
    tones: string[]; // 한국어 톤 (AI가 자유롭게 생성)
    tones_en?: string[]; // 영어 톤 (AI가 자유롭게 생성)
    genres: string[]; // 한국어 장르 (AI가 자유롭게 생성)
    genres_en?: string[]; // 영어 장르 (AI가 자유롭게 생성)
    emotions: string[];
}

/**
 * 생성된 비주얼 에셋
 */
export interface DreamVisual {
    id: string;
    type: 'key_visual' | 'character' | 'world' | 'object';
    imageUrl: string; // OpenAI 임시 URL (24시간 만료)
    ipfsUrl?: string; // IPFS Gateway URL (영구 저장)
    ipfsCid?: string; // IPFS CID (Content Identifier)
    prompt: string;
    title?: string; // 한국어 제목 (기본)
    title_en?: string; // 영어 제목
    description?: string; // 한국어 설명 (기본)
    description_en?: string; // 영어 설명
}

/**
 * 생성된 스토리 에셋 (다국어 지원)
 */
export interface DreamStory {
    synopsis: string; // 한국어 시놉시스 (기본)
    synopsis_en?: string; // 영어 시놉시스
    sceneBits: string[]; // 한국어 장면 비트 (기본)
    sceneBits_en?: string[]; // 영어 장면 비트
    lore: string; // 한국어 세계관 설정 (기본)
    lore_en?: string; // 영어 세계관 설정
}

/**
 * 완성된 Dream IP 패키지
 */
export interface DreamIPPackage {
    id: string;
    dreamRecord: DreamRecord;
    analysis: DreamAnalysis;
    visuals: DreamVisual[];
    story: DreamStory;
    dreamHash: string; // SHA256 hash of dream text for proof of originality
    createdAt: string;
    updatedAt: string;
    isPublic: boolean;
    status: 'draft' | 'processing' | 'completed' | 'failed';
    progress?: {
        currentStep: number;
        totalSteps: number;
        stepKey: string; // 'analyzing', 'generatingStory', etc.
    };
}

/**
 * Dream IP 메타데이터 (IPFS 저장용)
 */
export interface DreamIPMetadata {
    version: '1.0';
    dreamHash: string;
    title: string;
    summary: string;
    genres: DreamGenre[];
    tones: DreamTone[];
    characters: string[];
    world: string;
    visualsUrls: string[];
    storyContentUrl: string;
    createdAt: string;
}

/**
 * Dream IP 리스트 아이템 (갤러리/검색용)
 */
export interface DreamIPListItem {
    id: string;
    title: string;
    summary: string;
    keyVisualUrl?: string;
    genres: DreamGenre[];
    tones: DreamTone[];
    createdAt: string;
}
