/**
 * MongoDB 기반 데이터 저장소
 * file-storage.ts를 대체하는 MongoDB 구현
 */

import type { DreamIPPackage } from '../types';
import * as dreamRepo from '../db/repositories/dream-repository';

/**
 * 모든 Dream IP 패키지 읽기
 */
export async function getAllDreams(): Promise<
    DreamIPPackage[]
> {
    return dreamRepo.getAllDreams();
}

/**
 * 특정 Dream IP 패키지 조회
 */
export async function getDreamById(
    id: string
): Promise<DreamIPPackage | null> {
    return dreamRepo.getDreamById(id);
}

/**
 * Dream IP 패키지 저장
 */
export async function saveDream(
    dream: DreamIPPackage
): Promise<void> {
    return dreamRepo.saveDream(dream);
}

/**
 * Dream IP 패키지 삭제
 */
export async function deleteDream(
    id: string
): Promise<void> {
    return dreamRepo.deleteDream(id);
}

/**
 * 공개된 Dream IP만 필터링하여 조회
 */
export async function getPublicDreams(): Promise<
    DreamIPPackage[]
> {
    return dreamRepo.getPublicDreams();
}
