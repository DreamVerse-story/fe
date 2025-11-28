/**
 * 공통 Header 컴포넌트
 * 통일된 크기와 스타일의 네비게이션
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { WalletButton } from '../common/WalletButton';
import { useTranslation } from '@/lib/i18n/context';

export function Header() {
    const pathname = usePathname();
    const { locale } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    // 단순화된 네비게이션: CREATE, EXPLORE, DASHBOARD
    const navItems = [
        {
            href: '/record',
            label: locale === 'ko' ? '만들기' : 'CREATE',
            icon: (
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
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            ),
        },
        {
            href: '/market',
            label: locale === 'ko' ? '탐색' : 'EXPLORE',
            icon: (
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            ),
        },
        {
            href: '/dashboard',
            label:
                locale === 'ko' ? '대시보드' : 'DASHBOARD',
            icon: (
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
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                </svg>
            ),
        },
    ];

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return (
                pathname === '/dashboard' ||
                pathname === '/mypage' ||
                pathname === '/royalties' ||
                pathname === '/stats'
            );
        }
        return (
            pathname === href ||
            pathname.startsWith(href + '/')
        );
    };

    return (
        <header className="fixed top-0 w-full z-50 transition-all duration-300">
            {/* Gradient Border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

            <div className="bg-black/60 backdrop-blur-xl">
                <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2 sm:gap-3"
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 relative transition-transform group-hover:scale-105">
                            <img
                                src="/assets/gpt-logo.png"
                                alt="DreamVerse Logo"
                                className="w-full h-full object-contain drop-shadow-lg"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none">
                                DreamVerse
                            </span>
                            {/* <span className="text-[10px] text-white/40 font-medium tracking-widest">
                                WEB3 PLATFORM
                            </span> */}
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border-2 border-white/10">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        h-10 px-4 rounded-full font-semibold text-sm
                                        transition-all duration-200 flex items-center gap-2
                                        ${
                                            isActive(
                                                item.href
                                            )
                                                ? 'bg-primary text-black border-2 border-primary shadow-lg shadow-primary/30'
                                                : 'text-white/80 hover:text-white hover:bg-white/10 border-2 border-transparent hover:border-white/20'
                                        }
                                    `}
                                >
                                    {item.icon}
                                    <span>
                                        {item.label}
                                    </span>
                                </Link>
                            ))}
                        </nav>

                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() =>
                                setMobileMenuOpen(
                                    !mobileMenuOpen
                                )
                            }
                            className="md:hidden h-10 w-10 rounded-full bg-white/10 border-2 border-white/20 hover:border-white/30 text-white hover:bg-white/15 transition-all flex items-center justify-center shadow-sm hover:shadow-md"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {mobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>

                        {/* Wallet Connect Button - 맨 오른쪽 */}
                        <WalletButton />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 animate-slide-in-up">
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() =>
                                    setMobileMenuOpen(false)
                                }
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl
                                    font-semibold text-sm transition-all
                                    ${
                                        isActive(item.href)
                                            ? 'bg-primary text-black'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }
                                `}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
