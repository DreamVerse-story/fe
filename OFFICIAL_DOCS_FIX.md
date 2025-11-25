# 공식 문서 기반 수정 가이드

## 🎯 주요 변경 사항

공식 Story Protocol 문서를 참고하여 다음 사항들을 수정했습니다:

---

## 1. ✅ IPFS Gateway URL

### 변경 전 (Pinata Gateway)

```typescript
const ipfsGateway =
    process.env.NEXT_PUBLIC_PINATA_GATEWAY ||
    'gateway.pinata.cloud';
const metadataUrl = `https://${ipfsGateway}/ipfs/${ipfsData.ipfsCid}`;
```

### 변경 후 (공식 ipfs.io Gateway)

```typescript
const ipMetadataURI = `https://ipfs.io/ipfs/${ipfsData.ipfsCid}`;
const nftMetadataURI = `https://ipfs.io/ipfs/${ipfsData.ipfsCid}`;
```

**이유:** 공식 문서 예시가 `ipfs.io` Gateway를 사용하고 있습니다.

---

## 2. ✅ SPG NFT Contract 주소

### 변경 전

```bash
NEXT_PUBLIC_SPG_NFT_IMPL=0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37
```

### 변경 후 (공식 Aeneid Testnet 공개 컬렉션)

```bash
NEXT_PUBLIC_SPG_NFT_IMPL=0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc
```

**이유:** 공식 문서에서 Aeneid Testnet용으로 제공하는 공개 컬렉션 주소입니다.

---

## 3. ✅ 메타데이터 해시 생성

### 현재 방식 (유지)

```typescript
// dreamHash는 이미 SHA-256 hex 문자열 (32 bytes)
const ipMetadataHash = (
    dream.dreamHash.startsWith('0x')
        ? dream.dreamHash
        : `0x${dream.dreamHash}`
) as `0x${string}`;
```

**이유:**

-   공식 문서는 `crypto.createHash("sha256")`를 사용
-   우리는 이미 백엔드에서 SHA-256 해시를 생성하므로, `0x` 접두사만 추가

---

## 4. ✅ allowDuplicates 제거

### 변경 전

```typescript
const response = await storyClient.ipAsset.registerIpAsset({
    nft: { type: 'mint', spgNftContract: ... },
    ipMetadata: { ... },
    allowDuplicates: true, // ← 제거됨
});
```

### 변경 후

```typescript
const response = await storyClient.ipAsset.registerIpAsset({
    nft: { type: 'mint', spgNftContract: ... },
    ipMetadata: { ... },
});
```

**이유:** 공식 문서 예시에는 `allowDuplicates` 파라미터가 없습니다.

---

## 🚀 테스트 방법

### 1단계: `.env.local` 업데이트

`.env.local` 파일을 열고 다음 라인을 수정하세요:

```bash
# 공식 Aeneid Testnet 공개 컬렉션
NEXT_PUBLIC_SPG_NFT_IMPL=0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc
```

**옵션:** 자신만의 NFT 컬렉션을 생성하려면:

```bash
bun run scripts/create-nft-collection.ts
# 생성된 주소를 NEXT_PUBLIC_SPG_NFT_IMPL에 입력
```

---

### 2단계: 개발 서버 재시작

```bash
# Ctrl+C로 중지
bun run dev
```

---

### 3단계: 브라우저 하드 리프레시

#### 방법 A: 개발자 도구

1. `F12` (개발자 도구)
2. **Network** 탭
3. **☑️ Disable cache** 활성화
4. `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)

#### 방법 B: 시크릿 모드

-   `Cmd+Shift+N` (새 시크릿 창)
-   `http://localhost:3000`

---

### 4단계: Dream IP 등록 시도

1. Dream IP 생성
2. "Story Protocol 등록" 버튼 클릭
3. 지갑에서 트랜잭션 승인
4. ✅ 성공!

---

## 📋 공식 문서와의 비교

| 항목             | 공식 문서              | 현재 코드              | 상태 |
| ---------------- | ---------------------- | ---------------------- | ---- |
| IPFS Gateway     | `ipfs.io`              | `ipfs.io`              | ✅   |
| SPG NFT Contract | `0xc32A8a...`          | `0xc32A8a...`          | ✅   |
| 해시 형식        | `0x${hash}` (32 bytes) | `0x${hash}` (32 bytes) | ✅   |
| allowDuplicates  | 없음                   | 제거됨                 | ✅   |
| registerIpAsset  | `{ nft, ipMetadata }`  | `{ nft, ipMetadata }`  | ✅   |

---

## 🎉 완료!

이제 코드가 **공식 Story Protocol 문서와 100% 일치**합니다!

**참고 문서:**

-   [Register an NFT as an IP Asset](https://docs.story.foundation/docs/register-an-nft-as-an-ip-asset)
-   [TypeScript SDK Setup](https://docs.story.foundation/docs/typescript-sdk-setup)

---

## 🔍 주요 포인트

### 공개 컬렉션 vs 자신만의 컬렉션

#### 공개 컬렉션 (테스트용)

```bash
NEXT_PUBLIC_SPG_NFT_IMPL=0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc
```

-   ✅ 즉시 사용 가능
-   ✅ 가스비만 있으면 됨
-   ⚠️ 다른 사람도 사용 가능

#### 자신만의 컬렉션 (프로덕션용)

```bash
# scripts/create-nft-collection.ts 실행 후 생성된 주소
NEXT_PUBLIC_SPG_NFT_IMPL=0xYourOwnContract...
```

-   ✅ 본인만 민팅 가능
-   ✅ 커스터마이징 가능
-   ✅ 프로덕션 환경에 적합

---

## 🚨 중요 사항

### IPFS Gateway 선택

현재 `ipfs.io`를 사용하지만, 다음과 같은 대안도 가능합니다:

```typescript
// Option 1: ipfs.io (공식 문서)
const ipMetadataURI = `https://ipfs.io/ipfs/${cid}`;

// Option 2: gateway.pinata.cloud (더 빠를 수 있음)
const ipMetadataURI = `https://gateway.pinata.cloud/ipfs/${cid}`;

// Option 3: cloudflare-ipfs.com (CDN)
const ipMetadataURI = `https://cloudflare-ipfs.com/ipfs/${cid}`;
```

**권장:** 프로덕션에서는 Pinata 또는 Cloudflare Gateway를 사용하세요 (더 빠른 로딩).

---

성공하시길 바랍니다! 🚀
