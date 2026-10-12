// scratch/test_four_acts_inky.js
const assert = require('assert');
const OdysseyEngine = require('../core/engine.js');
const ArchiveManager = require('../core/archive-manager.js');
const GAME_DATABASE = require('../story/game_database.js');

console.log('=== 开始验证全新四幕主线剧情系统（基于 plot/ 文案与 Inky 引擎架构） ===\n');

// 1. 验证数据库结构与全部幕次
console.log('1. 验证游戏数据库中的四幕与 Knots 配置...');
assert(GAME_DATABASE.STORY_ACTS, 'STORY_ACTS 必须存在');
assert(GAME_DATABASE.KNOTS, 'KNOTS 必须存在');
assert.strictEqual(Object.keys(GAME_DATABASE.STORY_ACTS).length, 5, '必须包含 0, 1, 2, 3, 4 共 5 幕定义');
assert(GAME_DATABASE.ENDINGS['hidden_safe_haven'], '必须包含卡法柔斯神迹隐藏结局');
assert(GAME_DATABASE.ACHIEVEMENTS.find(a => a.id === 'ach_caphireus_miracle'), '必须包含神佑归航成就');
assert(GAME_DATABASE.ACHIEVEMENTS.find(a => a.id === 'ach_steersman'), '必须包含执舵者成就');
assert(GAME_DATABASE.ACHIEVEMENTS.find(a => a.id === 'ach_peacemaker'), '必须包含止战者成就');
assert(GAME_DATABASE.ACHIEVEMENTS.find(a => a.id === 'ach_crossing_realms'), '必须包含渡界者成就');
console.log('   ✓ 数据库验证通过，Knots 总数:', Object.keys(GAME_DATABASE.KNOTS).length);

// 2. 验证多职业开局专属序幕 Knot
console.log('\n2. 验证四职业专属开局节点...');
const classesToTest = ['warrior', 'priest', 'helmsman', 'merchant'];
classesToTest.forEach(cls => {
  const eng = new OdysseyEngine();
  const st = eng.reset(cls);
  assert.strictEqual(st.currentAct, 0, `${cls} 开局幕次必须为 0`);
  assert.strictEqual(st.actKnotId, `knot_prologue_${cls}_troy`, `${cls} 必须匹配专属初始 Knot`);
  assert.strictEqual(st.currentNode.id, `knot_prologue_${cls}_troy`, `${cls} 当前节点必须匹配`);
  console.log(`   ✓ 职业 [${cls}] 绑定初始 Knot 成功: ${st.currentNode.title} (${st.currentNode.speaker})`);
});

// 3. 验证选项纯净性（严禁选项上出现数值变动剧透）
console.log('\n3. 验证选项卡片纯净性（严防选项剧透数值）...');
for (const knotId in GAME_DATABASE.KNOTS) {
  const knot = GAME_DATABASE.KNOTS[knotId];
  if (knot.choices) {
    knot.choices.forEach((c, idx) => {
      assert.strictEqual(c.hint || '', '', `Knot [${knotId}] 选项 [${idx}] 的 hint 必须为空字符串`);
      const hasDeltaSpoiler = /[+-]\d+/.test(c.text);
      assert(!hasDeltaSpoiler, `Knot [${knotId}] 选项文本严禁包含数值符号: ${c.text}`);
    });
  }
}
console.log('   ✓ 全库所有主线 Knot 选项已验证纯净，无任何数值剧透！');

// 4. 验证序幕分支与隐藏结局门槛检定
console.log('\n4. 验证序幕风暴流转与卡法柔斯神迹隐藏结局...');
const engWarrior = new OdysseyEngine();
engWarrior.reset('warrior');
assert.strictEqual(engWarrior.state.currentNode.id, 'knot_prologue_warrior_troy');

// 做出选择：清点缴获登船拔锚 -> 直接切入卡法柔斯海角风暴
let res = engWarrior.makeChoice(0);
assert(res.success, '选择成功');
assert.strictEqual(engWarrior.state.currentNode.id, 'knot_prologue_warrior_storm', '下一节点必须为卡法柔斯海角风暴');
assert(engWarrior.state.currentNode.text.includes('【前情抉择】'), '新事件正文顶部必须包含【前情抉择】');
assert(engWarrior.state.currentNode.text.includes('【局势变动】'), '结果旁白文本框中必须完整显示【局势变动】');

// 隐藏结局门槛检定：数值不足时不可选
const stormChoices = engWarrior.state.currentNode.choices;
const miracleChoice = stormChoices[0];
let check = engWarrior.isChoiceAvailable(miracleChoice);
assert.strictEqual(check.available, false, '未达到极高门槛时不可选神迹结局');

// 提升数值以满足神迹要求
engWarrior.state.resources.luck = 85;
engWarrior.state.resources.loyalty = 85;
engWarrior.state.resources.sanity = 75;
check = engWarrior.isChoiceAvailable(miracleChoice);
assert.strictEqual(check.available, true, '数值满足极高门槛后神迹选项必须可用');

// 突破卡法柔斯海角风暴 -> 顺利进入彩蛋线
res = engWarrior.makeChoice(0);
assert(res.success, '突破卡法柔斯风暴成功');
assert.strictEqual(engWarrior.state.currentNode.id, 'knot_easter_egg_caphireus_pass', '顺利通过卡法柔斯海角后必须进入彩蛋线');

// 在彩蛋线选择直接返乡
res = engWarrior.makeChoice(0);
assert(res.success, '彩蛋线直接返乡成功');
assert.strictEqual(engWarrior.state.gameEnded, true, '游戏应当结束');
assert.strictEqual(engWarrior.state.ending.title, '【隐藏结局 · 神佑归航】', '结局必须为神佑归航');
assert(engWarrior.state.newAchievements.find(a => a.id === 'ach_caphireus_miracle'), '必须解锁神佑归航成就');
console.log('   ✓ 卡法柔斯神迹彩蛋线直通返乡与成就解锁验证通过！');

// 5. 验证四幕完整贯通流程（从序幕誓言到故土归途）
console.log('\n5. 验证常规航线（四幕连贯流转至终章）...');
const engine = new OdysseyEngine();
engine.reset('warrior');

// Helper: 步进处理幕间航海，直至抵达下一个主线 Knot
function stepToNextKnot(eng) {
  let steps = 0;
  while (!eng.state.gameEnded && steps < 15) {
    steps++;
    // 维持测试资源安全线
    eng.state.resources.food = Math.max(eng.state.resources.food, 70);
    eng.state.resources.sanity = Math.max(eng.state.resources.sanity, 70);
    eng.state.resources.loyalty = Math.max(eng.state.resources.loyalty, 70);
    eng.state.resources.crew = Math.max(eng.state.resources.crew, 15);

    const node = eng.state.currentNode;
    if (node.isLandingDecision) {
      eng.makeChoice(1); // 绕行荒岛直奔主线
    } else if (node.isIslandStayDecision) {
      eng.makeChoice(1); // 拔锚起航回海
    } else {
      if (node.id.startsWith('knot_') && !eng.state.pendingNextKnot) {
        break;
      }
      eng.makeChoice(0);
    }
  }
}

// 序幕：选择常规航线 -> 海滩反思 -> 立誓启航
engine.makeChoice(0); // 特洛伊启航 -> 卡法柔斯风暴
assert.strictEqual(engine.state.currentNode.id, 'knot_prologue_warrior_storm');

const regularIdx = engine.state.currentNode.choices.findIndex(c => c.nextKnot === 'knot_prologue_beach_reflection');
engine.makeChoice(regularIdx >= 0 ? regularIdx : 2); // 搏杀巨浪，冲上海滩 -> 浅滩反思
assert.strictEqual(engine.state.currentNode.id, 'knot_prologue_beach_reflection');

// 立誓启航：扬帆，启航！(解锁执舵者成就，切入第一幕)
engine.makeChoice(0);
assert(engine.state.newAchievements.find(a => a.id === 'ach_steersman'), '必须解锁【执舵者】成就');
assert.strictEqual(engine.state.currentAct, 1, '必须进入第一幕');
console.log('   ✓ 序幕立誓启航完成，已解锁【执舵者】成就！');

// 跨幕航海：幕间海洋航渡后抵达第一幕米拉托斯 (knot_act1_q1_how_survive)
stepToNextKnot(engine);
assert.strictEqual(engine.state.currentNode.id, 'knot_act1_q1_how_survive', '必须抵达第一幕第一问');
console.log('   ✓ 幕间航渡顺利完成，抵达第一幕米拉托斯：', engine.state.currentNode.title);

// 第一问：在海上怎么活下去 -> 碎石浅滩
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act1_q1_reef_straits');

// 碎石浅滩应对 -> 第二问：为了谁作战
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act1_q2_whom_fight');

// 第二问应对 -> 沙洲幸存者
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act1_q2_sandbar_survivors');

// 沙洲应对 -> 第三问：你能放下剑吗
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act1_q3_put_down_sword');

// 第三问做出放下抉择 -> 雅典娜荒庙试炼
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act1_q3_athena_temple');
assert.strictEqual(engine.state.currentNode.isMajorChallenge, true, '雅典娜神庙试炼必须标记为大事件考验');
assert.strictEqual(engine.state.currentNode.image, null, '大事件插图在考验前严禁剧透');

// 神庙前放下利剑与银杯 -> 解锁止战者成就，弹出史诗收集原画特刊，跨入第二幕
engine.makeChoice(0);
assert(engine.state.newAchievements.find(a => a.id === 'ach_peacemaker'), '放下利剑与银杯必须解锁【止战者】成就');
assert(engine.state.epicMajorEvent, '考验成功后必须弹出史诗大事件收集特刊');
assert.strictEqual(engine.state.currentAct, 2, '必须跨入第二幕');
console.log('   ✓ 第一幕止战试炼圆满完成，已解锁【止战者】成就与史诗原画收集！');

// 跨幕航海：幕间航渡后抵达第二幕提那鲁斯 · 赫尔墨斯六重门 (knot_act2_gate1_drinking)
stepToNextKnot(engine);
assert.strictEqual(engine.state.currentNode.id, 'knot_act2_gate1_drinking', '必须抵达第二幕第一重门');
console.log('   ✓ 抵达第二幕提那鲁斯神之域：', engine.state.currentNode.title);

// 六重门连贯流转：
// 第一重门：饮水之门 -> 【武领克制】严守军纪 -> 第二重门：忘名之门
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act2_gate2_forget_name');

// 第二重门 -> 写下同袍名字 -> 第三重门：折刃之门
engine.makeChoice(1);
assert.strictEqual(engine.state.currentNode.id, 'knot_act2_gate3_broken_blade');

// 第三重门 -> 冒着利刃硬闯走廊 -> 第四重门：心相之镜
engine.makeChoice(1);
assert.strictEqual(engine.state.currentNode.id, 'knot_act2_gate4_mirror');

// 第四重门 -> 因为我答应过把他们带回去 -> 第五重门：投影之渊
engine.makeChoice(1);
assert.strictEqual(engine.state.currentNode.id, 'knot_act2_gate5_shadow');

// 第五重门 -> 我们的影子属于我们自己 -> 第六重门：归途渡口
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act2_gate6_final_ferry');

// 第六重门：向左转舵迎着破晓白光划桨 -> 解锁渡界者成就，跨入第三幕
engine.makeChoice(0);
assert(engine.state.newAchievements.find(a => a.id === 'ach_crossing_realms'), '突破六重迷宫必须解锁【渡界者】成就');
assert.strictEqual(engine.state.currentAct, 3, '必须跨入第三幕');
console.log('   ✓ 第二幕赫尔墨斯六重门突破，已解锁【渡界者】成就！');

// 跨幕航海：幕间航渡后抵达第三幕阿尔戈斯 · 赫拉誓言碑 (knot_act3_oath_stele)
stepToNextKnot(engine);
assert.strictEqual(engine.state.currentNode.id, 'knot_act3_oath_stele', '必须抵达第三幕赫拉誓言碑');
console.log('   ✓ 抵达第三幕阿尔戈斯神之书：', engine.state.currentNode.title);

// 誓言碑立誓 -> 第一问：你是谁的归人
engine.makeChoice(0); // 刻下“归”
assert.strictEqual(engine.state.currentNode.id, 'knot_act3_q1_whose');

// 第一问 -> 第二问：你恐惧什么
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act3_q2_fear');

// 第二问 -> 第三问：你因何而信
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act3_q3_faith');

// 第三问 -> 第四问：凭什么是你活着
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act3_q4_why_you');

// 第四问 -> 第五问：你还记得誓言吗
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act3_q5_remember_oath');

// 第五问 -> 走出神庙，同袍终极检验
engine.makeChoice(0);
assert.strictEqual(engine.state.currentNode.id, 'knot_act3_temple_judgement');

// 忠诚度检验（充足忠诚度） -> 踏上海面月光路直奔第四幕 (nextAct: 4)
engine.state.resources.loyalty = 80;
engine.makeChoice(0);
assert.strictEqual(engine.state.currentAct, 4, '必须跨入终章');
console.log('   ✓ 第三幕阿尔戈斯问心大殿与忠诚检定完成，跨入终章！');

// 终章：菲埃克斯救赎 (knot_epilogue_phaeacians)
assert.strictEqual(engine.state.currentNode.id, 'knot_epilogue_phaeacians');
engine.makeChoice(0); // 道尽漂泊辛酸 -> 抵达故土阿萨卡海滩
assert.strictEqual(engine.state.currentNode.id, 'knot_epilogue_home');

// 故土海滩：走下跳板，面向故乡人群张开双臂 -> 触发终局结算
res = engine.makeChoice(0);
assert(res.success, '终局结算成功');
assert.strictEqual(engine.state.gameEnded, true, '游戏应当已结束');
assert(engine.state.ending, '必须生成最终结局对象');
console.log('   ✓ 成功抵达故土阿萨卡海滩！达成结局：', engine.state.ending.title);
console.log('   最终物资状态 - 存活船员:', engine.state.resources.crew, '忠诚:', engine.state.resources.loyalty, '神恩:', engine.state.resources.luck);

console.log('\n======================================================');
console.log('🎉 全部 plot 文案主线剧情、Inky 拓扑架构与成就系统测试圆满通过！');
console.log('======================================================');
