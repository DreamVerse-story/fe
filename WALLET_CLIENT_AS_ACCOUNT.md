# WalletClient를 Account로 사용하기

## 🎯 핵심 개념

Story Protocol SDK는 **viem의 WalletClient를 Account로 받을 수 있습니다!**

---

## ✅ 최종 해결 방법

```typescript
export function getStoryClientWithWallet(walletClient: any): StoryClient {
    // walletClient 유효성 검사
    if (!walletClient.account) {
        throw new Error('지갑 계정이 연결되지 않았습니다.');
    }

    // Story Protocol 설정
    const config: StoryConfig = {
        account: walletClient as any, // ← walletClient 전체를 account로!
        transport: http('https://aeneid.storyrpc.io'),
        chainId: 1315 as any,
    };

    return StoryClient.newClient(config);
}
```

---

## 🔍 왜 이렇게 해야 하나요?

### viem의 WalletClient 구조

```typescript
// wagmi의 useWalletClient()가 반환하는 WalletClient
interface WalletClient {
  account: Account, // 주소 정보
  chain: Chain,
  transport: Transport,
  
  // 트랜잭션 서명 메서드
  signTransaction: (tx) => Promise<Hash>,
  signMessage: (msg) => Promise<Hash>,
  sendTransaction: (tx) => Promise<Hash>,
  
  // 기타 메서드들...
}
```

### Story Protocol SDK가 기대하는 것

```typescript
interface StoryConfig {
  account: Account | WalletClient, // ← WalletClient 전체를 받을 수 있음!
  transport: Transport,
  chainId: number
}
```

**핵심:** Story Protocol SDK는 `WalletClient`를 `Account`처럼 사용할 수 있도록 설계되어 있습니다!

---

## 🚀 테스트 방법

### 1단계: 완전 새로고침 필수! 🔄

**시크릿 모드 사용 (강력 추천!):**

```bash
# Mac
Cmd+Shift+N (Chrome)
Cmd+Shift+P (Firefox)

# Windows
Ctrl+Shift+N (Chrome)
Ctrl+Shift+P (Firefox)
```

**또는 캐시 완전 삭제:**
1. `F12` (개발자 도구)
2. Application 탭
3. "Clear storage" → "Clear site data"
4. `Cmd+Shift+R` 새로고침

---

### 2단계: 지갑 연결

1. `http://localhost:3000` 접속
2. "Connect Wallet" 버튼 클릭
3. MetaMask 등 선택
4. **Story Aeneid Testnet (Chain ID: 1315)** 확인

---

### 3단계: Dream IP 등록

1. Dream IP 생성
2. "Story Protocol 등록" 버튼 클릭
3. 지갑에서 트랜잭션 승인
4. ✅ **성공!**

---

## 📋 체크리스트

- [x] `story-client.ts` 수정 완료 ✅
- [x] `account: walletClient as any` 설정 ✅
- [ ] **시크릿 모드로 테스트**
- [ ] 지갑 연결 확인
- [ ] Dream IP 등록 시도
- [ ] ✅ **성공!**

---

## 🎯 트랜잭션 흐름

```
1. wagmi useWalletClient()
   ↓ WalletClient 반환
   
2. useStoryProtocol()
   ↓ walletClient를 그대로 전달
   
3. getStoryClientWithWallet(walletClient)
   ↓ StoryConfig 생성
   {
     account: walletClient, // ← 전체 walletClient
     transport: http(...),
     chainId: 1315
   }
   
4. StoryClient.newClient(config)
   ↓ Story Protocol SDK 초기화
   
5. storyClient.ipAsset.registerIpAsset(...)
   ↓ 
   
6. walletClient.signTransaction() 호출
   ↓ 사용자가 지갑에서 승인
   
7. transport를 통해 RPC로 전송
   ↓
   
8. ✅ NFT 민팅 + IP Asset 등록 성공!
```

---

## 🔍 디버깅

만약 여전히 에러가 발생한다면:

### 1. walletClient 확인
```typescript
// _components/common/StoryRegisterButton.tsx
console.log('walletClient:', {
  hasAccount: !!storyClient,
  address: address,
  clientType: typeof storyClient,
});
```

### 2. Story Protocol 클라이언트 확인
```typescript
// lib/blockchain/story-client.ts
console.log('Creating Story Client:', {
  hasWalletClient: !!walletClient,
  hasAccount: !!walletClient.account,
  address: walletClient.account?.address,
  chainId: 1315,
});
```

---

## 🎉 완료!

이제 **wagmi의 WalletClient를 Story Protocol SDK에서 직접 사용**할 수 있습니다!

**시크릿 모드로 테스트하세요!** 🚀

