# 🔧 브라우저 캐시 문제 해결 가이드

코드는 올바르게 수정되었지만, 브라우저가 **이전 버전의 JavaScript 파일을 캐시**하고 있어서 여전히 오래된 코드가 실행되고 있습니다!

---

## 🐛 증상

RPC 요청에서 여전히 `0x` 접두사 없는 해시가 전달됨:

```
ipMetadataHash: 99cc7be3d6b3ffdbc4ca7523845c147011231a6b7235848c72af20b9df2b41c9
                ↑ 0x 없음!
```

**예상 (올바른 형식):**
```
ipMetadataHash: 0x99cc7be3d6b3ffdbc4ca7523845c147011231a6b7235848c72af20b9df2b41c9
                ↑ 0x 있어야 함!
```

---

## ✅ 해결 방법

### 방법 1: 강력한 새로고침 (권장)

```bash
# Windows/Linux
Ctrl + Shift + R

# Mac
Cmd + Shift + R
```

또는

```bash
# Windows/Linux
Ctrl + F5

# Mac
Cmd + Shift + Delete
```

---

### 방법 2: 개발자 도구에서 캐시 완전 삭제

#### Chrome/Edge:

1. `F12` 또는 `Cmd/Ctrl + Shift + I` (개발자 도구 열기)
2. `Application` 탭 클릭
3. 좌측 메뉴에서 `Clear storage` 클릭
4. `Clear site data` 버튼 클릭
5. 페이지 새로고침 (`F5`)

#### Firefox:

1. `F12` (개발자 도구 열기)
2. `Storage` 탭 클릭
3. 좌측 메뉴에서 각 항목 우클릭 → `Delete All`
4. 페이지 새로고침 (`F5`)

---

### 방법 3: Next.js 빌드 캐시 삭제

터미널에서:

```bash
# .next 폴더 삭제
rm -rf .next

# node_modules/.cache 삭제 (있다면)
rm -rf node_modules/.cache

# 개발 서버 재시작
bun run dev
```

---

### 방법 4: 시크릿 모드 (테스트용)

새로운 시크릿/프라이빗 창에서 테스트:

```bash
# Chrome/Edge
Ctrl + Shift + N (Windows/Linux)
Cmd + Shift + N (Mac)

# Firefox
Ctrl + Shift + P (Windows/Linux)
Cmd + Shift + P (Mac)
```

시크릿 모드에서 `http://localhost:3000` 접속 후 테스트

---

## 🔍 캐시가 제대로 삭제되었는지 확인

### 1. 브라우저 콘솔에서 확인

개발자 도구 → Console 탭:

```javascript
// dreamHash 확인
console.log('dreamHash:', dream.dreamHash);
console.log('dreamHashWithPrefix:', dreamHashWithPrefix);
```

**예상 출력:**
```
dreamHash: 99cc7be3d6b3ffdbc4ca7523845c147011231a6b7235848c72af20b9df2b41c9
dreamHashWithPrefix: 0x99cc7be3d6b3ffdbc4ca7523845c147011231a6b7235848c72af20b9df2b41c9
```

### 2. Network 탭에서 확인

개발자 도구 → Network 탭:

1. `eth_call` 요청 찾기
2. Payload 확인
3. `data` 필드에서 `0x99cc...` (0x 포함) 확인

---

## 🎯 완전 클린 재시작 (최종 수단)

모든 방법이 실패하면:

```bash
# 1. 개발 서버 중지 (Ctrl+C)

# 2. 모든 캐시 삭제
rm -rf .next
rm -rf node_modules/.cache

# 3. 브라우저 완전 종료
# Windows/Linux: Alt+F4
# Mac: Cmd+Q

# 4. 브라우저 재시작

# 5. 개발 서버 재시작
bun run dev

# 6. 시크릿 모드로 접속
# http://localhost:3000
```

---

## 🔒 개발 중 캐시 비활성화 (권장)

개발하는 동안 캐시 문제를 방지하려면:

### Chrome/Edge:

1. 개발자 도구 열기 (`F12`)
2. `Network` 탭 클릭
3. ✅ `Disable cache` 체크박스 활성화
4. **개발자 도구를 열어둔 상태로 개발**

### Firefox:

1. 개발자 도구 열기 (`F12`)
2. 설정 아이콘 ⚙️ 클릭
3. ✅ `Disable HTTP Cache (when toolbox is open)` 체크

---

## 📋 체크리스트

- [ ] 강력한 새로고침 (`Ctrl/Cmd + Shift + R`)
- [ ] 개발자 도구에서 캐시 삭제
- [ ] `.next` 폴더 삭제 후 서버 재시작
- [ ] 시크릿 모드에서 테스트
- [ ] 브라우저 완전 재시작
- [ ] `Disable cache` 옵션 활성화
- [ ] Console에서 `dreamHashWithPrefix` 확인 (0x로 시작하는지)
- [ ] Network 탭에서 RPC 요청 확인

---

## 🎉 확인 방법

캐시가 올바르게 삭제되면:

1. ✅ Console에서 `dreamHashWithPrefix: 0x99cc...` 출력
2. ✅ Network → eth_call → data에 `0x99cc...` 포함
3. ✅ Story Protocol 등록 성공!

---

## 🐛 여전히 실패하는 경우

에러 코드 `0x06b752de`가 계속 나온다면:

1. **NFT 컬렉션 문제**
   - `NEXT_PUBLIC_SPG_NFT_IMPL` 주소가 올바른지 확인
   - 자신이 생성한 NFT 컬렉션인지 확인

2. **권한 문제**
   - NFT 컬렉션의 `isPublicMinting`이 `true`인지 확인
   - `mintOpen`이 `true`인지 확인

3. **가스비 부족**
   - 지갑에 충분한 IP 토큰이 있는지 확인
   - Faucet: https://faucet.story.foundation

---

## 💡 팁

### 개발 모드에서 항상 최신 코드 사용하기

`.env.local`에 추가:

```bash
# Next.js 캐시 비활성화 (개발 모드)
NEXT_DISABLE_SWC_CACHE=1
```

그리고 서버 재시작:

```bash
bun run dev
```

---

## 📚 관련 문서

- `NFT_COLLECTION_SETUP.md`: NFT 컬렉션 생성 가이드
- `AENEID_TESTNET_CORRECT_SETTINGS.md`: Aeneid Testnet 설정
- `CHAINID_FIX.md`: Chain ID 에러 해결

---

**마지막 업데이트: 2024**
**캐시 문제는 웹 개발의 영원한 숙제입니다! 😅**

