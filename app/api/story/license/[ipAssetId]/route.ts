/**
 * GET /api/story/license/[ipAssetId]
 * IP Asset에 첨부된 라이선스 조건 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { storyAeneid } from '@/lib/blockchain/chains';

// IP Asset Registry ABI (라이선스 조건 조회용)
const IP_ASSET_REGISTRY_ABI = [
    {
        name: 'getAttachedLicenseTerms',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'ipId', type: 'address' }],
        outputs: [
            {
                name: '',
                type: 'tuple[]',
                components: [
                    {
                        name: 'licenseTermsId',
                        type: 'uint256',
                    },
                    {
                        name: 'licenseTemplate',
                        type: 'address',
                    },
                ],
            },
        ],
    },
] as const;

// License Registry ABI
const LICENSE_REGISTRY_ABI = [
    {
        name: 'getLicenseTerms',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'licenseTermsId', type: 'uint256' },
        ],
        outputs: [
            {
                name: '',
                type: 'tuple',
                components: [
                    {
                        name: 'defaultMintingFee',
                        type: 'uint256',
                    },
                    { name: 'currency', type: 'address' },
                    { name: 'commercialUse', type: 'bool' },
                    {
                        name: 'commercialRevShare',
                        type: 'uint32',
                    },
                    {
                        name: 'derivativesAllowed',
                        type: 'bool',
                    },
                    {
                        name: 'derivativesAttribution',
                        type: 'bool',
                    },
                    {
                        name: 'derivativesApproval',
                        type: 'bool',
                    },
                    {
                        name: 'derivativesReciprocal',
                        type: 'bool',
                    },
                ],
            },
        ],
    },
] as const;

// Story Protocol Aeneid Testnet 컨트랙트 주소
const IP_ASSET_REGISTRY_ADDRESS =
    '0x0000000000000000000000000000000000000000'; // TODO: 실제 주소로 교체
const LICENSE_REGISTRY_ADDRESS =
    '0x0000000000000000000000000000000000000000'; // TODO: 실제 주소로 교체

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ ipAssetId: string }> }
) {
    try {
        const { ipAssetId } = await params;

        if (!ipAssetId) {
            return NextResponse.json(
                { error: 'ipAssetId가 필요합니다.' },
                { status: 400 }
            );
        }

        // Public client 생성 (읽기 전용)
        const publicClient = createPublicClient({
            chain: storyAeneid,
            transport: http('https://aeneid.storyrpc.io'),
        });

        // 방법 1: Story Protocol SDK를 사용하여 조회 (가능한 경우)
        // 주의: 서버 사이드에서는 STORY_PRIVATE_KEY가 필요하므로
        // 클라이언트 사이드에서만 사용 가능한 경우가 많음
        // 여기서는 스킵하고 MongoDB나 블록체인에서 직접 조회

        // 방법 2: MongoDB에서 먼저 조회 (가장 빠름)
        // ipAssetId로 Dream을 찾아야 함 (dream.id가 아니라 dream.ipAssetId)
        try {
            const { getDatabase, COLLECTIONS } =
                await import('@/lib/db/mongodb');

            const db = await getDatabase();
            const collection = db.collection(
                COLLECTIONS.DREAMS
            );

            // ipAssetId 필드로 검색 (대소문자 무시)
            const dream = await collection.findOne({
                ipAssetId: {
                    $regex: new RegExp(
                        `^${ipAssetId}$`,
                        'i'
                    ),
                },
            });

            if (dream) {
                const dreamAny = dream as any;

                // Dream IP에 저장된 라이선스 조건 ID 확인
                if (dreamAny?.licenseTermsId) {
                    return NextResponse.json({
                        success: true,
                        licenseTermsId:
                            dreamAny.licenseTermsId.toString(),
                        source: 'database',
                        message:
                            '라이선스 조건을 조회했습니다.',
                    });
                }
            }
        } catch (dbError) {
            console.log(
                'MongoDB 조회 실패, 블록체인에서 조회 시도:',
                dbError
            );
        }

        // 방법 3: 블록체인에서 직접 조회
        // IP Asset Registry 컨트랙트에서 첨부된 라이선스 조건 조회
        const ipAssetRegistryAddress =
            process.env.NEXT_PUBLIC_IP_ASSET_REGISTRY ||
            '0x77319B4031e6eF1250907aa00018B8B1c67a244b'; // Aeneid Testnet 기본값

        // 블록체인에서 직접 조회 시도
        try {
            const attachedTerms =
                await publicClient.readContract({
                    address:
                        ipAssetRegistryAddress as `0x${string}`,
                    abi: IP_ASSET_REGISTRY_ABI,
                    functionName: 'getAttachedLicenseTerms',
                    args: [ipAssetId as `0x${string}`],
                });

            if (
                !attachedTerms ||
                attachedTerms.length === 0
            ) {
                return NextResponse.json({
                    success: false,
                    error: 'IP Asset에 라이선스 조건이 첨부되어 있지 않습니다.',
                    licenseTermsId: null,
                });
            }

            // 첫 번째 첨부된 라이선스 조건 ID 반환
            const licenseTermsId =
                attachedTerms[0].licenseTermsId.toString();

            return NextResponse.json({
                success: true,
                licenseTermsId: licenseTermsId,
                source: 'blockchain',
                licenseTemplate:
                    attachedTerms[0].licenseTemplate,
                message: '라이선스 조건을 조회했습니다.',
            });
        } catch (contractError) {
            console.error(
                '컨트랙트 조회 오류:',
                contractError
            );

            // 모든 방법 실패 시 에러 반환
            return NextResponse.json({
                success: false,
                error: '라이선스 조건을 찾을 수 없습니다. IP Asset에 라이선스 조건이 첨부되어 있는지 확인해주세요.',
                licenseTermsId: null,
                details:
                    contractError instanceof Error
                        ? contractError.message
                        : String(contractError),
            });
        }
    } catch (error) {
        console.error('라이선스 조건 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '라이선스 조건 조회에 실패했습니다.',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}
