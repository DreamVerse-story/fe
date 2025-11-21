/**
 * 꿈 기록 페이지
 * Design Concept: "The Lucid Anchor" - Focus Mode
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DreamRecorder } from '@/_components/forms';
import { PageContainer } from '@/_components/layout';
import { useTranslation } from '@/lib/i18n/context';
import { useToast } from '@/_components/common';

export default function RecordPage() {
    const { t, locale } = useTranslation();
    const router = useRouter();
    const { showToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState<{
        currentStep: number;
        totalSteps: number;
        stepKey: string;
    } | null>(null);

    const handleSubmit = async (dreamText: string) => {
        setIsProcessing(true);
        setProgress({
            currentStep: 0,
            totalSteps: 6,
            stepKey: 'starting',
        });

        let eventSource: EventSource | null = null;

        try {
            const userId = 'user-001';

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
                                router.push('/market');
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

    return (
        <PageContainer
            showBackground={true}
            backgroundType="default"
        >
            <div className="w-full max-w-4xl mx-auto animate-fade-in">
                <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 tracking-tight text-white">
                        {t.record.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/80 leading-relaxed px-4">
                        {t.record.subtitle}
                    </p>
                </div>

                <div className="glass-panel rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 animate-slide-in-up shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
                    <DreamRecorder
                        onSubmit={handleSubmit}
                        isProcessing={isProcessing}
                        progress={progress}
                    />
                </div>

                {/* Tips Section */}
                <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 glass-panel rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 animate-scale-in border border-white/5 bg-white/5">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 flex items-center gap-2 sm:gap-3 text-primary">
                        <span className="text-lg sm:text-xl md:text-2xl">
                            💡
                        </span>
                        {locale === 'ko'
                            ? '더 좋은 결과를 위한 팁'
                            : 'Tips for Better Results'}
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 text-white/80 text-sm sm:text-base">
                        {locale === 'ko' ? (
                            <>
                                <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                    <span className="text-primary text-lg mt-0.5">
                                        ✓
                                    </span>
                                    <span>
                                        <strong className="text-white block mb-1">
                                            구체적인 장면
                                            묘사
                                        </strong>
                                        "어두운 숲"보다
                                        "달빛이 비치는
                                        고요한 대나무 숲"이
                                        더 좋습니다
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                    <span className="text-primary text-lg mt-0.5">
                                        ✓
                                    </span>
                                    <span>
                                        <strong className="text-white block mb-1">
                                            등장인물의 특징
                                        </strong>
                                        외모, 성격, 행동
                                        등을 자세히
                                        적어주세요
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                    <span className="text-primary text-lg mt-0.5">
                                        ✓
                                    </span>
                                    <span>
                                        <strong className="text-white block mb-1">
                                            감정과 분위기
                                        </strong>
                                        꿈에서 느낀 감정과
                                        전체적인 분위기를
                                        포함하세요
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                    <span className="text-primary text-lg mt-0.5">
                                        ✓
                                    </span>
                                    <span>
                                        <strong className="text-white block mb-1">
                                            주요 사건
                                        </strong>
                                        꿈에서 일어난 중요한
                                        사건이나 전환점을
                                        기록하세요
                                    </span>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                    <span className="text-primary text-lg mt-0.5">
                                        ✓
                                    </span>
                                    <span>
                                        <strong className="text-white block mb-1">
                                            Specific scene
                                            descriptions
                                        </strong>
                                        "A quiet bamboo
                                        forest illuminated
                                        by moonlight" is
                                        better than "dark
                                        forest"
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                    <span className="text-primary text-lg mt-0.5">
                                        ✓
                                    </span>
                                    <span>
                                        <strong className="text-white block mb-1">
                                            Character traits
                                        </strong>
                                        Describe appearance,
                                        personality, and
                                        actions in detail
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                    <span className="text-primary text-lg mt-0.5">
                                        ✓
                                    </span>
                                    <span>
                                        <strong className="text-white block mb-1">
                                            Emotions and
                                            atmosphere
                                        </strong>
                                        Include the feelings
                                        and overall mood of
                                        your dream
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                    <span className="text-primary text-lg mt-0.5">
                                        ✓
                                    </span>
                                    <span>
                                        <strong className="text-white block mb-1">
                                            Key events
                                        </strong>
                                        Record important
                                        events or turning
                                        points in your dream
                                    </span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </PageContainer>
    );
}
