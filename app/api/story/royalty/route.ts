/**
 * POST /api/story/royalty
 * 로열티 클레임
 */

import { NextRequest, NextResponse } from 'next/server';
import { claimRoyalties } from '@/lib/blockchain/story-protocol';

interface ClaimRoyaltyRequest {
    ipAssetId: string;
    snapshotIds: string[]; // bigint[] -> string[]
}

export async function POST(request: NextRequest) {
    try {
        const body =
            (await request.json()) as ClaimRoyaltyRequest;

        if (
            !body.ipAssetId ||
            !body.snapshotIds ||
            body.snapshotIds.length === 0
        ) {
            return NextResponse.json(
                {
                    error: 'ipAssetId와 snapshotIds가 필요합니다.',
                },
                { status: 400 }
            );
        }

        const snapshotIds = body.snapshotIds.map((id) =>
            BigInt(id)
        );

        const result = await claimRoyalties(
            body.ipAssetId,
            snapshotIds
        );

        return NextResponse.json({
            success: true,
            data: result,
            message: '로열티가 클레임되었습니다.',
        });
    } catch (error) {
        console.error('로열티 클레임 오류:', error);
        return NextResponse.json(
            {
                error: '로열티 클레임에 실패했습니다.',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}
