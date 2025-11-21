/**
 * 스토리 생성 AI 서비스
 * OpenAI GPT를 사용하여 시놉시스, 장면 비트, 로어 생성
 */

import { getOpenAIClient } from './openai-client';
import type { DreamAnalysis, DreamStory } from '../types';

const STORY_GENERATION_PROMPT = `당신은 전문 스토리텔러이자 세계관 설정 전문가입니다.
제공된 꿈 분석 결과를 바탕으로 다음을 생성해주세요.
**중요: 한국어와 영어 버전을 모두 생성해야 합니다.**

1. synopsis: 1-2페이지 분량의 시놉시스 (영화/드라마/게임에 사용할 수 있는 수준, 한국어, 문자열)
2. synopsis_en: 1-2페이지 분량의 시놉시스 (영어, 문자열)
3. sceneBits: 주요 장면들의 비트 (5-8개 정도의 장면 설명, 한국어, 문자열 배열)
4. sceneBits_en: 주요 장면들의 비트 (5-8개 정도의 장면 설명, 영어, 문자열 배열)
5. lore: 세계관 설정 요약 (배경, 규칙, 특징 등을 포함한 긴 문자열, 한국어)
6. lore_en: 세계관 설정 요약 (배경, 규칙, 특징 등을 포함한 긴 문자열, 영어)

창의적이고 상업적으로 활용 가능한 형태로 작성해주세요.
반드시 JSON 형식으로만 응답해주세요.

중요: lore와 lore_en은 반드시 하나의 긴 문자열로 작성해주세요. 객체나 배열이 아닌 문자열입니다!

예시:
{
  "synopsis": "광활한 사막 한가운데, 별이 쏟아지는 밤하늘 아래...",
  "synopsis_en": "In the middle of a vast desert, under a night sky filled with falling stars...",
  "sceneBits": [
    "주인공이 무한한 사막을 홀로 걷는다",
    "하늘에서 거대한 그림자가 나타난다",
    "별고래가 별빛을 먹으며 우아하게 헤엄친다"
  ],
  "sceneBits_en": [
    "The protagonist walks alone through the endless desert",
    "A massive shadow appears in the sky",
    "The star whale gracefully swims, feeding on starlight"
  ],
  "lore": "이 세계에서는 밤하늘의 별들이 실체를 가지며, 거대한 생명체들이 우주 공간을 자유롭게 헤엄칩니다. 별고래는 이 세계의 신화적 존재로, 별빛을 먹고 자라며 우주의 균형을 유지하는 역할을 합니다...",
  "lore_en": "In this world, the stars in the night sky have physical form, and gigantic creatures swim freely through space. The star whale is a mythical being in this world, feeding on starlight to grow and maintaining the balance of the universe..."
}`;

export async function generateStory(
    dreamText: string,
    analysis: DreamAnalysis
): Promise<DreamStory> {
    const client = getOpenAIClient();

    const completion = await client.chat.completions.create(
        {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: STORY_GENERATION_PROMPT,
                },
                {
                    role: 'user',
                    content: `원본 꿈:\n${dreamText}\n\n분석 결과:\n${JSON.stringify(
                        analysis,
                        null,
                        2
                    )}\n\n이를 바탕으로 스토리를 생성해주세요.`,
                },
            ],
            temperature: 0.8,
            response_format: { type: 'json_object' },
        }
    );

    const responseText =
        completion.choices[0]?.message?.content;

    if (!responseText) {
        throw new Error(
            '스토리 생성 결과를 받지 못했습니다.'
        );
    }

    const story = JSON.parse(responseText) as DreamStory;

    return story;
}
