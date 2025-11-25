# 🎬 Dream IP 생성부터 라이선스까지 전체 플로우 가이드

생성자가 꿈을 입력해서 NFT 민팅하고 라이선스를 부여하는 전체 과정을 단계별로 설명합니다.

---

## 📋 전체 플로우 개요

```
1. 꿈 입력 (Record 페이지)
   ↓
2. AI 분석 & 이미지 생성 (자동 처리)
   ↓
3. Story Protocol에 NFT 민팅 & IP Asset 등록
   ↓
4. 라이선스 조건 설정 (소유자)
   ↓
5. 라이선스 구매 (스튜디오/창작자)
   ↓
6. 로열티 청구 (소유자)
```

---

## 🎯 단계별 상세 가이드

### 1단계: 꿈 입력 및 AI 처리

#### 📝 꿈 기록하기

1. **Record 페이지 접속**
   - URL: `http://localhost:3000/record`
   - 또는 헤더의 "RECORD" 메뉴 클릭

2. **꿈 내용 입력**
   - 최소 50자 이상 입력
   - 실시간 글자 수 카운터 확인
   - 예시:
     ```
     사막 한가운데에서 별빛을 먹는 거대한 고래를 만났다.
     고래는 우주를 헤엄치며 별들을 모으고 있었다.
     나는 그 고래의 등에 올라타서 우주 여행을 시작했다.
     ```

3. **AI 모델 선택** (선택사항)
   - OpenAI (기본값) - 안정적이고 정확
   - Flock - 저비용 대안

4. **"꿈 기록하기" 버튼 클릭**
   - 즉시 `dreamId` 반환
   - 백그라운드에서 AI 처리 시작

#### 🤖 AI 자동 처리 (백그라운드)

다음 단계들이 자동으로 진행됩니다:

1. **꿈 분석** (Step 1/6)
   - 제목 추출 (한국어/영어)
   - 요약 생성 (한국어/영어)
   - 장르 분류 (SF, 판타지, 호러 등)
   - 분위기 태그 (몽환적, 공포 등)
   - 캐릭터 추출 (한국어/영어)
   - 세계관 분석 (한국어/영어)

2. **스토리 생성** (Step 2/6)
   - 시놉시스 생성 (1-2페이지, 한국어/영어)
   - 장면 비트 생성 (5-8개, 한국어/영어)
   - 로어 생성 (세계관 설정, 한국어/영어)

3. **이미지 생성** (Step 3-6/6)
   - Key Visual 생성 (영화 포스터 수준)
   - 캐릭터 컨셉 아트 생성 (실사 스타일)
   - 세계관 컨셉 아트 생성
   - IPFS에 자동 업로드

5. **완료 상태**
   - `status: 'completed'`
   - 모든 데이터 MongoDB에 저장

#### 📊 진행 상태 확인

- Dream 상세 페이지에서 실시간 진행률 확인
- URL: `/dreams/{dreamId}`
- 또는 Market 페이지에서 확인

---

### 2단계: Story Protocol에 NFT 민팅 & IP Asset 등록

#### 🔐 지갑 연결

1. **지갑 연결**
   - 헤더의 "Connect Wallet" 버튼 클릭
   - MetaMask 선택
   - Aeneid Testnet으로 자동 전환
   - 트랜잭션 승인

2. **테스트 토큰 받기** (필요시)
   - [Story Faucet](https://faucet.story.foundation) 접속
   - 지갑 주소 입력
   - 5 IP 토큰 수령 (하루 1회)

#### 🎨 NFT 민팅 & IP Asset 등록

1. **Dream IP 상세 페이지 접속**
   - URL: `/dreams/{dreamId}`
   - 또는 Market 페이지에서 Dream IP 클릭

2. **"Story Protocol 등록" 버튼 클릭**
   - Dream IP가 `completed` 상태인지 확인
   - 버튼이 활성화되어 있으면 클릭

3. **자동 처리 과정**
   ```
   📦 Dream IP 데이터 가져오는 중...
   ↓
   ☁️ IPFS에 메타데이터 업로드 중...
   - IP Metadata 업로드 (IPA Metadata Standard)
   - NFT Metadata 업로드 (ERC-721 Standard, 영어)
   ↓
   🔐 지갑에서 트랜잭션을 승인해주세요...
   - MetaMask 팝업에서 트랜잭션 승인
   - 가스비: ~0.01 IP
   ↓
   ⏳ 블록체인에서 처리 중...
   ↓
   ✅ Story Protocol 등록 완료!
   ```

4. **등록 결과**
   - `ipAssetId` 생성 (예: `0x1234...`)
   - MongoDB에 `ipAssetId` 저장
   - 블록 탐색기에서 확인 가능

#### 🔍 등록 확인

- Dream IP 상세 페이지의 "라이선스 & 로열티" 섹션에서 확인
- IP Asset ID 표시
- Explorer 링크로 블록체인에서 확인

---

### 3단계: 라이선스 조건 설정 (소유자)

#### 📜 라이선스 설정하기

1. **Dream IP 상세 페이지 접속**
   - 등록된 Dream IP (`ipAssetId`가 있는 경우)

2. **"라이선스 설정" 버튼 클릭**
   - Overview 탭의 "라이선스 & 로열티" 섹션
   - 또는 헤더의 액션 버튼

3. **라이선스 조건 입력**
   - ✅ **상업적 사용 허용**: 체크박스
   - **상업적 사용 로열티**: 0-100% (예: 10%)
   - ✅ **파생 작품 허용**: 체크박스
   - **파생 작품 로열티**: 0-100% (예: 5%)
   - **라이선스 가격**: IP 단위 (예: 0.1 IP)

4. **"라이선스 설정" 버튼 클릭**
   - 지갑에서 트랜잭션 승인
   - 라이선스 조건이 Story Protocol에 저장됨

#### 📋 라이선스 조건 예시

```typescript
{
  commercialUse: true,        // 상업적 사용 허용
  commercialRevShare: 10,     // 10% 로열티
  derivativesAllowed: true,   // 파생 작품 허용
  derivativesRevShare: 5,     // 5% 로열티
  currency: '0x0000...',       // Native token (IP)
  price: '0.1'                // 0.1 IP
}
```

---

### 4단계: 라이선스 구매 (스튜디오/창작자)

#### 🛒 라이선스 구매하기

1. **Market 페이지에서 Dream IP 탐색**
   - URL: `/market`
   - 장르, 분위기 필터링
   - 키워드 검색

2. **Dream IP 상세 페이지 접속**
   - 관심 있는 Dream IP 클릭

3. **"라이선스 구매" 버튼 클릭**
   - 가격 확인 (예: 0.1 IP)
   - "라이선스를 구매하시겠습니까?" 확인

4. **트랜잭션 승인**
   - MetaMask 팝업에서 승인
   - 가스비: ~0.01 IP
   - 라이선스 토큰 발행

5. **구매 완료**
   - 라이선스 토큰이 구매자 지갑으로 전송됨
   - Dream IP를 상업적으로 사용 가능

---

### 5단계: 로열티 청구 (소유자)

#### 💰 로열티 확인 및 청구

1. **로열티 대시보드 접속**
   - 헤더의 "ROYALTIES" 메뉴 클릭
   - URL: `/royalties`

2. **로열티 정보 확인**
   - 각 Dream IP별 총 로열티
   - 청구 가능한 스냅샷 수
   - 이미 청구된 스냅샷 수

3. **"로열티 청구" 버튼 클릭**
   - 청구 가능한 스냅샷이 있는 경우
   - "로열티를 청구하시겠습니까?" 확인

4. **트랜잭션 승인**
   - MetaMask 팝업에서 승인
   - 로열티가 소유자 지갑으로 전송됨

---

## 🔄 전체 플로우 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                    생성자 (Creator)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  1. 꿈 입력     │
                    │  (Record 페이지)│
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  2. AI 처리     │
                    │  - 분석         │
                    │  - 스토리 생성  │
                    │  - 이미지 생성  │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  3. NFT 민팅    │
                    │  Story Protocol │
                    │  등록           │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  4. 라이선스    │
                    │  조건 설정      │
                    └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              스튜디오/창작자 (Studio/Creator)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  5. 라이선스    │
                    │  구매           │
                    │  (Market 페이지)│
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  6. 콘텐츠 제작 │
                    │  - 영화/드라마  │
                    │  - 게임         │
                    │  - 웹툰         │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  7. 수익 발생   │
                    │  (로열티 생성)  │
                    └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    생성자 (Creator)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  8. 로열티 청구 │
                    │  (Royalties 페이지)│
                    └─────────────────┘
```

---

## 📝 실제 사용 예시

### 예시 1: 완전한 플로우

#### 생성자 (Alice)

1. **꿈 입력**
   ```
   "사막에서 별고래를 만나는 꿈"
   → Record 페이지에서 입력
   ```

2. **AI 처리 대기**
   ```
   Step 1/6: 꿈 분석 중...
   Step 2/6: 스토리 생성 중...
   Step 3/6: Key Visual 생성 중...
   Step 4/6: 캐릭터 생성 중...
   Step 5/6: 세계관 생성 중...
   Step 6/6: IPFS 업로드 중...
   ✅ 완료!
   ```

3. **NFT 민팅**
   ```
   "Story Protocol 등록" 버튼 클릭
   → MetaMask 승인
   → ipAssetId: 0x1234... 생성
   ```

4. **라이선스 설정**
   ```
   "라이선스 설정" 버튼 클릭
   → 상업적 사용: 허용, 10% 로열티
   → 파생 작품: 허용, 5% 로열티
   → 가격: 0.1 IP
   → MetaMask 승인
   ```

#### 스튜디오 (Bob)

5. **라이선스 구매**
   ```
   Market 페이지에서 "별고래" 검색
   → Dream IP 상세 페이지 접속
   → "라이선스 구매 (0.1 IP)" 버튼 클릭
   → MetaMask 승인
   → 라이선스 토큰 수령
   ```

6. **콘텐츠 제작**
   ```
   라이선스 토큰을 사용하여
   → 영화/게임/웹툰 제작
   → 수익 발생
   ```

#### 생성자 (Alice)

7. **로열티 청구**
   ```
   Royalties 페이지 접속
   → "별고래" Dream IP 확인
   → 총 로열티: 0.5 IP
   → 청구 가능: 3개 스냅샷
   → "로열티 청구" 버튼 클릭
   → MetaMask 승인
   → 0.5 IP 수령
   ```

---

## 🎯 주요 기능별 상세 설명

### 1. 꿈 입력 (`/record`)

**기능:**
- 텍스트 입력 (최소 50자)
- 실시간 글자 수 카운터
- AI 모델 선택 (OpenAI/Flock)
- 진행률 표시

**API:**
- `POST /api/dreams/create`
- 요청:
  ```json
  {
    "dreamText": "꿈 내용...",
    "userId": "user-uuid",
    "model": "openai" // 또는 "flock"
  }
  ```
- 응답:
  ```json
  {
    "success": true,
    "dreamId": "dream-uuid"
  }
  ```

---

### 2. AI 처리 (백그라운드)

**처리 단계:**
1. 꿈 분석 (`analyzeDream`)
   - 제목, 요약, 장르, 톤, 캐릭터, 세계관 추출
   - 한국어/영어 동시 생성

2. 스토리 생성 (`generateStory`)
   - 시놉시스, 장면 비트, 로어 생성
   - 한국어/영어 동시 생성

3. 이미지 생성 (`generateDreamVisuals`)
   - Key Visual (영화 포스터 수준)
   - 캐릭터 (실사 스타일)
   - 세계관 컨셉 아트
   - IPFS 자동 업로드

**진행 상태 확인:**
- `GET /api/dreams/{dreamId}/progress`
- 또는 Dream 상세 페이지에서 실시간 확인

---

### 3. NFT 민팅 & IP Asset 등록

**컴포넌트:** `StoryRegisterButton`

**처리 과정:**
1. Dream IP 데이터 가져오기
2. IPFS에 메타데이터 업로드
   - IP Metadata (IPA Metadata Standard)
   - NFT Metadata (ERC-721 Standard, 영어)
3. Story Protocol에 등록
   - NFT 민팅 (SPG NFT Contract)
   - IP Asset 등록
4. MongoDB 업데이트
   - `ipAssetId` 저장
   - `ipfsCid` 저장

**API:**
- `POST /api/story/prepare-metadata`
- `POST /api/story/register` (사용하지 않음, 직접 SDK 호출)

**결과:**
- `ipAssetId`: Story Protocol IP Asset ID
- `txHash`: 트랜잭션 해시
- 블록 탐색기에서 확인 가능

---

### 4. 라이선스 조건 설정

**컴포넌트:** `LicenseSetupButton`

**설정 항목:**
- 상업적 사용 허용/금지
- 상업적 사용 로열티 비율 (0-100%)
- 파생 작품 허용/금지
- 파생 작품 로열티 비율 (0-100%)
- 라이선스 가격 (IP 단위)

**API:**
- `POST /api/story/license`
- 요청:
  ```json
  {
    "ipAssetId": "0x1234...",
    "commercialUse": true,
    "commercialRevShare": 10,
    "derivativesAllowed": true,
    "derivativesRevShare": 5,
    "currency": "0x0000...",
    "price": "100000000000000000" // 0.1 IP in wei
  }
  ```

**위치:**
- Dream IP 상세 페이지
- Overview 탭 → "라이선스 & 로열티" 섹션
- 또는 헤더의 액션 버튼

---

### 5. 라이선스 구매

**컴포넌트:** `BuyLicenseButton`

**구매 과정:**
1. Market 페이지에서 Dream IP 탐색
2. Dream IP 상세 페이지 접속
3. "라이선스 구매" 버튼 클릭
4. 가격 확인 및 트랜잭션 승인
5. 라이선스 토큰 수령

**API:**
- `PUT /api/story/license`
- 요청:
  ```json
  {
    "ipAssetId": "0x1234...",
    "amount": 1,
    "receiverAddress": "0x5678..."
  }
  ```

**결과:**
- 라이선스 토큰이 구매자 지갑으로 전송됨
- Dream IP를 상업적으로 사용 가능

---

### 6. 로열티 청구

**컴포넌트:** `ClaimRoyaltyButton`

**청구 과정:**
1. Royalties 페이지 접속 (`/royalties`)
2. 각 Dream IP별 로열티 확인
3. "로열티 청구" 버튼 클릭
4. 트랜잭션 승인
5. 로열티 수령

**API:**
- `GET /api/story/royalty/{ipAssetId}` - 로열티 정보 조회
- `POST /api/story/royalty` - 로열티 청구
- 요청:
  ```json
  {
    "ipAssetId": "0x1234...",
    "snapshotIds": ["1", "2", "3"]
  }
  ```

**위치:**
- Royalties 페이지 (`/royalties`)
- Dream IP 상세 페이지 (향후 추가 예정)

---

## 🔍 각 단계별 확인 방법

### 1. 꿈 입력 확인
- ✅ Record 페이지에서 입력 완료
- ✅ `dreamId` 반환 확인

### 2. AI 처리 확인
- ✅ Dream 상세 페이지에서 진행률 확인
- ✅ `status: 'completed'` 확인
- ✅ 분석, 스토리, 이미지 생성 확인

### 3. NFT 민팅 확인
- ✅ Dream 상세 페이지에 `ipAssetId` 표시 확인
- ✅ 블록 탐색기에서 확인:
  ```
  https://aeneid.explorer.story.foundation/address/{ipAssetId}
  ```

### 4. 라이선스 설정 확인
- ✅ "라이선스 설정" 버튼이 사라지고 "라이선스 구매" 버튼만 표시
- ✅ 블록 탐색기에서 라이선스 정보 확인

### 5. 라이선스 구매 확인
- ✅ 구매자 지갑에 라이선스 토큰 전송 확인
- ✅ 블록 탐색기에서 트랜잭션 확인

### 6. 로열티 청구 확인
- ✅ Royalties 페이지에서 로열티 정보 확인
- ✅ 청구 후 지갑 잔액 증가 확인

---

## 🛠️ 문제 해결

### 꿈이 사라진 경우

**원인:**
1. MongoDB 연결 문제
2. 데이터베이스가 비어있음
3. 필터링 로직 문제

**해결 방법:**

1. **MongoDB 연결 확인**
   ```bash
   bun run scripts/test-mongodb.ts
   ```

2. **데이터 확인**
   ```bash
   bun run scripts/init-db.ts
   ```

3. **데이터 마이그레이션** (필요시)
   ```bash
   bun run scripts/migrate-to-mongodb.ts
   ```

4. **API 응답 확인**
   - 브라우저 개발자 도구 → Network 탭
   - `/api/dreams` 요청 확인
   - 응답 데이터 확인

---

### NFT 민팅 실패

**원인:**
1. 지갑 미연결
2. 가스비 부족
3. SPG NFT Contract 권한 문제

**해결 방법:**
1. 지갑 연결 확인
2. Faucet에서 IP 토큰 받기
3. 자신의 NFT 컬렉션 사용:
   ```bash
   bun run scripts/create-nft-collection.ts
   ```

---

### 라이선스 설정 실패

**원인:**
1. IP Asset 미등록
2. 소유자가 아님
3. 트랜잭션 실패

**해결 방법:**
1. 먼저 NFT 민팅 완료 확인
2. 지갑 주소가 소유자인지 확인
3. 트랜잭션 에러 메시지 확인

---

## 📚 관련 문서

- `STORY_PROTOCOL_GUIDE.md`: Story Protocol 상세 가이드
- `STORY_SDK_USAGE.md`: Story SDK 사용법
- `AENEID_TESTNET_SETUP.md`: Aeneid Testnet 설정
- `MONGODB_SETUP_KO.md`: MongoDB 설정 가이드

---

## 🎉 완료!

이제 생성자가 꿈을 입력해서 NFT 민팅하고 라이선스를 부여하는 전체 플로우를 이해하셨습니다!

**핵심 포인트:**
1. ✅ 꿈 입력 → AI 처리 → NFT 민팅 (자동화)
2. ✅ 라이선스 조건 설정 (소유자)
3. ✅ 라이선스 구매 (스튜디오)
4. ✅ 로열티 청구 (소유자)

**다음 단계:**
- 실제로 꿈을 입력하고 테스트해보세요!
- Market 페이지에서 다른 Dream IP를 탐색해보세요!
- Royalties 페이지에서 로열티를 확인해보세요!

