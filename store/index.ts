/**
 * Jotai 상태관리 스토어
 */

import { atom } from 'jotai';
import type { DreamIPPackage } from '@/lib/types';

// Dreams 상태
export const dreamsAtom = atom<DreamIPPackage[]>([]);

// 선택된 Dream 상태
export const selectedDreamAtom =
    atom<DreamIPPackage | null>(null);

// 로딩 상태
export const loadingAtom = atom<boolean>(false);

// 필터 상태 (Market 페이지용)
export const searchQueryAtom = atom<string>('');
export const selectedGenresAtom = atom<string[]>([]);
export const selectedTonesAtom = atom<string[]>([]);
export const sortByAtom = atom<
    'newest' | 'oldest' | 'popular'
>('newest');

// 통계 데이터 (Stats 페이지용)
export const statsAtom = atom((get) => {
    const dreams = get(dreamsAtom);
    return {
        total: dreams.length,
        minted: dreams.filter(
            (d) => d.status === 'completed'
        ).length,
        processing: dreams.filter(
            (d) => d.status === 'processing'
        ).length,
        failed: dreams.filter((d) => d.status === 'failed')
            .length,
    };
});
