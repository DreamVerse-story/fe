/**
 * Button UI 컴포넌트
 * 통일된 크기와 명확한 스타일
 */

'use client';

import React, {
    ButtonHTMLAttributes,
    ReactNode,
} from 'react';

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
        'bg-primary hover:bg-primary/90 text-black font-semibold border-2 border-primary hover:border-primary/80 shadow-md hover:shadow-lg hover:shadow-primary/30',
    secondary:
        'bg-secondary hover:bg-secondary/90 text-white font-semibold border-2 border-secondary hover:border-secondary/80 shadow-md hover:shadow-lg',
    glass: 'bg-white/10 hover:bg-white/15 text-white border-2 border-white/20 hover:border-white/30 backdrop-blur-sm shadow-sm hover:shadow-md',
    ghost: 'bg-transparent hover:bg-white/5 text-white border-2 border-white/20 hover:border-white/30',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-2 border-red-500/40 hover:border-red-500/50',
};

const sizeStyles = {
    sm: 'h-9 px-4 text-sm rounded-lg',
    md: 'h-11 px-5 text-base rounded-xl',
    lg: 'h-14 px-8 text-lg rounded-xl',
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
        inline-flex items-center justify-center gap-2
        font-semibold
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
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
