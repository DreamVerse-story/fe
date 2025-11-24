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
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
    };
}

/**
 * API 타입을 MongoDB 문서로 변환
 */
export function dreamPackageToDocument(
    pkg: DreamIPPackage
): Omit<DreamDocument, '_id'> {
    return {
        ...pkg,
        userId: pkg.dreamRecord.userId,
        genres: pkg.analysis.genres || [],
        tones: pkg.analysis.tones || [],
        createdAt: new Date(pkg.createdAt),
        updatedAt: new Date(pkg.updatedAt),
    };
}
