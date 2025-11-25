# 📘 Story Protocol SDK 사용 가이드

Dream IP 프로젝트에서 Story Protocol SDK를 사용하는 방법을 정리한 문서입니다.

---

## 🎯 현재 구현 상태

### ✅ 구현 완료
- IP Asset 등록 (`registerIpAsset`)
- IPFS 메타데이터 업로드
- 사용자 지갑 직접 서명
- MongoDB 데이터 동기화

### 🚧 향후 구현 예정
- Derivative (파생 작품) 등록
- License Terms 관리
- Royalty 지불 및 청구
- Dispute (분쟁) 처리

---

## 📖 1. IP Asset 등록

Dream IP를 Story Protocol에 등록하는 가장 기본적인 기능입니다.

### 사용 중인 메서드
```typescript
await storyClient.ipAsset.registerIpAsset({
    nft: {
        type: 'mint',
        spgNftContract: '0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37',
    },
    ipMetadata: {
        ipMetadataURI: 'ipfs://Qm...',
        ipMetadataHash: '0x...',
        nftMetadataURI: 'ipfs://Qm...',
        nftMetadataHash: '0x...',
    },
});
```

### 참고 문서
- [Register an IP Asset](https://docs.story.foundation/developers/typescript-sdk/register)

### 구현 파일
- `_components/common/StoryRegisterButton.tsx`

---

## 📖 2. License Terms 추가 (향후 구현)

IP Asset에 라이선스 조건을 추가하여, 다른 사람이 사용할 수 있도록 합니다.

### Story Protocol의 PIL Flavors

#### 1️⃣ Non-Commercial Social Remixing
```typescript
import { PILFlavor } from '@story-protocol/core-sdk';

await storyClient.ipAsset.registerIpAsset({
    nft: { /* ... */ },
    licenseTermsData: [
        {
            terms: PILFlavor.nonCommercialSocialRemixing(),
        },
    ],
    ipMetadata: { /* ... */ },
});
```

**특징:**
- ✅ 무료 리믹스 허용
- ✅ 출처 표시 필수
- ❌ 상업적 사용 불가

---

#### 2️⃣ Commercial Use
```typescript
import { PILFlavor, WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk';
import { parseEther } from 'viem';

await storyClient.ipAsset.registerIpAsset({
    nft: { /* ... */ },
    licenseTermsData: [
        {
            terms: PILFlavor.commercialUse({
                defaultMintingFee: parseEther('1'), // 1 $IP
                currency: WIP_TOKEN_ADDRESS,
            }),
        },
    ],
    ipMetadata: { /* ... */ },
});
```

**특징:**
- ✅ 상업적 사용 허용
- ✅ 라이선스 비용 지불 필요
- ❌ 수익 공유 불필요

---

#### 3️⃣ Commercial Remix
```typescript
import { PILFlavor, WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk';
import { parseEther } from 'viem';

await storyClient.ipAsset.registerIpAsset({
    nft: { /* ... */ },
    licenseTermsData: [
        {
            terms: PILFlavor.commercialRemix({
                commercialRevShare: 5, // 5% 수익 공유
                defaultMintingFee: parseEther('1'), // 1 $IP
                currency: WIP_TOKEN_ADDRESS,
            }),
        },
    ],
    ipMetadata: { /* ... */ },
});
```

**특징:**
- ✅ 상업적 리믹스 허용
- ✅ 라이선스 비용 지불 필요
- ✅ 수익의 X% 공유 필요

---

### 참고 문서
- [Attach Terms to an IPA](https://docs.story.foundation/developers/typescript-sdk/attach-terms)
- [PIL Flavors](https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors)

---

## 📖 3. Derivative (파생 작품) 등록 (향후 구현)

다른 IP Asset을 기반으로 새로운 IP Asset을 만들 때 사용합니다.

### 예시: Dream IP를 기반으로 새로운 스토리 만들기

```typescript
await storyClient.ipAsset.registerDerivativeIpAsset({
    nft: {
        type: 'mint',
        spgNftContract: '0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37',
    },
    derivData: {
        parentIpIds: ['0x...(원본 Dream IP ID)'],
        licenseTermsIds: ['1'], // 사용할 라이선스 ID
    },
    ipMetadata: {
        ipMetadataURI: 'ipfs://Qm...',
        ipMetadataHash: '0x...',
        nftMetadataURI: 'ipfs://Qm...',
        nftMetadataHash: '0x...',
    },
});
```

### 사용 시나리오
1. **웹툰 → 드라마 각색**
   - 원본 Dream IP (웹툰)
   - 파생 IP Asset (드라마 시나리오)

2. **소설 → 게임 스토리**
   - 원본 Dream IP (소설)
   - 파생 IP Asset (게임 스토리)

3. **캐릭터 → 굿즈 디자인**
   - 원본 Dream IP (캐릭터)
   - 파생 IP Asset (굿즈 디자인)

### 참고 문서
- [Register a Derivative](https://docs.story.foundation/developers/typescript-sdk/register-derivative)

---

## 📖 4. Royalty (로열티) 처리 (향후 구현)

### 4a. IP Asset에 지불하기

```typescript
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk';
import { parseEther, zeroAddress } from 'viem';

// 팁 주기 (3rd-party 사용자)
await storyClient.royalty.payRoyaltyOnBehalf({
    receiverIpId: '0x...(Dream IP ID)',
    payerIpId: zeroAddress, // 외부 사용자는 zeroAddress
    token: WIP_TOKEN_ADDRESS,
    amount: parseEther('2'), // 2 $WIP
});
```

### 4b. 수익 청구하기

```typescript
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk';

// 직접 받은 수익 청구
await storyClient.royalty.claimAllRevenue({
    ancestorIpId: '0x...(Dream IP ID)',
    claimer: '0x...(Dream IP ID)', // IP Account 주소
    currencyTokens: [WIP_TOKEN_ADDRESS],
    childIpIds: [],
    royaltyPolicies: [],
    claimOptions: {
        autoTransferAllClaimedTokensFromIp: true, // 자동으로 NFT 소유자에게 전송
        autoUnwrapIpTokens: true, // $WIP → $IP 자동 언래핑
    },
});
```

### 사용 시나리오
1. **팬이 Dream IP에 후원**
   - 팬이 `payRoyaltyOnBehalf`로 $WIP 전송
   - 크리에이터가 `claimAllRevenue`로 수익 청구

2. **파생 작품이 수익 공유**
   - 드라마 제작사가 웹툰 작가에게 수익 공유
   - 자동으로 라이선스 조건에 따라 분배

### 참고 문서
- [Pay an IPA](https://docs.story.foundation/developers/typescript-sdk/pay-ipa)
- [Claim Revenue](https://docs.story.foundation/developers/typescript-sdk/claim-revenue)

---

## 📖 5. Dispute (분쟁) 처리 (향후 구현)

표절이나 부적절한 등록을 신고할 때 사용합니다.

```typescript
import { DisputeTargetTag } from '@story-protocol/core-sdk';
import { parseEther } from 'viem';

await storyClient.dispute.raiseDispute({
    targetIpId: '0x...(신고할 IP Asset ID)',
    cid: 'Qm...(증거 파일의 IPFS CID)',
    targetTag: DisputeTargetTag.IMPROPER_REGISTRATION, // 부적절한 등록
    bond: parseEther('0.1'), // 최소 0.1 $IP
    liveness: 2592000, // 30일
});
```

### Dispute Tags
- `IMPROPER_REGISTRATION`: 부적절한 등록 (표절, 저작권 침해)
- 기타 태그는 [공식 문서](https://docs.story.foundation/concepts/dispute-module#dispute-tags) 참고

### 참고 문서
- [Raise a Dispute](https://docs.story.foundation/developers/typescript-sdk/dispute-ip)

---

## 🔧 환경 변수 설정

### 필수 환경 변수

```bash
# Story Protocol (Client-side)
NEXT_PUBLIC_STORY_RPC_URL=https://aeneid.storyrpc.io
NEXT_PUBLIC_SPG_NFT_IMPL=0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37
NEXT_PUBLIC_PIL_LICENSE_TEMPLATE=0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316
NEXT_PUBLIC_IP_ASSET_REGISTRY=0x77319B4031e6eF1250907aa00018B8B1c67a244b
NEXT_PUBLIC_LICENSING_MODULE=0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f
NEXT_PUBLIC_REGISTRATION_WORKFLOWS=0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424

# WalletConnect (RainbowKit)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Server-side (IPFS only)
PINATA_JWT=your_pinata_jwt
PINATA_GATEWAY=gateway.pinata.cloud
```

---

## 🎨 UI 컴포넌트

### StoryRegisterButton
- **위치**: `_components/common/StoryRegisterButton.tsx`
- **기능**: Dream IP를 Story Protocol에 등록
- **사용**: `<StoryRegisterButton dreamId={dreamId} />`

### WalletButton
- **위치**: `_components/common/WalletButton.tsx`
- **기능**: 지갑 연결 및 잔액 표시
- **사용**: `<WalletButton />`

---

## 🚀 테스트 방법

### 1. 개발 서버 실행
```bash
bun run dev
```

### 2. 지갑 연결
- 헤더의 "Connect Wallet" 버튼 클릭
- MetaMask 등 지갑 선택

### 3. 테스트 토큰 받기
```
https://faucet.story.foundation
```

### 4. Dream IP 등록
- Dream IP 상세 페이지에서 "Story Protocol 등록" 버튼 클릭
- MetaMask에서 트랜잭션 승인

### 5. 확인
- 블록 탐색기: https://aeneid.explorer.story.foundation
- MongoDB에서 `ipAssetId`, `txHash` 확인

---

## 📚 참고 문서

### Story Protocol 공식 문서
- [TypeScript SDK](https://docs.story.foundation/developers/typescript-sdk)
- [Concepts](https://docs.story.foundation/concepts)
- [Deployed Contracts](https://docs.story.foundation/developers/deployed-smart-contracts)

### 프로젝트 내부 문서
- `WALLET_DIRECT_REGISTRATION.md`: 사용자 지갑 직접 등록 방식
- `WEB3_WALLET_GUIDE.md`: Web3 지갑 연결 가이드
- `STORY_PROTOCOL_GUIDE.md`: Story Protocol 통합 가이드
- `STORY_PROTOCOL_IMPLEMENTATION.md`: 구현 상세 문서

---

## 🎉 다음 단계

1. **License Terms 추가**
   - Dream IP 등록 시 라이선스 조건 선택 UI 구현
   - PIL Flavors 중 하나 선택 (Non-Commercial, Commercial, etc.)

2. **Derivative 등록**
   - 기존 Dream IP를 기반으로 새로운 작품 등록
   - 부모-자식 IP 관계 시각화

3. **Royalty 관리**
   - 수익 청구 UI 구현
   - 수익 내역 조회 및 통계

4. **Dispute 처리**
   - 신고 기능 구현
   - 신고 내역 관리

---

## 🔗 유용한 링크

- [Story Protocol Discord](https://discord.gg/storyprotocol)
- [Story Protocol GitHub](https://github.com/storyprotocol)
- [Aeneid Testnet Faucet](https://faucet.story.foundation)
- [Aeneid Block Explorer](https://aeneid.explorer.story.foundation)

