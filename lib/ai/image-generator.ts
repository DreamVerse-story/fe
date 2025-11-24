/**
 * 이미지 생성 서비스
 * OpenAI DALL-E 3 사용
 */

import { getOpenAIClient } from './openai-client';
import type { DreamAnalysis, DreamVisual } from '../types';
import { generateId } from '../crypto';
import { uploadImagesToIPFS } from '../storage/ipfs';

/**
 * Key Visual 생성 프롬프트 구성
 * 드라마/영화/게임 썸네일용 - 매우 화려하고 임팩트 있게
 */
function buildKeyVisualPrompt(
    analysis: DreamAnalysis,
    size: string = '1024x1024'
): string {
    const locations = analysis.locations
        .slice(0, 2)
        .join(', ');
    const characters = analysis.characters
        .slice(0, 2)
        .join(', ');
    const objects = analysis.objects.slice(0, 2).join(', ');
    const emotions = analysis.emotions
        .slice(0, 2)
        .join(', ');

    // 영화/드라마/게임 포스터 수준의 화려한 Key Visual 프롬프트
    const parts = [
        // 핵심 컨셉
        `Epic cinematic key visual poster for ${analysis.summary}`,

        // 세계관 & 위치
        `World: ${analysis.world}`,
        locations && `Setting: ${locations}`,

        // 캐릭터 & 오브젝트
        characters && `Main subjects: ${characters}`,
        objects && `Key elements: ${objects}`,

        // 장르 & 분위기
        `Genre: ${analysis.genres.join(', ')}`,
        `Mood: ${analysis.tones.join(', ')}`,
        emotions && `Emotion: ${emotions}`,

        // 시각적 품질 (영화 포스터 수준)
        'Dramatic composition with strong visual hierarchy',
        'Cinematic lighting with dynamic shadows and highlights',
        'Rich color grading and atmospheric effects',
        'Depth of field with layered foreground and background',
        'Professional movie poster quality',
        'AAA game cover art style',
        'Highly detailed textures and materials',
        'Epic scale and grandeur',
        'Eye-catching and memorable visual impact',

        // 기술적 요구사항
        'Ultra high resolution digital art',
        'Professional illustration',
        'Masterpiece quality',

        // 텍스트 절대 금지 (가장 중요!)
        'ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO TITLES, NO CAPTIONS, NO WRITING, NO TYPOGRAPHY, NO SYMBOLS of any kind',
        'Pure visual imagery only',
    ].filter(Boolean);

    return parts.join('. ') + '.';
}

/**
 * 캐릭터 컨셉 아트 프롬프트 구성
 * 실사(Photorealistic) 스타일 - 영화 배우 수준의 리얼리티
 */
function buildCharacterPrompt(
    characterName: string,
    analysis: DreamAnalysis,
    size: string = '1024x1024'
): string {
    const locations = analysis.locations
        .slice(0, 2)
        .join(', ');
    const emotions = analysis.emotions
        .slice(0, 3)
        .join(', ');

    // 실사 스타일 캐릭터 포트레이트
    const parts = [
        // 핵심: 실사 스타일 명시
        `Photorealistic character portrait: ${characterName}`,

        // 세팅 & 위치
        `Setting: ${analysis.world}`,
        locations && `Location: ${locations}`,

        // 장르 & 분위기
        `Genre: ${analysis.genres.join(', ')}`,
        `Atmosphere: ${analysis.tones.join(', ')}`,
        emotions && `Expression: ${emotions}`,

        // 실사 스타일 요구사항
        'Hyperrealistic human features and skin textures',
        'Professional photography style',
        'Cinema quality character portrait',
        'Realistic facial details and expressions',
        'Natural skin tones and lighting',
        'Film grain and cinematic color grading',

        // 구도 & 조명
        'Dramatic portrait lighting with soft shadows',
        'Shallow depth of field with bokeh background',
        'Professional headshot to full body composition',
        'Studio or environmental portrait setup',

        // 디테일
        'Ultra detailed facial features',
        'Realistic hair and clothing textures',
        'Natural pose and body language',
        'Award-winning portrait photography quality',

        // 기술적 품질
        'Shot on high-end cinema camera',
        'IMAX quality',
        '8K resolution',
        'Professional color grading',

        // 텍스트 절대 금지
        'ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO CAPTIONS, NO WRITING, NO SYMBOLS of any kind',
        'Pure photographic portrait only',
    ].filter(Boolean);

    return parts.join('. ') + '.';
}

/**
 * 세계관/배경 컨셉 아트 프롬프트 구성
 */
function buildWorldPrompt(
    analysis: DreamAnalysis,
    size: string = '1024x1024'
): string {
    const locations = analysis.locations
        .slice(0, 3)
        .join(', ');
    const objects = analysis.objects.slice(0, 3).join(', ');
    const emotions = analysis.emotions
        .slice(0, 2)
        .join(', ');

    // 안전한 환경 프롬프트
    const parts = [
        `Environment concept art: ${analysis.world}`,
        locations && `Featuring: ${locations}`,
        `Genre: ${analysis.genres.join(', ')}`,
        `Atmosphere: ${analysis.tones.join(', ')}`,
        objects && `Elements: ${objects}`,
        'Detailed landscape illustration',
        'Professional digital painting',
        'Wide scenic view',
        'No text in image',
    ].filter(Boolean);

    return parts.join('. ') + '.';
}

/**
 * 프롬프트를 1000자 이내로 최적화 (GPT 사용)
 */
async function optimizePrompt(
    originalPrompt: string,
    imageType: 'key_visual' | 'character' | 'world'
): Promise<string> {
    const client = getOpenAIClient();

    const optimizationPrompt = `You are a prompt optimization expert for AI image generation. Your task is to optimize the following image generation prompt to be under 1000 characters while preserving all essential information and key details.

Original prompt:
${originalPrompt}

Image type: ${imageType}

Requirements:
1. Keep all essential information: characters, settings, genres, moods, objects, locations
2. Preserve key style requirements: epic, dramatic, cinematic, professional quality
3. Maintain visual impact keywords: lighting, composition, scale, grandeur
4. Ensure the optimized prompt is under 1000 characters
5. Use powerful, vivid language that creates visual impact
6. Keep keywords for AAA game/movie poster quality
7. CRITICAL FOR KEY VISUALS: This will be used as a thumbnail for movies/games/dramas, so it must be extremely eye-catching and impressive
8. ABSOLUTELY MANDATORY: Include strong "NO TEXT" directive at the end
9. The NO TEXT directive should emphasize: ZERO text, letters, words, titles, captions, writing, typography, symbols in ANY language
10. Do NOT remove or weaken the NO TEXT directive - make it even stronger if possible

Return ONLY the optimized prompt, nothing else.`;

    try {
        const completion =
            await client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a prompt optimization expert. Return only the optimized prompt without any explanation or additional text.',
                    },
                    {
                        role: 'user',
                        content: optimizationPrompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: 500,
            });

        const optimizedPrompt =
            completion.choices[0]?.message?.content?.trim() ||
            originalPrompt;

        // 안전장치: 최적화된 프롬프트가 여전히 1000자를 초과하면 자르기
        const maxLength = 1000;
        if (optimizedPrompt.length > maxLength) {
            console.warn(
                `최적화된 프롬프트가 여전히 ${optimizedPrompt.length}자입니다. 자동으로 잘라냅니다.`
            );
            return (
                optimizedPrompt.substring(
                    0,
                    maxLength - 3
                ) + '...'
            );
        }

        return optimizedPrompt;
    } catch (error) {
        console.error('프롬프트 최적화 실패:', error);
        // 최적화 실패 시 원본 프롬프트를 1000자로 자르기
        const maxLength = 1000;
        return originalPrompt.length > maxLength
            ? originalPrompt.substring(0, maxLength - 3) +
                  '...'
            : originalPrompt;
    }
}

/**
 * 텍스트 금지 지시를 프롬프트에 강제로 추가
 * Key Visual은 특히 더 강력하게 텍스트 금지 강조
 */
function enforceNoTextPrompt(
    prompt: string,
    isKeyVisual: boolean = false
): string {
    // Key Visual용 강력한 텍스트 금지 지시
    const strongNoTextDirective = isKeyVisual
        ? ' CRITICAL REQUIREMENT: This image will be used as a movie/game/drama thumbnail poster. ABSOLUTELY FORBIDDEN: Any form of text, letters, words, numbers, symbols, typography, calligraphy, writing, signs, labels, captions, titles, inscriptions, or any written content in any language. The image MUST be 100% pure visual artwork with ZERO textual elements. Reject any attempt to include text.'
        : ' CRITICAL: This is a pure visual image. Do not include any text, letters, words, writing, signs, symbols, typography, calligraphy, inscriptions, labels, captions, titles, or any written content whatsoever. The image must contain only visual elements.';

    // 이미 텍스트 금지 지시가 포함되어 있는지 확인
    const hasNoTextDirective =
        prompt.toLowerCase().includes('no text') ||
        prompt.toLowerCase().includes('no letters') ||
        prompt.toLowerCase().includes('no words') ||
        prompt.toLowerCase().includes('absolutely no');

    if (!hasNoTextDirective) {
        // 프롬프트 끝에 텍스트 금지 지시 추가
        return prompt + strongNoTextDirective;
    }

    return prompt;
}

/**
 * GPT Image 1 Mini를 사용하여 단일 이미지 생성
 */
async function generateSingleImage(
    prompt: string,
    size: string = '1024x1024',
    isKeyVisual: boolean = false
): Promise<string> {
    const client = getOpenAIClient();

    // 텍스트 금지 지시를 강제로 추가 (Key Visual은 더 강력하게)
    const finalPrompt = enforceNoTextPrompt(
        prompt,
        isKeyVisual
    );

    if (isKeyVisual) {
        console.log(
            '🎬 Key Visual 생성 (영화/게임 썸네일 수준)'
        );
    }
    console.log(
        '🎨 최종 프롬프트 (텍스트 금지 포함):',
        finalPrompt.substring(finalPrompt.length - 250)
    );

    try {
        const response = await client.images.generate({
            model: 'gpt-image-1',
            prompt: finalPrompt,
            quality: 'low',
            size: size as
                | '1024x1024'
                | '1792x1024'
                | '1024x1792',
            n: 1,
        });

        const imageUrl = response.data?.[0]?.url;

        if (!imageUrl) {
            throw new Error(
                '이미지 URL을 받지 못했습니다.'
            );
        }

        return imageUrl;
    } catch (error: any) {
        console.error('GPT Image 1 Mini 생성 실패:', error);

        // GPT Image가 안되면 DALL-E 2로 폴백
        console.log('DALL-E 2로 폴백 시도...');

        // 프롬프트는 이미 최적화되어 1000자 이내이므로 그대로 사용
        // 텍스트 금지 지시는 이미 포함되어 있음
        const fallbackPrompt = enforceNoTextPrompt(
            prompt,
            isKeyVisual
        );
        const fallbackResponse =
            await client.images.generate({
                model: 'dall-e-2',
                prompt: fallbackPrompt,
                size: size as
                    | '256x256'
                    | '512x512'
                    | '1024x1024',
                n: 1,
            });

        const fallbackUrl = fallbackResponse.data?.[0]?.url;

        if (!fallbackUrl) {
            throw new Error(
                '이미지 생성에 실패했습니다: ' +
                    (error.message || String(error))
            );
        }

        return fallbackUrl;
    }
}

/**
 * Dream IP를 위한 비주얼 에셋 생성
 */
export async function generateDreamVisuals(
    analysis: DreamAnalysis,
    onProgress?: (
        step: number,
        stepKey: string
    ) => Promise<void>
): Promise<DreamVisual[]> {
    const visuals: DreamVisual[] = [];

    const imageSize = '1024x1024';

    try {
        // 1. Key Visual 생성 (드라마/영화/게임 썸네일 수준)
        if (onProgress) {
            await onProgress(3, 'generatingKeyVisual');
        }
        const keyVisualPrompt = buildKeyVisualPrompt(
            analysis,
            imageSize
        );
        console.log(
            '🎬 Key Visual 생성 중 (영화/게임 포스터 수준)...'
        );
        console.log(
            `프롬프트 길이: ${keyVisualPrompt.length}자`
        );
        console.log(
            `프롬프트 미리보기: ${keyVisualPrompt.substring(
                0,
                200
            )}...`
        );
        const keyVisualUrl = await generateSingleImage(
            keyVisualPrompt,
            imageSize,
            true // Key Visual임을 표시
        );

        visuals.push({
            id: generateId(),
            type: 'key_visual',
            imageUrl: keyVisualUrl,
            prompt: keyVisualPrompt,
            title: `${analysis.title} - Key Visual`,
            title_en: analysis.title_en
                ? `${analysis.title_en} - Key Visual`
                : undefined,
            description: analysis.summary,
            description_en: analysis.summary_en,
        });

        // 2. 주요 캐릭터 (첫 번째 캐릭터만) - 실사 스타일
        if (analysis.characters.length > 0) {
            if (onProgress) {
                await onProgress(4, 'generatingCharacter');
            }
            const mainCharacter = analysis.characters[0];
            const characterPrompt = buildCharacterPrompt(
                mainCharacter,
                analysis,
                imageSize
            );
            console.log(
                '🎭 실사 스타일 캐릭터 생성 중 (영화 배우 수준)...'
            );
            console.log(`캐릭터: ${mainCharacter}`);
            const characterUrl = await generateSingleImage(
                characterPrompt,
                imageSize,
                false // 캐릭터는 Key Visual만큼 강력한 텍스트 금지는 불필요
            );

            const characterEn =
                analysis.characters_en?.[0] ||
                mainCharacter;
            visuals.push({
                id: generateId(),
                type: 'character',
                imageUrl: characterUrl,
                prompt: characterPrompt,
                title: mainCharacter,
                title_en: characterEn,
                description: `${mainCharacter} 캐릭터 컨셉 아트`,
                description_en: `${characterEn} character concept art`,
            });
        }

        // 3. 세계관/배경
        if (onProgress) {
            await onProgress(5, 'generatingWorld');
        }
        const worldPrompt = buildWorldPrompt(
            analysis,
            imageSize
        );
        console.log('🎨 세계관 생성 중...');
        const worldUrl = await generateSingleImage(
            worldPrompt,
            imageSize
        );

        visuals.push({
            id: generateId(),
            type: 'world',
            imageUrl: worldUrl,
            prompt: worldPrompt,
            title: analysis.world,
            title_en: analysis.world_en,
            description: `${analysis.world} 세계관 컨셉 아트`,
            description_en: analysis.world_en
                ? `${analysis.world_en} world concept art`
                : undefined,
        });
    } catch (error) {
        console.error('이미지 생성 중 오류:', error);
        throw new Error(
            '이미지 생성에 실패했습니다: ' +
                (error instanceof Error
                    ? error.message
                    : String(error))
        );
    }

    // 4. IPFS에 업로드 (옵션)
    try {
        if (process.env.PINATA_JWT) {
            if (onProgress) {
                await onProgress(6, 'uploadingIPFS');
            }
            console.log('🔄 이미지를 IPFS에 업로드 중...');

            const imagesToUpload = visuals.map(
                (visual) => ({
                    url: visual.imageUrl,
                    name: `${visual.type}-${visual.id}.png`,
                })
            );

            const ipfsResults = await uploadImagesToIPFS(
                imagesToUpload
            );

            // IPFS URL 및 CID를 visuals에 추가
            visuals.forEach((visual, index) => {
                const ipfsResult = ipfsResults[index];
                if (ipfsResult.cid) {
                    visual.ipfsCid = ipfsResult.cid;
                    visual.ipfsUrl = ipfsResult.ipfsUrl;
                }
            });

            console.log('✅ IPFS 업로드 완료');
        } else {
            console.log(
                '⚠️ PINATA_JWT가 설정되지 않아 IPFS 업로드를 건너뜁니다.'
            );
        }
    } catch (error) {
        console.error(
            '⚠️ IPFS 업로드 실패 (이미지는 OpenAI URL 유지):',
            error
        );
        // IPFS 업로드 실패해도 OpenAI URL은 유지되므로 계속 진행
    }

    return visuals;
}

/**
 * 이미지 생성 전략:
 * 1차 시도: GPT Image 1 Mini (초저비용 $0.005/이미지)
 * 2차 폴백: DALL-E 2 (저비용 $0.020/이미지)
 *
 * GPT Image 1 Mini:
 * - 모델: gpt-image-1-mini
 * - 품질: low
 * - 크기: 1024x1024
 * - 비용: $0.005/이미지
 *
 * DALL-E 2 (폴백):
 * - 모델: dall-e-2
 * - 크기: 1024x1024
 * - 비용: $0.020/이미지
 */
