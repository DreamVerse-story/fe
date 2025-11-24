/**
 * FLock.io API 클라이언트 설정
 * FLock.io는 OpenAI SDK와 호환되지만 x-litellm-api-key 헤더를 사용
 */

import OpenAI from 'openai';

let flockClient: OpenAI | null = null;

export function getFlockClient(): OpenAI {
    if (!flockClient) {
        const apiKey = process.env.FLOCK_API_KEY;

        if (!apiKey) {
            throw new Error(
                'FLOCK_API_KEY 환경 변수가 설정되지 않았습니다.'
            );
        }

        // FLock.io는 OpenAI SDK 호환이지만 커스텀 헤더 사용
        flockClient = new OpenAI({
            apiKey,
            baseURL: 'https://api.flock.io/v1',
            defaultHeaders: {
                'x-litellm-api-key': apiKey,
            },
        });
    }

    return flockClient;
}
