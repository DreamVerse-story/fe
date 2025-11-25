/**
 * POST /api/story/license
 * Dream IP에 라이선스 조건 설정 및 발행
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    attachLicenseTerms,
    mintLicenseTokens,
} from '@/lib/blockchain/story-protocol';

interface AttachLicenseRequest {
    ipAssetId: string;
    commercialUse: boolean;
    commercialRevShare: number;
    derivativesAllowed: boolean;
    derivativesRevShare: number;
    currency: string;
    price: string; // bigint를 string으로 전달
}

interface MintLicenseRequest {
    ipAssetId: string;
    amount: number;
    receiverAddress: string;
}

/**
 * POST - 라이선스 조건 설정
 */
export async function POST(request: NextRequest) {
    try {
        const body =
            (await request.json()) as AttachLicenseRequest;

        if (!body.ipAssetId) {
            return NextResponse.json(
                { error: 'ipAssetId가 필요합니다.' },
                { status: 400 }
            );
        }

        const result = await attachLicenseTerms(
            body.ipAssetId,
            {
                commercialUse: body.commercialUse,
                commercialRevShare: body.commercialRevShare,
                derivativesAllowed: body.derivativesAllowed,
                derivativesRevShare: body.derivativesRevShare,
                currency: body.currency,
                price: BigInt(body.price),
            }
        );

        return NextResponse.json({
            success: true,
            data: result,
            message: '라이선스 조건이 설정되었습니다.',
        });
    } catch (error) {
        console.error('라이선스 설정 오류:', error);
        return NextResponse.json(
            {
                error: '라이선스 설정에 실패했습니다.',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}

/**
 * PUT - 라이선스 토큰 발행
 */
export async function PUT(request: NextRequest) {
    try {
        const body =
            (await request.json()) as MintLicenseRequest;

        if (
            !body.ipAssetId ||
            !body.receiverAddress ||
            !body.amount
        ) {
            return NextResponse.json(
                {
                    error: 'ipAssetId, receiverAddress, amount가 필요합니다.',
                },
                { status: 400 }
            );
        }

        const result = await mintLicenseTokens(
            body.ipAssetId,
            body.amount,
            body.receiverAddress
        );

        return NextResponse.json({
            success: true,
            data: result,
            message: '라이선스 토큰이 발행되었습니다.',
        });
    } catch (error) {
        console.error('라이선스 발행 오류:', error);
        return NextResponse.json(
            {
                error: '라이선스 발행에 실패했습니다.',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}

