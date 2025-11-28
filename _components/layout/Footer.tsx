/**
 * 공통 Footer 컴포넌트
 */

'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';

export function Footer() {
    const { locale } = useTranslation();

    return (
        <footer className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-xl">
            <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link
                            href="/"
                            className="flex items-center gap-3 mb-4 group"
                        >
                            <div className="w-10 h-10 relative transition-transform group-hover:scale-105">
                                <img
                                    src="/assets/gpt-logo.png"
                                    alt="DreamVerse Logo"
                                    className="w-full h-full object-contain drop-shadow-lg"
                                />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white">
                                    DreamVerse
                                </span>
                                <span className="text-xs text-white/40 block">
                                    WEB3 PLATFORM
                                </span>
                            </div>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed">
                            {locale === 'ko'
                                ? 'AI와 블록체인으로 당신의 꿈을 IP 자산으로 만드세요.'
                                : 'DreamVerse is an AI-powered Web3 platform that transforms personal dreams into fully on-chain intellectual property.'}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                            {locale === 'ko'
                                ? '바로가기'
                                : 'Quick Links'}
                        </h4>
                        <ul className="space-y-2">
                            {[
                                {
                                    href: '/record',
                                    label:
                                        locale === 'ko'
                                            ? '꿈 기록하기'
                                            : 'Record Dream',
                                },
                                {
                                    href: '/market',
                                    label:
                                        locale === 'ko'
                                            ? 'Dream IP 탐색'
                                            : 'Explore Dreams',
                                },
                                {
                                    href: '/dashboard',
                                    label:
                                        locale === 'ko'
                                            ? '대시보드'
                                            : 'Dashboard',
                                },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/50 hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                            {locale === 'ko'
                                ? '리소스'
                                : 'Resources'}
                        </h4>
                        <ul className="space-y-2">
                            {[
                                {
                                    href: 'https://story.foundation',
                                    label: 'Story Protocol',
                                    external: true,
                                },
                                {
                                    href: 'https://docs.story.foundation',
                                    label:
                                        locale === 'ko'
                                            ? '문서'
                                            : 'Documentation',
                                    external: true,
                                },
                            ].map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/50 hover:text-primary transition-colors text-sm inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={
                                                    2
                                                }
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Status */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                            {locale === 'ko'
                                ? '상태'
                                : 'Status'}
                        </h4>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-white/70 text-sm">
                                {locale === 'ko'
                                    ? '네트워크: Aeneid Testnet'
                                    : 'Network: Aeneid Testnet'}
                            </span>
                        </div>
                        <p className="text-white/40 text-xs">
                            {locale === 'ko'
                                ? '이 서비스는 현재 테스트넷에서 운영됩니다.'
                                : 'This service is currently running on testnet.'}
                        </p>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 text-sm">
                    <p>
                        © 2025 Dream IP Incubator. All
                        rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Privacy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
