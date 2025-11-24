# Key Visual 생성 가이드

Dream IP의 Key Visual은 드라마/영화/게임의 **공식 썸네일**로 사용되므로, 매우 화려하고 임팩트 있게 생성됩니다.

## 🎬 Key Visual의 목적

1. **드라마 포스터**: Netflix, Disney+ 등 OTT 플랫폼 썸네일
2. **영화 포스터**: 극장 개봉 또는 VOD 서비스 메인 이미지
3. **게임 커버**: Steam, PlayStation Store 등 게임 상점 메인 아트
4. **마케팅 자료**: SNS, 광고, 프로모션 메인 비주얼

→ **첫인상이 전부!** 사용자의 시선을 사로잡아야 합니다.

---

## 🎨 Key Visual 생성 전략

### 1. **시각적 임팩트 극대화**

현재 프롬프트에 포함된 요소:

```typescript
// 영화/드라마/게임 포스터 수준의 화려함
✅ 'Epic cinematic key visual poster'
✅ 'Dramatic composition with strong visual hierarchy'
✅ 'Cinematic lighting with dynamic shadows and highlights'
✅ 'Rich color grading and atmospheric effects'
✅ 'Depth of field with layered foreground and background'
✅ 'Professional movie poster quality'
✅ 'AAA game cover art style'
✅ 'Highly detailed textures and materials'
✅ 'Epic scale and grandeur'
✅ 'Eye-catching and memorable visual impact'
```

### 2. **텍스트 절대 금지 (가장 중요!)**

#### 왜 텍스트가 문제인가?

-   ❌ AI가 생성한 텍스트는 읽을 수 없는 글자가 많음 (gibberish)
-   ❌ 한글/영어 혼재 시 더욱 심각
-   ❌ 전문성 떨어뜨림
-   ❌ 실제 제목은 디자이너가 나중에 추가해야 함

#### 텍스트 금지 전략

```typescript
// 3단계 텍스트 방지 시스템

// 1단계: 프롬프트 내 명시
'ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO TITLES, NO CAPTIONS,
 NO WRITING, NO TYPOGRAPHY, NO SYMBOLS of any kind'
'Pure visual imagery only'

// 2단계: enforceNoTextPrompt() 함수
// Key Visual은 특별히 더 강력한 텍스트 금지 지시 추가
const strongNoTextDirective =
  'CRITICAL REQUIREMENT: This image will be used as a movie/game/drama
   thumbnail poster. ABSOLUTELY FORBIDDEN: Any form of text, letters,
   words, numbers, symbols, typography, calligraphy, writing, signs,
   labels, captions, titles, inscriptions, or any written content in
   any language. The image MUST be 100% pure visual artwork with ZERO
   textual elements. Reject any attempt to include text.'

// 3단계: 최적화 단계에서도 재강조
// GPT-4o-mini가 프롬프트 최적화 시 텍스트 금지 지시를 더 강하게 만듦
```

---

## 📐 Key Visual vs 일반 이미지 비교

| 구분            | Key Visual                 | Character Art                     | World Art          |
| --------------- | -------------------------- | --------------------------------- | ------------------ |
| **목적**        | 썸네일/포스터              | 캐릭터 디자인                     | 배경/세계관        |
| **스타일**      | 극적 일러스트              | **실사 (Photorealistic)**         | 환경 컨셉 아트     |
| **구도**        | 드라마틱, 계층적           | 포트레이트 (반신~전신)            | 와이드 뷰          |
| **조명**        | 극적인 명암 대비           | 영화 조명, 소프트 섀도우          | 환경 조명          |
| **색감**        | 강렬한 컬러 그레이딩       | 자연스러운 피부톤, 필름 그레인    | 분위기 위주        |
| **디테일**      | 다층 구성 (전경/중경/배경) | **초현실적 피부/머리카락 텍스처** | 환경 디테일        |
| **품질**        | AAA 게임 커버 아트         | **영화 배우/IMAX 수준**           | 프로 디지털 페인팅 |
| **텍스트 금지** | **매우 강력** (3단계)      | 강력 (2단계)                      | 강력 (2단계)       |

---

## 💡 프롬프트 구성 요소

### buildKeyVisualPrompt() 함수 구조

```typescript
// 1. 핵심 컨셉
`Epic cinematic key visual poster for ${analysis.summary}`

// 2. 세계관 & 위치
`World: ${analysis.world}`
`Setting: ${locations}`

// 3. 캐릭터 & 오브젝트
`Main subjects: ${characters}`
`Key elements: ${objects}`

// 4. 장르 & 분위기
`Genre: ${genres}`
`Mood: ${tones}`
`Emotion: ${emotions}`

// 5. 시각적 품질 (영화 포스터 수준)
'Dramatic composition with strong visual hierarchy'
'Cinematic lighting with dynamic shadows and highlights'
'Rich color grading and atmospheric effects'
'Depth of field with layered foreground and background'
'Professional movie poster quality'
'AAA game cover art style'
'Highly detailed textures and materials'
'Epic scale and grandeur'
'Eye-catching and memorable visual impact'

// 6. 기술적 요구사항
'Ultra high resolution digital art'
'Professional illustration'
'Masterpiece quality'

// 7. 텍스트 절대 금지 (최우선!)
'ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO TITLES,
 NO CAPTIONS, NO WRITING, NO TYPOGRAPHY, NO SYMBOLS of any kind'
'Pure visual imagery only'
```

---

## 🎯 사용 예시

### 예시 1: SF 장르 꿈

**입력 꿈:**

```
"우주 정거장에서 거대한 크리스탈 고래를 만났다.
 고래는 별빛을 먹으며 우주를 유영했다."
```

**생성된 Key Visual 프롬프트:**

```
Epic cinematic key visual poster for A dream of meeting a gigantic
crystal whale at a space station, feeding on starlight. World: Cosmic
space station surrounded by nebulae. Setting: Zero gravity environment,
floating observation deck. Main subjects: Translucent crystal whale,
Lone astronaut. Key elements: Starlight particles, Space station
architecture. Genre: Sci-Fi, Fantasy. Mood: Awe-inspiring, Mystical.
Emotion: Wonder, Solitude. Dramatic composition with strong visual
hierarchy. Cinematic lighting with dynamic shadows and highlights.
Rich color grading and atmospheric effects. Depth of field with layered
foreground and background. Professional movie poster quality.
AAA game cover art style. Highly detailed textures and materials.
Epic scale and grandeur. Eye-catching and memorable visual impact.
Ultra high resolution digital art. Professional illustration.
Masterpiece quality. ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS,
NO TITLES, NO CAPTIONS, NO WRITING, NO TYPOGRAPHY, NO SYMBOLS of any kind.
Pure visual imagery only.
```

**결과:**

-   ✅ 우주 정거장과 크리스탈 고래의 대비가 극적
-   ✅ 별빛 입자 효과로 몽환적 분위기
-   ✅ 넓은 우주 배경에 레이어드 구성
-   ✅ 텍스트 없음 (100% 비주얼)

### 예시 2: 호러 장르 꿈

**입력 꿈:**

```
"안개 낀 숲속 오래된 저택에서 붉은 눈을 가진 그림자를 봤다."
```

**생성된 Key Visual 프롬프트:**

```
Epic cinematic key visual poster for A dream of encountering a shadow
with glowing red eyes in an old mansion within a foggy forest.
World: Abandoned Victorian mansion in misty woods. Setting: Fog-shrouded
forest, Crumbling Gothic architecture. Main subjects: Dark shadow figure
with red eyes, Terrified protagonist. Key elements: Thick fog,
Broken windows. Genre: Horror, Mystery. Mood: Terrifying, Oppressive.
Emotion: Fear, Dread. Dramatic composition with strong visual hierarchy.
Cinematic lighting with dynamic shadows and highlights. Rich color
grading and atmospheric effects. Depth of field with layered foreground
and background. Professional movie poster quality. AAA game cover art
style. Highly detailed textures and materials. Epic scale and grandeur.
Eye-catching and memorable visual impact. Ultra high resolution digital
art. Professional illustration. Masterpiece quality. ABSOLUTELY NO TEXT,
NO LETTERS, NO WORDS, NO TITLES, NO CAPTIONS, NO WRITING, NO TYPOGRAPHY,
NO SYMBOLS of any kind. Pure visual imagery only.
```

**결과:**

-   ✅ 어두운 분위기의 고딕 호러 포스터
-   ✅ 붉은 눈의 그림자가 중앙 포커스
-   ✅ 안개와 조명으로 긴장감 극대화
-   ✅ 텍스트 없음 (100% 비주얼)

---

## 🔧 코드 구현

### 핵심 함수

```typescript
// 1. Key Visual 프롬프트 생성
buildKeyVisualPrompt(analysis: DreamAnalysis, size: string): string

// 2. 텍스트 금지 강제 추가
enforceNoTextPrompt(prompt: string, isKeyVisual: boolean): string

// 3. 이미지 생성
generateSingleImage(prompt: string, size: string, isKeyVisual: boolean): Promise<string>

// 4. 전체 비주얼 생성 (Key Visual + Character + World)
generateDreamVisuals(analysis: DreamAnalysis, onProgress): Promise<DreamVisual[]>
```

### 호출 흐름

```typescript
// API Route: /api/dreams/create
processDreamAsync()
  → analyzeDream()
  → generateStory()
  → generateDreamVisuals()
    → buildKeyVisualPrompt() // 화려한 포스터 수준 프롬프트 생성
    → generateSingleImage(..., isKeyVisual: true) // 텍스트 금지 강화
      → enforceNoTextPrompt(prompt, true) // Key Visual용 강력한 금지
      → OpenAI API call (gpt-image-1 or dall-e-2)
```

---

## 📊 품질 체크리스트

생성된 Key Visual이 다음 기준을 만족하는지 확인:

### ✅ 시각적 품질

-   [ ] 구도가 드라마틱하고 계층적인가?
-   [ ] 조명이 영화 포스터 수준인가?
-   [ ] 색감이 풍부하고 그레이딩이 잘 되어 있는가?
-   [ ] 전경/중경/배경 레이어가 명확한가?
-   [ ] 시선을 사로잡는 임팩트가 있는가?

### ✅ 컨셉 반영

-   [ ] 꿈의 핵심 컨셉이 잘 드러나는가?
-   [ ] 장르 특성이 명확한가? (SF, 판타지, 호러 등)
-   [ ] 분위기(톤)가 잘 표현되었는가?
-   [ ] 주요 캐릭터/오브젝트가 보이는가?

### ✅ 텍스트 금지 (가장 중요!)

-   [ ] **텍스트가 전혀 없는가?** (0% 텍스트)
-   [ ] 문자, 숫자, 기호, 로고 등 모든 형태의 글자가 없는가?
-   [ ] 영어, 한글, 일본어 등 어떤 언어도 없는가?
-   [ ] AI가 만든 "gibberish" 글자도 없는가?

### ✅ 기술적 요구사항

-   [ ] 해상도가 충분한가? (최소 1024x1024)
-   [ ] 이미지 파일 크기가 적절한가?
-   [ ] IPFS에 업로드되었는가?

---

## 🚀 향후 개선 방향

### 1. **모델 업그레이드**

```typescript
// 현재: gpt-image-1 (저비용)
model: 'gpt-image-1';

// 향후: DALL-E 3 (고품질)
model: 'dall-e-3';
quality: 'hd'; // 고해상도 옵션
```

### 2. **종횡비 다양화**

```typescript
// 현재: 1024x1024 (정사각형)
size: '1024x1024' -
    // 향후: 다양한 포맷 지원
    '1792x1024' - // 영화 포스터 (가로)
    '1024x1792' - // 드라마 포스터 (세로)
    '2048x1152'; // 게임 커버 (16:9)
```

### 3. **스타일 커스터마이징**

```typescript
// 장르별 시각적 스타일 템플릿
const styleTemplates = {
    SF: 'Cyberpunk neon lighting, Futuristic architecture',
    Fantasy:
        'Epic fantasy illustration, Magical atmosphere',
    Horror: 'Dark cinematic horror, Oppressive shadows',
    Romance: 'Soft dreamy lighting, Warm color palette',
};
```

### 4. **A/B 테스팅**

```typescript
// 같은 꿈에 대해 여러 버전 생성 후 사용자 선택
generateMultipleKeyVisuals(analysis, count: 3)
  → 사용자가 가장 임팩트 있는 것 선택
```

---

## 📚 참고 자료

### 영화 포스터 디자인 원칙

-   [Film Poster Design Best Practices](https://www.creativebloq.com/features/movie-poster-design)
-   [AAA Game Cover Art Trends](https://www.gamedeveloper.com/art/cover-art-trends)

### AI 이미지 생성 최적화

-   [DALL-E Prompt Engineering](https://platform.openai.com/docs/guides/images)
-   [Stable Diffusion Prompting Guide](https://stable-diffusion-art.com/prompt-guide/)

---

## ✨ 요약

Dream IP의 Key Visual은:

1. 🎬 **드라마/영화/게임 썸네일** 용도로 설계
2. 🎨 **극적이고 화려한** 영화 포스터 수준의 품질
3. 🚫 **텍스트 절대 금지** (3단계 방어 시스템)
4. 💎 **AAA급 퀄리티** 컨셉 아트 스타일
5. 👁️ **시선 사로잡기** - 첫인상이 전부!

→ **완벽한 비주얼만으로 이야기를 전달합니다!**
