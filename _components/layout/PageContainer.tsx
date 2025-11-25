/**
 * 페이지 컨테이너 컴포넌트
 * max-width 1800px 제한 및 공통 레이아웃 제공
 */

'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { ChaosBackground } from '../common/ChaosBackground';
import { Footer } from './Footer';

interface PageContainerProps {
    children: ReactNode;
    showBackground?: boolean;
    backgroundType?: 'default' | 'subtle';
    className?: string;
    fullWidth?: boolean;
}

export function PageContainer({
    children,
    showBackground = true,
    backgroundType = 'default',
    className = '',
    fullWidth = false,
}: PageContainerProps) {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 flex flex-col">
            {/* Background Elements */}
            {showBackground && <ChaosBackground />}
            <div
                className={`fixed inset-0 z-0 pointer-events-none ${
                    backgroundType === 'subtle'
                        ? 'bg-background/80 backdrop-blur-[2px]'
                        : 'bg-linear-to-b from-background/80 via-transparent to-background'
                }`}
            />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main
                className={`relative z-10 flex-1 w-full ${fullWidth ? '' : 'max-w-[1800px]'} mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 ${className}`}
            >
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
