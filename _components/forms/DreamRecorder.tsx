/**
 * 꿈 기록 컴포넌트
 * 텍스트 입력을 통한 꿈 기록 기능
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button, Textarea } from '../ui';
import type { AnalysisModel } from '@/lib/types';

interface DreamRecorderProps {
    onSubmit: (
        dreamText: string,
        model: AnalysisModel
    ) => Promise<void>;
    isProcessing?: boolean;
    progress?: {
        currentStep: number;
        totalSteps: number;
        stepKey: string;
    } | null;
}

export function DreamRecorder({
    onSubmit,
    isProcessing = false,
    progress = null,
}: DreamRecorderProps) {
    const { t, locale } = useTranslation();
    const [dreamText, setDreamText] = useState('');
    const [charCount, setCharCount] = useState(0);
    // GPT-4o Mini를 기본 모델로 사용
    const selectedModel: AnalysisModel = 'openai';

    // 디버깅: progress 업데이트 추적
    useEffect(() => {
        if (progress) {
            console.log(
                '🎨 DreamRecorder progress 업데이트:',
                {
                    isProcessing,
                    progress,
                    stepKey: progress.stepKey,
                    currentStep: progress.currentStep,
                    totalSteps: progress.totalSteps,
                }
            );
        }
    }, [progress, isProcessing]);

    const handleChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const text = e.target.value;
        setDreamText(text);
        setCharCount(text.length);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!dreamText.trim()) {
            return;
        }

        if (dreamText.trim().length < 50) {
            return;
        }

        await onSubmit(dreamText, selectedModel);
        setDreamText('');
        setCharCount(0);
    };

    const isValid = charCount >= 50;
    const charProgress = Math.min(
        (charCount / 50) * 100,
        100
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full space-y-6"
        >
            <div className="space-y-2 sm:space-y-3">
                <label
                    htmlFor="dream-text"
                    className="block text-base sm:text-lg md:text-xl font-semibold text-white"
                >
                    {locale === 'ko'
                        ? '오늘 꾼 꿈을 기록해주세요'
                        : 'Record Your Dream'}
                </label>

                <div className="relative">
                    <Textarea
                        id="dream-text"
                        value={dreamText}
                        onChange={handleChange}
                        disabled={isProcessing}
                        placeholder={t.record.placeholder}
                        rows={10}
                    />

                    {/* Character Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border-2 border-white/20 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="text-base font-medium">
                                <span
                                    className={`${
                                        isValid
                                            ? 'text-green-400'
                                            : 'text-white/70'
                                    }`}
                                >
                                    {charCount}
                                </span>
                                <span className="text-white/60">
                                    {' '}
                                    / 50+
                                </span>
                            </div>
                            {isValid && (
                                <svg
                                    className="w-5 h-5 text-green-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
                        <div
                            className={`h-full transition-all duration-300 ${
                                isValid
                                    ? 'bg-linear-to-r from-green-500 to-emerald-500'
                                    : 'bg-linear-to-r from-blue-500 to-purple-500'
                            }`}
                            style={{
                                width: `${charProgress}%`,
                            }}
                        />
                    </div>
                    <p className="text-sm text-white/80 font-medium">
                        {isValid ? (
                            <span className="text-green-400 font-medium">
                                ✓ {t.record.minLength}
                            </span>
                        ) : (
                            <span className="text-white/60">
                                {t.record.minLength}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isProcessing || !isValid}
            >
                {isProcessing ? (
                    <>
                        <LoadingSpinner size="sm" />
                        {t.record.submitting}
                    </>
                ) : (
                    <>
                        <svg
                            className="w-4 h-4 sm:w-5 sm:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                        {t.record.submitButton}
                    </>
                )}
            </Button>

            {progress && (
                <div className="space-y-4 p-6 bg-white/5 border-2 border-white/20 rounded-xl animate-fade-in backdrop-blur-sm">
                    {/* Progress Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">
                            {progress.stepKey ===
                            'completed' ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5 text-green-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {locale === 'ko'
                                        ? '완료!'
                                        : 'Completed!'}
                                </span>
                            ) : (
                                t.record.progress[
                                    progress.stepKey as keyof typeof t.record.progress
                                ] || progress.stepKey
                            )}
                        </h3>
                        <span
                            className={`text-base font-semibold ${
                                progress.stepKey ===
                                'completed'
                                    ? 'text-green-400'
                                    : 'text-primary'
                            }`}
                        >
                            {progress.currentStep}/
                            {progress.totalSteps}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                            <div
                                className={`h-full transition-all duration-500 ease-out ${
                                    progress.stepKey ===
                                    'completed'
                                        ? 'bg-linear-to-r from-green-500 to-emerald-500'
                                        : 'bg-linear-to-r from-primary to-secondary'
                                }`}
                                style={{
                                    width: `${
                                        (progress.currentStep /
                                            progress.totalSteps) *
                                        100
                                    }%`,
                                }}
                            />
                        </div>
                        <p className="text-sm text-white/70 text-center">
                            {Math.round(
                                (progress.currentStep /
                                    progress.totalSteps) *
                                    100
                            )}
                            %
                        </p>
                    </div>

                    {/* Loading Animation - 완료 상태가 아닐 때만 표시 */}
                    {progress.stepKey !== 'completed' && (
                        <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                            <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <span
                                className="inline-block w-2 h-2 bg-secondary rounded-full animate-bounce"
                                style={{
                                    animationDelay: '0.1s',
                                }}
                            />
                            <span
                                className="inline-block w-2 h-2 bg-accent rounded-full animate-bounce"
                                style={{
                                    animationDelay: '0.2s',
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </form>
    );
}
