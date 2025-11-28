/**
 * GET /api/story/license/stats?ownerAddress=xxx
 * 라이선스 판매 통계 조회 (창작자용)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const ownerAddress =
            searchParams.get('ownerAddress');
        const ipAssetId = searchParams.get('ipAssetId'); // 선택사항: 특정 IP Asset만 조회

        if (!ownerAddress) {
            return NextResponse.json(
                { error: 'ownerAddress가 필요합니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const licensesCollection = db.collection(
            COLLECTIONS.LICENSES
        );

        // 쿼리 조건 구성
        const query: any = {
            ownerAddress: {
                $regex: new RegExp(
                    `^${ownerAddress}$`,
                    'i'
                ),
            },
        };

        if (ipAssetId) {
            query.ipAssetId = {
                $regex: new RegExp(`^${ipAssetId}$`, 'i'),
            };
        }

        // 전체 판매 내역 조회
        const sales = await licensesCollection
            .find(query)
            .sort({ purchasedAt: -1 })
            .toArray();

        // 통계 계산
        // totalSales는 구매 트랜잭션 건수 (구매 횟수)
        const totalSales = sales.length;
        // totalAmount는 실제 판매된 라이선스 수량 (amount 합계)
        const totalAmount = sales.reduce(
            (sum, sale) => sum + (sale.amount || 0),
            0
        );
        const totalRevenue = sales.reduce(
            (sum, sale) => sum + (sale.totalPrice || 0),
            0
        );

        // IP Asset별 통계
        const statsByIpAsset: Record<
            string,
            {
                ipAssetId: string;
                sales: number; // 구매 트랜잭션 건수
                amount: number; // 실제 판매된 라이선스 수량
                revenue: number;
            }
        > = {};

        sales.forEach((sale) => {
            const assetId = sale.ipAssetId;
            if (!statsByIpAsset[assetId]) {
                statsByIpAsset[assetId] = {
                    ipAssetId: assetId,
                    sales: 0, // 구매 트랜잭션 건수
                    amount: 0, // 실제 판매된 라이선스 수량
                    revenue: 0,
                };
            }
            statsByIpAsset[assetId].sales += 1; // 구매 트랜잭션 건수
            statsByIpAsset[assetId].amount +=
                sale.amount || 0; // 실제 판매된 라이선스 수량
            statsByIpAsset[assetId].revenue +=
                sale.totalPrice || 0;
        });

        return NextResponse.json({
            success: true,
            data: {
                ownerAddress: ownerAddress,
                totalSales: totalSales, // 총 판매 건수
                totalAmount: totalAmount, // 총 판매 수량
                totalRevenue: totalRevenue, // 총 수익 (IP)
                statsByIpAsset:
                    Object.values(statsByIpAsset), // IP Asset별 통계
                recentSales: sales.slice(0, 10), // 최근 10건 판매 내역
            },
        });
    } catch (error) {
        console.error('라이선스 통계 조회 오류:', error);
        return NextResponse.json(
            {
                error: '라이선스 통계 조회에 실패했습니다.',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}
