/**
 * Dream IP 상세 페이지
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { PageContainer } from '@/_components/layout';
import { LoadingPage } from '@/_components/common';
import { DreamIPDetailContent } from '@/_components/common/DreamIPDetail';
import type { DreamIPPackage } from '@/lib/types';

export default function DreamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [dream, setDream] =
        useState<DreamIPPackage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const isNew = searchParams.get('new') === 'true';

    useEffect(() => {
        const loadDream = async () => {
            try {
                const id = params.id as string;
                const response = await fetch(
                    `/api/dreams/${id}`
                );
                const data = await response.json();

                if (data.success && data.dream) {
                    setDream(data.dream);
                } else {
                    setError(
                        data.error ||
                            'Dream IP를 찾을 수 없습니다.'
                    );
                }
            } catch (err) {
                console.error('Dream load error:', err);
                setError(
                    'Dream IP를 불러오는 중 오류가 발생했습니다.'
                );
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            loadDream();
        }
    }, [params.id]);

    const handleBack = () => {
        router.back();
    };

    const handleDelete = async (dreamId: string) => {
        if (
            !confirm('정말 이 Dream IP를 삭제하시겠습니까?')
        ) {
            return;
        }

        try {
            const response = await fetch(
                `/api/dreams/${dreamId}`,
                {
                    method: 'DELETE',
                }
            );

            const data = await response.json();

            if (data.success) {
                router.push('/market');
            } else {
                alert(data.error || '삭제에 실패했습니다.');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return (
            <PageContainer
                showBackground={true}
                backgroundType="default"
            >
                <LoadingPage message="Loading dream details..." />
            </PageContainer>
        );
    }

    if (error || !dream) {
        return (
            <PageContainer
                showBackground={true}
                backgroundType="default"
            >
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="text-6xl mb-6 opacity-50">
                        😴
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                        {error ||
                            'Dream IP를 찾을 수 없습니다.'}
                    </h1>
                    <button
                        onClick={handleBack}
                        className="mt-6 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        돌아가기
                    </button>
                </div>
            </PageContainer>
        );
    }



    return (
        <PageContainer
            showBackground={true}
            backgroundType="default"
        >
            <DreamIPDetailContent
                dream={dream}
                onBack={handleBack}
                onDelete={handleDelete}
                isNew={isNew}
            />
        </PageContainer>
    );
}
