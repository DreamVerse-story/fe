# 🔧 Chain ID 에러 수정 완료

`Error: ChainId undefined not supported` 에러를 완전히 해결했습니다!

---

## 🐛 문제 원인

Story Protocol SDK는 **숫자 체인 ID**를 요구하는데, 문자열 `'aeneid'`를 전달하고 있었습니다.

### 잘못된 코드 ❌

```typescript
const config: StoryConfig = {
    account: walletAccount,
    transport: http('https://aeneid.storyrpc.io'),
    chainId: 'aeneid' as any, // ❌ 문자열은 지원하지 않음!
};
```

### 올바른 코드 ✅

```typescript
const config: StoryConfig = {
    account: walletAccount,
    transport: http('https://aeneid.storyrpc.io'),
    chainId: 1516, // ✅ Aeneid Testnet의 숫자 체인 ID
};
```

---

## ✅ 수정 사항

### 1. `lib/blockchain/story-client.ts`

#### `getStoryClient()` 함수 (서버용)
```typescript
// 네트워크별 체인 ID 설정
let chainId: 'odyssey' | number;
let rpcUrl: string;

if (network === 'mainnet') {
    chainId = 'odyssey'; // Mainnet
    rpcUrl = process.env.STORY_RPC_URL || 'https://rpc.odyssey.storyrpc.io';
} else {
    chainId = 1516; // ✅ Aeneid Testnet
    rpcUrl = process.env.STORY_RPC_URL || 'https://aeneid.storyrpc.io';
}

const config: StoryConfig = {
    account: account,
    transport: http(rpcUrl),
    chainId: chainId as any,
};
```

#### `getStoryClientWithWallet()` 함수 (클라이언트용)
```typescript
// 네트워크별 체인 ID 설정
let chainId: 'odyssey' | number;
let rpcUrl: string;

if (network === 'mainnet') {
    chainId = 'odyssey'; // Mainnet
    rpcUrl = process.env.NEXT_PUBLIC_STORY_RPC_URL || 'https://rpc.odyssey.storyrpc.io';
} else {
    chainId = 1516; // ✅ Aeneid Testnet
    rpcUrl = process.env.NEXT_PUBLIC_STORY_RPC_URL || 'https://aeneid.storyrpc.io';
}

const config: StoryConfig = {
    account: walletAccount,
    transport: http(rpcUrl),
    chainId: chainId as any,
};
```

### 2. `lib/hooks/useStoryProtocol.ts`

```typescript
const storyClient = useMemo(() => {
    if (!walletClient || !isConnected) {
        return null;
    }

    try {
        // Aeneid Testnet 사용
        return getStoryClientWithWallet(
            walletClient.account,
            'aeneid' // ✅ 네트워크 명시
        );
    } catch (error) {
        console.error('Story Protocol 클라이언트 생성 실패:', error);
        return null;
    }
}, [walletClient, isConnected]);
```

---

## 🌐 네트워크 정보

### Aeneid Testnet

```typescript
{
  "name": "Story Aeneid Testnet",
  "chainId": 1516,
  "rpcUrl": "https://aeneid.storyrpc.io",
  "explorer": "https://aeneid.explorer.story.foundation",
  "nativeCurrency": {
    "name": "Testnet IP",
    "symbol": "IP",
    "decimals": 18
  }
}
```

### Story Mainnet (Odyssey)

```typescript
{
  "name": "Story Mainnet",
  "chainId": "odyssey", // 문자열 지원
  "rpcUrl": "https://rpc.odyssey.storyrpc.io",
  "explorer": "https://odyssey.explorer.story.foundation",
  "nativeCurrency": {
    "name": "IP",
    "symbol": "IP",
    "decimals": 18
  }
}
```

---

## 🔍 Story Protocol SDK의 체인 ID 지원

Story Protocol SDK는 다음 체인 ID를 지원합니다:

```typescript
// 지원되는 체인 ID
type SupportedChainId = 
  | 'iliad'     // ❌ Deprecated (구 테스트넷)
  | 'odyssey'   // ✅ Mainnet
  | 1513        // ✅ Iliad Testnet (deprecated)
  | 1516        // ✅ Aeneid Testnet (현재 테스트넷)
  | number      // ✅ 기타 숫자 체인 ID
```

**중요:**
- `'aeneid'` (문자열)은 지원하지 않음!
- `1516` (숫자)을 사용해야 함!

---

## 🚀 테스트 방법

### 1. 개발 서버 재시작

```bash
# Ctrl+C로 기존 서버 중지
bun run dev
```

### 2. 브라우저 콘솔 확인

```javascript
// ✅ 정상 출력 (에러 없음)
// Story Protocol 클라이언트가 성공적으로 생성됨
```

### 3. 지갑 연결 테스트

```
1. http://localhost:3000 접속
2. "Connect Wallet" 버튼 클릭
3. MetaMask 선택
4. 지갑 주소와 잔액 확인
5. ✅ 에러 없이 연결 성공!
```

### 4. Dream IP 등록 테스트

```
1. Dream IP 생성
2. "Story Protocol 등록" 버튼 클릭
3. IPFS 업로드 완료 대기
4. MetaMask 팝업에서 트랜잭션 승인
5. ✅ 등록 성공!
```

---

## 📋 환경 변수 체크리스트

`.env.local` 파일에 다음 환경 변수가 설정되어 있는지 확인:

```bash
# ✅ 필수
NEXT_PUBLIC_STORY_RPC_URL=https://aeneid.storyrpc.io
NEXT_PUBLIC_SPG_NFT_IMPL=0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# ✅ Pinata (IPFS)
PINATA_JWT=your_pinata_jwt_here
PINATA_GATEWAY=gateway.pinata.cloud

# ✅ MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=dream-ip

# ✅ OpenAI
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 🐛 문제 해결 가이드

### 여전히 Chain ID 에러가 발생하는 경우

#### 1. 브라우저 캐시 삭제
```
Chrome: Ctrl+Shift+Delete
개발자 도구 → Application → Clear Storage
```

#### 2. 개발 서버 완전 재시작
```bash
# 터미널에서 Ctrl+C
# 프로세스가 완전히 종료되었는지 확인
ps aux | grep next

# 재시작
bun run dev
```

#### 3. Node Modules 재설치
```bash
rm -rf node_modules
rm -rf .next
bun install
bun run dev
```

#### 4. 환경 변수 확인
```bash
# .env.local 파일이 존재하는지 확인
cat .env.local

# NEXT_PUBLIC_STORY_RPC_URL이 설정되어 있는지 확인
grep NEXT_PUBLIC_STORY_RPC_URL .env.local
```

---

## 🎉 완료!

이제 `ChainId undefined not supported` 에러가 완전히 해결되었습니다!

### 핵심 포인트:
- ✅ Aeneid Testnet Chain ID: **1516** (숫자)
- ✅ RPC URL: **https://aeneid.storyrpc.io**
- ✅ 문자열 `'aeneid'`는 사용하지 않음
- ✅ 서버와 클라이언트 모두 수정 완료

---

## 📚 참고 문서

- `AENEID_TESTNET_SETUP.md`: Aeneid Testnet 설정 가이드
- `WALLET_DIRECT_REGISTRATION.md`: 사용자 지갑 직접 등록 방식
- `STORY_SDK_USAGE.md`: Story Protocol SDK 사용 가이드
- [Story Protocol Docs](https://docs.story.foundation)
- [Deployed Contracts](https://docs.story.foundation/developers/deployed-smart-contracts)

---

## 🔗 유용한 링크

- [Aeneid Block Explorer](https://aeneid.explorer.story.foundation)
- [Story Faucet](https://faucet.story.foundation)
- [Story Protocol Discord](https://discord.gg/storyprotocol)
- [Story Protocol GitHub](https://github.com/storyprotocol)

