/**
 * Badge UI 컴포넌트
 */

'use client';

import { ReactNode } from 'react';

interface BadgeProps {
    variant?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'warning'
        | 'danger'
        | 'info';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    className?: string;
}

const variantStyles = {
    primary:
        'bg-primary/10 text-primary border-2 border-primary/30',
    secondary:
        'bg-secondary/10 text-secondary border-2 border-secondary/30',
    success:
        'bg-green-500/20 text-green-400 border-2 border-green-500/40',
    warning:
        'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/40',
    danger: 'bg-red-500/20 text-red-400 border-2 border-red-500/40',
    info: 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/40',
};

const sizeStyles = {
    sm: 'px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full',
    md: 'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm md:text-base rounded-full',
    lg: 'px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full',
};

export function Badge({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
}: BadgeProps) {
    return (
        <span
            className={`
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                font-semibold uppercase tracking-wide
                ${className}
            `}
        >
            {children}
        </span>
    );
}
