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
                    bg-white/10 border-2 border-white/20
                    rounded-xl
                    px-4 py-2.5
                    text-sm
                    text-white
                    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                    transition-all
                    cursor-pointer
                    h-11
                    shadow-sm
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
