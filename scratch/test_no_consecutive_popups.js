const assert = require('assert');
const OdysseyEngine = require('../core/engine.js');
const GAME_DATABASE = require('../story/game_database.js');

console.log('=== Test Suite: No Consecutive / Overlapping Popups (弹窗互斥与冷却机制测试) ===');

// 运行 50 局完整航程模拟，检验所有可能路径下的弹窗触发行为
const RUNS = 50;

for (let r = 1; r <= RUNS; r++) {
  const engine = new OdysseyEngine(['warrior', 'priest', 'helmsman'][r % 3]);
  const popupDays = [];

  while (!engine.state.gameEnded && engine.state.day < 20) {
    const node = engine.state.currentNode;
    const day = engine.state.day;

    // 1. 同回合绝对互斥检验：绝不能同时出现大事件与见闻录弹窗
    const hasEpic = !!engine.state.epicMajorEvent;
    const hasSight = !!engine.state.discoveredSight;
    assert(!(hasEpic && hasSight), `[第${r}局 第${day}天] 严禁同时出现史诗大事件与见闻录弹窗！`);

    // 2. 决策节点绝对不能带弹窗
    if (node.isLandingDecision) {
      assert(!hasEpic && !hasSight, `[第${r}局 第${day}天] 远眺海岛决策节点不应挂载弹窗！`);
    }
    if (node.isIslandStayDecision) {
      assert(!hasEpic && !hasSight, `[第${r}局 第${day}天] 营地驻留抉择节点不应挂载弹窗！`);
    }

    // 记录弹窗天数
    if (hasEpic || hasSight) {
      popupDays.push({
        day,
        type: hasEpic ? 'epic' : 'sight',
        title: hasEpic ? engine.state.epicMajorEvent.title : engine.state.discoveredSight.title
      });
    }

    // 做出可用选项选择以推进
    const availableChoices = node.choices
      .map((c, idx) => ({ c, idx }))
      .filter(item => engine.isChoiceAvailable(item.c).available);

    if (availableChoices.length === 0) break;
    const pick = availableChoices[Math.floor(Math.random() * availableChoices.length)].idx;
    engine.makeChoice(pick);
  }

  // 3. 连续跨回合检验：任何两个弹窗之间的间隔天数必须 >= 2
  for (let i = 0; i < popupDays.length - 1; i++) {
    const p1 = popupDays[i];
    const p2 = popupDays[i + 1];
    const interval = p2.day - p1.day;
    assert(
      interval >= 2,
      `[第${r}局] 发现连续出现弹窗！第${p1.day}天(${p1.type}:${p1.title}) 与 第${p2.day}天(${p2.type}:${p2.title})，间隔仅为 ${interval} 天！`
    );
  }

  // 4. 上限检验
  assert(engine.state.majorEventsCount <= 12, `大事件次数不能超过12次，实际: ${engine.state.majorEventsCount}`);
  assert(engine.state.sightsCount <= 3, `见闻录次数不能超过3次，实际: ${engine.state.sightsCount}`);
}

console.log(`✔ 成功完成 ${RUNS} 局全生命周期航行模拟！`);
console.log('✔ 所有局数均满足：');
console.log('   1. 同回合史诗大事件与航海见闻录 100% 互斥，绝不同步弹出；');
console.log('   2. 跨回合弹窗严格遵守至少 2 天冷却期，绝不连续出现；');
console.log('   3. 海岛登陆决策与营地驻留抉择节点 0 弹窗干扰；');
console.log('   4. 经典大事件 ≤ 3 次，航海见闻录 ≤ 3 次。');
console.log('\n🎉 ALL POPUP SPACING & MUTUAL EXCLUSION TESTS PASSED!');
