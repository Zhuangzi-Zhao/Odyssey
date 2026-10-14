const assert = require('assert');
const OdysseyEngine = require('../core/engine.js');
const GAME_DATABASE = require('../story/game_database.js');
const ArchiveManager = require('../core/archive-manager.js');

console.log('=== Test Suite: Micro-Event Chains (微型事件链) ===');

// 1. 验证 8 个微型事件链在数据库中的结构
const targetIds = ['random_2', 'random_6', 'random_11', 'random_14', 'random_16', 'random_17', 'random_23', 'random_52'];

targetIds.forEach(id => {
  const ev = GAME_DATABASE.RANDOM_EVENTS.find(e => e.id === id);
  assert(ev, '事件存在: ' + id);
  assert(ev.choices.length >= 2, id + ' 选项数应 >= 2');
  
  const chainChoice = ev.choices.find(c => c.chain);
  assert(chainChoice, id + ' 必须有触发微型事件链的选项');
  assert(chainChoice.chain.text, id + ' chain 必须有第二阶段叙事文本');
  assert(chainChoice.chain.outcomes && chainChoice.chain.outcomes.length >= 2, id + ' chain 必须至少包含 2 个判定结局');
  
  // 选项标题中不应包含未清洗的数值或判定文本
  ev.choices.forEach(c => {
    assert(!c.text.includes('【数值变化】'), '选项文本不应包含【数值变化】: ' + c.text);
    assert(!c.text.includes('判定'), '选项文本不应包含未清洗的判定: ' + c.text);
  });
  console.log('✔ [DB Check] ' + ev.id + ' (' + ev.title + ') 结构验证通过，触发选项: ' + chainChoice.text);
});

// 2. 深度测试 random_16 陌生人求搭船（用户指定的典例）
console.log('\n--- 详细测试 random_16: 陌生人求搭船 ---');
{
  const engine = new OdysseyEngine('warrior');
  engine.state.day = 5;
  engine.state.resources.food = 70;
  engine.state.resources.sanity = 80;
  engine.state.resources.luck = 60;
  engine.state.resources.crew = 25;
  engine.state.resources.loyalty = 75; // >= 60 解锁仔细盘问

  const ev16 = GAME_DATABASE.RANDOM_EVENTS.find(e => e.id === 'random_16');
  engine.state.currentNode = JSON.parse(JSON.stringify(ev16));

  assert.strictEqual(engine.state.currentNode.choices.length, 3);
  assert.strictEqual(engine.state.currentNode.choices[0].text, '同意搭船');
  assert.strictEqual(engine.state.currentNode.choices[1].text, '拒绝搭船');
  assert.strictEqual(engine.state.currentNode.choices[2].text, '仔细盘问');

  // 选择第 3 项：仔细盘问
  const resChoice = engine.makeChoice(2);
  assert(resChoice.success, '选择仔细盘问应成功');
  
  // 应进入第二阶段事件展示节点
  const stage2Node = engine.state.currentNode;
  assert(stage2Node.isResolution, '第二阶段节点应为 isResolution');
  assert(stage2Node.text.includes('你上前一步，盯着他的眼睛：“解开斗篷。”'), '文本应包含第二阶段正文');
  assert(stage2Node.text.includes('【命运判定 ·'), '文本应包含命运判定标题');
  assert(stage2Node.choices.length === 1, '第二阶段应有继续前行选项');
  assert.strictEqual(stage2Node.choices[0].text, '妥善处置，继续前行');

  // 成就检定：命运的骰子
  const archive = ArchiveManager.getArchive();
  assert(archive.unlockedAchievements['ach_first_dice'], '应解锁成就: 命运的骰子');

  // 点击继续前行推进回合
  const nextRes = engine.makeChoice(0);
  assert(nextRes.success, '继续前行应成功推进');
  assert.strictEqual(engine.state.day, 6, '推进后天数应加 1');
  console.log('✔ [Gameplay Check] random_16 仔细盘问 -> 第二阶段判定 -> 妥善处置推进 验证通过！');
}

// 3. 测试 8 个微型事件链全部都能在 engine 中平稳运转
console.log('\n--- 批量测试所有 8 个微型事件链在 Engine 中的执行流 ---');
targetIds.forEach(id => {
  const engine = new OdysseyEngine('priest');
  engine.state.day = 3;
  engine.state.resources = { food: 90, sanity: 90, luck: 90, crew: 30, loyalty: 90 };

  const ev = GAME_DATABASE.RANDOM_EVENTS.find(e => e.id === id);
  engine.state.currentNode = JSON.parse(JSON.stringify(ev));

  const chainChoiceIdx = ev.choices.findIndex(c => c.chain);
  assert(chainChoiceIdx >= 0, '需找到 chain choice');

  const r1 = engine.makeChoice(chainChoiceIdx);
  assert(r1.success, id + ' 选择 chain 选项应成功');
  assert(engine.state.currentNode.isResolution, id + ' 应切换到 stage2 判定展现节点');
  assert(engine.state.currentNode.text.includes('【命运判定 ·'), id + ' 应展示命运判定标签');

  const r2 = engine.makeChoice(0);
  assert(r2.success, id + ' stage2 点击继续前行应成功');
  assert.strictEqual(engine.state.day, 4, id + ' 完成后天数应递增为 4');
  console.log('✔ [Engine Batch] ' + id + ' 完整执行链路成功！');
});

console.log('\n🎉 All Micro-Event Chain tests passed successfully!');
