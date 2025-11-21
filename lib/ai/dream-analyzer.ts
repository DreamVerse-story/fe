/**
 * Dream 분석 AI 서비스
 * OpenAI GPT를 사용하여 꿈 텍스트를 구조화된 데이터로 변환
 */

import { getOpenAIClient } from './openai-client';
import type { DreamAnalysis } from '../types';

const DREAM_ANALYSIS_PROMPT = `당신은 꿈 해석 및 스토리 분석 전문가입니다.
사용자가 기록한 꿈 내용을 분석하여 다음 요소들을 추출해주세요.
**중요: 한국어와 영어 버전을 모두 생성해야 합니다.**

1. title: 꿈의 핵심을 담은 매력적인 제목 (한국어)
2. title_en: 꿈의 핵심을 담은 매력적인 제목 (영어)
3. summary: 짧은 logline 형태의 요약 (1-2 문장, 한국어)
4. summary_en: 짧은 logline 형태의 요약 (1-2 문장, 영어)
5. characters: 꿈에 등장한 주요 캐릭터들 (배열, 한국어)
6. characters_en: 꿈에 등장한 주요 캐릭터들 (배열, 영어)
7. world: 꿈이 일어난 세계나 주요 장소 (한국어)
8. world_en: 꿈이 일어난 세계나 주요 장소 (영어)
9. objects: 중요한 물체나 아이템들 (배열)
10. locations: 구체적인 장소들 (배열)
11. tones: 꿈의 전반적인 느낌/분위기 (배열, 한국어, 2-4개 정도)
    - 꿈의 내용에 맞는 적절한 톤을 자유롭게 생성하세요
    - 예: ["몽환적", "웅장함"], ["공포", "긴장감"], ["따뜻함", "평화로움"] 등
12. tones_en: 꿈의 전반적인 느낌/분위기 (배열, 영어, 2-4개 정도)
    - tones의 영어 번역 버전을 생성하세요
    - 예: ["Dreamy", "Epic"], ["Horror", "Tension"], ["Warm", "Peaceful"] 등
13. genres: 장르 분류 (배열, 한국어, 1-3개 정도)
    - 꿈의 내용에 맞는 적절한 장르를 자유롭게 생성하세요
    - 예: ["SF", "판타지"], ["호러", "미스터리"], ["로맨스", "드라마"] 등
    - 일반적인 장르 분류를 사용하되, 꿈의 특성에 맞게 자유롭게 선택하세요
14. genres_en: 장르 분류 (배열, 영어, 1-3개 정도)
    - genres의 영어 번역 버전을 생성하세요
    - 예: ["Sci-Fi", "Fantasy"], ["Horror", "Mystery"], ["Romance", "Drama"] 등
15. emotions: 꿈에서 느껴지는 주요 감정들 (배열, 한국어)

반드시 JSON 형식으로만 응답해주세요.

예시:
{
  "title": "사막 위의 별고래",
  "title_en": "Star Whale Above the Desert",
  "summary": "사막 한가운데에서 별빛을 먹는 거대한 고래를 만나는 꿈",
  "summary_en": "A dream of meeting a gigantic whale that feeds on starlight in the middle of a desert",
  "characters": ["별고래", "방랑자 소년"],
  "characters_en": ["Star Whale", "Wandering Boy"],
  "world": "별이 쏟아지는 사막",
  "world_en": "Desert under a shower of stars",
  "objects": ["별빛", "모래시계"],
  "locations": ["무한 사막", "밤하늘"],
  "tones": ["몽환적", "웅장함", "신비로움"],
  "tones_en": ["Dreamy", "Epic", "Mysterious"],
  "genres": ["SF", "판타지", "모험"],
  "genres_en": ["Sci-Fi", "Fantasy", "Adventure"],
  "emotions": ["경이로움", "고독함", "평화로움"]
}`;

export async function analyzeDream(
    dreamText: string
): Promise<DreamAnalysis> {
    const client = getOpenAIClient();

    const completion = await client.chat.completions.create(
        {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: DREAM_ANALYSIS_PROMPT,
                },
                {
                    role: 'user',
                    content: `다음 꿈을 분석해주세요:\n\n${dreamText}`,
                },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
        }
    );

    const responseText =
        completion.choices[0]?.message?.content;

    if (!responseText) {
        throw new Error('AI 분석 결과를 받지 못했습니다.');
    }

    const analysis = JSON.parse(
        responseText
    ) as DreamAnalysis;

    return analysis;
}
