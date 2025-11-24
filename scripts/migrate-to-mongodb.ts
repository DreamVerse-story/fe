/**
 * data/dreams.json의 데이터를 MongoDB로 마이그레이션
 *
 * 실행 방법:
 * bun scripts/migrate-to-mongodb.ts
 */

import { readFile } from 'fs/promises';
import path from 'path';
import {
    getDatabase,
    COLLECTIONS,
    initializeIndexes,
} from '../lib/db';
import { dreamPackageToDocument } from '../lib/db/models';
import type { DreamIPPackage } from '../lib/types';

async function migrate() {
    console.log('🔄 MongoDB 마이그레이션 시작...\n');

    try {
        // 1. MongoDB 연결 및 인덱스 초기화
        console.log('📡 MongoDB 연결 중...');
        const db = await getDatabase();
        console.log('✅ MongoDB 연결 성공\n');

        console.log('📑 인덱스 초기화 중...');
        await initializeIndexes();
        console.log('✅ 인덱스 초기화 완료\n');

        // 2. dreams.json 읽기
        const dreamsFilePath = path.join(
            process.cwd(),
            'data',
            'dreams.json'
        );
        console.log(`📂 ${dreamsFilePath} 읽는 중...`);

        let dreams: DreamIPPackage[];
        try {
            const data = await readFile(
                dreamsFilePath,
                'utf-8'
            );
            dreams = JSON.parse(data);
            console.log(
                `✅ ${dreams.length}개의 꿈 데이터 로드 완료\n`
            );
        } catch (error) {
            if (
                (error as NodeJS.ErrnoException).code ===
                'ENOENT'
            ) {
                console.log(
                    '⚠️  dreams.json 파일이 없습니다. 마이그레이션할 데이터가 없습니다.'
                );
                process.exit(0);
            }
            throw error;
        }

        if (dreams.length === 0) {
            console.log(
                '⚠️  마이그레이션할 데이터가 없습니다.'
            );
            process.exit(0);
        }

        // 3. MongoDB에 데이터 삽입
        console.log('💾 MongoDB에 데이터 저장 중...');
        const collection = db.collection(
            COLLECTIONS.DREAMS
        );

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const dream of dreams) {
            try {
                const doc = dreamPackageToDocument(dream);
                const result = await collection.updateOne(
                    { id: dream.id },
                    { $set: doc },
                    { upsert: true }
                );

                if (result.upsertedCount > 0) {
                    successCount++;
                    console.log(
                        `  ✅ 새로 생성: ${
                            dream.analysis?.title ||
                            dream.id
                        }`
                    );
                } else if (result.modifiedCount > 0) {
                    successCount++;
                    console.log(
                        `  🔄 업데이트: ${
                            dream.analysis?.title ||
                            dream.id
                        }`
                    );
                } else {
                    skipCount++;
                    console.log(
                        `  ⏭️  변경 없음: ${
                            dream.analysis?.title ||
                            dream.id
                        }`
                    );
                }
            } catch (error) {
                errorCount++;
                console.error(
                    `  ❌ 오류 (${dream.id}):`,
                    error
                );
            }
        }

        // 4. 결과 요약
        console.log('\n' + '='.repeat(60));
        console.log('📊 마이그레이션 완료\n');
        console.log(`  총 데이터:     ${dreams.length}개`);
        console.log(`  성공:         ${successCount}개`);
        console.log(`  변경 없음:    ${skipCount}개`);
        console.log(`  오류:         ${errorCount}개`);
        console.log('='.repeat(60) + '\n');

        // 5. 데이터 검증
        const totalCount = await collection.countDocuments(
            {}
        );
        console.log(
            `✅ MongoDB에 총 ${totalCount}개의 꿈이 저장되어 있습니다.\n`
        );

        process.exit(0);
    } catch (error) {
        console.error('\n❌ 마이그레이션 실패:', error);
        process.exit(1);
    }
}

// 실행
migrate();
