/**
 * GET /api/dreams/[id]/progress
 * Server-Sent Events를 통한 실시간 진행 상태 스트리밍
 */

import { NextRequest } from 'next/server';
import { getDreamById } from '@/lib/storage/mongo-storage';

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    const { id } = await context.params;

    // SSE 스트리밍 응답 생성
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            let lastProgress: string | null = null;
            let isClosed = false;

            // 클라이언트 연결 확인을 위한 keepalive
            const keepAliveInterval = setInterval(() => {
                if (isClosed) {
                    clearInterval(keepAliveInterval);
                    return;
                }
                try {
                    controller.enqueue(
                        encoder.encode(': keepalive\n\n')
                    );
                } catch (error) {
                    clearInterval(keepAliveInterval);
                }
            }, 30000); // 30초마다 keepalive

            // 진행 상태 체크 함수
            const checkProgress = async () => {
                if (isClosed) return;

                try {
                    const dream = await getDreamById(id);

                    if (!dream) {
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({
                                    error: 'Dream IP를 찾을 수 없습니다.',
                                })}\n\n`
                            )
                        );
                        controller.close();
                        clearInterval(keepAliveInterval);
                        return;
                    }

                    // progress가 변경되었는지 확인
                    const currentProgress = dream.progress
                        ? JSON.stringify(dream.progress)
                        : null;

                    if (currentProgress !== lastProgress) {
                        lastProgress = currentProgress;

                        // progress 이벤트 전송
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({
                                    progress:
                                        dream.progress,
                                    status: dream.status,
                                })}\n\n`
                            )
                        );

                        // 완료 또는 실패 시 스트림 종료
                        if (
                            dream.status === 'completed' ||
                            dream.status === 'failed'
                        ) {
                            controller.enqueue(
                                encoder.encode(
                                    `data: ${JSON.stringify(
                                        {
                                            progress:
                                                dream.progress,
                                            status: dream.status,
                                            completed: true,
                                        }
                                    )}\n\n`
                                )
                            );
                            setTimeout(() => {
                                controller.close();
                                clearInterval(
                                    keepAliveInterval
                                );
                                isClosed = true;
                            }, 1000);
                        }
                    }
                } catch (error) {
                    console.error(
                        'Progress 체크 오류:',
                        error
                    );
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({
                                error: '진행 상태를 가져오는 중 오류가 발생했습니다.',
                            })}\n\n`
                        )
                    );
                }
            };

            // 초기 연결 메시지
            controller.enqueue(
                encoder.encode(
                    `data: ${JSON.stringify({
                        connected: true,
                    })}\n\n`
                )
            );

            // 즉시 한 번 체크
            await checkProgress();

            // 1초마다 진행 상태 체크
            const progressInterval = setInterval(
                async () => {
                    if (isClosed) {
                        clearInterval(progressInterval);
                        return;
                    }
                    await checkProgress();
                },
                1000
            );

            // 클라이언트 연결 종료 감지
            request.signal.addEventListener('abort', () => {
                isClosed = true;
                clearInterval(progressInterval);
                clearInterval(keepAliveInterval);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no', // Nginx 버퍼링 비활성화
        },
    });
}
