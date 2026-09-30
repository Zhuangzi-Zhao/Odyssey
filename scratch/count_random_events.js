// scratch/count_random_events.js
const OdysseyEngine = require('../core/engine.js');
const GAME_DATABASE = require('../story/game_database.js');

function runSimulation(landingStrategy = 'random') {
  // landingStrategy: 'never' (从不登陆), 'always' (总是登陆), 'random' (50%概率登陆)
  const engine = new OdysseyEngine();
  engine.reset('warrior');

  let stats = {
    totalDays: 0,
    mainKnots: 0,
    randomSeaEvents: 0,
    randomLandEvents: 0,
    islandDecisions: 0,
    islandStayDecisions: 0,
    eventsList: []
  };

  while (!engine.state.gameEnded && engine.state.day <= 40) {
    // 保证数值不中途夭折，以完整测算全航程
    engine.state.resources.food = Math.max(engine.state.resources.food, 60);
    engine.state.resources.sanity = Math.max(engine.state.resources.sanity, 60);
    engine.state.resources.loyalty = Math.max(engine.state.resources.loyalty, 60);
    engine.state.resources.crew = Math.max(engine.state.resources.crew, 15);

    const node = engine.state.currentNode;
    const day = engine.state.day;

    if (node.isLandingDecision) {
      stats.islandDecisions++;
      let choiceIdx = 1; // 默认绕行
      if (landingStrategy === 'always') choiceIdx = 0;
      else if (landingStrategy === 'never') choiceIdx = 1;
      else if (landingStrategy === 'random') choiceIdx = Math.random() < 0.5 ? 0 : 1;
      engine.makeChoice(choiceIdx);
      continue;
    }

    if (node.isIslandStayDecision) {
      stats.islandStayDecisions++;
      // 50% 多留一天，50% 拔锚起航
      let choiceIdx = Math.random() < 0.5 ? 0 : 1;
      if (landingStrategy === 'never') choiceIdx = 1;
      engine.makeChoice(choiceIdx);
      continue;
    }

    if (node.id.startsWith('knot_')) {
      stats.mainKnots++;
      stats.eventsList.push({ type: 'knot', id: node.id, title: node.title, day });
    } else if (node.env === 'sea') {
      stats.randomSeaEvents++;
      stats.eventsList.push({ type: 'random_sea', id: node.id, title: node.title, day });
    } else if (node.env === 'land') {
      stats.randomLandEvents++;
      stats.eventsList.push({ type: 'random_land', id: node.id, title: node.title, day });
    }

    // 做出随机可用选项
    const avail = node.choices
      .map((c, i) => ({ c, i }))
      .filter(x => engine.isChoiceAvailable(x.c).available);

    if (avail.length === 0) break;
    // 避开隐藏神迹结局以走完整四幕
    const normalAvail = avail.filter(x => !x.c.triggerEnding || x.c.triggerEnding !== 'hidden_safe_haven');
    const pick = normalAvail.length > 0 
      ? normalAvail[Math.floor(Math.random() * normalAvail.length)].i 
      : avail[0].i;

    engine.makeChoice(pick);
  }

  stats.totalDays = engine.state.day;
  return stats;
}

console.log('=== 正在模拟测算各游玩风格下的随机事件遭遇数 ===\n');

// 1. 从不登陆海岛（纯走主线 + 幕间航海）
let runsNever = Array.from({ length: 50 }, () => runSimulation('never'));
let avgNever = {
  days: avg(runsNever.map(r => r.totalDays)),
  knots: avg(runsNever.map(r => r.mainKnots)),
  sea: avg(runsNever.map(r => r.randomSeaEvents)),
  land: avg(runsNever.map(r => r.randomLandEvents)),
  totalRandom: avg(runsNever.map(r => r.randomSeaEvents + r.randomLandEvents))
};

// 2. 正常探索风格（遇到岛屿 50% 概率登陆探索）
let runsNorm = Array.from({ length: 100 }, () => runSimulation('random'));
let avgNorm = {
  days: avg(runsNorm.map(r => r.totalDays)),
  knots: avg(runsNorm.map(r => r.mainKnots)),
  sea: avg(runsNorm.map(r => r.randomSeaEvents)),
  land: avg(runsNorm.map(r => r.randomLandEvents)),
  totalRandom: avg(runsNorm.map(r => r.randomSeaEvents + r.randomLandEvents))
};

// 3. 深度探索风格（遇到岛屿总是登陆探索）
let runsAlways = Array.from({ length: 50 }, () => runSimulation('always'));
let avgAlways = {
  days: avg(runsAlways.map(r => r.totalDays)),
  knots: avg(runsAlways.map(r => r.mainKnots)),
  sea: avg(runsAlways.map(r => r.randomSeaEvents)),
  land: avg(runsAlways.map(r => r.randomLandEvents)),
  totalRandom: avg(runsAlways.map(r => r.randomSeaEvents + r.randomLandEvents))
};

function avg(arr) {
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
}

console.log('风格 A：极速推主线（从不登陆海岛）');
console.log(`  - 总航行天数: 约 ${avgNever.days} 天`);
console.log(`  - 主线核心 Knots: 约 ${avgNever.knots} 个`);
console.log(`  - 海洋随机事件: 约 ${avgNever.sea} 个`);
console.log(`  - 陆地随机事件: 0 个`);
console.log(`  - 总随机事件数: 约 ${avgNever.totalRandom} 个\n`);

console.log('风格 B：适度探索（普通玩家，50% 遇到岛屿靠岸）');
console.log(`  - 总航行天数: 约 ${avgNorm.days} 天`);
console.log(`  - 主线核心 Knots: 约 ${avgNorm.knots} 个`);
console.log(`  - 海洋随机事件: 约 ${avgNorm.sea} 个`);
console.log(`  - 陆地随机事件: 约 ${avgNorm.land} 个`);
console.log(`  - 总随机事件数: 约 ${avgNorm.totalRandom} 个\n`);

console.log('风格 C：深度探索（逢岛必登，搜刮补给）');
console.log(`  - 总航行天数: 约 ${avgAlways.days} 天`);
console.log(`  - 主线核心 Knots: 约 ${avgAlways.knots} 个`);
console.log(`  - 海洋随机事件: 约 ${avgAlways.sea} 个`);
console.log(`  - 陆地随机事件: 约 ${avgAlways.land} 个`);
console.log(`  - 总随机事件数: 约 ${avgAlways.totalRandom} 个\n`);

// 打印一份典型的事件时间线样例
console.log('--- 典型航程流程单局示例 (风格 B) ---');
runsNorm[0].eventsList.forEach((e, idx) => {
  const typeTag = e.type === 'knot' ? '【主线 Knot】' : (e.type === 'random_sea' ? '〔海洋随机〕' : '〔陆地随机〕');
  console.log(`第 ${String(e.day).padStart(2, ' ')} 天 | ${typeTag} ${e.title} (${e.id})`);
});
