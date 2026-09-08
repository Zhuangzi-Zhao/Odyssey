// core/engine.js
const GAME_DATABASE = require('../story/game_database.js');
const ArchiveManager = require('./archive-manager.js');

class OdysseyEngine {
  constructor() {
    this.reset();
  }

  /**
   * 重置/以指定职业初始化游戏
   * @param {string} classId - 'warrior' | 'priest' | 'helmsman' | 'merchant'
   */
  reset(classId = 'warrior') {
    const classConfig = GAME_DATABASE.CLASSES[classId] || GAME_DATABASE.CLASSES['warrior'];
    const initRes = Object.assign({}, classConfig.initialResources);

    this.state = {
      classId: classId,
      classInfo: classConfig,
      day: 1,
      maxDays: 20, // 单局航程规划为 18~22 回合左右到达终局
      resources: {
        food: initRes.food,       // 一阶：食物 (0 - 100)
        sanity: initRes.sanity,   // 一阶：理智精神 (0 - 100)
        luck: initRes.luck,       // 一阶：神恩幸运 (0 - 100)
        crew: initRes.crew,       // 二阶：存活船员 (0 - 30，招募可突破)
        loyalty: initRes.loyalty  // 二阶：船员忠诚 (0 - 100)
      },
      currentEnv: 'land',         // 'sea' | 'land'
      stormStreak: 0,             // 风暴/迷航连续触发次数计数器
      majorEventsCount: 0,        // 主线经典大事件计数（至多 3 次）
      sightsCount: 0,             // 见闻录发现计数（至多 3 次）
      unlockedSights: [],         // 已点亮的见闻
      unlockedAchievements: [],   // 本局已达成的成就
      visitedRandomIds: [],       // 已经历过的随机事件 ID
      visitedMajorIds: [],        // 已经历过的大事件 ID
      history: [],                // 航海日志 (Backlog)
      lastDeltas: null,           // 上一次行动物资变动浮动跳字
      secondOrderAlerts: [],      // 二阶危机警告
      currentNode: null,          // 当前剧情/事件节点
      discoveredSight: null,      // 当回合新触发的见闻录弹窗
      epicMajorEvent: null,       // 当回合触发的史诗大事件特刊
      newAchievements: [],        // 当回合新达成的成就横幅队列
      gameEnded: false,
      ending: null
    };

    // 默认开局为序章
    this.state.currentNode = JSON.parse(JSON.stringify(GAME_DATABASE.PROLOGUE));

    // 全局档案记录开局
    const startAchs = ArchiveManager.recordStart();
    this.state.newAchievements = startAchs;

    return this.state;
  }

  /**
   * 获取当前事件节点
   */
  getCurrentNode() {
    return this.state.currentNode;
  }

  /**
   * 检查某个选项是否可用
   */
  isChoiceAvailable(choice) {
    if (!choice || !choice.condition) return { available: true };
    const cond = choice.condition;
    const res = this.state.resources;

    if (cond.minLuck !== undefined && res.luck < cond.minLuck) {
      return { available: false, reason: `需神恩 ≥ ${cond.minLuck}（当前 ${res.luck}）` };
    }
    if (cond.minFood !== undefined && res.food < cond.minFood) {
      return { available: false, reason: `需食物 ≥ ${cond.minFood}（当前 ${res.food}）` };
    }
    if (cond.minSanity !== undefined && res.sanity < cond.minSanity) {
      return { available: false, reason: `需理智 ≥ ${cond.minSanity}（当前 ${res.sanity}）` };
    }
    if (cond.minLoyalty !== undefined && res.loyalty < cond.minLoyalty) {
      return { available: false, reason: `需忠诚 ≥ ${cond.minLoyalty}（当前 ${res.loyalty}）` };
    }
    return { available: true };
  }

  /**
   * 执行玩家选择并进入下一回合
   * @param {number} choiceIndex 
   */
  makeChoice(choiceIndex) {
    const node = this.state.currentNode;
    if (!node || !node.choices || !node.choices[choiceIndex]) {
      return { success: false, msg: "无效的选项" };
    }

    const choice = node.choices[choiceIndex];
    const check = this.isChoiceAvailable(choice);
    if (!check.available) {
      return { success: false, msg: check.reason };
    }

    // 1. 记录历史文本
    this.state.history.push({
      day: this.state.day,
      chapter: node.chapter || node.title,
      envLabel: node.envLabel || (node.env === 'sea' ? '海上航段' : '陆上探索'),
      speaker: node.speaker || '旁白',
      text: node.text,
      chosenText: choice.text
    });

    // 2. 计算选项基础数值变动（结合职业加权）
    const weights = this.state.classInfo.weights || {};
    const rawDeltas = Object.assign({ food: 0, sanity: 0, luck: 0, crew: 0, loyalty: 0 }, choice.deltas || {});
    const appliedDeltas = { ...rawDeltas };

    // 职业加权修正
    if (appliedDeltas.loyalty < 0 && weights.loyaltyLossRate) {
      appliedDeltas.loyalty = Math.round(appliedDeltas.loyalty * weights.loyaltyLossRate);
    }
    if (appliedDeltas.food > 0 && weights.tradeGainRate && (node.title && node.title.includes('贸易'))) {
      appliedDeltas.food = Math.round(appliedDeltas.food * weights.tradeGainRate);
    }
    if (appliedDeltas.food > 0 && weights.battleGainRate && (node.title && (node.title.includes('海战') || node.title.includes('作战')))) {
      appliedDeltas.food = Math.round(appliedDeltas.food * weights.battleGainRate);
    }
    if (appliedDeltas.sanity < 0 && weights.sanityDamageRate) {
      appliedDeltas.sanity = Math.round(appliedDeltas.sanity * weights.sanityDamageRate);
    }
    if (appliedDeltas.crew < 0 && weights.stormLossRate && node.isStormOrDisoriented) {
      appliedDeltas.crew = Math.max(-1, Math.round(appliedDeltas.crew * weights.stormLossRate));
    }

    const res = this.state.resources;
    res.food += appliedDeltas.food;
    res.sanity += appliedDeltas.sanity;
    res.luck += appliedDeltas.luck;
    res.crew += appliedDeltas.crew;
    res.loyalty += appliedDeltas.loyalty;

    // 3. 回合自然消耗（每回合食物-3，理智-2，受职业加权）
    const foodDecay = Math.round(3 * (weights.foodDecayRate || 1.0));
    const sanityDecay = Math.round(2 * (weights.sanityDecayRate || 1.0));
    res.food -= foodDecay;
    res.sanity -= sanityDecay;
    appliedDeltas.food -= foodDecay;
    appliedDeltas.sanity -= sanityDecay;

    // 4. 二阶危机联动惩罚判定
    const alerts = [];
    // ① 饥荒警戒
    if (res.food <= 0) {
      res.food = 0;
      res.crew -= 1;
      res.loyalty -= 10;
      appliedDeltas.crew -= 1;
      appliedDeltas.loyalty -= 10;
      alerts.push("⚠️ 粮草断绝！饥荒蔓延，一名水手倒地不起，全船忠诚崩落！");
    } else if (res.food < 20) {
      res.loyalty -= 4;
      appliedDeltas.loyalty -= 4;
      alerts.push("⚠️ 粮草告急！饥饿的水手私下怨声载道，忠诚度滑落！");
    }

    // ② 理智恐慌警戒
    if (res.sanity <= 0) {
      res.sanity = 0;
      this.triggerEnding('death_sea');
      return { success: true, ending: this.state.ending, state: this.state };
    } else if (res.sanity < 25) {
      res.loyalty -= 4;
      appliedDeltas.loyalty -= 4;
      alerts.push("⚠️ 恐惧蔓延！船长神志受创，疑惧在水手心中暗生！");
    }

    // ③ 神恩天谴警戒
    if (res.luck < 15) {
      res.loyalty -= 3;
      appliedDeltas.loyalty -= 3;
      alerts.push("⚡ 恶兆频现！水手们深信这艘船已遭海神弃绝！");
    }

    // 边界约束
    res.food = Math.max(0, Math.min(100, res.food));
    res.sanity = Math.max(0, Math.min(100, res.sanity));
    res.luck = Math.max(0, Math.min(100, res.luck));
    res.crew = Math.max(0, Math.min(35, res.crew));
    res.loyalty = Math.max(0, Math.min(100, res.loyalty));

    this.state.lastDeltas = appliedDeltas;
    this.state.secondOrderAlerts = alerts;

    // 检定回合决策与状态成就
    this.state.newAchievements = ArchiveManager.checkTurnUnlocks(this.state, node, choice);

    // 5. 死亡与失败即时判定
    if (res.crew <= 0) {
      this.triggerEnding('death_sea');
      return { success: true, ending: this.state.ending, state: this.state, newAchievements: this.state.newAchievements };
    }
    if (res.loyalty <= 0) {
      this.triggerEnding('death_land');
      return { success: true, ending: this.state.ending, state: this.state, newAchievements: this.state.newAchievements };
    }

    // 6. 推进天数，进入下一个事件
    this.state.day += 1;

    // 检查是否达到终局（第 20 天到达故土）
    if (this.state.day >= this.state.maxDays) {
      this.calculateFinalEnding();
      return { success: true, ending: this.state.ending, state: this.state, newAchievements: this.state.newAchievements };
    }

    // 7. 生成下一个事件（海陆交替 + 风暴连击 + 大事件检定 + 见闻）
    this.advanceToNextEvent(node);

    return { success: true, state: this.state, newAchievements: this.state.newAchievements };
  }

  /**
   * 概率生成下一个事件
   */
  advanceToNextEvent(previousNode) {
    this.state.discoveredSight = null;
    this.state.epicMajorEvent = null;

    const day = this.state.day;
    const luck = this.state.resources.luck;
    const weights = this.state.classInfo.weights || {};

    // 1. 见闻录触发判定（单局最多 3 次，约 18% 概率在宁静时刻偶遇）
    if (this.state.sightsCount < 3 && Math.random() < 0.22) {
      const unusedSights = GAME_DATABASE.SIGHTS.filter(s => !this.state.unlockedSights.includes(s.id));
      if (unusedSights.length > 0) {
        const sight = unusedSights[Math.floor(Math.random() * unusedSights.length)];
        this.state.unlockedSights.push(sight.id);
        this.state.sightsCount += 1;
        this.state.discoveredSight = sight;

        // 全局图鉴与成就记录
        const sAchs = ArchiveManager.recordSight(sight.id);
        this.state.newAchievements = (this.state.newAchievements || []).concat(sAchs);
      }
    }

    // 2. 经典主线大事件触发检定（至多 3 次，分布在航程第 5~8、11~14、16~18 天窗口）
    let triggerMajor = false;
    if (this.state.majorEventsCount < 3) {
      if ((day >= 5 && day <= 7 && this.state.majorEventsCount === 0) ||
          (day >= 11 && day <= 13 && this.state.majorEventsCount === 1) ||
          (day >= 16 && day <= 18 && this.state.majorEventsCount === 2)) {
        triggerMajor = true;
      }
    }

    if (triggerMajor) {
      // 筛选适合神恩大事件
      const unusedMajor = GAME_DATABASE.MAJOR_EVENTS.filter(m => !this.state.visitedMajorIds.includes(m.id));
      if (unusedMajor.length > 0) {
        let pickedMajor = null;
        if (luck < 40) {
          // 恶兆偏向：斯库拉、太阳神牛、食人巨人、独眼巨人
          pickedMajor = unusedMajor.find(m => m.title.includes('太阳神') || m.title.includes('斯库拉') || m.title.includes('独眼') || m.title.includes('食人'));
        } else if (luck > 60) {
          // 祥瑞偏向：斯克里亚、风神、喀耳刻、卡吕普索
          pickedMajor = unusedMajor.find(m => m.title.includes('斯克里亚') || m.title.includes('风神') || m.title.includes('喀耳刻') || m.title.includes('塞壬'));
        }
        if (!pickedMajor) {
          pickedMajor = unusedMajor[Math.floor(Math.random() * unusedMajor.length)];
        }

        this.state.visitedMajorIds.push(pickedMajor.id);
        this.state.majorEventsCount += 1;
        this.state.currentEnv = pickedMajor.env || 'sea';
        this.state.currentNode = JSON.parse(JSON.stringify(pickedMajor));
        this.state.epicMajorEvent = pickedMajor;

        // 全局图鉴与大事件成就记录
        const mAchs = ArchiveManager.recordMajorEvent(pickedMajor.id);
        this.state.newAchievements = (this.state.newAchievements || []).concat(mAchs);
        return;
      }
    }

    // 3. 正常海陆交替流转（带风暴迷航连发机制）
    let nextEnv = 'sea';
    if (previousNode && previousNode.env === 'sea' && previousNode.isStormOrDisoriented) {
      // 若上一轮遭遇风暴/迷航，有 60% 概率连续进入下一次海上险境（舵手职业下降为 36%）
      const chainChance = 0.6 * (weights.stormChainChanceRate || 1.0);
      if (this.state.stormStreak < 2 && Math.random() < chainChance) {
        nextEnv = 'sea';
        this.state.stormStreak += 1;
      } else {
        nextEnv = 'land';
        this.state.stormStreak = 0;
      }
    } else {
      // 严格海陆交替
      nextEnv = (this.state.currentEnv === 'sea') ? 'land' : 'sea';
      this.state.stormStreak = 0;
    }

    this.state.currentEnv = nextEnv;

    // 从 52 个随机事件库中筛选匹配环境且未重复的事件
    let candidateEvents = GAME_DATABASE.RANDOM_EVENTS.filter(e => e.env === nextEnv && !this.state.visitedRandomIds.includes(e.id));
    if (candidateEvents.length === 0) {
      // 全部经历过则重置池
      candidateEvents = GAME_DATABASE.RANDOM_EVENTS.filter(e => e.env === nextEnv);
    }

    const pickedEvent = candidateEvents[Math.floor(Math.random() * candidateEvents.length)];
    this.state.visitedRandomIds.push(pickedEvent.id);
    this.state.currentNode = JSON.parse(JSON.stringify(pickedEvent));
  }

  /**
   * 执行神明祭祀（动态概率检定与神恩加权系统）
   * @param {number} sacrificeIndex 
   */
  performSacrifice(sacrificeIndex) {
    const sacList = GAME_DATABASE.SACRIFICES;
    const sac = sacList[sacrificeIndex] || sacList[0];
    const res = this.state.resources;
    const weights = this.state.classInfo.weights || {};

    // 1. 检查食物祭品成本（消耗 5 点食物）
    const cost = sac.cost ? (sac.cost.food || 5) : 5;
    if (res.food < cost) {
      return { success: false, msg: `祭品不足！需要食物储备 ≥ ${cost}` };
    }
    res.food -= cost;

    // 2. 计算成功概率
    // P = 基础(50%) + (神恩 - 50) * 0.5% + 职业加成
    const luckDelta = (res.luck - 50) * 0.5;
    const classBonus = weights.sacrificeBonus || 0;
    const baseRate = sac.baseRate || 50;
    const successRate = Math.min(95, Math.max(15, Math.round(baseRate + luckDelta + classBonus)));

    // 3. 掷骰检定 (1 ~ 100)
    const roll = Math.floor(Math.random() * 100) + 1;
    let outcomeType = 'failure';
    let outcomeText = '';
    const appliedDeltas = { food: -cost, sanity: 0, luck: 0, crew: 0, loyalty: 0 };

    if (roll <= successRate) {
      // 成功分支：判断是否为蒙允大吉 (高于成功线 25+ 或 roll <= 18)
      if (roll <= 18 || roll <= Math.max(10, successRate - 25)) {
        outcomeType = 'great_success';
        outcomeText = `【🌟 蒙允大吉 · 神迹降临】\n公牛的热血倾入海中，青烟笔直贯入云霄！${sac.god}降下神圣徽光，波涛与风暴骤息！`;
        const reward = sac.greatReward || { luck: 15, loyalty: 10, sanity: 10 };
        for (let k in reward) {
          appliedDeltas[k] = (appliedDeltas[k] || 0) + reward[k];
        }
      } else {
        outcomeType = 'success';
        outcomeText = `【🕊️ 凡祭受纳 · 诸神垂青】\n祭香在海风中回荡，铅灰色的云海裂开金色晨曦，${sac.god}默许了你的祷求。`;
        const reward = sac.standardReward || { luck: 10, loyalty: 5 };
        for (let k in reward) {
          appliedDeltas[k] = (appliedDeltas[k] || 0) + reward[k];
        }
      }
    } else {
      // 失败分支：弃受 / 降罚
      outcomeType = 'failure';
      outcomeText = `【⚡ 漠然弃受 · 逆风逆浪】\n狂暴的阴风将黑烟狠狠吹散回甲板，祭火惨淡熄灭。${sac.god}对祭品无动于衷，水手们面面相觑，疑惧暗生。`;
      appliedDeltas.sanity -= 5;
      appliedDeltas.luck -= 2;
    }

    // 4. 结算数值
    res.sanity += appliedDeltas.sanity;
    res.luck += appliedDeltas.luck;
    res.loyalty += appliedDeltas.loyalty;

    res.sanity = Math.max(0, Math.min(100, res.sanity));
    res.luck = Math.max(0, Math.min(100, res.luck));
    res.loyalty = Math.max(0, Math.min(100, res.loyalty));

    this.state.lastDeltas = appliedDeltas;

    // 全局祭祀记录与成就检定
    const sacAchs = ArchiveManager.recordSacrifice(sac.god);
    const turnAchs = ArchiveManager.checkTurnUnlocks(this.state, null, null);
    this.state.newAchievements = (this.state.newAchievements || []).concat(sacAchs, turnAchs);

    return {
      success: true,
      outcomeType: outcomeType,
      outcomeText: outcomeText,
      successRate: successRate,
      roll: roll,
      appliedDeltas: appliedDeltas,
      state: this.state,
      newAchievements: this.state.newAchievements
    };
  }

  /**
   * 航程结束后的综合结局评定
   */
  calculateFinalEnding() {
    const { crew, loyalty, sanity, food } = this.state.resources;
    let endingKey = 'return';

    if (crew >= 22 && loyalty >= 65 && sanity >= 50) {
      endingKey = 'triumphant'; // 凯旋 · 众多船员
    } else if (crew >= 8 && loyalty >= 30) {
      endingKey = 'return';     // 回家 · 中等船员
    } else {
      endingKey = 'survivor';   // 上岸 · 极少数船员
    }

    this.triggerEnding(endingKey);
  }

  /**
   * 触发终局
   */
  triggerEnding(endingKey) {
    this.state.gameEnded = true;
    this.state.ending = GAME_DATABASE.ENDINGS[endingKey] || GAME_DATABASE.ENDINGS['return'];

    // 全局终局记录与终局成就解锁
    const endAchs = ArchiveManager.recordEnding(endingKey, this.state);
    this.state.newAchievements = (this.state.newAchievements || []).concat(endAchs);
  }

  exportState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  importState(savedState) {
    this.state = JSON.parse(JSON.stringify(savedState));
    return this.state;
  }
}

module.exports = OdysseyEngine;
