/**
 * Checkbox UI 컴포넌트
 */

'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Checkbox = forwardRef<
    HTMLInputElement,
    CheckboxProps
>(({ label, className = '', ...props }, ref) => {
    return (
        <label className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <div className="relative flex items-center">
                <input
                    ref={ref}
                    type="checkbox"
                    className={`
                            peer h-4 w-4
                            cursor-pointer appearance-none rounded
                            border-2 border-white/30 bg-white/10
                            transition-all
                            checked:border-primary checked:bg-primary
                            hover:border-primary/60 hover:bg-white/15
                            shadow-sm
                            ${className}
                        `}
                    {...props}
                />
                <svg
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>
            {label && (
                <span className="text-white/90 group-hover:text-white transition-colors text-sm font-medium">
                    {label}
                </span>
            )}
        </label>
    );
});

Checkbox.displayName = 'Checkbox';
