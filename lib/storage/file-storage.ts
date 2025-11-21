/**
 * 파일 기반 데이터 저장소 (Phase 1 MVP용)
 * 프로덕션에서는 실제 DB로 대체 필요
 */

import { promises as fs } from 'fs';
import path from 'path';
import type { DreamIPPackage } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DREAMS_FILE = path.join(DATA_DIR, 'dreams.json');

/**
 * 데이터 디렉토리 초기화
 */
async function ensureDataDir(): Promise<void> {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

/**
 * dreams.json 파일이 없으면 생성
 */
async function ensureDreamsFile(): Promise<void> {
    try {
        await fs.access(DREAMS_FILE);
    } catch {
        await fs.writeFile(
            DREAMS_FILE,
            JSON.stringify([], null, 2),
            'utf-8'
        );
    }
}

/**
 * 모든 Dream IP 패키지 읽기
 */
export async function getAllDreams(): Promise<
    DreamIPPackage[]
> {
    await ensureDataDir();
    await ensureDreamsFile();

    const content = await fs.readFile(DREAMS_FILE, 'utf-8');
    return JSON.parse(content) as DreamIPPackage[];
}

/**
 * 특정 Dream IP 패키지 조회
 */
export async function getDreamById(
    id: string
): Promise<DreamIPPackage | null> {
    const dreams = await getAllDreams();
    return dreams.find((dream) => dream.id === id) || null;
}

/**
 * Dream IP 패키지 저장
 */
export async function saveDream(
    dream: DreamIPPackage
): Promise<void> {
    const dreams = await getAllDreams();
    const existingIndex = dreams.findIndex(
        (d) => d.id === dream.id
    );

    if (existingIndex >= 0) {
        dreams[existingIndex] = dream;
    } else {
        dreams.push(dream);
    }

    await fs.writeFile(
        DREAMS_FILE,
        JSON.stringify(dreams, null, 2),
        'utf-8'
    );
}

/**
 * Dream IP 패키지 삭제
 */
export async function deleteDream(
    id: string
): Promise<void> {
    const dreams = await getAllDreams();
    const filtered = dreams.filter((d) => d.id !== id);
    await fs.writeFile(
        DREAMS_FILE,
        JSON.stringify(filtered, null, 2),
        'utf-8'
    );
}

/**
 * 공개된 Dream IP만 필터링하여 조회
 */
export async function getPublicDreams(): Promise<
    DreamIPPackage[]
> {
    const dreams = await getAllDreams();
    return dreams.filter(
        (dream) =>
            dream.isPublic && dream.status === 'completed'
    );
}
