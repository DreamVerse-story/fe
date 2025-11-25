# 🔧 환경 변수 설정 가이드

Dream IP 프로젝트를 실행하기 위한 환경 변수 설정 가이드입니다.

---

## ✅ 1. `.env.local` 파일이 생성되었습니다!

프로젝트 루트에 `.env.local` 파일이 자동으로 생성되었습니다.

이제 **실제 API 키**로 교체해야 합니다!

---

## 🔑 2. 필수 API 키 발급 및 설정

### 2.1. OpenAI API Key (필수)

Dream 분석 및 이미지 생성에 사용됩니다.

1. [OpenAI Platform](https://platform.openai.com/api-keys) 접속
2. "Create new secret key" 클릭
3. 생성된 키 복사
4. `.env.local` 파일 열기
5. 다음 줄 수정:
    ```bash
    OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
    ```

---

### 2.2. Pinata JWT (필수)

IPFS에 이미지 및 메타데이터를 업로드하는 데 사용됩니다.

1. [Pinata](https://app.pinata.cloud) 가입
2. API Keys 페이지로 이동
3. "New Key" 클릭
4. 권한 설정:
    - ✅ `pinFileToIPFS`
    - ✅ `pinJSONToIPFS`
5. 생성된 JWT 복사
6. `.env.local` 파일 수정:
    ```bash
    PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    ```

---

### 2.3. WalletConnect Project ID (필수)

지갑 연결 기능에 사용됩니다.

1. [WalletConnect Cloud](https://cloud.walletconnect.com) 접속
2. "Create New Project" 클릭
3. 프로젝트 이름 입력 (예: "Dream IP")
4. Project ID 복사
5. `.env.local` 파일 수정:
    ```bash
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=abcdef1234567890...
    ```

---

### 2.4. MongoDB URI (필수)

Dream IP 데이터를 저장하는 데 사용됩니다.

#### 로컬 MongoDB 사용 (권장)

```bash
# 이미 설정되어 있음 (기본값)
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=dream-ip
```

#### MongoDB Atlas 사용 (프로덕션)

1. [MongoDB Atlas](https://cloud.mongodb.com) 가입
2. "Create Cluster" 클릭
3. 무료 Tier 선택
4. 클러스터 생성 완료 대기
5. "Connect" 클릭
6. "Connect your application" 선택
7. Connection String 복사
8. `.env.local` 파일 수정:
    ```bash
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
    MONGODB_DB_NAME=dream-ip
    ```

---

### 2.5. Flock AI API (선택사항)

Dream 분석에 Flock AI 모델을 사용하려면 설정합니다.

1. [Flock AI](https://flock.com) 접속
2. API 키 발급
3. `.env.local` 파일 수정:
    ```bash
    FLOCK_API_KEY=your_flock_api_key_here
    ```

---

## 🌐 3. Story Protocol 설정 (자동 설정됨)

Aeneid Testnet 주소가 이미 설정되어 있습니다!

```bash
# Story Protocol - Aeneid Testnet (자동 설정됨)
NEXT_PUBLIC_STORY_RPC_URL=https://aeneid.storyrpc.io
NEXT_PUBLIC_SPG_NFT_IMPL=0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37
NEXT_PUBLIC_PIL_LICENSE_TEMPLATE=0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316
NEXT_PUBLIC_IP_ASSET_REGISTRY=0x77319B4031e6eF1250907aa00018B8B1c67a244b
NEXT_PUBLIC_LICENSING_MODULE=0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f
NEXT_PUBLIC_REGISTRATION_WORKFLOWS=0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424
STORY_NETWORK=aeneid
```

**수정할 필요 없습니다!** ✅

---

## 📋 4. 설정 완료 체크리스트

다음 항목을 확인하세요:

-   [ ] `.env.local` 파일이 프로젝트 루트에 있음
-   [ ] `OPENAI_API_KEY` 설정 완료
-   [ ] `PINATA_JWT` 설정 완료
-   [ ] `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` 설정 완료
-   [ ] `MONGODB_URI` 설정 완료 (로컬 또는 Atlas)
-   [ ] Story Protocol 주소 확인 (자동 설정됨)

---

## 🚀 5. 개발 서버 실행

모든 환경 변수 설정이 완료되었다면:

```bash
# 개발 서버 실행
bun run dev

# 또는
npm run dev
```

브라우저에서 확인:

```
http://localhost:3000
```

---

## 🧪 6. 설정 테스트

### 6.1. MongoDB 연결 테스트

```bash
# MongoDB 초기화 스크립트 실행
bun run scripts/init-db.ts
```

**예상 출력:**

```
✅ MongoDB 연결 성공
✅ 인덱스 생성 완료
```

### 6.2. OpenAI API 테스트

```bash
# Dream 생성 테스트
# 브라우저에서 Dream 생성 시도
# "꿈 분석 중..." → "스토리 생성 중..." → "이미지 생성 중..."
```

### 6.3. IPFS (Pinata) 테스트

```bash
# Story Protocol 등록 테스트
# Dream 생성 후 "Story Protocol 등록" 버튼 클릭
# "IPFS에 메타데이터 업로드 중..." 성공 확인
```

### 6.4. 지갑 연결 테스트

```bash
# 브라우저에서 "Connect Wallet" 클릭
# MetaMask 선택
# 지갑 주소 및 잔액 표시 확인
```

---

## 🐛 7. 문제 해결

### OpenAI API 에러

**에러:**

```
Error: Invalid OpenAI API key
```

**해결:**

1. API 키가 `sk-proj-`로 시작하는지 확인
2. 공백이나 개행 문자가 없는지 확인
3. OpenAI 계정에 크레딧이 있는지 확인

---

### Pinata JWT 에러

**에러:**

```
Error: Unauthorized - Invalid JWT
```

**해결:**

1. JWT 전체를 복사했는지 확인 (매우 길어요!)
2. 공백이나 개행 문자가 없는지 확인
3. Pinata에서 JWT 권한 확인:
    - `pinFileToIPFS` ✅
    - `pinJSONToIPFS` ✅

---

### MongoDB 연결 에러

**에러:**

```
Error: MongoNetworkError: connect ECONNREFUSED
```

**해결 (로컬):**

```bash
# MongoDB 실행 확인
brew services list | grep mongodb

# 실행되지 않았다면
brew services start mongodb-community
```

**해결 (Atlas):**

1. Connection String 확인
2. 비밀번호에 특수문자가 있다면 URL 인코딩
3. IP 화이트리스트 확인 (0.0.0.0/0 허용)

---

### WalletConnect 에러

**에러:**

```
Error: Invalid projectId
```

**해결:**

1. Project ID 확인 (32자리 영숫자)
2. `.env.local` 파일 저장 확인
3. 개발 서버 재시작

---

## 📝 8. `.env.local` 최종 예시

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-proj-aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890

# Pinata (IPFS) Configuration
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI...
PINATA_GATEWAY=gateway.pinata.cloud

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=dream-ip

# Flock AI API (선택사항)
FLOCK_API_KEY=flock_xxxxxxxxxxxxx

# Story Protocol - Aeneid Testnet (Client-side)
NEXT_PUBLIC_STORY_RPC_URL=https://aeneid.storyrpc.io
NEXT_PUBLIC_SPG_NFT_IMPL=0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37
NEXT_PUBLIC_PIL_LICENSE_TEMPLATE=0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316
NEXT_PUBLIC_IP_ASSET_REGISTRY=0x77319B4031e6eF1250907aa00018B8B1c67a244b
NEXT_PUBLIC_LICENSING_MODULE=0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f
NEXT_PUBLIC_REGISTRATION_WORKFLOWS=0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424

# WalletConnect (RainbowKit)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Story Protocol - Network Setting
STORY_NETWORK=aeneid
```

---

## 🔒 9. 보안 주의사항

### ⚠️ 절대로 하면 안 되는 것:

1. **`.env.local` 파일을 Git에 커밋하지 마세요!**
    - 이미 `.gitignore`에 포함되어 있음
2. **API 키를 공개 저장소에 올리지 마세요!**
3. **API 키를 프론트엔드 코드에 직접 넣지 마세요!**
    - `NEXT_PUBLIC_` 접두사가 없는 키는 서버에서만 사용됨

### ✅ 안전하게 공유하는 방법:

```bash
# 팀원에게 env.example 공유
cp env.example .env.local

# 각자 API 키를 개인적으로 발급받아 설정
```

---

## 🎉 10. 다음 단계

환경 변수 설정이 완료되었다면:

1. ✅ 개발 서버 실행: `bun run dev`
2. ✅ MongoDB 초기화: `bun run scripts/init-db.ts`
3. ✅ 지갑 연결 테스트
4. ✅ Dream IP 생성 테스트
5. ✅ Story Protocol 등록 테스트

---

## 📚 관련 문서

-   `AENEID_TESTNET_SETUP.md`: Aeneid Testnet 상세 가이드
-   `CHAINID_FIX.md`: Chain ID 에러 해결 가이드
-   `WALLET_DIRECT_REGISTRATION.md`: 지갑 직접 등록 방식
-   `MONGODB_SETUP_KO.md`: MongoDB 설정 가이드

---

## 💬 도움이 필요하신가요?

-   [Story Protocol Discord](https://discord.gg/storyprotocol)
-   [MongoDB 공식 문서](https://docs.mongodb.com)
-   [OpenAI API 문서](https://platform.openai.com/docs)
-   [WalletConnect 문서](https://docs.walletconnect.com)
