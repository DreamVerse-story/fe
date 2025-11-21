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

    return `Ultra-detailed cinematic key visual, professional film/game quality. Visual concept based on: ${
        analysis.summary
    }. World: ${analysis.world}${
        locations ? `. Locations: ${locations}` : ''
    }${characters ? `. Characters: ${characters}` : ''}${
        objects ? `. Objects: ${objects}` : ''
    }. Genre: ${analysis.genres.join(
        ', '
    )}. Mood: ${analysis.tones.join(', ')}${
        emotions ? `. Emotions: ${emotions}` : ''
    }. Highly detailed textures, materials, surfaces. Rich atmospheric effects: lighting, fog, particles, weather. Complex composition, multiple detail layers. Dramatic lighting: highlights, shadows, rim lighting. Depth of field, atmospheric perspective. Professional matte painting, maximum detail. ${size} square format, foreground/midground/background details, cinematic scale, all elements visible. CRITICAL: This is a pure visual image. Do not include any text, letters, words, writing, signs, symbols, typography, calligraphy, inscriptions, labels, captions, titles, or any written content whatsoever. The image must contain only visual elements: characters, objects, environments, lighting, colors, and atmosphere.`;
}

/**
 * 캐릭터 컨셉 아트 프롬프트 구성
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

    return `Highly detailed professional character concept art, complete face and full body visible. Character: ${characterName}. Setting: ${
        analysis.world
    }${
        locations ? `, ${locations}` : ''
    }. Genre: ${analysis.genres.join(
        ', '
    )}. Mood: ${analysis.tones.join(', ')}${
        emotions ? `. Emotions: ${emotions}` : ''
    }. Ultra-detailed textures, fabric, skin, hair details. Clear facial features, expressive eyes. Detailed clothing and accessories. Rich colors, professional lighting with highlights and shadows. Atmospheric rendering. ${size} square format, character centered, complete face visible, no cropping. Include background from ${
        analysis.world
    }. Professional game/animation concept art quality, cinematic lighting, rich textures, maximum detail. CRITICAL: This is a pure visual image. Do not include any text, letters, words, writing, signs, symbols, typography, calligraphy, inscriptions, labels, captions, titles, or any written content whatsoever. The image must contain only visual elements: character, clothing, accessories, background, lighting, colors, and atmosphere.`;
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

    return `Ultra-detailed epic environment concept art, professional game/film quality. World: ${
        analysis.world
    }${
        locations ? `. Locations: ${locations}` : ''
    }. Genre: ${analysis.genres.join(
        ', '
    )}. Mood: ${analysis.tones.join(', ')}${
        objects ? `. Objects: ${objects}` : ''
    }${
        emotions ? `. Emotions: ${emotions}` : ''
    }. Highly detailed textures: stone, metal, wood, nature. Intricate architecture and structures. Atmospheric effects: fog, mist, light rays, particles. Foreground, midground, background layers. Complex lighting, shadows, reflections. Depth of field, atmospheric perspective. Cinematic composition. Professional matte painting, photorealistic details. ${size} square format, all elements visible, detailed perspective, maximum detail. CRITICAL: This is a pure visual image. Do not include any text, letters, words, writing, signs, symbols, typography, calligraphy, inscriptions, labels, captions, titles, or any written content whatsoever. The image must contain only visual elements: architecture, nature, objects, lighting, colors, and atmosphere.`;
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
2. Preserve key style requirements: detailed, professional, cinematic, etc.
3. Maintain technical specifications: lighting, textures, composition, etc.
4. Ensure the optimized prompt is under 1000 characters
5. Use concise but descriptive language
6. Keep important keywords that affect image quality
7. CRITICAL: You MUST ALWAYS include this exact text at the END of your optimized prompt: "CRITICAL: This is a pure visual image. Do not include any text, letters, words, writing, signs, symbols, typography, calligraphy, inscriptions, labels, captions, titles, or any written content whatsoever. The image must contain only visual elements."
8. Remove any references to titles, text, or written content from the prompt - only keep visual descriptions
9. Do NOT remove or shorten the CRITICAL text directive - it must be included exactly as specified

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
 */
function enforceNoTextPrompt(prompt: string): string {
    const noTextDirective =
        ' CRITICAL: This is a pure visual image. Do not include any text, letters, words, writing, signs, symbols, typography, calligraphy, inscriptions, labels, captions, titles, or any written content whatsoever. The image must contain only visual elements.';

    // 이미 텍스트 금지 지시가 포함되어 있는지 확인
    const hasNoTextDirective =
        prompt.toLowerCase().includes('no text') ||
        prompt.toLowerCase().includes('no letters') ||
        prompt.toLowerCase().includes('no words') ||
        prompt.toLowerCase().includes('pure visual');

    if (!hasNoTextDirective) {
        // 프롬프트 끝에 텍스트 금지 지시 추가
        return prompt + noTextDirective;
    }

    return prompt;
}

/**
 * GPT Image 1 Mini를 사용하여 단일 이미지 생성
 */
async function generateSingleImage(
    prompt: string,
    size: string = '1024x1024'
): Promise<string> {
    const client = getOpenAIClient();

    // 텍스트 금지 지시를 강제로 추가
    const finalPrompt = enforceNoTextPrompt(prompt);
    console.log(
        '🎨 최종 프롬프트 (텍스트 금지 포함):',
        finalPrompt.substring(finalPrompt.length - 200)
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
        const fallbackPrompt = enforceNoTextPrompt(prompt);
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
        // 1. Key Visual 생성
        if (onProgress) {
            await onProgress(3, 'generatingKeyVisual');
        }
        const originalKeyVisualPrompt =
            buildKeyVisualPrompt(analysis, imageSize);
        console.log('🔧 Key Visual 프롬프트 최적화 중...');
        const keyVisualPrompt = await optimizePrompt(
            originalKeyVisualPrompt,
            'key_visual'
        );
        console.log(
            `✅ 최적화 완료: ${keyVisualPrompt.length}자`
        );
        const keyVisualUrl = await generateSingleImage(
            keyVisualPrompt,
            imageSize
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

        // 2. 주요 캐릭터 (첫 번째 캐릭터만)
        if (analysis.characters.length > 0) {
            if (onProgress) {
                await onProgress(4, 'generatingCharacter');
            }
            const mainCharacter = analysis.characters[0];
            const originalCharacterPrompt =
                buildCharacterPrompt(
                    mainCharacter,
                    analysis,
                    imageSize
                );
            console.log('🔧 캐릭터 프롬프트 최적화 중...');
            const characterPrompt = await optimizePrompt(
                originalCharacterPrompt,
                'character'
            );
            console.log(
                `✅ 최적화 완료: ${characterPrompt.length}자`
            );
            const characterUrl = await generateSingleImage(
                characterPrompt,
                imageSize
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
        const originalWorldPrompt = buildWorldPrompt(
            analysis,
            imageSize
        );
        console.log('🔧 세계관 프롬프트 최적화 중...');
        const worldPrompt = await optimizePrompt(
            originalWorldPrompt,
            'world'
        );
        console.log(
            `✅ 최적화 완료: ${worldPrompt.length}자`
        );
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
