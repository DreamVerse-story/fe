/**
 * GET /api/story/royalty/[ipAssetId]
 * 특정 IP Asset의 로열티 정보 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { getIPAssetInfo } from '@/lib/blockchain/story-protocol';

export async function GET(
    request: NextRequest,
    { params }: { params: { ipAssetId: string } }
) {
    try {
        const ipAssetId = params.ipAssetId;

        if (!ipAssetId) {
            return NextResponse.json(
                { error: 'ipAssetId가 필요합니다.' },
                { status: 400 }
            );
        }

        // TODO: Story Protocol SDK에서 실제 로열티 정보 조회
        // 현재는 플레이스홀더 데이터 반환
        // 추후 SDK 업데이트 후 실제 로열티 정보 조회 구현

        const ipAssetInfo = await getIPAssetInfo(ipAssetId);

        // 플레이스홀더: 실제로는 Story Protocol SDK에서 조회
        const royaltyInfo = {
            ipAssetId,
            totalRoyalties: '0.5', // IP 단위
            claimableSnapshots: ['1', '2', '3'], // 예시
            claimedSnapshots: [], // 예시
            lastUpdated: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            data: royaltyInfo,
            message: '로열티 정보를 조회했습니다.',
        });
    } catch (error) {
        console.error('로열티 정보 조회 오류:', error);
        return NextResponse.json(
            {
                error: '로열티 정보 조회에 실패했습니다.',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}
