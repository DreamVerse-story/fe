/**
 * 암호화 및 해싱 유틸리티
 */

/**
 * 텍스트의 SHA256 해시 생성
 * 꿈 텍스트의 원천성 증명을 위해 사용
 */
export async function generateDreamHash(
    dreamText: string
): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(dreamText);
    const hashBuffer = await crypto.subtle.digest(
        'SHA-256',
        data
    );
    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
}

/**
 * UUID 생성 (브라우저 네이티브 API 사용)
 */
export function generateId(): string {
    return crypto.randomUUID();
}
