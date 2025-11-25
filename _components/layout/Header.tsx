/**
 * 공통 Header 컴포넌트
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { WalletButton } from '../common/WalletButton';

export function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const navItems = [
        { href: '/record', label: 'RECORD' },
        { href: '/market', label: 'MARKET' },
        { href: '/stats', label: 'STATS' },
    ];

    return (
        <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-black/40 backdrop-blur-md border-b border-white/10">
            <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-3 sm:py-4 md:py-5 flex justify-between items-center">
                <Link
                    href="/"
                    className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider text-white hover:opacity-80 transition-opacity min-h-[44px] flex items-center"
                >
                    IDI{' '}
                    <span className="text-xs sm:text-sm md:text-base opacity-50 font-normal ml-1.5 sm:ml-2">
                        BETA
                    </span>
                </Link>

                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-4 lg:gap-6 xl:gap-8 text-sm md:text-base font-bold tracking-wide">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors uppercase text-sm md:text-base tracking-widest min-h-[44px] flex items-center px-2 ${
                                    pathname === item.href
                                        ? 'text-primary'
                                        : 'text-white/80 hover:text-primary'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Wallet Connect Button */}
                    <WalletButton />

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() =>
                            setMobileMenuOpen(
                                !mobileMenuOpen
                            )
                        }
                        className="md:hidden p-2 text-white/80 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
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

                    <LanguageSwitcher />
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 animate-slide-in-up">
                    <nav className="px-4 py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() =>
                                    setMobileMenuOpen(false)
                                }
                                className={`px-4 py-3 rounded-lg transition-colors uppercase text-base font-bold tracking-widest min-h-[44px] flex items-center ${
                                    pathname === item.href
                                        ? 'text-primary bg-primary/10'
                                        : 'text-white/80 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
