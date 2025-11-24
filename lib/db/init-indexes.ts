/**
 * MongoDB 인덱스 초기화
 * 애플리케이션 시작 시 한 번 실행하여 성능 최적화
 */

import { getDatabase, COLLECTIONS } from './mongodb';

export async function initializeIndexes(): Promise<void> {
    const db = await getDatabase();

    // Dreams 컬렉션 인덱스
    const dreamsCollection = db.collection(
        COLLECTIONS.DREAMS
    );
    await dreamsCollection.createIndexes([
        // id로 빠른 조회
        { key: { id: 1 }, unique: true },
        // userId로 사용자별 꿈 조회
        { key: { userId: 1 } },
        // dreamHash로 중복 확인
        {
            key: { dreamHash: 1 },
            unique: true,
            sparse: true,
        },
        // 상태별 필터링
        { key: { status: 1 } },
        // 공개 여부 + 상태 (복합 인덱스)
        { key: { isPublic: 1, status: 1 } },
        // 장르 검색
        { key: { genres: 1 } },
        // 톤 검색
        { key: { tones: 1 } },
        // 생성일 정렬
        { key: { createdAt: -1 } },
        // 텍스트 검색 (제목, 요약)
        {
            key: {
                'analysis.title': 'text',
                'analysis.summary': 'text',
            },
            name: 'dream_text_search',
        },
    ]);

    // Users 컬렉션 인덱스
    const usersCollection = db.collection(
        COLLECTIONS.USERS
    );
    await usersCollection.createIndexes([
        // userId로 빠른 조회
        { key: { userId: 1 }, unique: true },
        // 지갑 주소로 조회
        {
            key: { walletAddress: 1 },
            unique: true,
            sparse: true,
        },
        // 이메일로 조회
        { key: { email: 1 }, unique: true, sparse: true },
    ]);

    console.log('✅ MongoDB 인덱스 초기화 완료');
}
