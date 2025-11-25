import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import { I18nProvider } from '@/lib/i18n/context';
import { ToastProvider } from '@/_components/common';
import { Web3Provider } from '@/_components/providers';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'IP Dream Incubator - Turn Your Dreams Into IP Assets',
    description:
        'A platform that transforms dreams into IP assets using AI',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="ko"
            suppressHydrationWarning
            className="dark"
        >
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground`}
            >
                <Web3Provider>
                    <I18nProvider>
                        <ToastProvider>
                            {children}
                        </ToastProvider>
                    </I18nProvider>
                </Web3Provider>
            </body>
        </html>
    );
}
