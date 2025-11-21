#!/usr/bin/env node
/**
 * 실패한 Dream IP 데이터 삭제 스크립트
 *
 * 사용법: bun run delete
 */

import fs from 'fs';
import path from 'path';

const DREAMS_FILE = path.join(
    process.cwd(),
    'data',
    'dreams.json'
);

function cleanFailedDreams() {
    try {
        // 파일 읽기
        const rawData = fs.readFileSync(
            DREAMS_FILE,
            'utf8'
        );
        const dreams = JSON.parse(rawData);

        // 통계
        const totalCount = dreams.length;
        const completedDreams = dreams.filter(
            (dream: any) => dream.status === 'completed'
        );
        const failedCount =
            totalCount - completedDreams.length;

        if (failedCount === 0) {
            console.log(
                '✅ 삭제할 실패한 데이터가 없습니다.'
            );
            console.log(
                `📊 전체: ${totalCount}개 (모두 성공)`
            );
            return;
        }

        // 확인 메시지
        console.log('\n🗑️  실패한 Dream IP 데이터 삭제\n');
        console.log(`📊 전체: ${totalCount}개`);
        console.log(`✅ 성공: ${completedDreams.length}개`);
        console.log(`❌ 실패: ${failedCount}개`);
        console.log('\n삭제할 항목:');

        dreams
            .filter(
                (dream: any) => dream.status !== 'completed'
            )
            .forEach((dream: any, index: number) => {
                console.log(
                    `  ${index + 1}. [${dream.status}] ${
                        dream.analysis.title ||
                        '(제목 없음)'
                    }`
                );
            });

        // 백업 생성
        const timestamp = new Date()
            .toISOString()
            .replace(/[:.]/g, '-');
        const backupFile = path.join(
            process.cwd(),
            'data',
            `dreams.backup.${timestamp}.json`
        );
        fs.writeFileSync(backupFile, rawData, 'utf8');
        console.log(
            `\n💾 백업 생성: ${path.basename(backupFile)}`
        );

        // 성공한 데이터만 저장
        fs.writeFileSync(
            DREAMS_FILE,
            JSON.stringify(completedDreams, null, 2),
            'utf8'
        );

        console.log(
            `\n✅ 실패한 데이터 ${failedCount}개 삭제 완료!`
        );
        console.log(
            `📝 남은 데이터: ${completedDreams.length}개\n`
        );
    } catch (error) {
        console.error('❌ 오류 발생:', error);
        process.exit(1);
    }
}

// 스크립트 실행
cleanFailedDreams();
