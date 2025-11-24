/**
 * GET /api/dreams/[id]
 * 특정 Dream IP 패키지 상세 조회
 * 
 * PATCH /api/dreams/[id]
 * Dream IP 패키지 업데이트 (공개/비공개 등)
 * 
 * DELETE /api/dreams/[id]
 * Dream IP 패키지 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDreamById, saveDream, deleteDream } from '@/lib/storage/mongo-storage';
import type { DreamIPPackage } from '@/lib/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const dream = await getDreamById(id);

    if (!dream) {
      return NextResponse.json(
        { error: 'Dream IP를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      dream,
    });
  } catch (error) {
    console.error('Dream 조회 오류:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<DreamIPPackage>;

    const dream = await getDreamById(id);

    if (!dream) {
      return NextResponse.json(
        { error: 'Dream IP를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 업데이트 가능한 필드만 업데이트
    const updatedDream: DreamIPPackage = {
      ...dream,
      isPublic: body.isPublic ?? dream.isPublic,
      updatedAt: new Date().toISOString(),
    };

    await saveDream(updatedDream);

    return NextResponse.json({
      success: true,
      dream: updatedDream,
    });
  } catch (error) {
    console.error('Dream 업데이트 오류:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    await deleteDream(id);

    return NextResponse.json({
      success: true,
      message: 'Dream IP가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Dream 삭제 오류:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

