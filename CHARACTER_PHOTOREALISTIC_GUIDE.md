# 실사 스타일 캐릭터 생성 가이드

Dream IP의 캐릭터는 **실사(Photorealistic)** 스타일로 생성되어, 마치 실제 배우가 연기하는 듯한 현실감을 제공합니다.

## 🎭 왜 실사 스타일인가?

### 1. **영화/드라마 캐스팅 시뮬레이션**
```
실사 캐릭터 → 실제 배우 캐스팅 참고 자료
```
- ✅ "이런 배우가 맡으면 좋겠다" 이미지 제공
- ✅ 캐스팅 디렉터에게 비주얼 레퍼런스
- ✅ 투자자/제작사 설득 자료

### 2. **게임 캐릭터 모델링 기준**
```
실사 → 3D 스캔 → 게임 캐릭터
```
- ✅ Unreal Engine 5 MetaHuman 스타일
- ✅ The Last of Us, Cyberpunk 2077 수준
- ✅ 실사 기반 3D 모델링 추세

### 3. **몰입도 향상**
- ✅ 일러스트보다 현실감 있음
- ✅ 감정 표현이 더 생생함
- ✅ 캐릭터에 대한 공감도 증가

---

## 🎨 실사 캐릭터 생성 전략

### buildCharacterPrompt() 구조

```typescript
// 1. 핵심: 실사 스타일 명시
'Photorealistic character portrait: ${characterName}'

// 2. 세팅 & 위치
'Setting: ${analysis.world}'
'Location: ${locations}'

// 3. 장르 & 분위기
'Genre: ${genres}'
'Atmosphere: ${tones}'
'Expression: ${emotions}'

// 4. 실사 스타일 요구사항 (가장 중요!)
'Hyperrealistic human features and skin textures'
'Professional photography style'
'Cinema quality character portrait'
'Realistic facial details and expressions'
'Natural skin tones and lighting'
'Film grain and cinematic color grading'

// 5. 구도 & 조명
'Dramatic portrait lighting with soft shadows'
'Shallow depth of field with bokeh background'
'Professional headshot to full body composition'
'Studio or environmental portrait setup'

// 6. 디테일
'Ultra detailed facial features'
'Realistic hair and clothing textures'
'Natural pose and body language'
'Award-winning portrait photography quality'

// 7. 기술적 품질
'Shot on high-end cinema camera'
'IMAX quality'
'8K resolution'
'Professional color grading'

// 8. 텍스트 금지
'ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS...'
```

---

## 📸 실사 vs 일러스트 비교

| 항목 | 실사 (Photorealistic) | 일러스트 (Illustration) |
|------|---------------------|----------------------|
| **피부 표현** | 모공, 주름, 피부결 세밀 묘사 | 단순화된 피부 표현 |
| **머리카락** | 한 올 한 올 자연스러움 | 스타일라이즈된 머리카락 |
| **눈** | 눈동자 반사, 눈물샘까지 | 단순한 눈 표현 |
| **조명** | 자연광/스튜디오 조명 시뮬레이션 | 예술적 조명 |
| **배경** | 보케 효과, 실제 환경 | 추상적/단순화된 배경 |
| **느낌** | 영화 배우, 실제 사람 | 컨셉 아트, 디자인 |
| **용도** | 캐스팅 참고, 3D 모델링 | 아트북, 캐릭터 시트 |

---

## 🎬 실사 캐릭터 예시

### 예시 1: SF 주인공

**입력:**
```
캐릭터: "우주 탐험가 소피아"
세계관: "2150년 화성 기지"
장르: "SF, 어드벤처"
분위기: "용감함, 고독함"
```

**생성된 프롬프트:**
```
Photorealistic character portrait: 우주 탐험가 소피아. 
Setting: 2150년 화성 기지. Location: 우주선 내부. 
Genre: SF, Adventure. Atmosphere: Brave, Solitary. 
Expression: Determination, Hope. 
Hyperrealistic human features and skin textures. 
Professional photography style. Cinema quality character portrait. 
Realistic facial details and expressions. Natural skin tones and lighting. 
Film grain and cinematic color grading. Dramatic portrait lighting with 
soft shadows. Shallow depth of field with bokeh background. 
Professional headshot to full body composition. Studio or environmental 
portrait setup. Ultra detailed facial features. Realistic hair and 
clothing textures. Natural pose and body language. Award-winning 
portrait photography quality. Shot on high-end cinema camera. 
IMAX quality. 8K resolution. Professional color grading. 
ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO CAPTIONS, NO WRITING, 
NO SYMBOLS of any kind. Pure photographic portrait only.
```

**기대 결과:**
- 👩‍🚀 실제 배우가 우주복 입고 있는 듯한 비주얼
- 💡 스튜디오 조명으로 얼굴 윤곽 강조
- 🌌 배경은 우주선 내부가 보케로 흐릿하게
- 👁️ 눈빛에서 결단력과 희망이 드러남
- 📸 IMAX 영화 스틸컷 수준

### 예시 2: 판타지 마법사

**입력:**
```
캐릭터: "고대 마법사 엘리온"
세계관: "잃어버린 마법 도서관"
장르: "판타지, 미스터리"
분위기: "신비로움, 지혜로움"
```

**생성된 프롬프트:**
```
Photorealistic character portrait: 고대 마법사 엘리온. 
Setting: 잃어버린 마법 도서관. Location: Ancient library. 
Genre: Fantasy, Mystery. Atmosphere: Mystical, Wise. 
Expression: Knowing, Mysterious. 
Hyperrealistic human features and skin textures. 
Professional photography style. Cinema quality character portrait. 
Realistic facial details and expressions. Natural skin tones and lighting. 
Film grain and cinematic color grading. Dramatic portrait lighting with 
soft shadows. Shallow depth of field with bokeh background. 
Ultra detailed facial features with age lines and wisdom. 
Realistic flowing robes and fabric textures. 
Natural pose holding magical staff. Award-winning portrait photography. 
Shot on high-end cinema camera. IMAX quality. 8K resolution. 
ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO CAPTIONS, NO WRITING, 
NO SYMBOLS of any kind. Pure photographic portrait only.
```

**기대 결과:**
- 🧙‍♂️ 실제 배우가 마법사 의상 입은 듯
- ✨ 신비로운 조명으로 마법 분위기
- 📚 배경에 고대 책들이 보케로 흐릿하게
- 👴 주름, 수염까지 세밀하게 표현
- 🎥 반지의 제왕 간달프 수준의 퀄리티

### 예시 3: 호러 생존자

**입력:**
```
캐릭터: "생존자 준호"
세계관: "폐허가 된 서울"
장르: "호러, 스릴러"
분위기: "공포, 절박함"
```

**생성된 프롬프트:**
```
Photorealistic character portrait: 생존자 준호. 
Setting: 폐허가 된 서울. Location: Abandoned building. 
Genre: Horror, Thriller. Atmosphere: Fearful, Desperate. 
Expression: Terror, Survival instinct. 
Hyperrealistic human features with dirt and sweat. 
Professional photography style. Cinema quality character portrait. 
Realistic facial details showing fear and exhaustion. 
Natural skin tones with grime and wounds. Film grain and gritty color grading. 
Dramatic low-key lighting with harsh shadows. Shallow depth of field. 
Ultra detailed facial features showing stress. Torn clothing textures. 
Natural defensive pose. Award-winning horror film photography. 
Shot on high-end cinema camera. IMAX quality. 8K resolution. 
ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO CAPTIONS, NO WRITING, 
NO SYMBOLS of any kind. Pure photographic portrait only.
```

**기대 결과:**
- 😰 공포에 질린 실제 사람 표정
- 💦 땀, 먼지, 상처까지 리얼하게
- 🏚️ 배경은 폐허가 된 건물
- 🎬 좀비 영화(부산행 등) 주인공 느낌
- 📸 다큐멘터리 같은 현실감

---

## 🎯 실사 스타일 키워드

### 필수 키워드
```
✅ Photorealistic
✅ Hyperrealistic
✅ Cinema quality
✅ IMAX quality
✅ Professional photography
✅ 8K resolution
```

### 피부 & 얼굴
```
✅ Realistic facial details
✅ Natural skin tones
✅ Ultra detailed facial features
✅ Hyperrealistic skin textures
✅ Pores, wrinkles, freckles (필요시)
```

### 조명 & 구도
```
✅ Dramatic portrait lighting
✅ Soft shadows
✅ Shallow depth of field
✅ Bokeh background
✅ Professional headshot/full body composition
✅ Studio or environmental portrait
```

### 카메라 & 기술
```
✅ Shot on high-end cinema camera
✅ Film grain
✅ Cinematic color grading
✅ Professional color grading
✅ Award-winning photography
```

### 표정 & 감정
```
✅ Realistic expressions
✅ Natural pose
✅ Body language
✅ Emotional depth
✅ Authentic human emotion
```

---

## ⚠️ 주의사항

### 1. **Uncanny Valley 회피**
- ❌ 너무 완벽하면 오히려 이상함
- ✅ 자연스러운 불완전함 허용
- ✅ "Natural", "Authentic" 키워드 사용

### 2. **다양성 고려**
```typescript
// 장르별 스타일 조정
if (genre === 'Horror') {
  // 더러움, 상처, 공포 표정 강조
  'with dirt, sweat, and wounds'
  'showing fear and exhaustion'
}

if (genre === 'Fantasy') {
  // 의상, 장신구, 마법 효과
  'wearing elaborate fantasy costume'
  'with mystical accessories'
}

if (genre === 'SF') {
  // 미래적 의상, 기술 장비
  'in futuristic outfit'
  'with high-tech equipment'
}
```

### 3. **문화적 고려**
- ✅ 한국 배우 스타일도 잘 나옴
- ✅ 다양한 인종/성별 표현 가능
- ✅ 의상은 장르에 맞게 자동 생성

---

## 🎬 실사 캐릭터 활용 방안

### 1. **캐스팅 레퍼런스**
```
실사 캐릭터 → 캐스팅 디렉터에게 제출
"이런 느낌의 배우를 찾고 있습니다"
```

### 2. **3D 모델링 기준**
```
실사 이미지 → Photogrammetry → 3D 스캔
→ Unreal Engine MetaHuman 생성
```

### 3. **투자 유치 자료**
```
실사 캐릭터 → 투자 제안서에 포함
"실제 영화/게임처럼 보이는 비주얼"
```

### 4. **팬 아트 & 코스프레 참고**
```
실사 캐릭터 → 팬들이 코스프레 제작 시 레퍼런스
```

---

## 🔧 코드 구현

### buildCharacterPrompt() 함수

```typescript
function buildCharacterPrompt(
    characterName: string,
    analysis: DreamAnalysis,
    size: string = '1024x1024'
): string {
    const parts = [
        // 핵심: 실사 스타일
        `Photorealistic character portrait: ${characterName}`,
        
        // 세팅
        `Setting: ${analysis.world}`,
        
        // 실사 품질 키워드
        'Hyperrealistic human features and skin textures',
        'Cinema quality character portrait',
        'IMAX quality',
        '8K resolution',
        
        // 조명 & 구도
        'Dramatic portrait lighting with soft shadows',
        'Shallow depth of field with bokeh background',
        
        // 텍스트 금지
        'ABSOLUTELY NO TEXT...',
    ].filter(Boolean);
    
    return parts.join('. ') + '.';
}
```

---

## 📊 품질 체크리스트

### ✅ 실사 품질
- [ ] 피부 질감이 자연스러운가?
- [ ] 머리카락이 한 올 한 올 표현되었는가?
- [ ] 눈동자 반사가 리얼한가?
- [ ] 조명이 자연스러운가?
- [ ] 배경 보케 효과가 있는가?

### ✅ 감정 표현
- [ ] 표정이 장르에 맞는가?
- [ ] 감정이 눈빛에서 드러나는가?
- [ ] 자세가 자연스러운가?

### ✅ 기술적 품질
- [ ] 8K 수준의 고해상도인가?
- [ ] 필름 그레인이 있는가?
- [ ] 컬러 그레이딩이 영화 수준인가?

### ✅ 텍스트 금지
- [ ] 의상에 문자가 없는가?
- [ ] 배경에 간판/표지판이 없는가?
- [ ] 로고/심볼이 없는가?

---

## 🚀 향후 개선 방향

### 1. **연령/성별 명시**
```typescript
// 현재: AI가 자동 판단
characterName: "마법사 엘리온"

// 향후: 명시적 지정
age: "60대"
gender: "남성"
appearance: "회색 수염, 지혜로운 눈빛"
```

### 2. **의상 디테일**
```typescript
costume: {
  style: "중세 판타지",
  colors: ["보라색", "금색"],
  accessories: ["마법 지팡이", "고대 부적"]
}
```

### 3. **포즈 지정**
```typescript
pose: "full body standing"
// 또는
pose: "close-up headshot"
// 또는
pose: "action pose with weapon"
```

---

## ✨ 요약

Dream IP의 캐릭터는:

1. 🎭 **실사(Photorealistic) 스타일** - 일러스트가 아닌 실제 사람처럼
2. 🎬 **영화 배우 수준** - IMAX, 8K 퀄리티
3. 📸 **프로 사진 촬영** - 스튜디오 조명, 보케 효과
4. 😊 **감정 표현 생생** - 눈빛, 표정, 자세로 캐릭터 개성 전달
5. 🎯 **실용적** - 캐스팅 참고, 3D 모델링 기준, 투자 유치 자료

→ **"이 배우가 이 역할을 맡으면 어떨까?"를 바로 보여줍니다!**

