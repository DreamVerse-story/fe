#!/usr/bin/env bun
/**
 * MongoDB 연결 테스트 스크립트
 * 사용법: bun scripts/test-mongodb.ts
 */

import { getMongoClient, getDatabase } from '../lib/db/mongodb';

async function testConnection() {
    try {
        console.log('🔍 MongoDB 연결 테스트 시작...\n');

        // 1. MongoDB 클라이언트 연결
        console.log('📡 MongoDB 연결 중...');
        const client = await getMongoClient();
        console.log('✅ MongoDB 클라이언트 연결 성공\n');

        // 2. 데이터베이스 가져오기
        console.log('📂 데이터베이스 접근 중...');
        const db = await getDatabase();
        console.log(`✅ 데이터베이스: ${db.databaseName}\n`);

        // 3. 서버 상태 확인
        console.log('🔍 서버 상태 확인 중...');
        const adminDb = client.db().admin();
        const serverStatus = await adminDb.serverStatus();
        console.log(`✅ MongoDB 버전: ${serverStatus.version}`);
        console.log(`✅ 서버 가동 시간: ${Math.floor(serverStatus.uptime / 60)} 분\n`);

        // 4. 컬렉션 목록 확인
        console.log('📋 컬렉션 목록:');
        const collections = await db.listCollections().toArray();
        if (collections.length === 0) {
            console.log('  (컬렉션이 없습니다 - 첫 데이터 추가 시 자동 생성됨)');
        } else {
            collections.forEach((col) => {
                console.log(`  - ${col.name}`);
            });
        }

        // 5. dreams 컬렉션 확인
        console.log('\n📊 Dreams 컬렉션 통계:');
        const dreamsCollection = db.collection('dreams');
        const count = await dreamsCollection.countDocuments();
        console.log(`  총 ${count}개의 꿈이 저장되어 있습니다.`);

        console.log('\n🎉 MongoDB 연결 테스트 완료!\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ MongoDB 연결 실패:');
        console.error(error);
        console.error('\n💡 .env 파일을 확인하세요:');
        console.error('   MONGODB_URI=mongodb://username:password@host:port/');
        console.error('   MONGODB_DB_NAME=dream-ip\n');
        process.exit(1);
    }
}

testConnection();
