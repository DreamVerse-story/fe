/**
 * 기존 MongoDB 데이터에서 visuals.imageUrl 필드 제거 스크립트
 *
 * 실행 방법:
 * bun run scripts/remove-imageurl-from-db.ts
 */

import {
    getDatabase,
    COLLECTIONS,
} from '../lib/db/mongodb';

async function removeImageUrlFromDB() {
    try {
        console.log('🔍 MongoDB 연결 중...');
        const db = await getDatabase();
        const collection = db.collection(
            COLLECTIONS.DREAMS
        );

        console.log('📊 전체 문서 수 확인 중...');
        const totalCount =
            await collection.countDocuments();
        console.log(
            `   총 ${totalCount}개의 문서가 있습니다.`
        );

        // imageUrl이 있는 문서 찾기
        const docsWithImageUrl = await collection
            .find({
                'visuals.imageUrl': {
                    $exists: true,
                    $ne: '',
                },
            })
            .toArray();

        console.log(
            `📸 imageUrl이 있는 문서: ${docsWithImageUrl.length}개`
        );

        if (docsWithImageUrl.length === 0) {
            console.log(
                '✅ imageUrl이 있는 문서가 없습니다. 작업 완료!'
            );
            return;
        }

        console.log('🗑️  imageUrl 필드 제거 중...');

        // 각 문서의 visuals 배열에서 imageUrl 제거
        let updatedCount = 0;
        for (const doc of docsWithImageUrl) {
            if (doc.visuals && Array.isArray(doc.visuals)) {
                const updatedVisuals = doc.visuals.map(
                    (visual: any) => {
                        const { imageUrl, ...rest } =
                            visual;
                        return rest;
                    }
                );

                // $set만 사용 (updatedVisuals에서 이미 imageUrl 제거됨)
                await collection.updateOne(
                    { _id: doc._id },
                    {
                        $set: {
                            visuals: updatedVisuals,
                        },
                    }
                );

                updatedCount++;
            }
        }

        console.log(
            `✅ ${updatedCount}개의 문서에서 imageUrl을 제거했습니다.`
        );

        // 검증: imageUrl이 남아있는지 확인
        const remainingDocs =
            await collection.countDocuments({
                'visuals.imageUrl': {
                    $exists: true,
                    $ne: '',
                },
            });

        if (remainingDocs === 0) {
            console.log(
                '✅ 모든 imageUrl이 성공적으로 제거되었습니다!'
            );
        } else {
            console.warn(
                `⚠️  ${remainingDocs}개의 문서에 여전히 imageUrl이 남아있습니다.`
            );
        }
    } catch (error) {
        console.error('❌ 오류 발생:', error);
        throw error;
    } finally {
        process.exit(0);
    }
}

// 스크립트 실행
removeImageUrlFromDB().catch((error) => {
    console.error('스크립트 실행 실패:', error);
    process.exit(1);
});
