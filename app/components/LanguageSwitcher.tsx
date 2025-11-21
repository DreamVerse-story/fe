/**
 * 언어 전환 컴포넌트
 */

'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import type { Locale } from '@/lib/i18n/types';

export function LanguageSwitcher() {
    const { locale, setLocale } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages: {
        code: Locale;
        label: string;
        flag: string;
    }[] = [
        { code: 'ko', label: '한국어', flag: '🇰🇷' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
    ];

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="glass-button px-3 py-2 rounded-lg flex items-center gap-2 text-base font-medium text-foreground hover:bg-white/20 transition-all"
            >
                <span>{languages.find(l => l.code === locale)?.flag}</span>
                <span className="hidden sm:inline">{languages.find(l => l.code === locale)?.label}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 glass-panel rounded-xl overflow-hidden shadow-xl animate-fade-in z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLocale(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-base flex items-center gap-2 hover:bg-primary/10 transition-colors ${
                                locale === lang.code ? 'text-primary font-bold bg-primary/5' : 'text-foreground'
                            }`}
                        >
                            <span>{lang.flag}</span>
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
