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
            'w-full bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all';
        const paddingStyles =
            variant === 'search'
                ? 'px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base min-h-[44px]'
                : 'px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg min-h-[44px] sm:min-h-[48px]';

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
