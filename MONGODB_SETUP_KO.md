# MongoDB 설정 완료! 🎉

Dream IP 프로젝트에서 MongoDB가 성공적으로 구성되었습니다.

## ✅ 완료된 작업

### 1. **MongoDB 통합 구조 구축**
- ✅ `lib/db/mongodb.ts` - MongoDB 클라이언트 연결 관리
- ✅ `lib/db/models.ts` - 데이터 모델 및 타입 정의
- ✅ `lib/db/repositories/` - Dream & User Repository 패턴 구현
- ✅ `lib/db/init-indexes.ts` - 성능 최적화를 위한 인덱스 설정
- ✅ `lib/storage/mongo-storage.ts` - 기존 file-storage 인터페이스 호환 계층

### 2. **데이터 모델**

#### Dreams 컬렉션
```typescript
{
  _id: ObjectId,
  id: "dream-uuid",
  userId: "user-uuid",
  dreamRecord: {...},
  analysis: {...},
  visuals: [...],
  story: {...},
  dreamHash: "sha256-hash",
  genres: ["SF", "판타지"],      // 검색 최적화
  tones: ["몽환적", "웅장함"],    // 검색 최적화
  status: "completed",
  isPublic: true,
  analysisModel: "openai",        // 'openai' | 'flock'
  ipfsCid?: "QmXXX",             // IPFS CID (Phase 2)
  ipAssetId?: "0x...",           // Story Protocol (Phase 2)
  createdAt: Date,
  updatedAt: Date
}
```

#### Users 컬렉션
```typescript
{
  _id: ObjectId,
  userId: "user-uuid",
  walletAddress?: "0x...",       // 블록체인 지갑
  email?: "user@example.com",
  displayName?: "사용자 이름",
  preferences: {
    language: "ko" | "en",
    notifications: boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **API 업데이트**
기존 모든 API 엔드포인트가 MongoDB를 사용하도록 수정:
- ✅ `POST /api/dreams/create`
- ✅ `GET /api/dreams`
- ✅ `GET /api/dreams/[id]`
- ✅ `PATCH /api/dreams/[id]`
- ✅ `DELETE /api/dreams/[id]`
- ✅ `GET /api/dreams/[id]/progress`

### 4. **Repository 패턴 구현**

#### Dream Repository 기능
- `getAllDreams()` - 모든 꿈 조회
- `getDreamById(id)` - ID로 조회
- `getDreamsByUserId(userId)` - 사용자별 조회
- `getDreamsByGenres(genres)` - 장르별 검색
- `getDreamsByTones(tones)` - 톤별 검색
- `searchDreams(keyword)` - 텍스트 검색
- `getDreamsByStatus(status)` - 상태별 필터링
- `getDreamByHash(hash)` - 중복 확인
- `saveDream(dream)` - 생성/업데이트
- `deleteDream(id)` - 삭제

#### User Repository 기능
- `findOrCreateUser(userId)` - 사용자 생성 또는 조회
- `getUserById(userId)` - ID로 조회
- `getUserByWallet(address)` - 지갑 주소로 조회
- `updateUser(userId, updates)` - 업데이트
- `connectWallet(userId, address)` - 지갑 연결
- `deleteUser(userId)` - 삭제

### 5. **성능 최적화 인덱스**

#### Dreams 컬렉션
- `id` (unique) - 빠른 ID 조회
- `userId` - 사용자별 꿈 조회
- `dreamHash` (unique, sparse) - 중복 방지
- `status` - 상태 필터링
- `isPublic + status` - 공개 꿈 조회 복합 인덱스
- `genres` - 장르 검색
- `tones` - 톤 검색
- `createdAt` - 시간순 정렬
- Text Index (`analysis.title`, `analysis.summary`) - 전문 검색

#### Users 컬렉션
- `userId` (unique) - ID 조회
- `walletAddress` (unique, sparse) - 지갑 조회
- `email` (unique, sparse) - 이메일 조회

### 6. **유틸리티 스크립트**
- ✅ `scripts/init-db.ts` - DB 초기화 및 인덱스 생성
- ✅ `scripts/migrate-to-mongodb.ts` - 기존 JSON 데이터 마이그레이션

---

## 🚀 시작하기

### Step 1: MongoDB 설치 및 실행

#### 옵션 A: 로컬 MongoDB (개발용)
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install mongodb-org
sudo systemctl start mongod
```

#### 옵션 B: MongoDB Atlas (프로덕션 권장)
1. https://www.mongodb.com/cloud/atlas 가입
2. 무료 M0 Cluster 생성
3. Database User 생성
4. Network Access 설정 (0.0.0.0/0)
5. Connection String 복사

#### 옵션 C: Docker
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  mongo:7.0
```

### Step 2: 환경 변수 설정

`.env.local` 파일 생성:

```bash
# 로컬 MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=dream-ip

# 또는 MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DB_NAME=dream-ip

# 기존 환경 변수들
OPENAI_API_KEY=your_key
PINATA_JWT=your_jwt
```

### Step 3: 패키지 설치

```bash
# MongoDB 드라이버 설치
bun install

# 또는
npm install
```

### Step 4: 데이터베이스 초기화

```bash
# 인덱스 생성
bun run db:init

# 기존 JSON 데이터 마이그레이션 (선택사항)
bun run db:migrate
```

### Step 5: 개발 서버 실행

```bash
bun dev
```

---

## 📊 데이터 마이그레이션

기존 `data/dreams.json` 파일이 있다면 MongoDB로 마이그레이션:

```bash
bun run db:migrate
```

마이그레이션 후:
- ✅ 모든 꿈 데이터가 MongoDB로 복사됨
- ✅ 중복 체크 (dreamHash 기반)
- ✅ 인덱스 자동 생성
- ✅ 기존 JSON 파일은 백업용으로 유지

---

## 🔍 MongoDB 사용 예시

### Shell에서 데이터 확인
```bash
# MongoDB 연결
mongosh "mongodb://localhost:27017/dream-ip"

# 컬렉션 확인
show collections

# Dreams 조회
db.dreams.find().limit(5)

# 특정 꿈 조회
db.dreams.findOne({ id: "dream-123" })

# 공개된 완료된 꿈
db.dreams.find({ isPublic: true, status: "completed" })

# 장르로 검색
db.dreams.find({ genres: "SF" })

# 텍스트 검색
db.dreams.find({ $text: { $search: "별고래" } })

# 통계
db.dreams.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

### 코드에서 사용
```typescript
import * as DreamRepo from '@/lib/db/repositories/dream-repository';

// 모든 꿈 조회
const dreams = await DreamRepo.getAllDreams();

// 특정 사용자의 꿈
const userDreams = await DreamRepo.getDreamsByUserId("user-123");

// 장르별 검색
const sfDreams = await DreamRepo.getDreamsByGenres(["SF", "판타지"]);

// 텍스트 검색
const results = await DreamRepo.searchDreams("별고래");

// 저장
await DreamRepo.saveDream(dreamPackage);
```

---

## 🎯 다음 단계 (Phase 2)

### 1. Story Protocol 연동
```typescript
// lib/blockchain/story-protocol.ts
export async function registerDreamIP(
  dream: DreamIPPackage,
  userWallet: string
): Promise<string> {
  // 1. IPFS에 전체 패키지 업로드
  const ipfsCID = await uploadPackageToIPFS(dream);
  
  // 2. Story Protocol에 IP Asset 생성
  const ipAssetId = await storyProtocol.createIPAsset({
    owner: userWallet,
    metadataURI: `ipfs://${ipfsCID}`,
    dreamHash: dream.dreamHash
  });
  
  // 3. MongoDB 업데이트
  await DreamRepo.saveDream({
    ...dream,
    ipfsCid: ipfsCID,
    ipAssetId: ipAssetId,
    status: 'registered'
  });
  
  return ipAssetId;
}
```

### 2. 분석 모델 선택 (이미 준비됨)
```typescript
// 프론트엔드에서 모델 선택
const response = await fetch('/api/dreams/create', {
  method: 'POST',
  body: JSON.stringify({
    dreamText: "...",
    userId: "user-123",
    model: "openai" // 또는 "flock"
  })
});
```

### 3. 검색 API 추가
```typescript
// app/api/dreams/search/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const keyword = searchParams.get('q');
  const genres = searchParams.getAll('genre');
  const tones = searchParams.getAll('tone');
  
  let dreams;
  if (keyword) {
    dreams = await DreamRepo.searchDreams(keyword);
  } else if (genres.length > 0) {
    dreams = await DreamRepo.getDreamsByGenres(genres);
  } else if (tones.length > 0) {
    dreams = await DreamRepo.getDreamsByTones(tones);
  }
  
  return NextResponse.json({ dreams });
}
```

---

## 📚 참고 문서

- [MongoDB 설정 가이드](./README_MONGODB.md) - 상세한 설정 및 문제 해결
- [환경 변수 예제](./env.example) - 필수 환경 변수 목록
- [IDI 기획서](./IDI_specification.md) - 전체 서비스 기획

---

## ⚠️ 중요 사항

1. **환경 변수 필수**: `.env.local` 파일에 `MONGODB_URI` 필수 설정
2. **인덱스 생성**: 첫 실행 전 `bun run db:init` 실행 권장
3. **백업**: 프로덕션 배포 전 MongoDB Atlas 자동 백업 설정
4. **보안**: `.env.local` 파일은 절대 커밋하지 말 것 (.gitignore에 포함됨)

---

## 🎉 완료!

이제 Dream IP 프로젝트는 MongoDB를 사용하여:
- ✅ 빠른 검색 및 필터링
- ✅ 확장 가능한 데이터 구조
- ✅ 사용자 관리
- ✅ 분석 모델 선택 지원
- ✅ Story Protocol 연동 준비 완료

문제가 발생하면 `README_MONGODB.md`의 문제 해결 섹션을 참고하세요!

