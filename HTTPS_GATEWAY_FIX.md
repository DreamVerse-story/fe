# HTTPS Gateway URL 수정 가이드

## 🎯 문제점

Story Protocol은 `ipfs://` 프로토콜 대신 **HTTPS Gateway URL**을 사용해야 합니다!

### ❌ 잘못된 방식
```typescript
ipMetadataURI: "ipfs://bafkrei..."
nftMetadataURI: "ipfs://bafkrei..."
```

### ✅ 올바른 방식 (성공한 예시)
```typescript
ipMetadataURI: "https://gateway.pinata.cloud/ipfs/QmfATrfirbTr4tAb89DuUDBk5aBkTNbMKncxJCskxTB6We"
nftMetadataURI: "https://gateway.pinata.cloud/ipfs/QmSJGUQGqebnWtpp38bc5ccdFiLpXTMvu3qnvc4fCr5soc"
```

---

## 🛠️ 수정 사항

### 1. 환경 변수 추가

`.env.local` 파일에 다음 라인을 추가하세요:

```bash
NEXT_PUBLIC_PINATA_GATEWAY=gateway.pinata.cloud
```

**전체 IPFS 설정:**
```bash
# Pinata (IPFS) Configuration
PINATA_JWT=your_pinata_jwt_here
PINATA_GATEWAY=gateway.pinata.cloud
NEXT_PUBLIC_PINATA_GATEWAY=gateway.pinata.cloud  # ← 추가!
```

---

### 2. 코드 수정 완료

`_components/common/StoryRegisterButton.tsx`가 자동으로 수정되었습니다:

```typescript
// IPFS URL 생성 (HTTPS Gateway 사용 - Story Protocol 공식 방식)
const ipfsGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud';
const metadataUrl = `https://${ipfsGateway}/ipfs/${ipfsData.ipfsCid}`;

const response = await storyClient.ipAsset.registerIpAsset({
    nft: {
        type: 'mint',
        spgNftContract: process.env.NEXT_PUBLIC_SPG_NFT_IMPL as `0x${string}`,
    },
    ipMetadata: {
        ipMetadataURI: metadataUrl,  // ✅ HTTPS URL
        ipMetadataHash: dreamHashWithPrefix as `0x${string}`,
        nftMetadataURI: metadataUrl,  // ✅ HTTPS URL
        nftMetadataHash: dreamHashWithPrefix as `0x${string}`,
    },
    allowDuplicates: true,
});
```

---

## 🚀 테스트 방법

### 1단계: 환경 변수 확인

`.env.local` 파일을 열고 다음 라인이 있는지 확인:

```bash
NEXT_PUBLIC_PINATA_GATEWAY=gateway.pinata.cloud
```

없다면 **파일 맨 아래에 추가**하세요!

---

### 2단계: 개발 서버 재시작

```bash
# 기존 서버 중지 (Ctrl+C)
bun run dev
```

---

### 3단계: 브라우저 하드 리프레시

#### 방법 A: 개발자 도구 (추천)
1. `F12` 또는 `Cmd+Option+I` (개발자 도구 열기)
2. **Network 탭**으로 이동
3. **"Disable cache" 체크박스 활성화** ☑️
4. `Cmd+Shift+R` (Mac) 또는 `Ctrl+Shift+R` (Windows/Linux)

#### 방법 B: 시크릿 모드
1. `Cmd+Shift+N` (Chrome) 또는 `Cmd+Shift+P` (Firefox)
2. `http://localhost:3000` 접속
3. 지갑 다시 연결

---

### 4단계: Dream IP 등록 시도

1. Dream IP 생성
2. "Story Protocol 등록" 버튼 클릭
3. 지갑에서 트랜잭션 승인
4. ✅ 성공! 🎉

---

## 🔍 성공 확인

브라우저 개발자 도구 (Network 탭)에서 다음과 같은 요청을 확인할 수 있습니다:

```
Method: POST
URL: https://aeneid.storyrpc.io
Request Body:
  - spgNftContract: 0x39bA2c1398E53749EE4E7Df60Cca8e9D26383DD8
  - ipMetadataURI: https://gateway.pinata.cloud/ipfs/bafkrei...
  - nftMetadataURI: https://gateway.pinata.cloud/ipfs/bafkrei...
```

**✅ ipfs:// 대신 https:// 사용!**

---

## 📋 빠른 체크리스트

- [ ] `.env.local`에 `NEXT_PUBLIC_PINATA_GATEWAY=gateway.pinata.cloud` 추가
- [ ] 개발 서버 재시작 (`bun run dev`)
- [ ] 브라우저 하드 리프레시 (Disable cache 활성화)
- [ ] Dream IP 등록 재시도
- [ ] ✅ 성공!

---

## 🎉 완료!

이제 Story Protocol이 기대하는 **HTTPS Gateway URL** 형식으로 메타데이터를 전송합니다!

**성공한 트랜잭션 예시와 동일한 형식입니다!** 🚀

