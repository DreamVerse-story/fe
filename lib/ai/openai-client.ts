/**
 * OpenAI API 클라이언트 설정
 */

import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
    if (!openaiClient) {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error(
                'OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.'
            );
        }

        openaiClient = new OpenAI({
            apiKey,
        });
    }

    return openaiClient;
}
