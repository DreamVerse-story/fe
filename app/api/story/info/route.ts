/**
 * GET /api/story/info?ipAssetId=xxx
 * IP Asset 정보 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { getIPAssetInfo } from '@/lib/blockchain/story-protocol';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const ipAssetId = searchParams.get('ipAssetId');

        if (!ipAssetId) {
            return NextResponse.json(
                { error: 'ipAssetId가 필요합니다.' },
                { status: 400 }
            );
        }

        const ipAsset = await getIPAssetInfo(ipAssetId);

        return NextResponse.json({
            success: true,
            data: ipAsset,
        });
    } catch (error) {
        console.error('IP Asset 조회 오류:', error);
        return NextResponse.json(
            {
                error: 'IP Asset 조회에 실패했습니다.',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}
