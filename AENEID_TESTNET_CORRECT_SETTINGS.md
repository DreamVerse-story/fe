# ✅ Story Aeneid Testnet 올바른 설정 완료

Story Protocol 공식 문서의 정확한 설정값으로 수정 완료!

---

## 📋 공식 Aeneid Testnet 정보

```
Network Name: Story Aeneid Testnet
RPC URL: aeneid.storyrpc.io (https://aeneid.storyrpc.io)
Chain ID: 1315
Native Currency Symbol: IP
Block Explorer: https://aeneid.explorer.story.foundation
```

---

## ✅ 수정된 파일 목록

### 1. `lib/blockchain/story-client.ts` ✅
```typescript
// 올바른 Chain ID: 1315
const chainId = 1315; // Aeneid Testnet
const rpcUrl = 'https://aeneid.storyrpc.io';
```

**변경 사항:**
- ❌ `chainId: 1516` → ✅ `chainId: 1315`
- ✅ 메인넷 관련 코드 완전 제거 (테스트넷 전용)
- ✅ `StoryNetwork` 타입을 `'aeneid'`만 남김

---

### 2. `lib/blockchain/wagmi-config.ts` ✅
```typescript
// Story Protocol Testnet (Aeneid) 체인 설정
export const storyAeneid = defineChain({
    id: 1315, // 올바른 Chain ID
    name: 'Story Aeneid Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'IP',
        symbol: 'IP',
    },
    rpcUrls: {
        default: {
            http: ['https://aeneid.storyrpc.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Story Explorer',
            url: 'https://aeneid.explorer.story.foundation',
        },
    },
    testnet: true,
});
```

**변경 사항:**
- ❌ `id: 1516` → ✅ `id: 1315`
- ❌ `storyOdyssey` → ✅ `storyAeneid` (이름 변경)
- ❌ `name: 'Testnet IP'` → ✅ `name: 'IP'`

---

### 3. `lib/hooks/useStoryProtocol.ts` ✅
```typescript
// Aeneid Testnet 사용 (Chain ID: 1315)
return getStoryClientWithWallet(walletClient.account);
```

**변경 사항:**
- ✅ 네트워크 매개변수 제거 (항상 Aeneid만 사용)

---

### 4. `.env.local` ✅
```bash
# Story Protocol - Aeneid Testnet (공식 설정)
# Chain ID: 1315
# RPC URL: https://aeneid.storyrpc.io
NEXT_PUBLIC_STORY_RPC_URL=https://aeneid.storyrpc.io
NEXT_PUBLIC_SPG_NFT_IMPL=0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37
NEXT_PUBLIC_PIL_LICENSE_TEMPLATE=0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316
NEXT_PUBLIC_IP_ASSET_REGISTRY=0x77319B4031e6eF1250907aa00018B8B1c67a244b
NEXT_PUBLIC_LICENSING_MODULE=0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f
NEXT_PUBLIC_REGISTRATION_WORKFLOWS=0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
STORY_NETWORK=aeneid
```

**변경 사항:**
- ✅ 주석에 올바른 Chain ID 1315 명시
- ✅ 메인넷 관련 설정 완전 제거

---

### 5. `env.example` ✅
```bash
# Story Protocol - Aeneid Testnet (공식 설정)
# Chain ID: 1315 (숫자)
# RPC URL: https://aeneid.storyrpc.io
# Native Currency: IP
```

**변경 사항:**
- ✅ 공식 설정값 명시
- ✅ 불필요한 서버 관련 환경 변수 제거

---

## 🔍 변경 사항 요약

### ❌ 이전 (잘못된 설정)
```
Chain ID: 1516
Network Name: Story Aeneid Testnet
Native Currency: Testnet IP
```

### ✅ 현재 (올바른 설정)
```
Chain ID: 1315
Network Name: Story Aeneid Testnet
Native Currency: IP
RPC URL: https://aeneid.storyrpc.io
```

---

## 🚀 테스트 방법

### 1. 개발 서버 재시작

```bash
# 기존 서버 중지 (Ctrl+C)
bun run dev
```

### 2. 브라우저 콘솔 확인

```javascript
// ✅ 정상: 에러 없음
// Story Protocol 클라이언트가 Chain ID 1315로 성공적으로 생성됨
```

### 3. MetaMask 네트워크 추가

MetaMask에 수동으로 네트워크를 추가할 때:

```
네트워크 이름: Story Aeneid Testnet
RPC URL: https://aeneid.storyrpc.io
Chain ID: 1315
통화 기호: IP
블록 탐색기: https://aeneid.explorer.story.foundation
```

### 4. 지갑 연결 테스트

```
1. "Connect Wallet" 버튼 클릭
2. MetaMask 선택
3. Aeneid Testnet으로 자동 전환
4. 지갑 주소 및 잔액 표시 확인
5. ✅ "5.00 IP" 같은 정상적인 잔액 표시
```

### 5. Dream IP 등록 테스트

```
1. Dream IP 생성
2. "Story Protocol 등록" 버튼 클릭
3. IPFS 업로드 대기
4. MetaMask 팝업 확인:
   - Network: Story Aeneid Testnet
   - Gas Fee: ~0.01 IP
5. 트랜잭션 승인
6. ✅ 등록 성공!
```

---

## 💰 테스트 토큰 받기

```
URL: https://faucet.story.foundation
Chain: Story Aeneid Testnet (1315)
Amount: 5 IP per day
```

---

## 🔗 공식 리소스

### Block Explorer
```
https://aeneid.explorer.story.foundation
```

### Faucet
```
https://faucet.story.foundation
```

### RPC Endpoint
```
https://aeneid.storyrpc.io
```

### Documentation
```
https://docs.story.foundation
```

---

## 📊 컨트랙트 주소 (Aeneid Testnet)

### Core Contracts
```typescript
{
  "IPAssetRegistry": "0x77319B4031e6eF1250907aa00018B8B1c67a244b",
  "LicensingModule": "0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f",
  "PILicenseTemplate": "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316"
}
```

### Periphery Contracts (우리가 사용)
```typescript
{
  "SPGNFTImpl": "0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37",
  "RegistrationWorkflows": "0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424"
}
```

---

## ⚠️ 중요 사항

### ✅ 확인된 설정
- Chain ID: **1315** (숫자, 반드시 확인!)
- RPC URL: **https://aeneid.storyrpc.io**
- Native Currency: **IP** (not "Testnet IP")
- Network: **테스트넷 전용** (메인넷 코드 완전 제거)

### ❌ 사용하지 않는 것
- Chain ID 1516 (잘못된 값)
- 메인넷 (Odyssey) 관련 설정
- "Testnet IP" (올바른 이름: "IP")

---

## 🎉 완료!

모든 설정이 **Story Protocol 공식 문서**의 정확한 값으로 수정되었습니다!

### 핵심 포인트:
- ✅ Chain ID: **1315** (공식 값)
- ✅ RPC URL: **https://aeneid.storyrpc.io**
- ✅ Native Currency: **IP**
- ✅ 테스트넷 전용 (메인넷 제거)
- ✅ 모든 파일 일관성 유지

---

## 🐛 문제 해결

### Chain ID 에러가 여전히 발생하는 경우

```bash
# 1. 브라우저 캐시 완전 삭제
Chrome → 개발자 도구 → Application → Clear Storage → Clear site data

# 2. 개발 서버 완전 재시작
ps aux | grep next  # 프로세스 확인
kill -9 <PID>       # 완전 종료
bun run dev         # 재시작

# 3. node_modules 재설치
rm -rf node_modules .next
bun install
bun run dev
```

### MetaMask 네트워크 에러

```
Error: Chain 1315 not found
```

**해결 방법:**
1. MetaMask에서 수동으로 네트워크 추가
2. 또는 앱에서 자동 추가 승인

---

## 📚 관련 문서

- `ENV_SETUP_GUIDE.md`: 환경 변수 설정 가이드
- `CHAINID_FIX.md`: Chain ID 에러 해결
- `WALLET_DIRECT_REGISTRATION.md`: 지갑 직접 등록 방식
- [Story Protocol Docs](https://docs.story.foundation)

---

**마지막 업데이트: 2024**
**설정 버전: Aeneid Testnet (Chain ID: 1315)**

