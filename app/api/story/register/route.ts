/**
 * POST /api/story/register
 * Dream IP를 Story Protocol에 등록
 */

import { NextRequest, NextResponse } from 'next/server';
import { registerDreamIP } from '@/lib/blockchain/story-protocol';

interface RegisterRequest {
    dreamId: string;
    walletAddress: string;
}

export async function POST(request: NextRequest) {
    try {
        const body =
            (await request.json()) as RegisterRequest;

        if (!body.dreamId || !body.walletAddress) {
            return NextResponse.json(
                {
                    error: 'dreamId와 walletAddress가 필요합니다.',
                },
                { status: 400 }
            );
        }

        // Story Protocol에 Dream IP 등록
        const result = await registerDreamIP(
            body.dreamId,
            body.walletAddress
        );

        return NextResponse.json({
            success: true,
            data: result,
            message:
                'Dream IP가 Story Protocol에 등록되었습니다.',
        });
    } catch (error) {
        console.error('Story Protocol 등록 오류:', error);
        return NextResponse.json(
            {
                error: '등록에 실패했습니다.',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}
