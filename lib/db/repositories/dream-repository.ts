/**
 * Dream Repository - MongoDB CRUD 작업
 */

import type { DreamIPPackage } from '../../types';
import { getDatabase, COLLECTIONS } from '../mongodb';
import type { DreamDocument } from '../models';
import {
    dreamDocumentToPackage,
    dreamPackageToDocument,
} from '../models';

/**
 * Dream 컬렉션 가져오기
 */
async function getDreamsCollection() {
    const db = await getDatabase();
    return db.collection<DreamDocument>(COLLECTIONS.DREAMS);
}

/**
 * 모든 Dream IP 패키지 조회
 * 목록 조회용: visuals.imageUrl 제외 (base64 데이터로 인한 성능 이슈 방지)
 */
export async function getAllDreams(): Promise<
    DreamIPPackage[]
> {
    const collection = await getDreamsCollection();
    const documents = await collection
        .find(
            {},
            {
                projection: {
                    'visuals.imageUrl': 0, // imageUrl 필드 제외
                },
            }
        )
        .sort({ createdAt: -1 })
        .toArray();

    // JavaScript에서도 imageUrl 제거 (이중 안전장치)
    // MongoDB projection이 배열 내부 필드 제외에 제한적이므로 JavaScript에서도 처리
    const dreams = documents.map(dreamDocumentToPackage);
    return dreams.map((dream) => ({
        ...dream,
        visuals: dream.visuals.map(
            ({ imageUrl: _, ...visual }) => ({
                ...visual,
                imageUrl: '', // 타입 호환성을 위해 빈 문자열 설정 (실제 응답에서는 제외됨)
            })
        ),
    })) as DreamIPPackage[];
}

/**
 * 특정 Dream IP 패키지 조회 (ID)
 */
export async function getDreamById(
    id: string
): Promise<DreamIPPackage | null> {
    const collection = await getDreamsCollection();
    const document = await collection.findOne({ id });
    return document
        ? dreamDocumentToPackage(document)
        : null;
}

/**
 * 사용자별 Dream IP 조회
 * 목록 조회용: visuals.imageUrl 제외 (base64 데이터로 인한 성능 이슈 방지)
 */
export async function getDreamsByUserId(
    userId: string
): Promise<DreamIPPackage[]> {
    const collection = await getDreamsCollection();
    const documents = await collection
        .find(
            { userId },
            {
                projection: {
                    'visuals.imageUrl': 0, // imageUrl 필드 제외
                },
            }
        )
        .sort({ createdAt: -1 })
        .toArray();

    // JavaScript에서도 imageUrl 제거 (이중 안전장치)
    // MongoDB projection이 배열 내부 필드 제외에 제한적이므로 JavaScript에서도 처리
    const dreams = documents.map(dreamDocumentToPackage);
    return dreams.map((dream) => ({
        ...dream,
        visuals: dream.visuals.map(
            ({ imageUrl: _, ...visual }) => ({
                ...visual,
                imageUrl: '', // 타입 호환성을 위해 빈 문자열 설정 (실제 응답에서는 제외됨)
            })
        ),
    })) as DreamIPPackage[];
}

/**
 * Dream IP 패키지 저장 (생성 또는 업데이트)
 */
export async function saveDream(
    dream: DreamIPPackage
): Promise<void> {
    const collection = await getDreamsCollection();
    const document = dreamPackageToDocument(dream);

    await collection.updateOne(
        { id: dream.id },
        {
            $set: {
                ...document,
                updatedAt: new Date(),
            },
        },
        { upsert: true }
    );
}

/**
 * Dream IP 패키지 삭제
 */
export async function deleteDream(
    id: string
): Promise<void> {
    const collection = await getDreamsCollection();
    await collection.deleteOne({ id });
}

/**
 * 공개된 Dream IP만 조회
 * 목록 조회용: visuals.imageUrl 제외 (base64 데이터로 인한 성능 이슈 방지)
 */
export async function getPublicDreams(): Promise<
    DreamIPPackage[]
> {
    const collection = await getDreamsCollection();
    const documents = await collection
        .find(
            {
                isPublic: true,
                status: 'completed',
            },
            {
                projection: {
                    'visuals.imageUrl': 0, // imageUrl 필드 제외
                },
            }
        )
        .sort({ createdAt: -1 })
        .toArray();

    // JavaScript에서도 imageUrl 제거 (이중 안전장치)
    // MongoDB projection이 배열 내부 필드 제외에 제한적이므로 JavaScript에서도 처리
    const dreams = documents.map(dreamDocumentToPackage);
    return dreams.map((dream) => ({
        ...dream,
        visuals: dream.visuals.map(
            ({ imageUrl: _, ...visual }) => ({
                ...visual,
                imageUrl: '', // 타입 호환성을 위해 빈 문자열 설정 (실제 응답에서는 제외됨)
            })
        ),
    })) as DreamIPPackage[];
}

/**
 * 장르별 Dream IP 검색
 * 목록 조회용: visuals.imageUrl 제외 (base64 데이터로 인한 성능 이슈 방지)
 */
export async function getDreamsByGenres(
    genres: string[]
): Promise<DreamIPPackage[]> {
    const collection = await getDreamsCollection();
    const documents = await collection
        .find(
            {
                genres: { $in: genres },
                isPublic: true,
                status: 'completed',
            },
            {
                projection: {
                    'visuals.imageUrl': 0, // imageUrl 필드 제외
                },
            }
        )
        .sort({ createdAt: -1 })
        .toArray();

    // JavaScript에서도 imageUrl 제거 (이중 안전장치)
    // MongoDB projection이 배열 내부 필드 제외에 제한적이므로 JavaScript에서도 처리
    const dreams = documents.map(dreamDocumentToPackage);
    return dreams.map((dream) => ({
        ...dream,
        visuals: dream.visuals.map(
            ({ imageUrl: _, ...visual }) => ({
                ...visual,
                imageUrl: '', // 타입 호환성을 위해 빈 문자열 설정 (실제 응답에서는 제외됨)
            })
        ),
    })) as DreamIPPackage[];
}

/**
 * 톤별 Dream IP 검색
 * 목록 조회용: visuals.imageUrl 제외 (base64 데이터로 인한 성능 이슈 방지)
 */
export async function getDreamsByTones(
    tones: string[]
): Promise<DreamIPPackage[]> {
    const collection = await getDreamsCollection();
    const documents = await collection
        .find(
            {
                tones: { $in: tones },
                isPublic: true,
                status: 'completed',
            },
            {
                projection: {
                    'visuals.imageUrl': 0, // imageUrl 필드 제외
                },
            }
        )
        .sort({ createdAt: -1 })
        .toArray();

    // JavaScript에서도 imageUrl 제거 (이중 안전장치)
    // MongoDB projection이 배열 내부 필드 제외에 제한적이므로 JavaScript에서도 처리
    const dreams = documents.map(dreamDocumentToPackage);
    return dreams.map((dream) => ({
        ...dream,
        visuals: dream.visuals.map(
            ({ imageUrl: _, ...visual }) => ({
                ...visual,
                imageUrl: '', // 타입 호환성을 위해 빈 문자열 설정 (실제 응답에서는 제외됨)
            })
        ),
    })) as DreamIPPackage[];
}

/**
 * 텍스트 검색 (제목, 요약)
 * 목록 조회용: visuals.imageUrl 제외 (base64 데이터로 인한 성능 이슈 방지)
 */
export async function searchDreams(
    keyword: string
): Promise<DreamIPPackage[]> {
    const collection = await getDreamsCollection();
    const documents = await collection
        .find(
            {
                $or: [
                    {
                        'analysis.title': {
                            $regex: keyword,
                            $options: 'i',
                        },
                    },
                    {
                        'analysis.summary': {
                            $regex: keyword,
                            $options: 'i',
                        },
                    },
                ],
                isPublic: true,
                status: 'completed',
            },
            {
                projection: {
                    'visuals.imageUrl': 0, // imageUrl 필드 제외
                },
            }
        )
        .sort({ createdAt: -1 })
        .toArray();

    // JavaScript에서도 imageUrl 제거 (이중 안전장치)
    // MongoDB projection이 배열 내부 필드 제외에 제한적이므로 JavaScript에서도 처리
    const dreams = documents.map(dreamDocumentToPackage);
    return dreams.map((dream) => ({
        ...dream,
        visuals: dream.visuals.map(
            ({ imageUrl: _, ...visual }) => ({
                ...visual,
                imageUrl: '', // 타입 호환성을 위해 빈 문자열 설정 (실제 응답에서는 제외됨)
            })
        ),
    })) as DreamIPPackage[];
}

/**
 * 진행 상태별 조회
 * 목록 조회용: visuals.imageUrl 제외 (base64 데이터로 인한 성능 이슈 방지)
 */
export async function getDreamsByStatus(
    status: 'draft' | 'processing' | 'completed' | 'failed'
): Promise<DreamIPPackage[]> {
    const collection = await getDreamsCollection();
    const documents = await collection
        .find(
            { status },
            {
                projection: {
                    'visuals.imageUrl': 0, // imageUrl 필드 제외
                },
            }
        )
        .sort({ createdAt: -1 })
        .toArray();

    // JavaScript에서도 imageUrl 제거 (이중 안전장치)
    // MongoDB projection이 배열 내부 필드 제외에 제한적이므로 JavaScript에서도 처리
    const dreams = documents.map(dreamDocumentToPackage);
    return dreams.map((dream) => ({
        ...dream,
        visuals: dream.visuals.map(
            ({ imageUrl: _, ...visual }) => ({
                ...visual,
                imageUrl: '', // 타입 호환성을 위해 빈 문자열 설정 (실제 응답에서는 제외됨)
            })
        ),
    })) as DreamIPPackage[];
}

/**
 * Dream Hash로 중복 확인
 */
export async function getDreamByHash(
    dreamHash: string
): Promise<DreamIPPackage | null> {
    const collection = await getDreamsCollection();
    const document = await collection.findOne({
        dreamHash,
    });
    return document
        ? dreamDocumentToPackage(document)
        : null;
}
