// test/run_all_tests.js
// 统一自动化测试调度器

const { execSync } = require('child_process');
const path = require('path');

const testFiles = [
  'test_web_version.js',
  'test_warrior_lock.js',
  'test_four_acts_inky.js',
  'test_micro_chains.js',
  'test_no_consecutive_popups.js',
  'test_miniprogram_game.js'
];

console.log('========================================================');
console.log('⚔️  奥德赛 (Odyssey) 全套自动化回归测试套件启动');
console.log('========================================================\n');

let passed = 0;
let failed = 0;

testFiles.forEach((file, index) => {
  const filePath = path.join(__dirname, file);
  process.stdout.write(`[${index + 1}/${testFiles.length}] 正在执行: ${file} ... `);
  try {
    execSync(`node "${filePath}"`, { stdio: 'pipe' });
    console.log('✅ 通过');
    passed++;
  } catch (err) {
    console.log('❌ 失败');
    console.error(err.stdout ? err.stdout.toString() : err.message);
    failed++;
  }
});

console.log('\n--------------------------------------------------------');
console.log(`测试完成：${passed} 项成功，${failed} 项失败。`);
if (failed === 0) {
  console.log('🎉 所有系统、主线、微型事件链、双端与安全机制验证通过！');
  console.log('========================================================');
  process.exit(0);
} else {
  console.error('💥 存在失败的测试用例，请检查上述错误日志。');
  console.log('========================================================');
  process.exit(1);
}
