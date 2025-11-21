/**
 * 언어 전환 컴포넌트
 */

'use client';

import { useTranslation } from '@/lib/i18n/context';
import type { Locale } from '@/lib/i18n/types';

export function LanguageSwitcher() {
    const { locale, setLocale } = useTranslation();

    const languages: {
        code: Locale;
        label: string;
        flag: string;
    }[] = [
        { code: 'ko', label: '한국어', flag: '🇰🇷' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
    ];

    const toggleLanguage = () => {
        const nextLocale = locale === 'ko' ? 'en' : 'ko';
        setLocale(nextLocale);
    };

    const currentLanguage = languages.find(
        (l) => l.code === locale
    );

    return (
        <button
            onClick={toggleLanguage}
            className="glass-button px-3 py-2 rounded-lg flex items-center gap-2 text-base font-medium text-white hover:bg-white/20 transition-all"
            aria-label={`Switch to ${
                locale === 'ko' ? 'English' : '한국어'
            }`}
        >
            <span>{currentLanguage?.flag}</span>
            <span className="hidden sm:inline">
                {currentLanguage?.label}
            </span>
        </button>
    );
}
