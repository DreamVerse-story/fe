/**
 * GET /api/dreams
 * Dream IP 패키지 목록 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllDreams, getPublicDreams } from '@/lib/storage/mongo-storage';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const publicOnly = searchParams.get('public') === 'true';

    const dreams = publicOnly ? await getPublicDreams() : await getAllDreams();

    // 최신순 정렬
    const sorted = dreams.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      dreams: sorted,
      total: sorted.length,
    });
  } catch (error) {
    console.error('Dream 목록 조회 오류:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

