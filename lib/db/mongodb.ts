/**
 * MongoDB 클라이언트 연결 관리
 */

import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error(
        'MONGODB_URI 환경 변수가 설정되지 않았습니다.'
    );
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise:
        | Promise<MongoClient>
        | undefined;
}

if (process.env.NODE_ENV === 'development') {
    // 개발 환경에서는 Hot Reload 시 연결이 중복되지 않도록 global 사용
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // 프로덕션에서는 매번 새로운 클라이언트 생성
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

/**
 * MongoDB 클라이언트 가져오기
 */
export async function getMongoClient(): Promise<MongoClient> {
    return clientPromise;
}

/**
 * MongoDB 데이터베이스 가져오기
 */
export async function getDatabase(): Promise<Db> {
    const client = await getMongoClient();
    return client.db(
        process.env.MONGODB_DB_NAME || 'dream-ip'
    );
}

/**
 * 컬렉션 이름 상수
 */
export const COLLECTIONS = {
    DREAMS: 'dreams',
    USERS: 'users',
} as const;
