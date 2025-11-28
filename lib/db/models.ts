/**
 * MongoDB 데이터 모델 타입 정의
 */

import type { ObjectId } from 'mongodb';
import type { DreamIPPackage } from '../types';

/**
 * MongoDB 문서 기본 인터페이스
 */
export interface MongoDocument {
    _id?: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User 문서 (MongoDB)
 */
export interface UserDocument extends MongoDocument {
    userId: string; // UUID
    walletAddress?: string; // 블록체인 지갑 주소
    email?: string;
    displayName?: string;
    preferences: {
        language: 'ko' | 'en';
        notifications: boolean;
    };
}

/**
 * Dream 문서 (MongoDB)
 * DreamIPPackage를 MongoDB에 저장하기 위한 확장
 */
export interface DreamDocument
    extends Omit<DreamIPPackage, 'createdAt' | 'updatedAt'>,
        MongoDocument {
    userId: string; // 인덱스용
    // 검색 최적화를 위한 중복 필드
    genres: string[];
    tones: string[];
    // IPFS 및 블록체인 관련
    ipfsCid?: string; // 전체 패키지의 IPFS CID
    ipAssetId?: string; // Story Protocol IP Asset ID
    // 분석 모델 정보
    analysisModel?: 'openai' | 'flock';
}

/**
 * MongoDB 문서를 API 응답용 타입으로 변환
 */
export function dreamDocumentToPackage(
    doc: DreamDocument
): DreamIPPackage {
    const { _id, ...rest } = doc;
    return {
        ...rest,
        createdAt:
            doc.createdAt?.toISOString() ||
            new Date().toISOString(),
        updatedAt:
            doc.updatedAt?.toISOString() ||
            new Date().toISOString(),
    };
}

/**
 * Projection된 문서를 DreamIPPackage로 변환 (목록 조회용)
 * 누락된 필드에 기본값 제공
 */
export function dreamDocumentToPackagePartial(
    doc: Partial<DreamDocument>
): DreamIPPackage {
    const { _id, ...rest } = doc;

    // Date 객체를 ISO 문자열로 변환
    const createdAt = doc.createdAt
        ? doc.createdAt instanceof Date
            ? doc.createdAt.toISOString()
            : typeof doc.createdAt === 'string'
            ? doc.createdAt
            : new Date().toISOString()
        : new Date().toISOString();

    const updatedAt = doc.updatedAt
        ? doc.updatedAt instanceof Date
            ? doc.updatedAt.toISOString()
            : typeof doc.updatedAt === 'string'
            ? doc.updatedAt
            : new Date().toISOString()
        : createdAt;

    // analysis 객체 병합 (projection으로 일부 필드만 있을 수 있음)
    const analysis = {
        title: '',
        summary: '',
        characters: [],
        world: '',
        objects: [],
        locations: [],
        tones: [],
        genres: [],
        emotions: [],
        ...doc.analysis,
    };

    return {
        ...rest,
        id: doc.id || '',
        createdAt,
        updatedAt,
        // 누락된 필수 필드에 기본값 제공
        dreamRecord: doc.dreamRecord || {
            id: doc.id || '',
            userId: doc.userId || '',
            dreamText: '',
            recordedAt: createdAt,
        },
        analysis,
        visuals: doc.visuals || [],
        story: doc.story || {
            synopsis: '',
            sceneBits: [],
            lore: '',
        },
        dreamHash: doc.dreamHash || '',
        isPublic: doc.isPublic ?? false,
        status: (doc.status || 'draft') as
            | 'draft'
            | 'processing'
            | 'completed'
            | 'failed',
    } as DreamIPPackage;
}

/**
 * API 타입을 MongoDB 문서로 변환
 * imageUrl은 저장하지 않음 (base64 데이터로 인한 성능 이슈 방지)
 */
export function dreamPackageToDocument(
    pkg: DreamIPPackage
): Omit<DreamDocument, '_id'> {
    // visuals 배열에서 imageUrl 제거 (타입 단언 사용)
    const visualsWithoutImageUrl = pkg.visuals.map(
        ({ imageUrl, ...visual }) => visual
    ) as any[]; // MongoDB 저장 시 imageUrl이 없는 상태로 저장

    return {
        ...pkg,
        visuals: visualsWithoutImageUrl, // imageUrl이 제거된 visuals
        userId: pkg.dreamRecord.userId,
        genres: pkg.analysis.genres || [],
        tones: pkg.analysis.tones || [],
        createdAt: new Date(pkg.createdAt),
        updatedAt: new Date(pkg.updatedAt),
    };
}
