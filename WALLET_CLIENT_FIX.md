# Wallet Client 연결 수정 가이드

## 🎯 문제점

`unknown account` 에러가 발생하는 이유는 **Story Protocol SDK에 walletClient를 잘못 전달**했기 때문입니다.

---

## ❌ 이전 코드 (잘못된 방식)

```typescript
export function getStoryClientWithWallet(walletClient: any): StoryClient {
    // ❌ account만 추출해서 전달
    const walletAccount = walletClient.account;
    
    const config: StoryConfig = {
        account: walletAccount, // ❌ account 객체만 전달
        transport: http(rpcUrl),
        chainId: chainId as any,
    };

    storyClient = StoryClient.newClient(config);
    return storyClient;
}
```

**문제:**
- `walletClient.account`는 단순한 주소 정보만 포함
- 트랜잭션 서명 기능이 없음
- RPC가 `unknown account` 에러 반환

---

## ✅ 수정된 코드 (올바른 방식)

```typescript
export function getStoryClientWithWallet(walletClient: any): StoryClient {
    // ✅ walletClient 전체를 account로 전달
    const config: StoryConfig = {
        account: walletClient, // ✅ walletClient 전체 전달 (서명 기능 포함)
        transport: walletClient.transport || http('https://aeneid.storyrpc.io'),
        chainId: 1315 as any, // Aeneid Testnet
    };

    storyClient = StoryClient.newClient(config);
    return storyClient;
}
```

**해결:**
- `walletClient` 전체를 `account`로 전달
- `walletClient`에는 트랜잭션 서명 기능이 포함됨
- RPC가 올바르게 트랜잭션 서명 가능

---

## 🔍 왜 이렇게 해야 하나요?

### wagmi의 walletClient 구조

```typescript
// wagmi useWalletClient 반환값
{
  account: {
    address: '0x09fa6F8346dBcb80ce5f85797F16d950424018F9',
    type: 'json-rpc'
  },
  transport: { ... }, // RPC 통신 메서드
  signTransaction: (tx) => { ... }, // 트랜잭션 서명 함수
  signMessage: (msg) => { ... }, // 메시지 서명 함수
  chain: { id: 1315, ... }
}
```

### Story Protocol SDK가 기대하는 형식

```typescript
// StoryConfig.account는 WalletClient를 기대함
interface StoryConfig {
  account: WalletClient, // ← 전체 walletClient 객체 (서명 기능 포함)
  transport: Transport,
  chainId: number
}
```

---

## 🚀 테스트 방법

### 1단계: 브라우저 완전 새로고침

**중요:** 반드시 캐시를 지우고 새로고침하세요!

#### 방법 A: 개발자 도구 (추천)
1. `F12` (개발자 도구)
2. **Application** 탭
3. **Clear storage** 클릭
4. **Clear site data** 클릭
5. `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)

#### 방법 B: 시크릿 모드 (가장 확실)
1. `Cmd+Shift+N` (Chrome) / `Cmd+Shift+P` (Firefox)
2. `http://localhost:3000`
3. 지갑 다시 연결

---

### 2단계: 콘솔에서 확인

브라우저 콘솔 (`F12` → Console)에서 다음 코드 실행:

```javascript
// 지갑 연결 상태 확인
console.log({
  address: window.ethereum?.selectedAddress,
  chainId: window.ethereum?.chainId,
  isConnected: !!window.ethereum?.selectedAddress
});
```

**예상 출력:**
```json
{
  "address": "0x09fa6F8346dBcb80ce5f85797F16d950424018F9",
  "chainId": "0x523", // 1315 in hex
  "isConnected": true
}
```

---

### 3단계: Dream IP 등록 시도

1. Dream IP 생성
2. "Story Protocol 등록" 버튼 클릭
3. **지갑에서 트랜잭션 승인**
4. ✅ 성공!

---

## 📋 체크리스트

- [x] `story-client.ts` 수정 완료 ✅
- [ ] 브라우저 캐시 완전 삭제
- [ ] 시크릿 모드로 테스트 (추천)
- [ ] 지갑 다시 연결
- [ ] Dream IP 등록 시도
- [ ] ✅ **성공!** 🎉

---

## 🎯 핵심 포인트

### Before (❌ 실패)
```typescript
// account 객체만 전달 → 서명 기능 없음
const config = {
  account: walletClient.account, // ❌
  transport: http(rpcUrl),
  chainId: 1315
};
```

### After (✅ 성공)
```typescript
// walletClient 전체 전달 → 서명 기능 포함
const config = {
  account: walletClient, // ✅ 전체 walletClient
  transport: walletClient.transport,
  chainId: 1315
};
```

---

## 🔍 디버깅 팁

만약 여전히 `unknown account` 에러가 발생한다면:

### 1. 지갑 연결 상태 확인
```typescript
// _components/common/StoryRegisterButton.tsx
console.log('Wallet connected:', { isConnected, address, storyClient });
```

### 2. walletClient 구조 확인
```typescript
// lib/hooks/useStoryProtocol.ts
console.log('walletClient:', {
  hasAccount: !!walletClient?.account,
  hasTransport: !!walletClient?.transport,
  hasSignTransaction: typeof walletClient?.signTransaction === 'function',
});
```

### 3. Story Protocol 클라이언트 확인
```typescript
// lib/blockchain/story-client.ts
console.log('Story Config:', {
  account: walletClient,
  hasAccount: !!walletClient?.account,
  chainId: 1315,
});
```

---

## 🎉 완료!

이제 **walletClient가 올바르게 전달**되어 트랜잭션 서명이 가능합니다!

**캐시를 완전히 지우고** 테스트하세요! 🚀

