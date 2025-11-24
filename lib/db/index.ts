/**
 * Database 모듈 진입점
 * MongoDB 관련 모든 export를 한 곳에서 관리
 */

// MongoDB 클라이언트
export { getMongoClient, getDatabase, COLLECTIONS } from './mongodb';

// 모델 타입 및 변환 함수
export type { UserDocument, DreamDocument, MongoDocument } from './models';
export { dreamDocumentToPackage, dreamPackageToDocument } from './models';

// Repository
export * as DreamRepository from './repositories/dream-repository';
export * as UserRepository from './repositories/user-repository';

// 인덱스 초기화
export { initializeIndexes } from './init-indexes';

