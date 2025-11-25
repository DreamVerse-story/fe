/**
 * 꿈 기록 페이지 (Create)
 * AI로 꿈을 분석하고 IP 자산으로 변환
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { DreamRecorder } from '@/_components/forms';
import { PageContainer } from '@/_components/layout';
import { Card } from '@/_components/ui';
import { useTranslation } from '@/lib/i18n/context';
import { useToast } from '@/_components/common';

export default function RecordPage() {
    const { t, locale } = useTranslation();
    const router = useRouter();
    const { showToast } = useToast();
    const { address, isConnected } = useAccount();
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState<{
        currentStep: number;
        totalSteps: number;
        stepKey: string;
    } | null>(null);

    const handleSubmit = async (
        dreamText: string,
        model: 'openai' | 'flock'
    ) => {
        setIsProcessing(true);
        setProgress({
            currentStep: 0,
            totalSteps: 6,
            stepKey: 'starting',
        });

        let eventSource: EventSource | null = null;

        try {
            const userId = 'user-001';

            // 지갑이 연결되어 있으면 creatorAddress 전달
            // (Story Protocol 등록 시 생성자 검증용)
            const creatorAddress =
                isConnected && address
                    ? address
                    : undefined;

            // API 호출
            const response = await fetch(
                '/api/dreams/create',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        dreamText,
                        userId,
                        model, // 모델 선택 전달
                        creatorAddress, // 생성자 지갑 주소 (보안용)
                    }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.error || t.record.error
                );
            }

            const data = await response.json();
            const dreamId = data.dreamId;
            console.log('✅ Dream ID 받음:', dreamId);

            // Server-Sent Events로 진행 상태 스트리밍
            eventSource = new EventSource(
                `/api/dreams/${dreamId}/progress`
            );

            const currentEventSource = eventSource;

            currentEventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log(
                        '📡 SSE 메시지 수신:',
                        data
                    );

                    if (data.error) {
                        console.error(
                            'SSE 오류:',
                            data.error
                        );
                        currentEventSource.close();
                        setIsProcessing(false);
                        showToast(data.error, 'error');
                        return;
                    }

                    if (data.connected) {
                        console.log('✅ SSE 연결됨');
                        return;
                    }

                    if (data.progress) {
                        setProgress(data.progress);
                        setIsProcessing(true);
                        console.log(
                            '📊 진행 상태 업데이트:',
                            data.progress
                        );
                    }

                    // 완료 또는 실패 시
                    if (
                        data.completed ||
                        data.status === 'completed' ||
                        data.status === 'failed'
                    ) {
                        currentEventSource.close();

                        if (data.status === 'completed') {
                            if (data.progress) {
                                setProgress(data.progress);
                            }
                            showToast(
                                t.record.success,
                                'success'
                            );
                            // 2초 후에 gallery로 이동
                            setTimeout(() => {
                                setIsProcessing(false);
                                router.push(
                                    `/dreams/${dreamId}?new=true`
                                );
                            }, 2000);
                        } else {
                            setIsProcessing(false);
                            showToast(
                                t.record.error,
                                'error'
                            );
                        }
                    }
                } catch (error) {
                    console.error(
                        'SSE 데이터 파싱 오류:',
                        error
                    );
                }
            };

            currentEventSource.onerror = (error) => {
                console.error('SSE 연결 오류:', error);
                currentEventSource.close();
                setIsProcessing(false);
                showToast(t.record.error, 'error');
            };

            // 최대 5분 후 연결 종료
            setTimeout(() => {
                if (
                    currentEventSource.readyState !==
                    EventSource.CLOSED
                ) {
                    currentEventSource.close();
                }
            }, 5 * 60 * 1000);
        } catch (error) {
            console.error('Dream submission error:', error);
            if (eventSource) {
                eventSource.close();
            }
            showToast(
                error instanceof Error
                    ? error.message
                    : t.record.error,
                'error'
            );
            setIsProcessing(false);
            setProgress(null);
        }
    };

    const tips =
        locale === 'ko'
            ? [
                  {
                      icon: '🎨',
                      title: '구체적인 장면 묘사',
                      desc: '"어두운 숲"보다 "달빛이 비치는 고요한 대나무 숲"이 더 좋습니다',
                  },
                  {
                      icon: '👤',
                      title: '등장인물의 특징',
                      desc: '외모, 성격, 행동 등을 자세히 적어주세요',
                  },
                  {
                      icon: '💭',
                      title: '감정과 분위기',
                      desc: '꿈에서 느낀 감정과 전체적인 분위기를 포함하세요',
                  },
                  {
                      icon: '⚡',
                      title: '주요 사건',
                      desc: '꿈에서 일어난 중요한 사건이나 전환점을 기록하세요',
                  },
              ]
            : [
                  {
                      icon: '🎨',
                      title: 'Specific scenes',
                      desc: '"A quiet bamboo forest illuminated by moonlight" is better than "dark forest"',
                  },
                  {
                      icon: '👤',
                      title: 'Character traits',
                      desc: 'Describe appearance, personality, and actions in detail',
                  },
                  {
                      icon: '💭',
                      title: 'Emotions & mood',
                      desc: 'Include the feelings and overall atmosphere of your dream',
                  },
                  {
                      icon: '⚡',
                      title: 'Key events',
                      desc: 'Record important events or turning points in your dream',
                  },
              ];

    return (
        <PageContainer
            showBackground={true}
            backgroundType="default"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <span className="text-2xl">✨</span>
                        <span className="text-primary text-sm font-semibold">
                            {locale === 'ko'
                                ? 'AI 기반 꿈 분석'
                                : 'AI-Powered Dream Analysis'}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        {t.record.title}
                    </h1>
                    <p className="text-lg text-white/60 max-w-xl mx-auto">
                        {t.record.subtitle}
                    </p>
                </div>

                {/* Main Form Card */}
                <Card
                    variant="glass"
                    padding="lg"
                    className="mb-8 animate-fade-in"
                >
                    <DreamRecorder
                        onSubmit={handleSubmit}
                        isProcessing={isProcessing}
                        progress={progress}
                    />
                </Card>

                {/* Tips Section */}
                <Card
                    variant="glass"
                    padding="md"
                    className="animate-slide-in-up"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        {locale === 'ko'
                            ? '더 좋은 결과를 위한 팁'
                            : 'Tips for Better Results'}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {tips.map((tip, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors"
                            >
                                <span className="text-xl shrink-0">
                                    {tip.icon}
                                </span>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">
                                        {tip.title}
                                    </h4>
                                    <p className="text-sm text-white/60">
                                        {tip.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Process Steps */}
                <div className="mt-12 grid sm:grid-cols-3 gap-4 text-center">
                    {[
                        {
                            step: '1',
                            label:
                                locale === 'ko'
                                    ? '꿈 입력'
                                    : 'Input Dream',
                            icon: '✍️',
                        },
                        {
                            step: '2',
                            label:
                                locale === 'ko'
                                    ? 'AI 분석'
                                    : 'AI Analysis',
                            icon: '🤖',
                        },
                        {
                            step: '3',
                            label:
                                locale === 'ko'
                                    ? 'IP 생성'
                                    : 'Create IP',
                            icon: '🎨',
                        },
                    ].map((item, idx) => (
                        <div key={idx} className="relative">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                                {item.icon}
                            </div>
                            <p className="text-sm font-medium text-white/70">
                                {item.label}
                            </p>
                            {idx < 2 && (
                                <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-white/10 to-transparent" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
}
