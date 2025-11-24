# MongoDB 설정 가이드

Dream IP 프로젝트에서 MongoDB를 사용하기 위한 설정 가이드입니다.

## 1. MongoDB 설치 및 실행

### 옵션 A: 로컬 MongoDB 설치 (개발용)

#### macOS (Homebrew)
```bash
# MongoDB 설치
brew tap mongodb/brew
brew install mongodb-community

# MongoDB 시작
brew services start mongodb-community

# MongoDB 연결 확인
mongosh
```

#### Linux (Ubuntu/Debian)
```bash
# MongoDB 설치
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# MongoDB 시작
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 옵션 B: MongoDB Atlas (클라우드, 프로덕션 권장)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 가입
2. 무료 Cluster 생성 (M0 Free Tier)
3. Database Access에서 사용자 생성
4. Network Access에서 IP 화이트리스트 설정 (0.0.0.0/0 개발용)
5. Connect 버튼 클릭 → "Connect your application" 선택
6. Connection String 복사

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 옵션 C: Docker로 MongoDB 실행

```bash
# MongoDB 컨테이너 실행
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7.0

# 연결 확인
docker exec -it mongodb mongosh -u admin -p password
```

## 2. 환경 변수 설정

`.env.local` 파일을 생성하고 MongoDB 연결 정보를 설정하세요:

```bash
# .env.local

# 로컬 MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=dream-ip

# 또는 MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=dream-ip

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Pinata (IPFS)
PINATA_JWT=your_pinata_jwt_here
PINATA_GATEWAY=gateway.pinata.cloud
```

## 3. 의존성 설치

```bash
# MongoDB 드라이버 설치
bun install mongodb

# 또는 npm/yarn
npm install mongodb
yarn add mongodb
```

## 4. 인덱스 초기화

애플리케이션을 처음 실행하면 자동으로 인덱스가 생성됩니다.

수동으로 인덱스를 생성하려면:

```bash
# Next.js 서버 시작 시 자동 실행됨
bun dev

# 또는 별도 스크립트 실행
node -r esbuild-register scripts/init-db.ts
```

## 5. MongoDB 데이터 구조

### Dreams 컬렉션

```typescript
{
  _id: ObjectId,
  id: "dream-uuid",          // UUID
  userId: "user-uuid",       // 사용자 ID
  dreamRecord: {
    id: "record-uuid",
    userId: "user-uuid",
    dreamText: "꿈 내용...",
    recordedAt: "2025-01-01T00:00:00.000Z"
  },
  analysis: {
    title: "꿈 제목",
    summary: "꿈 요약",
    characters: ["캐릭터1", "캐릭터2"],
    // ... 분석 결과
  },
  visuals: [...],
  story: {...},
  dreamHash: "sha256-hash",
  genres: ["SF", "판타지"],   // 검색 최적화용
  tones: ["몽환적", "웅장함"], // 검색 최적화용
  status: "completed",
  isPublic: true,
  analysisModel: "openai",    // 'openai' | 'flock'
  ipfsCid: "QmXXXXXX",        // IPFS CID (옵션)
  ipAssetId: "0x...",         // Story Protocol Asset ID (옵션)
  createdAt: Date,
  updatedAt: Date
}
```

### Users 컬렉션

```typescript
{
  _id: ObjectId,
  userId: "user-uuid",
  walletAddress: "0x...",     // 블록체인 지갑 주소 (옵션)
  email: "user@example.com",  // 이메일 (옵션)
  displayName: "사용자 이름",
  preferences: {
    language: "ko",
    notifications: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 6. 인덱스 목록

### Dreams 컬렉션 인덱스
- `id` (unique): ID로 빠른 조회
- `userId`: 사용자별 꿈 조회
- `dreamHash` (unique, sparse): 중복 방지
- `status`: 상태별 필터링
- `isPublic + status`: 공개 꿈 조회 최적화
- `genres`: 장르 검색
- `tones`: 톤 검색
- `createdAt`: 최신순 정렬
- Text Index: `analysis.title`, `analysis.summary` 전문 검색

### Users 컬렉션 인덱스
- `userId` (unique): ID로 빠른 조회
- `walletAddress` (unique, sparse): 지갑 주소 조회
- `email` (unique, sparse): 이메일 조회

## 7. MongoDB Shell 명령어 예시

```javascript
// MongoDB에 연결
mongosh "mongodb://localhost:27017/dream-ip"

// 또는 Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/dream-ip"

// 컬렉션 확인
show collections

// Dreams 데이터 조회
db.dreams.find().limit(5)

// 특정 꿈 조회
db.dreams.findOne({ id: "dream-uuid" })

// 공개된 완료된 꿈만 조회
db.dreams.find({ isPublic: true, status: "completed" })

// 장르로 검색
db.dreams.find({ genres: "SF" })

// 텍스트 검색
db.dreams.find({ $text: { $search: "별고래" } })

// 인덱스 확인
db.dreams.getIndexes()

// 사용자 조회
db.users.find()

// 특정 사용자의 꿈 개수
db.dreams.countDocuments({ userId: "user-uuid" })

// 통계
db.dreams.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

## 8. 마이그레이션 (file-storage → MongoDB)

기존 `data/dreams.json` 파일의 데이터를 MongoDB로 마이그레이션:

```typescript
// scripts/migrate-to-mongodb.ts
import { readFile } from 'fs/promises';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { dreamPackageToDocument } from '@/lib/db/models';
import type { DreamIPPackage } from '@/lib/types';

async function migrate() {
  const db = await getDatabase();
  const collection = db.collection(COLLECTIONS.DREAMS);
  
  // dreams.json 읽기
  const data = await readFile('data/dreams.json', 'utf-8');
  const dreams: DreamIPPackage[] = JSON.parse(data);
  
  // MongoDB에 저장
  for (const dream of dreams) {
    const doc = dreamPackageToDocument(dream);
    await collection.updateOne(
      { id: dream.id },
      { $set: doc },
      { upsert: true }
    );
  }
  
  console.log(`✅ ${dreams.length}개의 꿈을 마이그레이션했습니다.`);
  process.exit(0);
}

migrate();
```

## 9. 백업 및 복원

```bash
# 백업
mongodump --uri="mongodb://localhost:27017/dream-ip" --out=./backup

# 복원
mongorestore --uri="mongodb://localhost:27017/dream-ip" ./backup/dream-ip

# Atlas 백업
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/dream-ip" --out=./backup
```

## 10. 성능 최적화 팁

1. **인덱스 활용**: 자주 조회하는 필드에 인덱스 생성
2. **Projection**: 필요한 필드만 가져오기
   ```typescript
   collection.find({}, { projection: { id: 1, 'analysis.title': 1 } })
   ```
3. **Connection Pooling**: 기본적으로 드라이버가 관리
4. **Aggregation Pipeline**: 복잡한 쿼리는 Aggregation 사용

## 문제 해결

### 연결 오류
```
MongoServerError: Authentication failed
```
→ MONGODB_URI의 username/password 확인

### 인덱스 오류
```
Index already exists with a different name
```
→ 기존 인덱스 삭제 후 재생성
```javascript
db.dreams.dropIndexes()
```

### 성능 느림
→ 쿼리에 인덱스가 사용되는지 확인
```javascript
db.dreams.find({ genres: "SF" }).explain("executionStats")
```

