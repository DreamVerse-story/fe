/**
 * Dream IP 카드 컴포넌트
 * 갤러리에서 사용되는 Dream IP 요약 카드
 */

'use client';

import type { DreamIPPackage } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { useTranslation } from '@/lib/i18n/context';

interface DreamIPCardProps {
    dream: DreamIPPackage;
    onClick: () => void;
}

export function DreamIPCard({
    dream,
    onClick,
}: DreamIPCardProps) {
    const { locale, t } = useTranslation();
    const keyVisual = dream.visuals.find(
        (v) => v.type === 'key_visual'
    );
    const imageUrl =
        keyVisual?.ipfsUrl || keyVisual?.imageUrl;

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer glass-panel rounded-2xl overflow-hidden card-hover relative bg-black/40 border border-white/10"
        >
            {/* Key Visual */}
            <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 z-0" />
                {imageUrl ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt={dream.analysis.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-10 relative"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-20" />
                        
                        {/* IPFS Badge */}
                        {keyVisual?.ipfsUrl && (
                            <div className="absolute bottom-3 left-3 z-30 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 border border-white/10">
                                <svg
                                    className="w-3 h-3 text-primary"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                IPFS SECURED
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 z-10 relative bg-white/5">
                        <svg
                            className="w-12 h-12 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-30">
                    <StatusBadge status={dream.status} />
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 relative z-10">
                {/* Title */}
                <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary transition-colors duration-300">
                    {(locale === 'en' &&
                        dream.analysis.title_en) ||
                        dream.analysis.title ||
                        t.detail.overview.title}
                </h3>

                {/* Summary */}
                <p className="text-base text-white line-clamp-2 leading-relaxed h-12 font-light">
                    {(locale === 'en' &&
                        dream.analysis.summary_en) ||
                        dream.analysis.summary ||
                        t.detail.overview.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {(() => {
                        const genresToShow =
                            locale === 'en' &&
                            dream.analysis.genres_en
                                ? dream.analysis.genres_en
                                : dream.analysis.genres;
                        return genresToShow
                            .slice(0, 2)
                            .map((genre, index) => (
                                <span
                                    key={`${genre}-${index}`}
                                    className="px-2.5 py-1 text-sm font-semibold bg-primary/10 text-primary rounded-full border border-primary/20 uppercase tracking-wide"
                                >
                                    {locale === 'en' &&
                                    dream.analysis.genres_en
                                        ? genre
                                        : t.genres[
                                              genre as keyof typeof t.genres
                                          ] || genre}
                                </span>
                            ));
                    })()}
                    {(() => {
                        const tonesToShow =
                            locale === 'en' &&
                            dream.analysis.tones_en
                                ? dream.analysis.tones_en
                                : dream.analysis.tones;
                        return tonesToShow
                            .slice(0, 1)
                            .map((tone, index) => (
                                <span
                                    key={`${tone}-${index}`}
                                    className="px-2.5 py-1 text-sm font-semibold bg-secondary/10 text-secondary rounded-full border border-secondary/20 uppercase tracking-wide"
                                >
                                    {locale === 'en' &&
                                    dream.analysis.tones_en
                                        ? tone
                                        : t.tones[
                                              tone as keyof typeof t.tones
                                          ] || tone}
                                </span>
                            ));
                    })()}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-base text-white/90 pt-4 border-t border-white/10">
                    <span className="flex items-center gap-1.5">
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {formatDistanceToNow(
                            new Date(dream.createdAt),
                            {
                                addSuffix: true,
                                locale:
                                    locale === 'ko'
                                        ? ko
                                        : enUS,
                            }
                        )}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium group-hover:text-primary transition-colors">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        {dream.visuals.length} Visuals
                    </span>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: DreamIPPackage['status'];
}) {
    const { locale } = useTranslation();

    const styles = {
        draft: 'bg-white/10 text-white/90 border border-white/10',
        processing:
            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse',
        completed: 'bg-primary/20 text-primary border border-primary/30',
        failed: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };

    const labels = {
        ko: {
            draft: '초안',
            processing: '처리중',
            completed: '완료',
            failed: '실패',
        },
        en: {
            draft: 'Draft',
            processing: 'Processing',
            completed: 'Completed',
            failed: 'Failed',
        },
    };

    return (
        <span
            className={`px-3 py-1.5 text-sm font-bold uppercase tracking-wider rounded-lg backdrop-blur-md ${styles[status]}`}
        >
            {labels[locale][status]}
        </span>
    );
}
