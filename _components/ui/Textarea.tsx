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
                    w-full min-h-[250px]
                    px-4 py-3
                    text-base
                    text-white placeholder-white/50
                    bg-white/10 border-2 border-white/20
                    rounded-xl
                    focus:ring-2 focus:ring-primary/20 focus:border-primary
                    backdrop-blur-sm resize-y
                    transition-all
                    shadow-sm
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${className}
                `}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';
