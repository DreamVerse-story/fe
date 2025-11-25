## Story Protocol 통합 가이드

Dream IP를 Story Protocol 블록체인에 등록하고 라이선스를 관리하는 기능이 구현되었습니다.

---

## 🎯 Story Protocol이란?

Story Protocol은 **지적 재산권(IP) 자산을 온체인으로 관리**하는 블록체인 프로토콜입니다.

### 주요 기능

1. **IP 자산 등록**: 창작물을 블록체인에 등록하여 소유권 증명
2. **라이선스 관리**: 맞춤형 라이선스 조건 생성 및 토큰 발행
3. **로열티 분배**: 자동화된 수익 분배 시스템
4. **파생 작품 추적**: 원작과 2차 창작물 간의 관계 추적
5. **분쟁 해결**: 온체인 거버넌스를 통한 IP 분쟁 해결

---

## 📁 구현된 파일 구조

```
lib/
├── blockchain/
│   ├── story-client.ts          # Story Protocol SDK 클라이언트
│   └── story-protocol.ts        # IP 등록, 라이선스, 로열티 관리
├── storage/
│   └── ipfs-metadata.ts         # 메타데이터 IPFS 업로드
app/api/story/
├── register/route.ts            # POST - IP 등록
├── license/route.ts             # POST/PUT - 라이선스 관리
├── royalty/route.ts             # POST - 로열티 클레임
└── info/route.ts                # GET - IP 정보 조회
```

---

## 🚀 설치 및 설정

### 1. 패키지 설치

```bash
bun install @story-protocol/core-sdk ethers viem
```

### 2. 환경 변수 설정

`.env.local` 파일에 추가:

```bash
# Story Protocol
STORY_PRIVATE_KEY=0x...  # 서버 지갑 Private Key (⚠️ 절대 커밋하지 말것!)
STORY_NETWORK=iliad      # 'iliad' (testnet) or 'mainnet'
STORY_RPC_URL=https://testnet.storyrpc.io
STORY_NFT_CONTRACT=0x...  # NFT 컨트랙트 주소
STORY_LICENSE_TEMPLATE=0x...  # 라이선스 템플릿 주소

# 기존 환경 변수들
MONGODB_URI=mongodb://localhost:27017
PINATA_JWT=your_pinata_jwt_here
OPENAI_API_KEY=your_openai_key_here
```

### 3. 테스트넷 설정

#### Iliad Testnet (개발용)

-   **Network**: iliad
-   **Chain ID**: 1513
-   **RPC URL**: https://testnet.storyrpc.io
-   **Explorer**: https://testnet.storyscan.xyz

#### 테스트 토큰 받기

1. https://faucet.story.foundation 방문
2. 지갑 주소 입력
3. 테스트 IP 토큰 받기

---

## 💡 사용 방법

### 1. Dream IP를 Story Protocol에 등록

```typescript
// API 호출
const response = await fetch('/api/story/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        dreamId: 'dream-uuid',
        walletAddress: '0xYourWalletAddress',
    }),
});

const result = await response.json();
console.log('IP Asset ID:', result.data.ipAssetId);
console.log('IPFS CID:', result.data.ipfsCid);
console.log('Tx Hash:', result.data.txHash);
```

### 2. 라이선스 조건 설정

```typescript
// 라이선스 조건 설정
const response = await fetch('/api/story/license', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        ipAssetId: '0x...',
        commercialUse: true, // 상업적 사용 허용
        commercialRevShare: 10, // 상업적 수익 분배 10%
        derivativesAllowed: true, // 파생 작품 허용
        derivativesRevShare: 5, // 파생 작품 수익 분배 5%
        currency: '0x...ETH', // 결제 통화
        price: '1000000000000000000', // 1 ETH (wei 단위)
    }),
});
```

### 3. 라이선스 토큰 발행

```typescript
// 구매자에게 라이선스 토큰 발행
const response = await fetch('/api/story/license', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        ipAssetId: '0x...',
        amount: 1,
        receiverAddress: '0xBuyerAddress',
    }),
});
```

### 4. IP Asset 정보 조회

```typescript
// IP Asset 정보 확인
const response = await fetch(
    '/api/story/info?ipAssetId=0x...'
);
const data = await response.json();

console.log('IP Owner:', data.data.owner);
console.log('Metadata URI:', data.data.metadataURI);
console.log('License Count:', data.data.licenseCount);
```

### 5. 로열티 클레임

```typescript
// 로열티 청구
const response = await fetch('/api/story/royalty', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        ipAssetId: '0x...',
        snapshotIds: ['1', '2', '3'],
    }),
});
```

---

## 🔗 Dream IP 등록 플로우

```typescript
// 전체 플로우 예시
async function registerDreamAsIP(
    dreamId: string,
    walletAddress: string
) {
    // 1. Dream IP 완료 확인
    const dream = await getDreamById(dreamId);
    if (dream.status !== 'completed') {
        throw new Error(
            'Dream IP가 아직 완료되지 않았습니다.'
        );
    }

    // 2. Story Protocol에 등록
    const registerResult = await fetch(
        '/api/story/register',
        {
            method: 'POST',
            body: JSON.stringify({
                dreamId,
                walletAddress,
            }),
        }
    );
    const { ipAssetId, ipfsCid } =
        await registerResult.json();

    // 3. 라이선스 조건 설정
    await fetch('/api/story/license', {
        method: 'POST',
        body: JSON.stringify({
            ipAssetId,
            commercialUse: true,
            commercialRevShare: 10, // Dream Creator가 10% 받음
            derivativesAllowed: true,
            derivativesRevShare: 5,
            currency: ETH_ADDRESS,
            price: '100000000000000000', // 0.1 ETH
        }),
    });

    // 4. 완료!
    console.log(
        'Dream IP가 Story Protocol에 등록되었습니다!'
    );
    console.log('IP Asset ID:', ipAssetId);
    console.log(
        'Explorer:',
        `https://testnet.storyscan.xyz/ipa/${ipAssetId}`
    );
}
```

---

## 📊 데이터 모델

### DreamIPPackage (MongoDB)

```typescript
{
  id: "dream-uuid",
  // ... 기존 필드들 ...

  // Story Protocol 관련 (Phase 2)
  ipfsCid?: "QmXXXXXX",        // IPFS CID
  ipAssetId?: "0x...",          // Story Protocol IP Asset ID
  licenseTermsId?: "1",         // 라이선스 조건 ID
  status: "registered",         // 등록 완료 상태
}
```

### DreamIPMetadata (IPFS)

```typescript
{
  version: "1.0",
  dreamHash: "sha256-hash",     // 원천성 증명
  title: "꿈 제목",
  summary: "꿈 요약",
  genres: ["SF", "판타지"],
  tones: ["몽환적", "웅장함"],
  characters: ["캐릭터1", "캐릭터2"],
  world: "세계관",
  visualsUrls: ["ipfs://...", "ipfs://..."],  // 이미지 URL들
  storyContentUrl: "ipfs://...",              // 스토리 컨텐츠
  createdAt: "2025-01-01T00:00:00.000Z"
}
```

---

## 🎯 라이선스 모델

### Standard Dream IP License

```typescript
{
  commercialUse: true,          // 상업적 사용 허용
  commercialRevShare: 10,       // Dream Creator가 10% 로열티
  derivativesAllowed: true,     // 2차 창작 허용
  derivativesRevShare: 5,       // 2차 창작에서 5% 로열티
  currency: ETH_ADDRESS,        // ETH로 결제
  price: 0.1 ETH                // 라이선스 가격
}
```

### 사용 사례

1. **스튜디오가 영화 제작 권리 구매**

    - 0.1 ETH 지불
    - 라이선스 토큰 획득
    - 영화 수익의 10%를 Dream Creator에게 분배

2. **게임 개발자가 캐릭터 사용**

    - 0.1 ETH 지불
    - 게임에 캐릭터 사용
    - 게임 수익의 10%를 Dream Creator에게 분배

3. **웹툰 작가가 2차 창작**
    - 0.1 ETH 지불
    - 웹툰 제작
    - 웹툰 수익의 5%를 원작자에게 분배

---

## 🔧 코드 예시

### lib/blockchain/story-protocol.ts

```typescript
// Dream IP 등록
export async function registerDreamIP(
    dreamId: string,
    ownerAddress: string
): Promise<RegisterDreamResult> {
    // 1. Dream 조회
    const dream = await getDreamById(dreamId);

    // 2. IPFS 업로드
    const ipfsCid = await uploadToIPFS(dream);

    // 3. Story Protocol 등록
    const client = getStoryClient();
    const response = await client.ipAsset.register({
        nftContract: NFT_CONTRACT,
        tokenId: BigInt(Date.now()),
        metadata: {
            metadataURI: `ipfs://${ipfsCid}`,
            metadataHash: dream.dreamHash,
        },
    });

    // 4. MongoDB 업데이트
    await saveDream({
        ...dream,
        ipfsCid,
        ipAssetId: response.ipId,
    });

    return {
        ipAssetId: response.ipId,
        ipfsCid,
        txHash: response.txHash,
    };
}
```

---

## 🚨 주의사항

### 1. Private Key 보안

```bash
# ⚠️ 절대 Git에 커밋하지 말것!
STORY_PRIVATE_KEY=0x...

# .gitignore에 추가 확인
.env.local
.env
```

### 2. 가스비 관리

-   Testnet: 무료 (Faucet 사용)
-   Mainnet: 실제 ETH 필요
-   트랜잭션마다 가스비 발생

### 3. 비동기 처리

```typescript
// IP 등록은 시간이 걸림 (블록 confirmation)
// 사용자에게 진행 상태 알림 필요
const result = await registerDreamIP(dreamId, wallet);
// → 30초~1분 소요 가능
```

### 4. 에러 처리

```typescript
try {
    await registerDreamIP(dreamId, wallet);
} catch (error) {
    if (error.message.includes('insufficient funds')) {
        // 가스비 부족
    } else if (
        error.message.includes('already registered')
    ) {
        // 이미 등록됨
    }
}
```

---

## 📚 참고 자료

### Story Protocol 공식 문서

-   공식 사이트: https://www.story.foundation
-   SDK 문서: https://docs.story.foundation
-   GitHub: https://github.com/storyprotocol/protocol-core
-   Explorer: https://testnet.storyscan.xyz

### 추가 리소스

-   Discord: https://discord.gg/storyprotocol
-   Twitter: @storyprotocol
-   Medium: https://medium.com/@storyprotocol

---

## ✨ 요약

✅ **Story Protocol SDK 완전 통합**

-   IP Asset 등록
-   라이선스 관리
-   로열티 분배
-   파생 작품 추적

✅ **API 엔드포인트**

-   `POST /api/story/register` - IP 등록
-   `POST /api/story/license` - 라이선스 설정
-   `PUT /api/story/license` - 라이선스 발행
-   `POST /api/story/royalty` - 로열티 클레임
-   `GET /api/story/info` - IP 정보 조회

✅ **IPFS 통합**

-   메타데이터 영구 저장
-   탈중앙화 스토리지

✅ **MongoDB 연동**

-   ipfsCid, ipAssetId 저장
-   블록체인 ↔ DB 동기화

→ **Dream IP를 실제로 거래 가능한 블록체인 자산으로!** 🚀
