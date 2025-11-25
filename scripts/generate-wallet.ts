/**
 * 테스트용 지갑 생성 스크립트
 *
 * Story Protocol 서버 작업용 지갑을 생성합니다.
 * ⚠️ 주의: 실제 프로덕션에서는 보안 저장소를 사용하세요!
 */

import {
    generatePrivateKey,
    privateKeyToAccount,
} from 'viem/accounts';

console.log('🔐 Story Protocol 서버 지갑 생성 중...\n');

// Private Key 생성
const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log('✅ 지갑 생성 완료!\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📝 .env.local 파일에 다음 내용을 추가하세요:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`STORY_PRIVATE_KEY=${privateKey}`);
console.log(`STORY_WALLET_ADDRESS=${account.address}\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n⚠️  중요 안내:\n');
console.log('1. 이 Private Key는 서버에서만 사용됩니다.');
console.log('2. 절대 공개 저장소에 커밋하지 마세요!');
console.log(
    '3. Story Faucet에서 이 주소로 테스트 IP 토큰을 받으세요:'
);
console.log(`   https://faucet.story.foundation\n`);
console.log('4. 지갑 주소:', account.address);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
