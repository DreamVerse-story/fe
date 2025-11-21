/**
 * 꿈 기록 페이지
 * Design Concept: "The Lucid Anchor" - Focus Mode
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DreamRecorder } from '../components/DreamRecorder';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ChaosBackground } from '../components/ChaosBackground';
import { useTranslation } from '@/lib/i18n/context';
import { useToast } from '../components/Toast';
import Link from 'next/link';

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
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
            {/* Background Elements */}
            <ChaosBackground />
            <div className="fixed inset-0 z-0 bg-background/80 backdrop-blur-[2px] pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-black/20 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold tracking-wider text-white mix-blend-difference hover:opacity-80 transition-opacity">
                        IDI <span className="text-base opacity-50 font-normal ml-1">BETA</span>
                    </Link>
                    
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex gap-8 text-base font-bold tracking-wide">
                            {[
                                { href: '/record', label: 'RECORD' },
                                { href: '/market', label: 'MARKET' },
                                { href: '/stats', label: 'STATS' },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`transition-colors uppercase text-base tracking-widest ${
                                        item.href === '/record' 
                                        ? 'text-primary' 
                                        : 'text-white/80 hover:text-primary'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 py-32">
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                            {t.record.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            {t.record.subtitle}
                        </p>
                    </div>

                    <div className="glass-panel rounded-3xl p-8 md:p-12 animate-slide-in-up shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
                        <DreamRecorder
                            onSubmit={handleSubmit}
                            isProcessing={isProcessing}
                            progress={progress}
                        />
                    </div>

                    {/* Tips Section */}
                    <div className="mt-12 glass-panel rounded-2xl p-8 animate-scale-in border border-white/5 bg-white/5">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-primary">
                            <span className="text-2xl">💡</span>
                            {locale === 'ko' ? '더 좋은 결과를 위한 팁' : 'Tips for Better Results'}
                        </h3>
                        <ul className="grid md:grid-cols-2 gap-4 text-white/80 text-base">
                            {locale === 'ko' ? (
                                <>
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                        <span className="text-primary text-lg mt-0.5">✓</span>
                                        <span>
                                            <strong className="text-white block mb-1">구체적인 장면 묘사</strong>
                                            "어두운 숲"보다 "달빛이 비치는 고요한 대나무 숲"이 더 좋습니다
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                        <span className="text-primary text-lg mt-0.5">✓</span>
                                        <span>
                                            <strong className="text-white block mb-1">등장인물의 특징</strong>
                                            외모, 성격, 행동 등을 자세히 적어주세요
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                        <span className="text-primary text-lg mt-0.5">✓</span>
                                        <span>
                                            <strong className="text-white block mb-1">감정과 분위기</strong>
                                            꿈에서 느낀 감정과 전체적인 분위기를 포함하세요
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                        <span className="text-primary text-lg mt-0.5">✓</span>
                                        <span>
                                            <strong className="text-white block mb-1">주요 사건</strong>
                                            꿈에서 일어난 중요한 사건이나 전환점을 기록하세요
                                        </span>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                        <span className="text-primary text-lg mt-0.5">✓</span>
                                        <span>
                                            <strong className="text-white block mb-1">Specific scene descriptions</strong>
                                            "A quiet bamboo forest illuminated by moonlight" is better than "dark forest"
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                        <span className="text-primary text-lg mt-0.5">✓</span>
                                        <span>
                                            <strong className="text-white block mb-1">Character traits</strong>
                                            Describe appearance, personality, and actions in detail
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                        <span className="text-primary text-lg mt-0.5">✓</span>
                                        <span>
                                            <strong className="text-white block mb-1">Emotions and atmosphere</strong>
                                            Include the feelings and overall mood of your dream
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5">
                                        <span className="text-primary text-lg mt-0.5">✓</span>
                                        <span>
                                            <strong className="text-white block mb-1">Key events</strong>
                                            Record important events or turning points in your dream
                                        </span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
