/**
 * Dream IP 카드 컴포넌트
 * 깔끔하고 일관된 디자인의 Dream IP 카드
 */

'use client';

import Link from 'next/link';
import type { DreamIPPackage } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { useTranslation } from '@/lib/i18n/context';
import { Badge, Card } from '../ui';

interface DreamIPCardProps {
    dream: DreamIPPackage;
    onClick?: () => void;
    isOwner?: boolean;
    compact?: boolean;
}

export function DreamIPCard({
    dream,
    onClick,
    isOwner = false,
    compact = false,
}: DreamIPCardProps) {
    const { locale, t } = useTranslation();
    const keyVisual = dream.visuals.find((v) => v.type === 'key_visual');
    const imageUrl = keyVisual?.ipfsUrl || keyVisual?.imageUrl;
    const isMinted = !!(dream as any).ipAssetId;

    const title = (locale === 'en' && dream.analysis.title_en) || dream.analysis.title;
    const genres = locale === 'en' && dream.analysis.genres_en 
        ? dream.analysis.genres_en 
        : dream.analysis.genres;

    return (
        <Link
            href={`/dreams/${dream.id}`}
            onClick={onClick}
            className="block w-full h-full group"
        >
            <Card
                variant="glass"
                padding="none"
                hover
                className={`h-full overflow-hidden transition-all duration-500 
                    hover:border-primary/40 hover:shadow-[0_0_40px_rgba(204,255,0,0.15)]
                    ${isOwner ? 'ring-1 ring-primary/30' : ''}
                `}
            >
                {/* Image */}
                <div className={`relative overflow-hidden ${compact ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
                    {imageUrl ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                            <span className="text-4xl opacity-20">🌙</span>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                        {/* Status */}
                        <Badge 
                            variant={isMinted ? 'success' : 'warning'} 
                            size="sm"
                            className="backdrop-blur-md"
                        >
                            {isMinted 
                                ? (locale === 'ko' ? '민팅됨' : 'Minted')
                                : (locale === 'ko' ? '대기중' : 'Pending')
                            }
                        </Badge>

                        {/* Owner Badge */}
                        {isOwner && (
                            <Badge variant="primary" size="sm" className="backdrop-blur-md">
                                {locale === 'ko' ? '내 꿈' : 'Mine'}
                            </Badge>
                        )}
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2 group-hover:text-primary transition-colors duration-300">
                            {title}
                        </h3>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Genre Tags */}
                    <div className="flex flex-wrap gap-1.5">
                        {genres?.slice(0, 2).map((genre, idx) => (
                            <span 
                                key={idx}
                                className="px-2 py-0.5 text-xs font-medium text-white/70 bg-white/5 rounded-md border border-white/10"
                            >
                                {genre}
                            </span>
                        ))}
                        {(genres?.length || 0) > 2 && (
                            <span className="px-2 py-0.5 text-xs font-medium text-white/40">
                                +{(genres?.length || 0) - 2}
                            </span>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div className="flex items-center gap-1.5">
                            <span className="text-lg font-bold text-primary">0.1</span>
                            <span className="text-sm text-white/50">IP</span>
                        </div>
                        <span className="text-xs text-white/40">
                            {formatDistanceToNow(new Date(dream.createdAt), {
                                addSuffix: true,
                                locale: locale === 'ko' ? ko : enUS,
                            })}
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
