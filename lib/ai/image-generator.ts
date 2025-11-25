/**
 * 이미지 생성 서비스
 * GPT Image 1 Mini 사용
 */

import { getOpenAIClient } from './openai-client';
import type { DreamAnalysis, DreamVisual } from '../types';
import { generateId } from '../crypto';
import { uploadImagesToIPFS } from '../storage/ipfs';

/**
 * 캐릭터 상세 묘사 생성 (AI 사용)
 * 캐릭터 이름만 있는 경우 상세한 외형 묘사를 생성
 */
async function generateCharacterDescription(
    characterName: string,
    analysis: DreamAnalysis
): Promise<string> {
    const client = getOpenAIClient();

    const descriptionPrompt = `You are a character design expert. Create a highly detailed physical description for the character "${characterName}" based on the following dream analysis.

Dream context:
- Title: ${analysis.title}
- Summary: ${analysis.summary}
- World: ${analysis.world}
- Genres: ${analysis.genres.join(', ')}
- Tones: ${analysis.tones.join(', ')}
- Emotions: ${analysis.emotions.join(', ')}

Requirements:
1. Create an extremely detailed physical description including:
   - Age, gender, ethnicity/appearance
   - Facial features (eyes, nose, mouth, face shape, skin tone)
   - Hair (color, style, length, texture)
   - Body type and build
   - Height and proportions
   - Distinctive features or characteristics
   - Clothing style and colors (if relevant)
   - Overall appearance and vibe

2. Make it vivid and specific enough for consistent visual representation
3. Match the tone and genre of the dream
4. Be creative but coherent with the dream context

Return ONLY the detailed character description in English, nothing else.`;

    try {
        const completion =
            await client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a character design expert. Return only the character description without any explanation or additional text.',
                    },
                    {
                        role: 'user',
                        content: descriptionPrompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 300,
            });

        const description =
            completion.choices[0]?.message?.content?.trim() ||
            `A character named ${characterName} in ${analysis.world}`;

        return description;
    } catch (error) {
        console.error('캐릭터 묘사 생성 실패:', error);
        // 실패 시 기본 묘사 반환
        return `A character named ${characterName} in ${analysis.world}`;
    }
}

/**
 * Key Visual 생성 프롬프트 구성
 * 드라마/영화/게임 썸네일용 - 매우 화려하고 임팩트 있게
 */
async function buildKeyVisualPrompt(
    analysis: DreamAnalysis,
    characterDescription?: string,
    size: string = '1024x1024'
): Promise<string> {
    const locations = analysis.locations
        .slice(0, 2)
        .join(', ');
    const mainCharacter = analysis.characters[0];
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

        // 주인공 상세 묘사 (동일 인물 consistency를 위해)
        mainCharacter &&
            characterDescription &&
            `Main protagonist: ${mainCharacter}, ${characterDescription}`,
        mainCharacter &&
            !characterDescription &&
            `Main protagonist: ${mainCharacter}`,
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

        // 캐릭터 일관성 요구사항
        mainCharacter &&
            characterDescription &&
            'CRITICAL: The main character must appear exactly as described above. This same character will appear in other images, so maintain visual consistency in facial features, appearance, and distinctive characteristics.',

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
    characterDescription?: string,
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

        // 캐릭터 상세 묘사 (동일 인물 consistency를 위해)
        characterDescription
            ? `Character appearance: ${characterDescription}`
            : `Character: ${characterName}`,

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

        // 캐릭터 일관성 요구사항
        characterDescription &&
            'CRITICAL: This character must appear exactly as described above. This same character appears in the key visual image, so maintain visual consistency in facial features, appearance, and distinctive characteristics. The character must be recognizable as the same person across all images.',

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

    const optimizationPrompt = `You are a prompt optimization expert for AI image generation. Your task is to optimize the following image generation prompt while preserving all essential information and key details.

Original prompt:
${originalPrompt}

Image type: ${imageType}

Requirements:
1. Keep all essential information: characters, settings, genres, moods, objects, locations
2. Preserve key style requirements: epic, dramatic, cinematic, professional quality
3. Maintain visual impact keywords: lighting, composition, scale, grandeur
4. Use powerful, vivid language that creates visual impact
5. Keep keywords for AAA game/movie poster quality
6. CRITICAL FOR KEY VISUALS: This will be used as a thumbnail for movies/games/dramas, so it must be extremely eye-catching and impressive
7. ABSOLUTELY MANDATORY: Include strong "NO TEXT" directive at the end
8. The NO TEXT directive should emphasize: ZERO text, letters, words, titles, captions, writing, typography, symbols in ANY language
9. Do NOT remove or weaken the NO TEXT directive - make it even stronger if possible
10. CRITICAL FOR CHARACTER CONSISTENCY: If the prompt contains detailed character descriptions or mentions "same character" or "visual consistency", you MUST preserve these completely. Do not remove or shorten character appearance descriptions, as they are essential for maintaining character consistency across multiple images.

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

        return optimizedPrompt;
    } catch (error) {
        console.error('프롬프트 최적화 실패:', error);
        // 최적화 실패 시 원본 프롬프트 반환
        return originalPrompt;
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
            model: 'gpt-image-1-mini',
            prompt: finalPrompt,
            quality: 'low',
            size: size as
                | '1024x1024'
                | '1536x1024'
                | '1024x1536',
            output_format: 'png',
            n: 1,
        });

        // gpt-image-1-mini는 base64로 반환됩니다
        const imageData = response.data?.[0]?.b64_json;

        if (!imageData) {
            throw new Error(
                '이미지 데이터를 받지 못했습니다.'
            );
        }

        // base64를 data URL로 변환
        const outputFormat = 'png';
        const imageUrl = `data:image/${outputFormat};base64,${imageData}`;

        return imageUrl;
    } catch (error: any) {
        console.error(
            'GPT Image 1 Mini (gpt-image-1-mini) 생성 실패:',
            error
        );

        throw new Error(
            '이미지 생성에 실패했습니다: ' +
                (error.message || String(error))
        );
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
        // 주인공 캐릭터 상세 묘사 생성
        let characterDescription: string | undefined;
        if (analysis.characters.length > 0) {
            const mainCharacter = analysis.characters[0];
            console.log(
                `🎭 주인공 "${mainCharacter}" 상세 묘사 생성 중...`
            );
            characterDescription =
                await generateCharacterDescription(
                    mainCharacter,
                    analysis
                );
            console.log(
                `✅ 캐릭터 묘사 생성 완료: ${characterDescription.substring(
                    0,
                    100
                )}...`
            );
        }

        // 1. Key Visual 생성 (드라마/영화/게임 썸네일 수준)
        if (onProgress) {
            await onProgress(3, 'generatingKeyVisual');
        }
        const keyVisualPrompt = await buildKeyVisualPrompt(
            analysis,
            characterDescription,
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
                characterDescription,
                imageSize
            );
            console.log(
                '🎭 실사 스타일 캐릭터 생성 중 (영화 배우 수준)...'
            );
            console.log(`캐릭터: ${mainCharacter}`);
            if (characterDescription) {
                console.log(
                    `캐릭터 묘사: ${characterDescription.substring(
                        0,
                        100
                    )}...`
                );
            }
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
 * GPT Image 1 Mini 사용
 *
 * GPT Image 1 Mini:
 * - 모델: gpt-image-1-mini
 * - 품질: low, medium, high
 * - 크기 및 가격:
 *   - 1024x1024: Low $0.005 | Medium $0.011 | High $0.036
 *   - 1536x1024 (landscape): Low $0.006 | Medium $0.015 | High $0.052
 *   - 1024x1536 (portrait): Low $0.006 | Medium $0.015 | High $0.052
 * - 출력 형식: png, jpeg, webp
 * - 응답: base64 (b64_json) - data URL로 변환
 * - 배경: transparent, opaque, auto 지원
 * - 프롬프트: 최대 32,000자
 */
