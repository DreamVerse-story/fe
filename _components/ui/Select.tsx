/**
 * Select UI 컴포넌트
 */

'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps
    extends SelectHTMLAttributes<HTMLSelectElement> {
    variant?: 'default';
}

export const Select = forwardRef<
    HTMLSelectElement,
    SelectProps
>(
    (
        {
            variant = 'default',
            className = '',
            children,
            ...props
        },
        ref
    ) => {
        return (
            <select
                ref={ref}
                className={`
                    bg-black/40 border border-white/10
                    rounded-lg sm:rounded-xl
                    px-4 sm:px-5 py-2.5 sm:py-3
                    text-sm sm:text-base
                    text-white
                    focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                    transition-colors
                    cursor-pointer
                    min-h-[44px]
                    ${className}
                `}
                {...props}
            >
                {children}
            </select>
        );
    }
);

Select.displayName = 'Select';
