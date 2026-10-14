const assert = require('assert');
const ArchiveManager = require('../core/archive-manager.js');
const GAME_DATABASE = require('../story/game_database.js');
const OdysseyEngine = require('../core/engine.js');

console.log('=== 开始测试：贵族武领首次成功返乡前锁定机制 ===');

// 1. 初始化纯净档案（无任何已达成结局）
const cleanArchive = {
  version: 1,
  unlockedAchievements: {},
  unlockedSights: [],
  unlockedMajorEvents: [],
  unlockedDeities: [],
  unlockedEndings: [],
  unlockedEncounters: [],
  stats: { totalVoyages: 0, totalDaysSailed: 0, totalSacrifices: 0 }
};
ArchiveManager.saveArchive(cleanArchive);

console.log('1. 验证纯净初始状态下的职业解锁状态...');
assert.strictEqual(ArchiveManager.hasAchievedHomeReturn(), false, '初始状态未达成任何返乡结局');
assert.strictEqual(ArchiveManager.isClassUnlocked('warrior'), false, '未返乡前【贵族武领】必须处于锁定状态');
assert.strictEqual(ArchiveManager.isClassUnlocked('priest'), true, '【神谕祭司】必须处于开放状态');
assert.strictEqual(ArchiveManager.isClassUnlocked('helmsman'), true, '【老辣舵手】必须处于开放状态');
assert.strictEqual(ArchiveManager.isClassUnlocked('merchant'), true, '【随军富贾】必须处于开放状态');
console.log('   ✓ 初始状态仅【贵族武领】锁定，其他三职业均可正常启航！');

console.log('\n2. 验证达成死亡/沉船结局（非成功返乡）后的锁定保持...');
ArchiveManager.recordEnding('death_sea', null);
assert.strictEqual(ArchiveManager.hasAchievedHomeReturn(), false, '沉海死亡不计入成功返乡');
assert.strictEqual(ArchiveManager.isClassUnlocked('warrior'), false, '沉海死亡后【贵族武领】仍然锁定');

ArchiveManager.recordEnding('death_land', null);
ArchiveManager.recordEnding('death_charybdis', null);
assert.strictEqual(ArchiveManager.hasAchievedHomeReturn(), false, '陆地与漩涡死亡均不计入成功返乡');
assert.strictEqual(ArchiveManager.isClassUnlocked('warrior'), false, '多次死亡失败后【贵族武领】依然严格保持锁定');
console.log('   ✓ 达成死亡结局时，【贵族武领】保持锁定！');

console.log('\n3. 验证达成成功返乡结局后的解锁机制...');
const homeEndingsToTest = ['survivor', 'return', 'triumphant', 'hidden_safe_haven', 'caphireus_easter_egg_home'];

// 分别测试任意一种成功返乡均可解锁
homeEndingsToTest.forEach(endKey => {
  // 重新重置为仅含死亡
  const tempArchive = JSON.parse(JSON.stringify(cleanArchive));
  tempArchive.unlockedEndings = [endKey];
  ArchiveManager.saveArchive(tempArchive);

  assert.strictEqual(ArchiveManager.hasAchievedHomeReturn(), true, `结局 [${endKey}] 应当判定为成功返乡`);
  assert.strictEqual(ArchiveManager.isClassUnlocked('warrior'), true, `达成结局 [${endKey}] 后【贵族武领】应当解锁`);
});
console.log('   ✓ 无论达成【上岸】、【回家】、【凯旋】或【神佑归航】彩蛋，均能成功解锁【贵族武领】！');

console.log('\n4. 验证 Web 端/小程序端职业选择默认降级逻辑...');
// 恢复为锁定状态测试
ArchiveManager.saveArchive(JSON.parse(JSON.stringify(cleanArchive)));
assert.strictEqual(ArchiveManager.isClassUnlocked('warrior'), false);

// 模拟 Web app.js 的选定逻辑
let webSelectedClass = 'warrior';
if (!ArchiveManager.isClassUnlocked(webSelectedClass)) {
  webSelectedClass = 'priest';
}
assert.strictEqual(webSelectedClass, 'priest', '未解锁时，默认职业应自动切换为【神谕祭司】');

console.log('\n======================================================');
console.log('🎉 贵族武领首次成功返乡前锁定与解锁逻辑测试全部通过！');
console.log('======================================================');
