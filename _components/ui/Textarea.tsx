/**
 * Textarea UI 컴포넌트
 */

'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: 'default';
}

export const Textarea = forwardRef<
    HTMLTextAreaElement,
    TextareaProps
>(
    (
        { variant = 'default', className = '', ...props },
        ref
    ) => {
        return (
            <textarea
                ref={ref}
                className={`
                    w-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px]
                    px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5
                    text-sm sm:text-base md:text-lg
                    text-white placeholder-white/50
                    bg-black/40 border-2 border-white/10
                    rounded-lg sm:rounded-xl
                    focus:ring-2 sm:focus:ring-4 focus:ring-primary/20 focus:border-primary
                    backdrop-blur-xl resize-y
                    transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${className}
                `}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';
