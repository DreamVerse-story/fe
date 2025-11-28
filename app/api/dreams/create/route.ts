/**
 * POST /api/dreams/create
 * 새로운 꿈 기록 생성 및 AI 처리 시작
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    generateId,
    generateDreamHash,
} from '@/lib/crypto';
import { analyzeDream } from '@/lib/ai/dream-analyzer';
import { generateStory } from '@/lib/ai/story-generator';
import { generateDreamVisuals } from '@/lib/ai/image-generator';
import {
    saveDream,
    getDreamById,
} from '@/lib/storage/mongo-storage';
import type {
    DreamIPPackage,
    AnalysisModel,
} from '@/lib/types';

interface CreateDreamRequest {
    dreamText: string;
    userId: string;
    model?: AnalysisModel; // 'openai' | 'flock'
    creatorAddress?: string; // Dream IP를 생성한 사용자의 지갑 주소 (보안용)
}

export async function POST(request: NextRequest) {
    try {
        const body =
            (await request.json()) as CreateDreamRequest;

        if (!body.dreamText || !body.userId) {
            return NextResponse.json(
                {
                    error: '꿈 내용과 사용자 ID가 필요합니다.',
                },
                { status: 400 }
            );
        }

        // 1. Dream Record 생성
        const dreamId = generateId();
        const recordedAt = new Date().toISOString();
        const dreamHash = await generateDreamHash(
            body.dreamText
        );

        // 2. 초기 패키지 생성 (processing 상태)
        const initialPackage: DreamIPPackage = {
            id: dreamId,
            dreamRecord: {
                id: generateId(),
                userId: body.userId,
                dreamText: body.dreamText,
                recordedAt,
            },
            analysis: {
                title: '',
                summary: '',
                characters: [],
                world: '',
                objects: [],
                locations: [],
                tones: [],
                genres: [],
                emotions: [],
            },
            visuals: [],
            story: {
                synopsis: '',
                sceneBits: [],
                lore: '',
            },
            dreamHash,
            createdAt: recordedAt,
            updatedAt: recordedAt,
            isPublic: false,
            status: 'processing',
            progress: {
                currentStep: 0,
                totalSteps: 6,
                stepKey: 'starting',
            },
            creatorAddress: body.creatorAddress, // 생성자 지갑 주소 저장 (보안용)
        };

        // 3. 초기 상태 저장
        try {
            await saveDream(initialPackage);
        } catch (saveError) {
            console.error(
                '초기 상태 저장 실패:',
                saveError
            );
            throw new Error(
                `Dream 초기 상태 저장 실패: ${
                    saveError instanceof Error
                        ? saveError.message
                        : String(saveError)
                }`
            );
        }

        // 4. 즉시 dreamId 반환하고 백그라운드에서 처리 시작
        // 클라이언트가 즉시 polling을 시작할 수 있도록
        processDreamAsync(
            dreamId,
            body.dreamText,
            initialPackage,
            body.model || 'openai' // 기본값: openai
        ).catch((error) => {
            console.error('백그라운드 처리 오류:', error);
        });

        // 즉시 dreamId 반환
        return NextResponse.json({
            success: true,
            dreamId,
        });
    } catch (error) {
        console.error('Dream 생성 오류:', error);
        return NextResponse.json(
            {
                error: '서버 오류가 발생했습니다.',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}

/**
 * 백그라운드에서 Dream IP 처리 (비동기)
 */
async function processDreamAsync(
    dreamId: string,
    dreamText: string,
    initialPackage: DreamIPPackage,
    model: AnalysisModel = 'openai'
) {
    try {
        // 단계 1: AI 분석
        await saveDream({
            ...initialPackage,
            progress: {
                currentStep: 1,
                totalSteps: 6,
                stepKey: 'analyzing',
            },
            updatedAt: new Date().toISOString(),
        });
        console.log(
            `✅ Step 1/6: 꿈 분석 시작 (모델: ${model.toUpperCase()})`
        );

        const analysis = await analyzeDream(
            dreamText,
            model
        );

        // 분석 완료 후 진행 상태 업데이트
        await saveDream({
            ...initialPackage,
            analysis,
            progress: {
                currentStep: 1,
                totalSteps: 6,
                stepKey: 'analyzing',
            },
            updatedAt: new Date().toISOString(),
        });
        console.log('✅ Step 1/6: 꿈 분석 완료');

        // 단계 2: 스토리 생성
        await saveDream({
            ...initialPackage,
            analysis,
            progress: {
                currentStep: 2,
                totalSteps: 6,
                stepKey: 'generatingStory',
            },
            updatedAt: new Date().toISOString(),
        });
        console.log('✅ Step 2/6: 스토리 생성 시작');

        const story = await generateStory(
            dreamText,
            analysis
        );

        // 스토리 생성 완료 후 진행 상태 업데이트
        await saveDream({
            ...initialPackage,
            analysis,
            story,
            progress: {
                currentStep: 2,
                totalSteps: 6,
                stepKey: 'generatingStory',
            },
            updatedAt: new Date().toISOString(),
        });
        console.log('✅ Step 2/6: 스토리 생성 완료');

        // 단계 3-6: 비주얼 생성 (내부에서 단계별 업데이트)
        const visuals = await generateDreamVisuals(
            analysis,
            async (step: number, stepKey: string) => {
                // 진행 상태를 파일에 저장 (polling을 위해)
                try {
                    const currentPackage =
                        await getDreamById(dreamId);
                    if (currentPackage) {
                        await saveDream({
                            ...currentPackage,
                            analysis,
                            story,
                            progress: {
                                currentStep: step,
                                totalSteps: 6,
                                stepKey,
                            },
                            updatedAt:
                                new Date().toISOString(),
                        });
                    } else {
                        await saveDream({
                            ...initialPackage,
                            analysis,
                            story,
                            progress: {
                                currentStep: step,
                                totalSteps: 6,
                                stepKey,
                            },
                            updatedAt:
                                new Date().toISOString(),
                        });
                    }
                    console.log(
                        `✅ 진행 상태 업데이트: Step ${step}/6 - ${stepKey}`
                    );
                } catch (error) {
                    console.error(
                        '진행 상태 업데이트 실패:',
                        error
                    );
                }
            }
        );

        // 완성된 패키지 저장
        const completedPackage: DreamIPPackage = {
            ...initialPackage,
            analysis,
            story,
            visuals,
            updatedAt: new Date().toISOString(),
            status: 'completed',
            progress: {
                currentStep: 6,
                totalSteps: 6,
                stepKey: 'completed',
            },
        };

        await saveDream(completedPackage);
        console.log('✅ Dream IP 생성 완료:', dreamId);
    } catch (error) {
        // AI 처리 실패 시
        console.error('백그라운드 처리 오류:', error);
        try {
            const failedPackage: DreamIPPackage = {
                ...initialPackage,
                status: 'failed',
                updatedAt: new Date().toISOString(),
                progress: {
                    currentStep: 6,
                    totalSteps: 6,
                    stepKey: 'failed',
                },
            };
            await saveDream(failedPackage);
        } catch (saveError) {
            console.error(
                '실패 상태 저장 오류:',
                saveError
            );
        }
    }
}
