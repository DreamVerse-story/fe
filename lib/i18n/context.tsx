/**
 * 다국어 지원 Context
 */

'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react';
import type { Locale, Translation } from './types';
import { ko } from './locales/ko';
import { en } from './locales/en';

interface I18nContextType {
    locale: Locale;
    t: Translation;
    setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<
    I18nContextType | undefined
>(undefined);

const translations: Record<Locale, Translation> = {
    ko,
    en,
};

export function I18nProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [locale, setLocaleState] = useState<Locale>('ko');

    // 로컬 스토리지에서 언어 설정 불러오기
    useEffect(() => {
        const savedLocale = localStorage.getItem(
            'locale'
        ) as Locale;
        if (
            savedLocale &&
            (savedLocale === 'ko' || savedLocale === 'en')
        ) {
            setLocaleState(savedLocale);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
    };

    const value: I18nContextType = {
        locale,
        t: translations[locale],
        setLocale,
    };

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error(
            'useTranslation must be used within an I18nProvider'
        );
    }
    return context;
}
