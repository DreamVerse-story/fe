/**
 * 꿈 기록 컴포넌트
 * 텍스트 입력을 통한 꿈 기록 기능
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { LoadingSpinner } from './LoadingSpinner';

interface DreamRecorderProps {
    onSubmit: (dreamText: string) => Promise<void>;
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

        await onSubmit(dreamText);
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
            <div className="space-y-3">
                <label
                    htmlFor="dream-text"
                    className="block text-xl font-semibold text-gray-900 dark:text-white"
                >
                    {locale === 'ko'
                        ? '오늘 꾼 꿈을 기록해주세요'
                        : 'Record Your Dream'}
                </label>

                <div className="relative">
                    <textarea
                        id="dream-text"
                        value={dreamText}
                        onChange={handleChange}
                        disabled={isProcessing}
                        placeholder={t.record.placeholder}
                        className="w-full min-h-[300px] px-5 py-4 text-lg text-white placeholder-white/50 bg-black/40 border-2 border-white/10 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary backdrop-blur-xl resize-y transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        rows={12}
                    />

                    {/* Character Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="text-base font-medium">
                                <span
                                    className={`${
                                        isValid
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-gray-700 dark:text-gray-200'
                                    }`}
                                >
                                    {charCount}
                                </span>
                                <span className="text-white/80">
                                    {' '}
                                    / 50+
                                </span>
                            </div>
                            {isValid && (
                                <svg
                                    className="w-5 h-5 text-green-600 dark:text-green-400"
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
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
                    <p className="text-base text-white font-medium">
                        {isValid ? (
                            <span className="text-green-400 font-medium">
                                ✓ {t.record.minLength}
                            </span>
                        ) : (
                            t.record.minLength
                        )}
                    </p>
                </div>
            </div>

            <button
                type="submit"
                disabled={isProcessing || !isValid}
                className="w-full px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
            >
                {isProcessing ? (
                    <span className="flex items-center justify-center gap-3">
                        <LoadingSpinner size="sm" />
                        {t.record.submitting}
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <svg
                            className="w-6 h-6"
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
                    </span>
                )}
            </button>

            {progress && (
                <div className="space-y-4 p-6 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-900/50 animate-fade-in">
                    {/* Progress Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {progress.stepKey ===
                            'completed' ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5 text-green-600 dark:text-green-400"
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
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-blue-600 dark:text-blue-400'
                            }`}
                        >
                            {progress.currentStep}/
                            {progress.totalSteps}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        {' '}
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ease-out ${
                                    progress.stepKey ===
                                    'completed'
                                        ? 'bg-linear-to-r from-green-500 to-emerald-500'
                                        : 'bg-linear-to-r from-blue-500 to-purple-500'
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
                        <p className="text-base text-gray-700 dark:text-gray-200 text-center">
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
                        <div className="flex items-center justify-center gap-2 text-base text-white/70">
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                            <span
                                className="inline-block w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                                style={{
                                    animationDelay: '0.1s',
                                }}
                            />
                            <span
                                className="inline-block w-2 h-2 bg-pink-600 rounded-full animate-bounce"
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
