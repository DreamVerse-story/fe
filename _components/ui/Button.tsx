/**
 * Button UI 컴포넌트
 */

'use client';

import React, {
    ButtonHTMLAttributes,
    ReactNode,
} from 'react';
import Link from 'next/link';

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
        | 'primary'
        | 'secondary'
        | 'glass'
        | 'ghost'
        | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    fullWidth?: boolean;
    asChild?: boolean;
}

const variantStyles = {
    primary:
        'bg-primary hover:bg-primary/90 text-black font-bold uppercase tracking-wider hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] hover:-translate-y-0.5',
    secondary:
        'bg-secondary hover:bg-secondary/90 text-white font-bold uppercase tracking-wider',
    glass: 'glass-button text-white hover:bg-white/20',
    ghost: 'bg-transparent hover:bg-white/10 text-white border border-white/10',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30',
};

const sizeStyles = {
    sm: 'px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg min-h-[44px]',
    md: 'px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl min-h-[44px] sm:min-h-[48px]',
    lg: 'px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl rounded-xl min-h-[48px] sm:min-h-[52px] md:min-h-[56px]',
};

export function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    asChild = false,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseClassName = `
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        flex items-center justify-center gap-1.5 sm:gap-2
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
    `
        .trim()
        .replace(/\s+/g, ' ');

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(
            children as React.ReactElement<any>,
            {
                className: `${baseClassName} ${
                    (children.props as any)?.className || ''
                }`.trim(),
            }
        );
    }

    return (
        <button className={baseClassName} {...props}>
            {children}
        </button>
    );
}
