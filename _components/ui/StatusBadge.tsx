/**
 * Status Badge UI 컴포넌트
 */

'use client';

import { useTranslation } from '@/lib/i18n/context';
import type { DreamIPPackage } from '@/lib/types';
import { Badge } from './Badge';

interface StatusBadgeProps {
    status: DreamIPPackage['status'];
}

const statusVariantMap: Record<
    DreamIPPackage['status'],
    'primary' | 'warning' | 'success' | 'danger' | 'info'
> = {
    draft: 'info',
    processing: 'warning',
    completed: 'success',
    failed: 'danger',
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const { locale } = useTranslation();

    const labels = {
        ko: {
            draft: '초안',
            processing: '처리중',
            completed: '완료',
            failed: '실패',
        },
        en: {
            draft: 'Draft',
            processing: 'Processing',
            completed: 'Completed',
            failed: 'Failed',
        },
    };

    return (
        <Badge
            variant={statusVariantMap[status]}
            size="sm"
            className="backdrop-blur-md font-bold uppercase tracking-wider"
        >
            {labels[locale][status]}
        </Badge>
    );
}
