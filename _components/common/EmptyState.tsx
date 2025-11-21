/**
 * 빈 상태 컴포넌트
 */

import Link from 'next/link';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
}

export function EmptyState({
    icon = '🌙',
    title,
    description,
    actionLabel,
    actionHref,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="text-8xl mb-6 animate-scale-in">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-white mb-6 text-center text-lg">
                    {description}
                </p>
            )}
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
