/**
 * Input UI 컴포넌트
 */

'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'search';
    icon?: React.ReactNode;
}

export const Input = forwardRef<
    HTMLInputElement,
    InputProps
>(
    (
        {
            variant = 'default',
            icon,
            className = '',
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'w-full bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm';
        const paddingStyles =
            variant === 'search'
                ? 'px-4 py-2.5 text-sm h-11'
                : 'px-4 py-3 text-base h-11';

        if (variant === 'search' && icon) {
            return (
                <div className="relative">
                    <input
                        ref={ref}
                        className={`${baseStyles} ${paddingStyles} pr-10 sm:pr-12 ${className}`}
                        {...props}
                    />
                    <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
                        {icon}
                    </div>
                </div>
            );
        }

        return (
            <input
                ref={ref}
                className={`${baseStyles} ${paddingStyles} ${className}`}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
