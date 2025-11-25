# 🔐 사용자 지갑 직접 등록 방식

Dream IP를 Story Protocol에 등록할 때, **사용자의 지갑으로 직접 트랜잭션을 서명**하도록 변경했습니다!

---

## 🎯 변경 사항

### ❌ 이전 방식 (잘못된 방식)

```
사용자 → 지갑 연결 → API 호출 → 서버가 대신 트랜잭션 전송
                                  ↑
                            서버 Private Key 필요 (보안 위험!)
```

**문제점:**

-   서버가 Private Key를 보관해야 함 (보안 위험)
-   사용자가 직접 트랜잭션을 제어할 수 없음
-   서버가 가스비를 지불해야 함

---

### ✅ 새로운 방식 (올바른 방식)

```
사용자 → 지갑 연결 → Story Protocol SDK (클라이언트) → 사용자 지갑에서 직접 서명
                                                         ↑
                                                   MetaMask 팝업
```

**장점:**

-   ✅ 사용자가 직접 트랜잭션 제어
-   ✅ 서버 Private Key 불필요 (보안 향상)
-   ✅ 사용자가 가스비 지불 (정상적인 Web3 방식)
-   ✅ 완전한 탈중앙화

---

## 📋 등록 프로세스

### 1. 지갑 연결

```typescript
// wagmi + RainbowKit으로 지갑 연결
const { isConnected, address, storyClient } =
    useStoryProtocol();
```

### 2. IPFS 메타데이터 업로드 (서버)

```typescript
// API: POST /api/story/prepare-metadata
const ipfsResponse = await fetch(
    '/api/story/prepare-metadata',
    {
        method: 'POST',
        body: JSON.stringify({ dreamId }),
    }
);

// 응답: { ipfsCid: 'Qm...', metadataURI: 'ipfs://Qm...' }
```

**왜 서버에서?**

-   IPFS 업로드는 Pinata JWT 토큰이 필요 (클라이언트 노출 불가)
-   메타데이터 포맷팅 로직을 서버에서 중앙 관리

### 3. Story Protocol에 등록 (클라이언트 - 사용자 지갑)

```typescript
// Story Protocol SDK로 직접 트랜잭션 전송
const response =
    await storyClient.ipAsset.mintAndRegisterIpAssetWithPilTerms(
        {
            spgNftContract:
                '0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37', // SPG NFT
            pilType: 1, // Non-Commercial Social Remixing
            ipMetadata: {
                ipMetadataURI: `ipfs://${ipfsCid}`,
                ipMetadataHash: dreamHash,
                nftMetadataURI: `ipfs://${ipfsCid}`,
                nftMetadataHash: dreamHash,
            },
            txOptions: {
                waitForTransaction: true, // 트랜잭션 완료 대기
            },
        }
    );

// 사용자의 MetaMask에서 트랜잭션 승인 팝업 표시!
```

### 4. MongoDB 업데이트 (서버)

```typescript
// API: PATCH /api/dreams/{dreamId}
await fetch(`/api/dreams/${dreamId}`, {
    method: 'PATCH',
    body: JSON.stringify({
        ipfsCid,
        ipAssetId: response.ipId,
        txHash: response.txHash,
    }),
});
```

---

## 🔑 사용되는 Smart Contracts

### Story Protocol Aeneid Testnet

```typescript
// Core Contracts
IP_ASSET_REGISTRY: '0x77319B4031e6eF1250907aa00018B8B1c67a244b';
LICENSING_MODULE: '0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f';
PIL_LICENSE_TEMPLATE: '0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316';

// Periphery Contracts (우리가 사용)
SPG_NFT_IMPL: '0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37';
REGISTRATION_WORKFLOWS: '0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424';
```

**SPG (Story Protocol Gateway)**를 사용하면:

-   NFT 민팅 + IP Asset 등록을 한 번에 처리
-   기본 PIL (Programmable IP License) 자동 적용
-   가장 간단하고 권장되는 방식

---

## 🔐 환경 변수

### `.env.local` 설정

```bash
# Client-side (브라우저에서 접근 가능)
NEXT_PUBLIC_STORY_RPC_URL=https://aeneid.storyrpc.io
NEXT_PUBLIC_SPG_NFT_IMPL=0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Server-side (Pinata IPFS용)
PINATA_JWT=your_pinata_jwt
PINATA_GATEWAY=gateway.pinata.cloud

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=dream-ip
```

**중요:** 더 이상 `STORY_PRIVATE_KEY`가 필요 없습니다! 🎉

---

## 💰 가스비 (Gas Fee)

### 사용자가 지불하는 가스비:

-   **IP Asset 등록**: ~0.01 IP (예상)
-   **네트워크**: Story Aeneid Testnet
-   **토큰**: IP (테스트넷)

### 테스트 토큰 받기:

```
https://faucet.story.foundation
```

---

## 🎨 사용자 경험 (UX)

### 등록 버튼 클릭 후:

1. **"Dream IP 데이터를 가져오는 중..."** (Toast)
2. **"IPFS에 메타데이터 업로드 중..."** (Toast)
3. **"지갑에서 트랜잭션을 승인해주세요..."** (Toast)
4. **MetaMask 팝업** 👉 사용자가 직접 승인!

    ```
    Story Aeneid Testnet
    Contract: 0x5266...4e37
    Gas Fee: 0.01 IP

    [거부]  [승인]
    ```

5. **"블록체인에서 처리 중..."** (Toast)
6. **"🎉 Story Protocol에 등록 완료!"** (Toast)

---

## 🔍 트랜잭션 확인

등록 완료 후:

```
IP Asset ID: 0x1234...5678
Transaction: 0xabcd...ef01

블록 탐색기:
https://aeneid.explorer.story.foundation/tx/0xabcd...ef01
```

---

## 🛠️ 개발자 가이드

### Story Protocol SDK 사용법

```typescript
import { useStoryProtocol } from '@/lib/hooks/useStoryProtocol';

function MyComponent() {
    const { isConnected, address, storyClient } =
        useStoryProtocol();

    const handleRegister = async () => {
        if (!storyClient) return;

        // IP Asset 등록
        const response =
            await storyClient.ipAsset.mintAndRegisterIpAssetWithPilTerms(
                {
                    spgNftContract:
                        process.env
                            .NEXT_PUBLIC_SPG_NFT_IMPL,
                    pilType: 1, // 1 = Non-Commercial Social Remixing
                    ipMetadata: {
                        ipMetadataURI: 'ipfs://Qm...',
                        ipMetadataHash: '0x...',
                        nftMetadataURI: 'ipfs://Qm...',
                        nftMetadataHash: '0x...',
                    },
                    txOptions: {
                        waitForTransaction: true,
                    },
                }
            );

        console.log('IP Asset ID:', response.ipId);
        console.log('Transaction Hash:', response.txHash);
    };

    return (
        <button
            onClick={handleRegister}
            disabled={!isConnected}
        >
            Register IP Asset
        </button>
    );
}
```

---

## 📚 PIL Types (Programmable IP License)

Story Protocol에서 지원하는 라이선스 타입:

```typescript
enum PILType {
    NON_COMMERCIAL_REMIX = 1, // 비상업적 리믹스 허용
    COMMERCIAL_USE = 2, // 상업적 사용 허용
    COMMERCIAL_REMIX = 3, // 상업적 리믹스 허용
}
```

우리는 **`pilType: 1`** (Non-Commercial Social Remixing)을 사용합니다.

---

## 🎉 완료!

이제 Dream IP 등록이:

-   ✅ 완전히 탈중앙화되었습니다
-   ✅ 사용자가 직접 제어합니다
-   ✅ 보안이 향상되었습니다
-   ✅ 정상적인 Web3 방식입니다

**서버 Private Key가 더 이상 필요 없습니다!** 🚀

---

## 🔗 참고 자료

-   [Story Protocol Docs](https://docs.story.foundation)
-   [Story Protocol SDK](https://github.com/storyprotocol/sdk)
-   [Aeneid Testnet Explorer](https://aeneid.explorer.story.foundation)
-   [Story Faucet](https://faucet.story.foundation)
