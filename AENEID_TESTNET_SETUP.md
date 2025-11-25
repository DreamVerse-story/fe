# 🌐 Aeneid Testnet 설정 가이드

Story Protocol의 최신 테스트넷인 **Aeneid**를 사용하기 위한 설정 가이드입니다.

---

## ⚠️ 중요: Iliad → Aeneid 마이그레이션

Story Protocol은 **Iliad Testnet**에서 **Aeneid Testnet**으로 업그레이드되었습니다.

### 주요 변경 사항

| 항목 | Iliad (구버전) | Aeneid (신버전) |
|------|---------------|----------------|
| Chain ID | `iliad` (string) | `1516` (number) |
| RPC URL | `https://testnet.storyrpc.io` | `https://aeneid.storyrpc.io` |
| Explorer | - | `https://aeneid.explorer.story.foundation` |
| Native Token | IP | IP |

---

## 🔧 환경 변수 설정

### `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 복사하세요:

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Pinata (IPFS) Configuration
PINATA_JWT=your_pinata_jwt_here
PINATA_GATEWAY=gateway.pinata.cloud

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=dream-ip

# Flock AI API (선택사항)
FLOCK_API_KEY=your_flock_api_key_here

# Story Protocol (Client-side) - Aeneid Testnet
NEXT_PUBLIC_STORY_RPC_URL=https://aeneid.storyrpc.io
NEXT_PUBLIC_SPG_NFT_IMPL=0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37
NEXT_PUBLIC_PIL_LICENSE_TEMPLATE=0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316
NEXT_PUBLIC_IP_ASSET_REGISTRY=0x77319B4031e6eF1250907aa00018B8B1c67a244b
NEXT_PUBLIC_LICENSING_MODULE=0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f
NEXT_PUBLIC_REGISTRATION_WORKFLOWS=0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424

# WalletConnect (RainbowKit)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

---

## 🌐 Aeneid Testnet 네트워크 정보

### 네트워크 추가 (MetaMask)

1. MetaMask 열기
2. 네트워크 선택 → "네트워크 추가"
3. 아래 정보 입력:

```
네트워크 이름: Story Aeneid Testnet
RPC URL: https://aeneid.storyrpc.io
Chain ID: 1516
통화 기호: IP
블록 탐색기: https://aeneid.explorer.story.foundation
```

---

## 💰 테스트 토큰 받기

### Story Faucet

1. [Story Faucet](https://faucet.story.foundation) 방문
2. 지갑 주소 입력
3. "Request Tokens" 클릭
4. 5 IP 토큰 수령 (하루 1회 제한)

### 확인 방법

```bash
# 지갑에서 직접 확인
# 또는 블록 탐색기에서 확인
https://aeneid.explorer.story.foundation/address/YOUR_WALLET_ADDRESS
```

---

## 🔗 Aeneid Testnet Contract 주소

### Core Protocol Contracts

```typescript
{
  "AccessController": "0xcCF37d0a503Ee1D4C11208672e622ed3DFB2275a",
  "IPAssetRegistry": "0x77319B4031e6eF1250907aa00018B8B1c67a244b",
  "LicensingModule": "0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f",
  "PILicenseTemplate": "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316",
  "RoyaltyModule": "0xD2f60c40fEbccf6311f8B47c4f2Ec6b040400086",
  "DisputeModule": "0x9b7A9c70AFF961C799110954fc06F3093aeb94C5"
}
```

### Periphery Contracts (우리가 사용)

```typescript
{
  "SPGNFTImpl": "0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37",
  "RegistrationWorkflows": "0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424",
  "DerivativeWorkflows": "0x9e2d496f72C547C2C535B167e06ED8729B374a4f",
  "LicenseAttachmentWorkflows": "0xcC2E862bCee5B6036Db0de6E06Ae87e524a79fd8",
  "RoyaltyWorkflows": "0x9515faE61E0c0447C6AC6dEe5628A2097aFE1890"
}
```

### Whitelisted Revenue Tokens

```typescript
{
  "WIP": "0x1514000000000000000000000000000000000000", // Wrapped IP
  "MERC20": "0xF2104833d386a2734a4eB3B8ad6FC6812F29E38E" // Test ERC20
}
```

---

## 🔍 코드에서 Chain ID 설정

### 올바른 설정 ✅

```typescript
// lib/blockchain/story-client.ts
const config: StoryConfig = {
    account: walletAccount,
    transport: http('https://aeneid.storyrpc.io'),
    chainId: 1516, // 숫자로 설정!
};
```

### 잘못된 설정 ❌

```typescript
// ❌ 문자열로 설정하면 에러 발생
const config: StoryConfig = {
    account: walletAccount,
    transport: http('https://aeneid.storyrpc.io'),
    chainId: 'aeneid', // Error: ChainId undefined not supported
};
```

---

## 🧪 테스트 방법

### 1. 개발 서버 실행
```bash
bun run dev
```

### 2. 브라우저에서 확인
```
http://localhost:3000
```

### 3. 지갑 연결 테스트
- 헤더의 "Connect Wallet" 버튼 클릭
- MetaMask 선택
- Aeneid Testnet으로 자동 전환 확인
- 잔액 표시 확인 (예: "5.00 IP")

### 4. Dream IP 등록 테스트
- Dream IP 생성
- "Story Protocol 등록" 버튼 클릭
- MetaMask 팝업에서 트랜잭션 승인
- 블록 탐색기에서 확인

---

## 🐛 문제 해결

### Chain ID 에러

**에러 메시지:**
```
Error: ChainId undefined not supported
```

**해결 방법:**
1. `.env.local` 파일 확인
2. `NEXT_PUBLIC_STORY_RPC_URL`이 설정되어 있는지 확인
3. 개발 서버 재시작: `bun run dev`

---

### RPC 연결 실패

**에러 메시지:**
```
Error: Failed to fetch from RPC
```

**해결 방법:**
1. RPC URL 확인: `https://aeneid.storyrpc.io`
2. 인터넷 연결 확인
3. Story Protocol 상태 확인: [Status Page](https://status.story.foundation)

---

### 지갑 연결 실패

**에러 메시지:**
```
Error: Chain not found
```

**해결 방법:**
1. MetaMask에 Aeneid Testnet 추가 (위 "네트워크 추가" 참고)
2. 또는 자동으로 네트워크 추가 승인

---

### 잔액 표시 오류

**증상:**
- "NaN IP" 표시
- 잔액이 0으로 표시

**해결 방법:**
1. Faucet에서 토큰 받기
2. 브라우저 캐시 삭제
3. 페이지 새로고침

---

## 📚 참고 자료

### 공식 문서
- [Story Protocol Docs](https://docs.story.foundation)
- [Aeneid Testnet Info](https://docs.story.foundation/docs/aeneid-testnet)
- [Deployed Contracts](https://docs.story.foundation/developers/deployed-smart-contracts)

### 유용한 링크
- [Aeneid Block Explorer](https://aeneid.explorer.story.foundation)
- [Story Faucet](https://faucet.story.foundation)
- [Story Protocol Discord](https://discord.gg/storyprotocol)
- [Story Protocol GitHub](https://github.com/storyprotocol)

---

## 🎉 다음 단계

Aeneid Testnet 설정이 완료되었다면:

1. ✅ Dream IP 생성
2. ✅ Story Protocol 등록
3. ✅ 블록 탐색기에서 확인
4. 🚀 License Terms 추가
5. 🚀 Derivative (파생 작품) 등록
6. 🚀 Royalty 관리

더 많은 기능은 `STORY_SDK_USAGE.md` 문서를 참고하세요!

