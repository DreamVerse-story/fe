/**
 * Card UI 컴포넌트
 */

'use client';

import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: 'default' | 'glass' | 'elevated';
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
    default:
        'bg-black/40 border-2 border-white/20 shadow-md',
    glass: 'glass-panel bg-white/10 border-2 border-white/20 shadow-md backdrop-blur-sm',
    elevated:
        'bg-black/60 border-2 border-white/30 shadow-xl',
};

const paddingStyles = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5 md:p-6',
    lg: 'p-6 sm:p-8 md:p-12',
};

export function Card({
    children,
    variant = 'glass',
    hover = false,
    padding = 'md',
    className = '',
    ...props
}: CardProps) {
    return (
        <div
            className={`
                ${variantStyles[variant]}
                ${paddingStyles[padding]}
                rounded-xl sm:rounded-2xl
                ${hover ? 'card-hover' : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
}
