/**
 * MongoDB 데이터베이스 초기화 스크립트
 * 인덱스 생성 및 기본 데이터 설정
 *
 * 실행 방법:
 * bun scripts/init-db.ts
 */

import {
    getDatabase,
    COLLECTIONS,
    initializeIndexes,
} from '../lib/db';

async function initDatabase() {
    console.log('🚀 MongoDB 데이터베이스 초기화 시작...\n');

    try {
        // 1. MongoDB 연결
        console.log('📡 MongoDB 연결 중...');
        const db = await getDatabase();
        console.log(
            `✅ 데이터베이스 연결 성공: ${db.databaseName}\n`
        );

        // 2. 인덱스 초기화
        console.log('📑 인덱스 생성 중...');
        await initializeIndexes();
        console.log('✅ 인덱스 생성 완료\n');

        // 3. 컬렉션 상태 확인
        console.log('📊 컬렉션 상태 확인...\n');

        const dreamsCollection = db.collection(
            COLLECTIONS.DREAMS
        );
        const usersCollection = db.collection(
            COLLECTIONS.USERS
        );

        const dreamsCount =
            await dreamsCollection.countDocuments({});
        const usersCount =
            await usersCollection.countDocuments({});

        console.log(
            `  Dreams 컬렉션: ${dreamsCount}개 문서`
        );
        console.log(
            `  Users 컬렉션:  ${usersCount}개 문서\n`
        );

        // 4. 인덱스 목록 출력
        console.log('📑 Dreams 컬렉션 인덱스:');
        const dreamsIndexes =
            await dreamsCollection.indexes();
        dreamsIndexes.forEach((index) => {
            console.log(
                `  - ${index.name}: ${JSON.stringify(
                    index.key
                )}`
            );
        });

        console.log('\n📑 Users 컬렉션 인덱스:');
        const usersIndexes =
            await usersCollection.indexes();
        usersIndexes.forEach((index) => {
            console.log(
                `  - ${index.name}: ${JSON.stringify(
                    index.key
                )}`
            );
        });

        console.log('\n' + '='.repeat(60));
        console.log('✅ 데이터베이스 초기화 완료');
        console.log('='.repeat(60) + '\n');

        process.exit(0);
    } catch (error) {
        console.error(
            '\n❌ 데이터베이스 초기화 실패:',
            error
        );
        process.exit(1);
    }
}

// 실행
initDatabase();
