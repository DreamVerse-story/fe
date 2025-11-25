/**
 * POST /api/story/prepare-metadata
 * Dream IP 메타데이터를 IPFS에 업로드
 *
 * 사용자가 직접 트랜잭션을 보내기 전에
 * 메타데이터를 IPFS에 먼저 업로드합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDreamById } from '@/lib/storage/mongo-storage';
import { uploadToIPFS } from '@/lib/storage/ipfs-metadata';

interface PrepareMetadataRequest {
    dreamId: string;
}

export async function POST(request: NextRequest) {
    try {
        const body =
            (await request.json()) as PrepareMetadataRequest;

        if (!body.dreamId) {
            return NextResponse.json(
                {
                    error: 'dreamId가 필요합니다.',
                },
                { status: 400 }
            );
        }

        // Dream IP 데이터 가져오기
        const dream = await getDreamById(body.dreamId);

        if (!dream) {
            return NextResponse.json(
                {
                    error: 'Dream IP를 찾을 수 없습니다.',
                },
                { status: 404 }
            );
        }

        if (dream.status !== 'completed') {
            return NextResponse.json(
                {
                    error: 'Dream IP 생성이 완료되지 않았습니다.',
                },
                { status: 400 }
            );
        }

        // IPFS에 메타데이터 업로드 (IP + NFT 메타데이터)
        console.log(
            `📤 Dream IP 메타데이터 IPFS 업로드 중: ${dream.id}`
        );

        const { ipMetadataCid, nftMetadataCid } =
            await uploadToIPFS(dream);

        console.log(
            `✅ IP 메타데이터 업로드 완료: ipfs://${ipMetadataCid}`
        );
        console.log(
            `✅ NFT 메타데이터 업로드 완료: ipfs://${nftMetadataCid}`
        );

        return NextResponse.json({
            success: true,
            ipMetadataCid,
            nftMetadataCid,
            ipMetadataURI: `ipfs://${ipMetadataCid}`,
            nftMetadataURI: `ipfs://${nftMetadataCid}`,
            message:
                'Dream IP 메타데이터가 IPFS에 업로드되었습니다.',
        });
    } catch (error) {
        console.error(
            'IPFS 메타데이터 업로드 오류:',
            error
        );
        return NextResponse.json(
            {
                error: 'IPFS 업로드에 실패했습니다.',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}
