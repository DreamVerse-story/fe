# 🎨 Dream IP NFT 컬렉션 생성 가이드

Story Protocol에 Dream IP를 등록하려면 **자신만의 NFT 컬렉션**이 필요합니다!

---

## ❌ 왜 에러가 발생했나요?

```
Error: Workflow__CallerNotAuthorizedToMint()
Contract: 0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37
```

**문제:** `0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37`는 **공개 테스트용 컨트랙트가 아닙니다!**

Aeneid Testnet에서는 테스트용 공개 NFT 컬렉션이 제공되지 않으므로, **자신만의 NFT 컬렉션을 생성**해야 합니다.

---

## ✅ 해결 방법

### 1단계: Private Key 준비

`.env.local` 파일에 지갑의 Private Key를 추가하세요:

```bash
# Story Protocol - NFT 컬렉션 생성용
STORY_PRIVATE_KEY=0x1234567890abcdef...  # 여러분의 Private Key
```

⚠️ **주의:**
- **테스트 전용 지갑**을 사용하세요!
- 메인 지갑의 Private Key를 절대 사용하지 마세요!
- Private Key는 절대 공개하거나 Git에 커밋하지 마세요!

---

### 2단계: 테스트 지갑 생성 (선택사항)

테스트용 새 지갑을 생성하려면:

```bash
# 테스트 지갑 생성
bun run scripts/generate-wallet.ts
```

출력 예시:
```
🔐 새로운 테스트 지갑 생성됨!

지갑 주소: 0x1234...5678
Private Key: 0xabcd...ef01

⚠️  이 Private Key를 .env.local 파일에 추가하세요:
STORY_PRIVATE_KEY=0xabcd...ef01
```

---

### 3단계: 테스트 토큰 받기

생성한 지갑 주소로 테스트 토큰을 받으세요:

1. [Story Faucet](https://faucet.story.foundation) 방문
2. 지갑 주소 입력
3. 5 IP 토큰 수령

**필요한 이유:**
- NFT 컬렉션 생성에 가스비가 필요합니다 (~0.01 IP)

---

### 4단계: NFT 컬렉션 생성

이제 자신만의 NFT 컬렉션을 생성하세요!

```bash
bun run scripts/create-nft-collection.ts
```

**예상 출력:**
```
🎨 Dream IP NFT 컬렉션 생성 시작...

📝 계정 주소: 0x1234...5678

🎨 NFT 컬렉션 생성 중...

✅ NFT 컬렉션 생성 완료!

📋 컬렉션 정보:
   - SPG NFT Contract: 0xabcd...ef01
   - Transaction Hash: 0x9876...5432
   - Block Explorer: https://aeneid.explorer.story.foundation/tx/0x9876...5432

✨ 이제 이 컨트랙트 주소를 환경 변수에 추가하세요:
   NEXT_PUBLIC_SPG_NFT_IMPL=0xabcd...ef01
```

---

### 5단계: 환경 변수 업데이트

`.env.local` 파일을 열고 생성된 컨트랙트 주소로 업데이트하세요:

```bash
# Story Protocol - Aeneid Testnet
NEXT_PUBLIC_STORY_RPC_URL=https://aeneid.storyrpc.io
NEXT_PUBLIC_SPG_NFT_IMPL=0xabcd...ef01  # ← 방금 생성한 주소로 변경!
NEXT_PUBLIC_PIL_LICENSE_TEMPLATE=0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316
NEXT_PUBLIC_IP_ASSET_REGISTRY=0x77319B4031e6eF1250907aa00018B8B1c67a244b
NEXT_PUBLIC_LICENSING_MODULE=0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f
NEXT_PUBLIC_REGISTRATION_WORKFLOWS=0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424
```

---

### 6단계: 개발 서버 재시작

환경 변수가 변경되었으니 개발 서버를 재시작하세요:

```bash
# Ctrl+C로 기존 서버 중지
bun run dev
```

---

## 🎉 완료!

이제 Dream IP를 Story Protocol에 등록할 수 있습니다!

### 테스트 방법:

1. ✅ 브라우저에서 `http://localhost:3000` 접속
2. ✅ Dream IP 생성
3. ✅ "Story Protocol 등록" 버튼 클릭
4. ✅ MetaMask에서 트랜잭션 승인
5. ✅ 등록 성공! 🎊

---

## 📋 생성된 NFT 컬렉션 정보

### 컬렉션 설정:
```typescript
{
  name: "Dream IP Collection",
  symbol: "DREAM",
  isPublicMinting: true,  // 누구나 민팅 가능
  mintOpen: true,          // 민팅 오픈
}
```

### 특징:
- ✅ **퍼블릭 민팅**: 누구나 이 컬렉션에서 NFT를 민팅할 수 있습니다
- ✅ **민팅 오픈**: 현재 민팅이 활성화되어 있습니다
- ✅ **Dream IP 전용**: Dream IP 등록에 최적화되어 있습니다

---

## 🔍 블록 탐색기에서 확인

생성된 NFT 컬렉션을 블록 탐색기에서 확인하세요:

```
https://aeneid.explorer.story.foundation/address/YOUR_SPG_NFT_CONTRACT
```

여기서 확인할 수 있는 것:
- 컨트랙트 정보
- 민팅된 NFT 목록
- 트랜잭션 내역

---

## 🐛 문제 해결

### Private Key 에러

**에러:**
```
❌ STORY_PRIVATE_KEY 환경 변수가 설정되지 않았습니다.
```

**해결:**
1. `.env.local` 파일에 `STORY_PRIVATE_KEY` 추가
2. `0x`로 시작하는 64자리 hex 문자열인지 확인
3. 따옴표 없이 입력

---

### 가스비 부족 에러

**에러:**
```
Error: insufficient funds for gas
```

**해결:**
1. [Story Faucet](https://faucet.story.foundation)에서 토큰 받기
2. 지갑 주소가 올바른지 확인
3. 잔액 확인: `https://aeneid.explorer.story.foundation/address/YOUR_ADDRESS`

---

### RPC 연결 에러

**에러:**
```
Error: Failed to fetch from RPC
```

**해결:**
1. 인터넷 연결 확인
2. RPC URL 확인: `https://aeneid.storyrpc.io`
3. Story Protocol 상태 확인: [Status Page](https://status.story.foundation)

---

## 🔒 보안 주의사항

### ⚠️ 중요한 보안 규칙:

1. **테스트 지갑만 사용하세요!**
   - 메인 지갑의 Private Key를 절대 사용하지 마세요
   - 소량의 테스트 토큰만 보관하세요

2. **Private Key를 절대 공유하지 마세요!**
   - Git에 커밋하지 마세요 (`.env.local`은 `.gitignore`에 포함)
   - Discord, Slack 등에 공유하지 마세요
   - 스크린샷을 찍을 때 가리세요

3. **`.env.local` 파일을 안전하게 보관하세요!**
   - 팀원과 공유할 때는 Private Key를 제거하세요
   - 각자 자신의 테스트 지갑을 생성하세요

---

## 📚 추가 정보

### NFT 컬렉션 설정 변경하기

나중에 컬렉션 설정을 변경하려면:

```typescript
// isPublicMinting: 민팅 권한
// - true: 누구나 민팅 가능
// - false: 소유자만 민팅 가능

// mintOpen: 민팅 활성화 상태
// - true: 민팅 가능
// - false: 민팅 중지

// mintFeeRecipient: 민팅 수수료 수령자
// - 수수료를 받을 지갑 주소
```

### 여러 NFT 컬렉션 생성하기

프로젝트별로 다른 NFT 컬렉션을 만들 수 있습니다:

```bash
# 프로젝트 1용
bun run scripts/create-nft-collection.ts
# → 0xaaaa...aaaa

# 프로젝트 2용
bun run scripts/create-nft-collection.ts
# → 0xbbbb...bbbb
```

환경 변수에서 원하는 컬렉션을 선택하세요.

---

## 🎉 다음 단계

NFT 컬렉션 생성이 완료되었다면:

1. ✅ `.env.local`에 컨트랙트 주소 추가
2. ✅ 개발 서버 재시작
3. ✅ Dream IP 생성 및 등록 테스트
4. ✅ 블록 탐색기에서 확인

---

## 📖 관련 문서

- `AENEID_TESTNET_CORRECT_SETTINGS.md`: Aeneid Testnet 설정
- `WALLET_DIRECT_REGISTRATION.md`: 지갑 직접 등록 방식
- `ENV_SETUP_GUIDE.md`: 환경 변수 설정 가이드
- [Story Protocol Docs](https://docs.story.foundation)

---

**마지막 업데이트: 2024**
**테스트넷: Aeneid (Chain ID: 1315)**

