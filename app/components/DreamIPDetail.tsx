/**
 * Dream IP 상세 보기 컴포넌트
 * 모달 형태로 Dream IP의 모든 정보를 표시
 */

'use client';

import { useState } from 'react';
import type { DreamIPPackage } from '@/lib/types';
import { format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { useTranslation } from '@/lib/i18n/context';
import { useToast } from './Toast';

interface DreamIPDetailProps {
    dream: DreamIPPackage;
    onClose: () => void;
    onDelete?: (dreamId: string) => void;
}

export function DreamIPDetail({
    dream,
    onClose,
    onDelete,
}: DreamIPDetailProps) {
    const { t, locale } = useTranslation();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<
        'overview' | 'story' | 'visuals'
    >('overview');

    const handleShare = () => {
        const url = `${window.location.origin}/market?id=${dream.id}`;
        navigator.clipboard.writeText(url);
        showToast(t.detail.alerts.linkCopied, 'success');
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(dream, null, 2);
        const dataBlob = new Blob([dataStr], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dream-ip-${dream.id}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showToast(
            locale === 'ko'
                ? '내보내기 완료!'
                : 'Exported successfully!',
            'success'
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass-panel rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in border border-white/10 bg-[#0a0a10]">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-8 py-6 border-b border-white/10">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                                {(locale === 'en' &&
                                    dream.analysis
                                        .title_en) ||
                                    dream.analysis
                                        .title}
                            </h2>
                            <p className="text-white/80 text-base font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                {format(
                                    new Date(
                                        dream.createdAt
                                    ),
                                    'PPP',
                                    {
                                        locale:
                                            locale ===
                                            'ko'
                                                ? ko
                                                : enUS,
                                    }
                                )}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0 text-white/80 hover:text-white"
                        >
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={handleShare}
                            className="glass-button px-4 py-2 rounded-xl font-medium text-base flex items-center gap-2 text-white hover:text-primary"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            {t.detail.buttons.share}
                        </button>
                        <button
                            onClick={handleExport}
                            className="glass-button px-4 py-2 rounded-xl font-medium text-base flex items-center gap-2 text-white hover:text-primary"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            {t.detail.buttons.export}
                        </button>

                        {onDelete && (
                            <button
                                onClick={() =>
                                    onDelete(dream.id)
                                }
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium transition-all text-base ml-auto flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                {t.detail.buttons.delete}
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 bg-black/20 px-8">
                    {(
                        [
                            'overview',
                            'story',
                            'visuals',
                        ] as const
                    ).map((tab) => (
                        <button
                            key={tab}
                            onClick={() =>
                                setActiveTab(tab)
                            }
                            className={`px-6 py-4 font-bold transition-all relative text-base tracking-widest uppercase ${
                                activeTab === tab
                                    ? 'text-primary'
                                    : 'text-white/90 hover:text-white'
                            }`}
                        >
                            {t.detail.tabs[tab]}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_var(--primary)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-black/20 custom-scrollbar">
                    {activeTab === 'overview' && (
                        <OverviewTab dream={dream} />
                    )}
                    {activeTab === 'story' && (
                        <StoryTab dream={dream} />
                    )}
                    {activeTab === 'visuals' && (
                        <VisualsTab dream={dream} />
                    )}
                </div>
            </div>
        </div>
    );
}

function OverviewTab({ dream }: { dream: DreamIPPackage }) {
    const { t, locale } = useTranslation();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Summary */}
            <Section title={t.detail.overview.summary}>
                <p className="text-xl leading-relaxed text-white font-light">
                    {(locale === 'en' &&
                        dream.analysis.summary_en) ||
                        dream.analysis.summary}
                </p>
            </Section>

            {/* Genres & Tones */}
            <div className="grid md:grid-cols-2 gap-8">
                <Section title={t.detail.overview.genres}>
                    <div className="flex flex-wrap gap-3">
                        {(() => {
                            const genresToShow =
                                locale === 'en' &&
                                dream.analysis.genres_en
                                    ? dream.analysis
                                          .genres_en
                                    : dream.analysis.genres;
                            return genresToShow.map(
                                (genre, index) => (
                                    <span
                                        key={`${genre}-${index}`}
                                        className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold text-base hover:bg-primary/20 transition-colors cursor-default uppercase tracking-wide"
                                    >
                                        {locale === 'en' &&
                                        dream.analysis
                                            .genres_en
                                            ? genre
                                            : t.genres[
                                                  genre as keyof typeof t.genres
                                              ] || genre}
                                    </span>
                                )
                            );
                        })()}
                    </div>
                </Section>

                <Section title={t.detail.overview.tones}>
                    <div className="flex flex-wrap gap-3">
                        {(() => {
                            const tonesToShow =
                                locale === 'en' &&
                                dream.analysis.tones_en
                                    ? dream.analysis
                                          .tones_en
                                    : dream.analysis.tones;
                            return tonesToShow.map(
                                (tone, index) => (
                                    <span
                                        key={`${tone}-${index}`}
                                        className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-full font-bold text-base hover:bg-secondary/20 transition-colors cursor-default uppercase tracking-wide"
                                    >
                                        {locale === 'en' &&
                                        dream.analysis
                                            .tones_en
                                            ? tone
                                            : t.tones[
                                                  tone as keyof typeof t.tones
                                              ] || tone}
                                    </span>
                                )
                            );
                        })()}
                    </div>
                </Section>
            </div>

            {/* Characters */}
            <Section title={t.detail.overview.characters}>
                <ul className="grid md:grid-cols-2 gap-4">
                    {(locale === 'en' &&
                    dream.analysis.characters_en
                        ? dream.analysis.characters_en
                        : dream.analysis.characters
                    ).map((character, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-4 p-4 glass-panel rounded-xl hover:bg-white/5 transition-colors border border-white/5"
                        >
                            <span className="text-2xl bg-white/5 p-2 rounded-lg">
                                👤
                            </span>
                            <span className="text-white font-medium text-lg">
                                {character}
                            </span>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* World */}
            <Section title={t.detail.overview.world}>
                <div className="glass-panel p-6 rounded-xl border border-white/10 bg-white/5">
                    <p className="text-white leading-relaxed">
                        {(locale === 'en' &&
                            dream.analysis.world_en) ||
                            dream.analysis.world}
                    </p>
                </div>
            </Section>
        </div>
    );
}

function StoryTab({ dream }: { dream: DreamIPPackage }) {
    const { t, locale } = useTranslation();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Synopsis */}
            <Section title={t.detail.story.synopsis}>
                <div className="prose dark:prose-invert max-w-none glass-panel p-8 rounded-2xl border border-white/10 bg-white/5">
                    <p className="text-white leading-relaxed whitespace-pre-wrap text-xl font-light">
                        {(locale === 'en' &&
                            dream.story.synopsis_en) ||
                            dream.story.synopsis}
                    </p>
                </div>
            </Section>

            {/* Scene Bits */}
            <Section title={t.detail.story.sceneBits}>
                <ol className="space-y-4">
                    {(locale === 'en' &&
                    dream.story.sceneBits_en
                        ? dream.story.sceneBits_en
                        : dream.story.sceneBits
                    ).map((scene, index) => (
                        <li
                            key={index}
                            className="flex gap-6 p-6 glass-panel rounded-2xl hover:bg-white/5 transition-all hover:translate-x-2 duration-300 border border-white/5"
                        >
                            <span className="shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-black font-bold text-lg shadow-lg rounded-xl">
                                {index + 1}
                            </span>
                            <p className="text-white leading-relaxed flex-1 pt-1 text-lg">
                                {scene}
                            </p>
                        </li>
                    ))}
                </ol>
            </Section>

            {/* Lore */}
            <Section title={t.detail.story.lore}>
                <div className="prose dark:prose-invert max-w-none glass-panel p-8 rounded-2xl border-l-4 border-secondary bg-white/5">
                    {(() => {
                        const loreText =
                            (locale === 'en' &&
                                dream.story.lore_en) ||
                            dream.story.lore;
                        return typeof loreText ===
                            'string' ? (
                            <p className="text-white leading-relaxed whitespace-pre-wrap italic text-lg">
                                {loreText}
                            </p>
                        ) : (
                            <pre className="text-base text-white/80 overflow-x-auto bg-black/40 p-4 rounded-lg">
                                {JSON.stringify(
                                    loreText,
                                    null,
                                    2
                                )}
                            </pre>
                        );
                    })()}
                </div>
            </Section>
        </div>
    );
}

function VisualsTab({ dream }: { dream: DreamIPPackage }) {
    const { t, locale } = useTranslation();

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dream.visuals.map((visual) => {
                    const imageUrl =
                        visual.ipfsUrl || visual.imageUrl;
                    return (
                        <div
                            key={visual.id}
                            className="glass-panel rounded-2xl overflow-hidden card-hover group border border-white/10 bg-black/40"
                        >
                            <div className="relative aspect-square bg-black/50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageUrl}
                                    alt={
                                        visual.title ||
                                        visual.type
                                    }
                                    className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${
                                        visual.type ===
                                        'character'
                                            ? 'object-contain p-4'
                                            : 'object-cover'
                                    }`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {visual.ipfsUrl && (
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 border border-white/10 shadow-lg">
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
                            </div>
                            <div className="p-5 relative">
                                <h3 className="font-bold text-lg text-white mb-2 group-hover:text-primary transition-colors">
                                    {(locale === 'en' &&
                                        visual.title_en) ||
                                        visual.title ||
                                        visual.type}
                                </h3>
                                {(() => {
                                    const descriptionText =
                                        (locale === 'en' &&
                                            visual.description_en) ||
                                        visual.description;
                                    return descriptionText ? (
                                        <p className="text-base text-white/80 mb-4 line-clamp-2">
                                            {
                                                descriptionText
                                            }
                                        </p>
                                    ) : null;
                                })()}
                                <div className="flex items-center justify-between text-base pt-2 border-t border-white/10">
                                    <span
                                        className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                                            visual.ipfsUrl
                                                ? 'bg-primary/10 text-primary border-primary/20'
                                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        }`}
                                    >
                                        {visual.ipfsUrl
                                            ? t.detail
                                                  .visuals
                                                  .ipfsStored
                                            : t.detail
                                                  .visuals
                                                  .temporary}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="group">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-secondary rounded-full group-hover:scale-y-125 transition-transform duration-300" />
                {title}
            </h3>
            {children}
        </div>
    );
}
