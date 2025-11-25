# 🔗 Web3 지갑 연동 가이드

Dream IP 프로젝트에 **wagmi + RainbowKit**을 사용한 Web3 지갑 연동이 완료되었습니다!

## 📋 목차

1. [구현된 기능](#구현된-기능)
2. [환경 변수 설정](#환경-변수-설정)
3. [사용 방법](#사용-방법)
4. [주요 컴포넌트](#주요-컴포넌트)
5. [Story Protocol 연동](#story-protocol-연동)

---

## 🎯 구현된 기능

### ✅ 완료된 작업

-   **wagmi + RainbowKit 설치** - 최신 버전의 Web3 라이브러리 통합
-   **Web3Provider** - 전역 지갑 상태 관리
-   **WalletButton** - 커스터마이징된 지갑 연결 버튼
-   **Story Protocol Aeneid Testnet** - Story Protocol 테스트넷 지원
-   **useStoryProtocol Hook** - 지갑과 Story Protocol SDK 연동
-   **StoryRegisterButton** - Dream IP를 블록체인에 등록하는 버튼

---

## ⚙️ 환경 변수 설정

### 1. WalletConnect Project ID 발급

[WalletConnect Cloud](https://cloud.walletconnect.com)에서 무료 Project ID를 발급받으세요.

### 2. `.env.local` 파일 생성

```bash
# Story Protocol (Client-side)
NEXT_PUBLIC_STORY_RPC_URL=https://aeneid.storyrpc.io

# WalletConnect (RainbowKit)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

---

## 🚀 사용 방법

### 1. Header에 지갑 연결 버튼

모든 페이지의 Header에 지갑 연결 버튼이 자동으로 표시됩니다.

```tsx
// _components/layout/Header.tsx
import { WalletButton } from '../common/WalletButton';

export function Header() {
    return (
        <header>
            {/* ... */}
            <WalletButton /> {/* 지갑 연결 버튼 */}
        </header>
    );
}
```

### 2. Dream IP 상세 페이지에서 등록

Dream IP 상세 페이지에서 "Story Protocol 등록" 버튼이 표시됩니다.

```tsx
// _components/common/DreamIPDetail.tsx
import { StoryRegisterButton } from './StoryRegisterButton';

<StoryRegisterButton dreamId={dream.id} />;
```

### 3. 커스텀 컴포넌트에서 지갑 사용

```tsx
'use client';

import { useStoryProtocol } from '@/lib/hooks/useStoryProtocol';

export function MyComponent() {
    const { isConnected, address, storyClient } =
        useStoryProtocol();

    if (!isConnected) {
        return <div>지갑을 연결해주세요</div>;
    }

    return (
        <div>
            <p>연결된 지갑: {address}</p>
            <button
                onClick={async () => {
                    // Story Protocol SDK 사용
                    if (storyClient) {
                        // const result = await storyClient.ipAsset.register(...);
                    }
                }}
            >
                IP Asset 등록
            </button>
        </div>
    );
}
```

---

## 🧩 주요 컴포넌트

### 1. `Web3Provider`

```tsx
// _components/providers/Web3Provider.tsx
import { Web3Provider } from '@/_components/providers';

// app/layout.tsx에서 사용
<Web3Provider>
    <I18nProvider>{/* Your App */}</I18nProvider>
</Web3Provider>;
```

**기능:**

-   wagmi + RainbowKit Provider 통합
-   React Query 설정
-   Story Protocol Aeneid Testnet 지원

### 2. `WalletButton`

```tsx
// _components/common/WalletButton.tsx
<WalletButton />
```

**상태별 표시:**

-   지갑 미연결: "Connect Wallet" 버튼
-   지갑 연결됨: 주소 + 잔액 + 체인 정보
-   잘못된 네트워크: "Wrong Network" 경고

### 3. `StoryRegisterButton`

```tsx
// _components/common/StoryRegisterButton.tsx
<StoryRegisterButton dreamId="dream-123" />
```

**기능:**

-   Dream IP를 Story Protocol에 등록
-   지갑 연결 상태 확인
-   로딩 상태 표시
-   성공/실패 토스트 알림

### 4. `useStoryProtocol` Hook

```tsx
// lib/hooks/useStoryProtocol.ts
import { useStoryProtocol } from '@/lib/hooks/useStoryProtocol';

const { isConnected, address, storyClient, isLoading } =
    useStoryProtocol();
```

**반환 값:**

-   `isConnected`: 지갑 연결 여부
-   `address`: 지갑 주소
-   `storyClient`: Story Protocol SDK 클라이언트
-   `isLoading`: 로딩 상태

---

## 🔗 Story Protocol 연동

### 네트워크 설정

```typescript
// lib/blockchain/wagmi-config.ts
export const storyOdyssey = defineChain({
    id: 1516,
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
};
```

### Story Client 생성

```typescript
// lib/blockchain/story-client.ts
import { getStoryClientWithWallet } from '@/lib/blockchain/story-client';

// wagmi의 walletClient와 함께 사용
const storyClient = getStoryClientWithWallet(
    walletClient.account
);
```

### Dream IP 등록 API

```typescript
// app/api/story/register/route.ts
POST /api/story/register
{
  "dreamId": "dream-123",
  "walletAddress": "0x..."
}
```

**응답:**

```json
{
    "success": true,
    "data": {
        "ipAssetId": "0x...",
        "ipfsCid": "Qm...",
        "txHash": "0x..."
    },
    "message": "Dream IP가 Story Protocol에 등록되었습니다."
}
```

---

## 📱 지원되는 지갑

RainbowKit은 다음 지갑들을 자동으로 지원합니다:

-   **MetaMask**
-   **WalletConnect** (모바일 지갑 전체 지원)
-   **Coinbase Wallet**
-   **Rainbow**
-   **Trust Wallet**
-   **Ledger**
-   그 외 300+ 지갑

---

## 🧪 테스트 방법

### 1. Story Aeneid Testnet 토큰 받기

1. [Story Faucet](https://faucet.story.foundation)에서 테스트 토큰 요청
2. 지갑 주소 입력
3. IP 토큰 수령 (네트워크 가스비용)

### 2. Dream IP 등록 테스트

1. Dream IP 생성 (Record 페이지)
2. 생성된 Dream IP 상세 페이지 이동
3. Header에서 "Connect Wallet" 클릭
4. MetaMask 또는 다른 지갑 연결
5. "Story Protocol 등록" 버튼 클릭
6. 트랜잭션 승인
7. 등록 완료 확인

---

## 🔧 트러블슈팅

### Q: "Connect Wallet" 버튼이 보이지 않아요

**A:** 브라우저를 새로고침하거나 개발 서버를 재시작하세요.

```bash
bun run dev
```

### Q: "Wrong Network" 경고가 표시됩니다

**A:** 지갑을 Story Aeneid Testnet으로 전환하세요. RainbowKit이 자동으로 전환 버튼을 제공합니다.

### Q: WalletConnect가 작동하지 않습니다

**A:** `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`가 `.env.local`에 올바르게 설정되었는지 확인하세요.

### Q: Story Protocol 등록이 실패합니다

**A:** 다음을 확인하세요:

1. 지갑에 충분한 IP 토큰이 있는지 (가스비)
2. Dream IP 상태가 `completed`인지
3. 백엔드 환경 변수 (`STORY_PRIVATE_KEY`, `STORY_NFT_CONTRACT`)가 설정되었는지

---

## 📚 추가 리소스

-   [wagmi Documentation](https://wagmi.sh)
-   [RainbowKit Documentation](https://www.rainbowkit.com)
-   [Story Protocol Documentation](https://docs.story.foundation)
-   [WalletConnect Cloud](https://cloud.walletconnect.com)

---

## 🎉 완료!

이제 Dream IP 프로젝트에서 Web3 지갑을 사용하여 블록체인과 상호작용할 수 있습니다!

**다음 단계:**

1. 프로덕션 배포 시 실제 지갑 주소와 메인넷 설정 업데이트
2. 사용자 경험 개선 (로딩 상태, 에러 처리 등)
3. IP Asset 소유권 이전, 라이선스 판매 등 추가 기능 구현
