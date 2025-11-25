/**
 * 언어 전환 컴포넌트
 * 네비게이션 바와 통일된 스타일
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
        { code: 'en', label: 'EN', flag: '🇺🇸' },
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
            className="h-10 px-3 rounded-full bg-white/10 border-2 border-white/20 hover:border-white/30 flex items-center gap-2 text-sm font-semibold text-white hover:bg-white/15 transition-all shadow-sm hover:shadow-md"
            aria-label={`Switch to ${
                locale === 'ko' ? 'English' : '한국어'
            }`}
        >
            <span className="text-base">
                {currentLanguage?.flag}
            </span>
            <span className="hidden sm:inline">
                {currentLanguage?.label}
            </span>
        </button>
    );
}
