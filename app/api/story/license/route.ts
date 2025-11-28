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
    licenseTermsId: string; // bigint를 string으로 전달
    amount: number;
    receiverAddress?: string; // 선택사항
    maxMintingFee?: string; // bigint를 string으로 전달 (기본값: "0")
    maxRevenueShare?: number; // 기본값: 100
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
                derivativesRevShare:
                    body.derivativesRevShare,
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
 * PUT - 라이선스 구매 (DB에만 저장, 블록체인 통신 없음)
 */
export async function PUT(request: NextRequest) {
    try {
        const body =
            (await request.json()) as MintLicenseRequest;

        if (
            !body.ipAssetId ||
            !body.amount ||
            !body.receiverAddress
        ) {
            return NextResponse.json(
                {
                    error: 'ipAssetId, amount, receiverAddress가 필요합니다.',
                },
                { status: 400 }
            );
        }

        // MongoDB에 라이선스 구매 정보 저장
        const { getDatabase, COLLECTIONS } = await import(
            '@/lib/db/mongodb'
        );
        const db = await getDatabase();
        const licensesCollection = db.collection(
            COLLECTIONS.LICENSES
        );
        const dreamsCollection = db.collection(
            COLLECTIONS.DREAMS
        );

        // ipAssetId로 Dream 조회하여 소유자 정보 가져오기
        const dream = await dreamsCollection.findOne({
            ipAssetId: {
                $regex: new RegExp(
                    `^${body.ipAssetId}$`,
                    'i'
                ),
            },
        });

        const dreamAny = dream as any;
        const ownerAddress =
            dreamAny?.ownerAddress ||
            dreamAny?.creatorAddress ||
            null;

        // 가격 계산 (amount * price, price는 기본값 0.1 IP)
        const pricePerLicense = parseFloat(
            (body as any).price || '0.1'
        );
        const totalPrice = pricePerLicense * body.amount;

        const licensePurchase = {
            id: `license-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`,
            ipAssetId: body.ipAssetId,
            licenseTermsId:
                body.licenseTermsId || 'default', // 없으면 기본값
            amount: body.amount,
            pricePerLicense: pricePerLicense, // 라이선스당 가격
            totalPrice: totalPrice, // 총 가격
            buyerAddress: body.receiverAddress,
            ownerAddress: ownerAddress, // 창작자/소유자 주소
            purchasedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await licensesCollection.insertOne(licensePurchase);

        return NextResponse.json({
            success: true,
            data: {
                licenseId: licensePurchase.id,
                ipAssetId: body.ipAssetId,
                amount: body.amount,
                totalPrice: totalPrice,
                buyerAddress: body.receiverAddress,
                ownerAddress: ownerAddress,
            },
            message: '라이선스 구매가 완료되었습니다.',
        });
    } catch (error) {
        console.error('라이선스 구매 오류:', error);
        return NextResponse.json(
            {
                error: '라이선스 구매에 실패했습니다.',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}
