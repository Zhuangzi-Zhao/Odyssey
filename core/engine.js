// core/engine.js
(function(root) {
let GAME_DATABASE = (typeof require !== 'undefined') ? require('../story/game_database.js') : (typeof root !== 'undefined' ? root.GAME_DATABASE : null);
let ArchiveManager = (typeof require !== 'undefined') ? require('./archive-manager.js') : (typeof root !== 'undefined' ? root.ArchiveManager : null);

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

    const act0 = GAME_DATABASE.STORY_ACTS["0"];
    const classKnotId = `knot_prologue_${classId}_troy`;
    const initKnotId = GAME_DATABASE.KNOTS[classKnotId] ? classKnotId : act0.initialKnot;
    const initKnot = GAME_DATABASE.KNOTS[initKnotId];

    this.state = {
      classId: classId,
      classInfo: classConfig,
      day: 1,
      maxDays: 35, // 四幕史诗航程规划（约22~28回合完成全部史诗）
      resources: {
        food: initRes.food,       // 一阶：食物 (0 - 100)
        sanity: initRes.sanity,   // 一阶：理智精神 (0 - 100)
        luck: initRes.luck,       // 一阶：神恩幸运 (0 - 100)
        crew: initRes.crew,       // 二阶：存活船员 (0 - 30，招募可突破)
        loyalty: initRes.loyalty  // 二阶：船员忠诚 (0 - 100)
      },
      currentEnv: initKnot.env || 'land', // 'sea' | 'land'
      currentIsland: null,        // 当前遭遇/驻留的岛屿信息 { type, typeName, name, icon, desc }
      landStayTurns: 0,           // 在当前岛屿停留的回合数（0~2）
      stormStreak: 0,             // 风暴/迷航连续触发次数计数器
      majorEventsCount: 0,        // 主线经典大事件计数
      sightsCount: 0,             // 见闻录发现计数（至多 3 次）
      unlockedSights: [],         // 已点亮的见闻
      unlockedAchievements: [],   // 本局已达成的成就
      visitedRandomIds: [],       // 已经历过的随机事件 ID
      visitedMajorIds: [],        // 已经历过的大事件 ID
      history: [],                // 航海日志 (Backlog)
      lastDeltas: null,           // 上一次行动物资变动浮动跳字
      secondOrderAlerts: [],      // 二阶危机警告
      currentNode: JSON.parse(JSON.stringify(initKnot)), // 当前剧情/事件节点
      discoveredSight: null,      // 当回合新触发的见闻录弹窗
      epicMajorEvent: null,       // 当回合触发的史诗大事件特刊
      lastPopupDay: -99,          // 上一次弹出弹窗的天数（用于强制弹窗冷却防连续弹出）
      newAchievements: [],        // 当回合新达成的成就横幅队列
      gameEnded: false,
      ending: null,

      // Inky 四幕架构核心字段
      currentAct: 0,
      actKnotId: initKnotId,
      actStage: initKnot.stage || 0,
      actTitle: act0.title,
      actTheme: act0.theme,
      currentObjective: initKnot.objective || act0.objective,
      storyMemory: {},            // 记录剧情抉择记忆标志（如 avoided_false_lights 等）
      pendingNextKnot: null       // 幕间航海交替时挂起的下一主线 Knot
    };

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
    if (cond.minCrew !== undefined && res.crew < cond.minCrew) {
      return { available: false, reason: `需船员 ≥ ${cond.minCrew}（当前 ${res.crew}）` };
    }
    if (cond.requiredClass && this.state.classId !== cond.requiredClass) {
      const clsDef = GAME_DATABASE && GAME_DATABASE.CLASSES && GAME_DATABASE.CLASSES[cond.requiredClass];
      const clsName = clsDef ? clsDef.name : cond.requiredClass;
      return { available: false, reason: `需【${clsName}】专属` };
    }
    if (cond.requireMemory) {
      const mem = this.state.storyMemory || {};
      if (!mem[cond.requireMemory]) {
        return { available: false, reason: cond.hint || `未达成前置机缘（需识破险角假火等）` };
      }
    }
    return { available: true };
  }

  /**
   * 设置并激活指定的 Inky 主线 Knot 节点
   */
  setKnotNode(knotId) {
    const knot = GAME_DATABASE.KNOTS[knotId];
    if (!knot) {
      console.warn(`Knot not found: ${knotId}`);
      this.state.currentNode = this.pickSeaEvent();
      return;
    }
    this.state.actKnotId = knotId;
    this.state.actStage = knot.stage || 0;
    this.state.currentEnv = knot.env || 'sea';
    if (knot.objective) {
      this.state.currentObjective = knot.objective;
    }

    const knotCopy = JSON.parse(JSON.stringify(knot));
    const majorId = knot.majorId || (knot.id.startsWith('major_') ? knot.id : null);

    // 大事件危机考验进行中：图片暂不展现，弹窗暂不跳出（作为收集要素待成功通过考验后再跳出）
    if (majorId) {
      knotCopy.collectedImage = knotCopy.image; // 保存史诗原画，待通过考验后展示
      knotCopy.image = null; // 考验前不预先展现
      knotCopy.isMajorChallenge = true;
      knotCopy.majorId = majorId;
    }

    this.state.currentNode = knotCopy;
  }

  /**
   * 幕次切换推进
   */
  advanceAct(actNum) {
    const actKey = String(actNum);
    const act = GAME_DATABASE.STORY_ACTS[actKey];
    if (!act) {
      this.calculateFinalEnding();
      return;
    }
    this.state.currentAct = actNum;
    this.state.actTitle = act.title;
    this.state.actTheme = act.theme;
    this.state.currentObjective = act.objective;

    if (actNum === 1 || actNum === 2 || actNum === 3) {
      // 跨幕远洋航渡：经历幕间海洋航程后再切入下一幕初始大事件，确保叙事呼吸感与冷却间隔
      this.state.pendingNextKnot = act.initialKnot;
      this.state.currentEnv = 'sea';
      this.state.currentIsland = null;
      this.state.landStayTurns = 0;
      this.state.currentNode = this.pickSeaEvent();
    } else {
      this.setKnotNode(act.initialKnot);
    }
  }

  /**
   * 生成岛屿基本信息（分为无人岛屿、人类岛屿、怪物/神异岛屿三种）
   */
  generateIslandInfo() {
    const roll = Math.random();
    let type = 'uninhabited';
    if (roll < 0.38) {
      type = 'uninhabited';
    } else if (roll < 0.76) {
      type = 'human';
    } else {
      type = 'monster';
    }

    const islandData = {
      uninhabited: {
        type: 'uninhabited',
        typeName: '无人荒岛',
        icon: '🏝️',
        titles: ['苍翠未知荒岛', '断崖孤岛', '海图未载之岛', '寂静石楠岛'],
        descs: [
          '海风吹散晨雾，一座未在海图上标注的孤岛在前方左舷浮现。岛上古木参天，断崖瀑布自峭壁垂落白练，不见炊烟与人迹，唯有大群海鸟在灌木间盘旋啼鸣。老水手远眺良久：“船长，前面是座无人荒岛。那里或许有甘甜的泉眼与可供捕猎的野兽，但也难料密林深处是否暗藏险坑。”',
          '战船切开平静的浪花，前方隐现一座狭长孤岛。岛岸布满白沙与灰岩，海鸟在礁石上栖息。瞭望手呼喊：“前方荒岛未见任何城邦与人烟！若靠岸探索，或许能找到淡水、枯木与先民遗迹，补充给养。”'
        ],
        landChoiceText: '下令靠岸，登上荒岛探索',
        landChoiceHint: '驶入避风湾抛锚，搜寻淡水与补给',
        bypassChoiceText: '不予靠岸，全速绕行',
        bypassChoiceHint: '避开未知浅礁，留在开阔海面继续航行'
      },
      human: {
        type: 'human',
        typeName: '有人城邦岛屿',
        icon: '🏛️',
        titles: ['繁茂海岬岛屿', '炊烟袅袅的集市岛', '外邦城邦港湾', '石砌城塞之岛'],
        descs: [
          '顺风航行至正午，前方海湾出现了一座坐落于绿山之间的城邦岛屿。石砌码头隐约可见，港内系着外邦木船，山坡上白墙红瓦错落，海风送来烘烤大麦面包与干鱼的咸香。瞭望手兴奋呼喊：“有城邦！岸边有人类聚落活动的踪迹，定能休整与贸易，但也需防备外邦战力或冲突。”',
          '海面波光粼粼，前方岛屿岬角处升起一道道安宁的炊烟。依山而建的渔村清晰可辨，岛民们似乎正在浅滩织网。老水手手扶船舷：“船长，这是座有人居住的岛屿。若靠岸入港，可与当地人以物易物，亦可能卷入争端。”'
        ],
        landChoiceText: '靠港停泊，入岛接触贸易',
        landChoiceHint: '战船进港，与岛民接触探索',
        bypassChoiceText: '不入港口，沿外海驶过',
        bypassChoiceHint: '保持高度戒备，克制入城欲望继续远航'
      },
      monster: {
        type: 'monster',
        typeName: '异象神异之岛',
        icon: '👁️',
        titles: ['迷雾怪石之岛', '紫雾祭坛隐秘岛', '低语轰鸣之岛', '古老神祇秘境'],
        descs: [
          '天空毫无征兆地沉暗下来，海流将战船推向一座笼罩在灰紫色浓雾中的怪岛。奇形怪状的悬崖犬牙交错，海浪拍击崖洞发出沉闷如巨兽低吼的回响，隐约能瞥见山巅残破的神坛与微弱荧光。全船水手不寒而栗：“船长……这岛透着怪异，或是神明祭坛，或是巨兽巢穴。若踏上去，生死难料。”',
          '灰黑色的礁石从狂躁的白沫中拔地而起，前方海岛周围弥漫着浓厚的异味。雾霭深处不时传来摄人心魄的怪异声响与祭坛的祈颂声。老水手按紧了腰间的佩剑：“诸神在上……这座岛绝非凡人居所。若登陆探秘，必将直面未知的命运考验。”'
        ],
        landChoiceText: '拔剑戒备，强行登岛探秘',
        landChoiceHint: '直面未知神异与险恶考验',
        bypassChoiceText: '敬畏远避，全速驶离险地',
        bypassChoiceHint: '严防妖魔与神怒灾殃，即刻回归主航道'
      }
    };

    const info = islandData[type];
    const title = info.titles[Math.floor(Math.random() * info.titles.length)];
    const desc = info.descs[Math.floor(Math.random() * info.descs.length)];

    return {
      type: type,
      typeName: info.typeName,
      name: title,
      icon: info.icon,
      desc: desc,
      landChoiceText: info.landChoiceText,
      landChoiceHint: info.landChoiceHint,
      bypassChoiceText: info.bypassChoiceText,
      bypassChoiceHint: info.bypassChoiceHint
    };
  }

  /**
   * 生成远眺海岛·是否登陆决策节点（不消耗回合数）
   */
  generateIslandApproachNode() {
    const island = this.generateIslandInfo();
    this.state.currentIsland = island;

    return {
      id: `island_approach_${island.type}_${Date.now()}`,
      chapter: `海域航行 · 远眺海岛`,
      title: island.name,
      env: 'sea',
      icon: island.icon,
      speaker: '瞭望手',
      isLandingDecision: true,
      pendingIslandType: island.type,
      text: island.desc,
      choices: [
        {
          text: island.landChoiceText,
          hint: island.landChoiceHint,
          action: 'land',
          deltas: {},
          condition: null
        },
        {
          text: island.bypassChoiceText,
          hint: island.bypassChoiceHint,
          action: 'bypass',
          deltas: {},
          condition: null
        }
      ]
    };
  }

  /**
   * 生成岛屿驻留或拔锚抉择节点（至多停留2回合，不消耗回合数）
   */
  generateIslandStayNode() {
    const island = this.state.currentIsland || { typeName: '海岛', name: '海岛' };

    return {
      id: `island_stay_${Date.now()}`,
      chapter: `岛屿探索 · 驻留抉择`,
      title: `暮色将至 · 驻留抉择`,
      env: 'land',
      icon: '⛺',
      speaker: '副手',
      isIslandStayDecision: true,
      text: `在${island.name || island.typeName}上的第一日探索已随暮色落幕。营火的火星随晚风升入夜空，水手们正在清点一天的收获与战损。副手快步走上前来请示：“船长，按航海戒律，我们在同一座岛上至多可驻留两日。是要在此岛再探寻一日，还是趁着晨曦顺风拔锚起航，重返归乡的大海？”`,
      choices: [
        {
          text: '在此岛多留一日，深入探索',
          hint: '在岛上度过第二回合（本岛最后驻留日）',
          action: 'stay',
          deltas: {},
          condition: null
        },
        {
          text: '整备物资，拔锚起航回海',
          hint: '结束陆地探索，战船驶回大海',
          action: 'depart',
          deltas: {},
          condition: null
        }
      ]
    };
  }

  /**
   * 检查并尝试触发航海见闻录（宁静时刻偶遇，单局上限3次，与大事件绝对互斥，不连续弹出）
   * @returns {boolean} 是否触发了见闻录
   */
  tryTriggerSight() {
    if (this.state.sightsCount >= 3) return false;
    if (this.state.epicMajorEvent) return false;

    // 弹窗防连续出现冷却：与上一次弹窗（大事件或见闻录）至少间隔 2 个回合
    const minInterval = 2;
    if (this.state.day - (this.state.lastPopupDay || -99) < minInterval) {
      return false;
    }

    // 宁静时刻偶遇概率（约 35% 概率偶遇）
    if (Math.random() < 0.35) {
      const unusedSights = GAME_DATABASE.SIGHTS.filter(s => !this.state.unlockedSights.includes(s.id));
      if (unusedSights.length > 0) {
        const sight = unusedSights[Math.floor(Math.random() * unusedSights.length)];
        this.state.unlockedSights.push(sight.id);
        this.state.sightsCount += 1;
        this.state.discoveredSight = sight;
        this.state.lastPopupDay = this.state.day;

        const sAchs = ArchiveManager.recordSight(sight.id);
        this.state.newAchievements = (this.state.newAchievements || []).concat(sAchs);
        return true;
      }
    }
    return false;
  }

  /**
   * 根据岛屿类型抽取匹配当幕主题的陆地事件
   */
  pickLandEventForIsland(islandType) {
    let candidates = GAME_DATABASE.RANDOM_EVENTS.filter(e => 
      e.env === 'land' && 
      e.landType === islandType && 
      (!e.actFilter || e.actFilter.includes(this.state.currentAct)) &&
      !this.state.visitedRandomIds.includes(e.id)
    );

    if (candidates.length === 0) {
      candidates = GAME_DATABASE.RANDOM_EVENTS.filter(e => 
        e.env === 'land' && 
        e.landType === islandType &&
        (!e.actFilter || e.actFilter.includes(this.state.currentAct))
      );
    }
    if (candidates.length === 0) {
      candidates = GAME_DATABASE.RANDOM_EVENTS.filter(e => 
        e.env === 'land' && (!e.actFilter || e.actFilter.includes(this.state.currentAct))
      );
    }
    if (candidates.length === 0) {
      candidates = GAME_DATABASE.RANDOM_EVENTS.filter(e => e.env === 'land');
    }

    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    this.state.visitedRandomIds.push(picked.id);

    this.tryTriggerSight();

    return JSON.parse(JSON.stringify(picked));
  }

  /**
   * 抽取契合当幕主题的海洋事件
   */
  pickSeaEvent() {
    let candidates = GAME_DATABASE.RANDOM_EVENTS.filter(e => 
      e.env === 'sea' && 
      (!e.actFilter || e.actFilter.includes(this.state.currentAct)) &&
      !this.state.visitedRandomIds.includes(e.id)
    );
    if (candidates.length === 0) {
      candidates = GAME_DATABASE.RANDOM_EVENTS.filter(e => 
        e.env === 'sea' && (!e.actFilter || e.actFilter.includes(this.state.currentAct))
      );
    }
    if (candidates.length === 0) {
      candidates = GAME_DATABASE.RANDOM_EVENTS.filter(e => e.env === 'sea');
    }

    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    this.state.visitedRandomIds.push(picked.id);

    if (!picked.isStormOrDisoriented) {
      this.tryTriggerSight();
    }

    return JSON.parse(JSON.stringify(picked));
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

    // 消费并清除当前节点的单次弹窗标记，防止次级/结果节点重复弹出
    this.state.epicMajorEvent = null;
    this.state.discoveredSight = null;

    // 0. 特殊即死/结局触发
    if (choice.triggerEnding) {
      this.triggerEnding(choice.triggerEnding);
      return { success: true, ending: this.state.ending, state: this.state, newAchievements: this.state.newAchievements };
    }
    if (choice.triggerFinalEnding) {
      this.calculateFinalEnding();
      return { success: true, ending: this.state.ending, state: this.state, newAchievements: this.state.newAchievements };
    }

    // 0.1 记忆标志留存（Inky Memory 机制）
    if (choice.setMemory) {
      if (typeof choice.setMemory === 'object') {
        Object.assign(this.state.storyMemory, choice.setMemory);
      } else if (typeof choice.setMemory === 'string') {
        this.state.storyMemory[choice.setMemory] = true;
      }
    }

    // 0.2 是否登陆岛屿决策（不计入总回合数，不推进天数与消耗）
    if (node.isLandingDecision) {
      this.state.history.push({
        day: this.state.day,
        chapter: node.chapter || node.title,
        envLabel: '海域远眺',
        speaker: node.speaker || '瞭望手',
        text: node.text,
        chosenText: choice.text
      });

      if (choice.action === 'bypass') {
        // 不登陆：直接进入海洋剧情（若有待衔接的主线 Knot，则直接切入 Knot）
        this.state.currentEnv = 'sea';
        this.state.landStayTurns = 0;
        this.state.currentIsland = null;
        if (this.state.pendingNextKnot) {
          const k = this.state.pendingNextKnot;
          this.state.pendingNextKnot = null;
          this.setKnotNode(k);
          return { success: true, state: this.state, newAchievements: this.state.newAchievements };
        }
        this.state.currentNode = this.pickSeaEvent();
        return { success: true, state: this.state, newAchievements: this.state.newAchievements };
      } else {
        // 登陆：进入陆地剧情（根据岛屿类型安排事件）
        this.state.currentEnv = 'land';
        this.state.landStayTurns = 0;
        this.state.currentNode = this.pickLandEventForIsland(node.pendingIslandType);
        return { success: true, state: this.state, newAchievements: this.state.newAchievements };
      }
    }

    // 0.3 岛屿驻留或起航抉择（至多停留两回合，不计入总回合数，不推进天数与消耗）
    if (node.isIslandStayDecision) {
      this.state.history.push({
        day: this.state.day,
        chapter: node.chapter || node.title,
        envLabel: '岛屿驻留',
        speaker: node.speaker || '副手',
        text: node.text,
        chosenText: choice.text
      });

      if (choice.action === 'depart') {
        // 拔锚起航：重返大海
        this.state.currentEnv = 'sea';
        this.state.landStayTurns = 0;
        this.state.currentIsland = null;
        if (this.state.pendingNextKnot) {
          const k = this.state.pendingNextKnot;
          this.state.pendingNextKnot = null;
          this.setKnotNode(k);
          return { success: true, state: this.state, newAchievements: this.state.newAchievements };
        }
        this.state.currentNode = this.pickSeaEvent();
        return { success: true, state: this.state, newAchievements: this.state.newAchievements };
      } else {
        // 多留一日：在当前岛屿度过第二回合（根据当前岛屿类型再抽取一幕陆上事件）
        this.state.currentEnv = 'land';
        const islandType = this.state.currentIsland ? this.state.currentIsland.type : 'human';
        this.state.currentNode = this.pickLandEventForIsland(islandType);
        return { success: true, state: this.state, newAchievements: this.state.newAchievements };
      }
    }

    // 0.4 剧情正文展现节点（isResolution）的继续推进
    if (node.isResolution) {
      this.state.day += 1;
      if (this.state.day >= this.state.maxDays) {
        this.calculateFinalEnding();
        return { success: true, ending: this.state.ending, state: this.state, newAchievements: this.state.newAchievements };
      }

      if (node.nextAct !== undefined) {
        this.advanceAct(node.nextAct);
        return { success: true, state: this.state, newAchievements: this.state.newAchievements };
      } else if (node.nextKnot) {
        this.setKnotNode(node.nextKnot);
        return { success: true, state: this.state, newAchievements: this.state.newAchievements };
      }

      this.advanceToNextEvent(node);
      return { success: true, state: this.state, newAchievements: this.state.newAchievements };
    }

    // 0.5 微型事件链第一阶段抉择（触发第二阶段事件与命运概率判定）
    if (choice.chain) {
      this.state.history.push({
        day: this.state.day,
        chapter: node.chapter || node.title,
        envLabel: node.envLabel || (node.env === 'sea' ? '海上航段' : '陆上探索'),
        speaker: node.speaker || '旁白',
        text: node.text,
        chosenText: choice.text
      });

      const outcomes = choice.chain.outcomes || [];
      const chainType = choice.chain.type;
      const weights = this.state.classInfo.weights || {};
      const res = this.state.resources;
      const currentClass = this.state.classId;

      const luckMod = (res.luck - 50) * 0.4;
      const dynamicWeights = outcomes.map((o, idx) => {
        let w = o.baseWeight || 50;
        if (idx === 0) {
          w += luckMod;
          if (chainType === 'battle' && currentClass === 'warrior') w += 20;
          if (chainType === 'divine' && currentClass === 'priest') w += 25;
          if (chainType === 'sea' && currentClass === 'helmsman') w += 20;
        }
        return Math.max(10, w);
      });

      const totalWeight = dynamicWeights.reduce((a, b) => a + b, 0);
      let roll = Math.random() * totalWeight;
      let winningIndex = 0;
      for (let i = 0; i < dynamicWeights.length; i++) {
        if (roll < dynamicWeights[i]) {
          winningIndex = i;
          break;
        }
        roll -= dynamicWeights[i];
      }

      const outcome = outcomes[winningIndex] || outcomes[0];
      const rawDeltas = Object.assign({ food: 0, sanity: 0, luck: 0, crew: 0, loyalty: 0 }, outcome.deltas || {});
      const appliedDeltas = { ...rawDeltas };

      if (appliedDeltas.loyalty < 0 && weights.loyaltyLossRate) {
        appliedDeltas.loyalty = Math.round(appliedDeltas.loyalty * weights.loyaltyLossRate);
      }
      if (appliedDeltas.food > 0 && weights.battleGainRate && (node.title && (node.title.includes('海战') || node.title.includes('作战')))) {
        appliedDeltas.food = Math.round(appliedDeltas.food * weights.battleGainRate);
      }
      if (appliedDeltas.crew < 0 && weights.stormLossRate && node.isStormOrDisoriented) {
        appliedDeltas.crew = Math.max(-1, Math.round(appliedDeltas.crew * weights.stormLossRate));
      }

      // 自然消耗
      const foodDecay = Math.round(3 * (weights.foodDecayRate || 1.0));
      const sanityDecay = Math.round(2 * (weights.sanityDecayRate || 1.0));
      appliedDeltas.food -= foodDecay;
      appliedDeltas.sanity -= sanityDecay;

      res.food += appliedDeltas.food;
      res.sanity += appliedDeltas.sanity;
      res.luck += appliedDeltas.luck;
      res.crew += appliedDeltas.crew;
      res.loyalty += appliedDeltas.loyalty;

      res.food = Math.max(0, Math.min(100, res.food));
      res.sanity = Math.max(0, Math.min(100, res.sanity));
      res.luck = Math.max(0, Math.min(100, res.luck));
      res.loyalty = Math.max(0, Math.min(100, res.loyalty));

      this.state.lastDeltas = appliedDeltas;

      const diceAchs = ArchiveManager.recordDiceRoll ? ArchiveManager.recordDiceRoll() : [];
      const turnAchs = ArchiveManager.checkTurnUnlocks(this.state, node, choice);
      this.state.newAchievements = (this.state.newAchievements || []).concat(diceAchs).concat(turnAchs);

      if (res.crew <= 0) {
        this.triggerEnding('death_sea');
        return { success: true, ending: this.state.ending, state: this.state, newAchievements: this.state.newAchievements };
      }
      if (res.loyalty <= 0) {
        this.triggerEnding('death_land');
        return { success: true, ending: this.state.ending, state: this.state, newAchievements: this.state.newAchievements };
      }

      const deltaTokens = [];
      if (appliedDeltas.food) deltaTokens.push(`食物 ${appliedDeltas.food > 0 ? '+' : ''}${appliedDeltas.food}`);
      if (appliedDeltas.sanity) deltaTokens.push(`理智 ${appliedDeltas.sanity > 0 ? '+' : ''}${appliedDeltas.sanity}`);
      if (appliedDeltas.luck) deltaTokens.push(`神恩 ${appliedDeltas.luck > 0 ? '+' : ''}${appliedDeltas.luck}`);
      if (appliedDeltas.crew) deltaTokens.push(`船员 ${appliedDeltas.crew > 0 ? '+' : ''}${appliedDeltas.crew}`);
      if (appliedDeltas.loyalty) deltaTokens.push(`忠诚 ${appliedDeltas.loyalty > 0 ? '+' : ''}${appliedDeltas.loyalty}`);

      const deltaSummary = deltaTokens.length > 0 
        ? `\n\n【局势变动】` + deltaTokens.join(' | ') 
        : `\n\n【局势变动】平安渡过，未受波折`;

      this.state.currentNode = {
        id: `${node.id}_chain_${winningIndex}`,
        title: `${node.title} · ${outcome.title}`,
        chapter: node.chapter || node.title,
        env: node.env,
        landType: node.landType,
        icon: node.icon,
        speaker: '旁白',
        quote: '',
        text: `${choice.chain.text}\n\n【命运判定 · ${outcome.title}】\n${outcome.text}${deltaSummary}`,
        isResolution: true,
        nextKnot: choice.nextKnot,
        nextAct: choice.nextAct,
        choices: [
          {
            text: "妥善处置，继续前行",
            hint: "",
            deltas: {},
            condition: null
          }
        ]
      };

      return { success: true, state: this.state, newAchievements: this.state.newAchievements };
    }

    // 1. 记录常规历史文本
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

    if (res.sanity <= 0) {
      res.sanity = 0;
      this.triggerEnding('death_sea');
      return { success: true, ending: this.state.ending, state: this.state };
    } else if (res.sanity < 25) {
      res.loyalty -= 4;
      appliedDeltas.loyalty -= 4;
      alerts.push("⚠️ 恐惧蔓延！船长神志受创，疑惧在水手心中暗生！");
    }

    if (res.luck < 15) {
      res.loyalty -= 3;
      appliedDeltas.loyalty -= 3;
      alerts.push("⚡ 恶兆频现！水手们深信这艘船已遭海神弃绝！");
    }

    res.food = Math.max(0, Math.min(100, res.food));
    res.sanity = Math.max(0, Math.min(100, res.sanity));
    res.luck = Math.max(0, Math.min(100, res.luck));
    res.crew = Math.max(0, Math.min(35, res.crew));
    res.loyalty = Math.max(0, Math.min(100, res.loyalty));

    this.state.lastDeltas = appliedDeltas;
    this.state.secondOrderAlerts = alerts;

    // 5. 死亡与失败即时判定
    if (res.crew <= 0) {
      this.triggerEnding('death_sea');
      return { success: true, ending: this.state.ending, state: this.state, newAchievements: this.state.newAchievements };
    }
    if (res.loyalty <= 0) {
      this.triggerEnding('death_land');
      return { success: true, ending: this.state.ending, state: this.state, newAchievements: this.state.newAchievements };
    }

    // 6. 成功通过考验判定与史诗原画收集要素解锁：
    // 若当前为主线大事件考验（isMajorChallenge 且 majorId），在此处成功通过考验！跳出收集特刊弹窗！
    let resolvedImage = node.collectedImage || node.image || null;
    const majorId = node.majorId;
    if (majorId) {
      const mAchs = ArchiveManager.recordMajorEvent(majorId);
      this.state.newAchievements = (this.state.newAchievements || []).concat(mAchs);

      const majorDef = GAME_DATABASE.MAJOR_EVENTS.find(m => m.id === majorId);
      if (majorDef) {
        resolvedImage = node.collectedImage || majorDef.image;
        // 弹窗防连续出现冷却：与上一次弹窗（大事件或见闻录）至少间隔 2 个回合
        const minInterval = 2;
        const effectiveDay = this.state.day + 1;
        if (effectiveDay - (this.state.lastPopupDay || -99) >= minInterval) {
          // 成功通过考验！跳出大事件原画收集特刊
          this.state.epicMajorEvent = {
            ...majorDef,
            isCollectionUnlocked: true
          };
          this.state.lastPopupDay = effectiveDay;
        }
      }
    }

    // 7. 在选择后，于上方旁白文本框展示叙事结果与局势变动
    let narrative = '';
    if (choice.resolutionText) {
      narrative = choice.resolutionText;
    } else {
      let desc = choice.hint || '';
      desc = desc.replace(/[:：].*$/, '').replace(/【.*?】/g, '').trim();
      if (!desc || desc === choice.text) {
        narrative = `面对此局，你断然下令：【${choice.text}】。全船上下遵令行事，战船劈波斩浪向前。`;
      } else {
        narrative = `你做出了决断：【${choice.text}】。\n${desc}。`;
      }
    }

    const deltaTokens = [];
    if (appliedDeltas.food) deltaTokens.push(`食物 ${appliedDeltas.food > 0 ? '+' : ''}${appliedDeltas.food}`);
    if (appliedDeltas.sanity) deltaTokens.push(`理智 ${appliedDeltas.sanity > 0 ? '+' : ''}${appliedDeltas.sanity}`);
    if (appliedDeltas.luck) deltaTokens.push(`神恩 ${appliedDeltas.luck > 0 ? '+' : ''}${appliedDeltas.luck}`);
    if (appliedDeltas.crew) deltaTokens.push(`船员 ${appliedDeltas.crew > 0 ? '+' : ''}${appliedDeltas.crew}`);
    if (appliedDeltas.loyalty) deltaTokens.push(`忠诚 ${appliedDeltas.loyalty > 0 ? '+' : ''}${appliedDeltas.loyalty}`);

    const deltaSummary = deltaTokens.length > 0 
      ? `\n【局势变动】` + deltaTokens.join(' | ') 
      : `\n【局势变动】平安渡过，未受波折`;

    const alertBlock = alerts.length > 0 ? ('\n' + alerts.join('\n')) : '';
    const aftermathPrefix = `【前情抉择】${narrative}${deltaSummary}${alertBlock}\n────────────────────\n\n`;

    // 8. 回合天数推进
    this.state.day += 1;
    if (this.state.day >= this.state.maxDays) {
      this.calculateFinalEnding();
      return { success: true, ending: this.state.ending, state: this.state, newAchievements: this.state.newAchievements };
    }

    // 9. 直接切入下一个事件（无任何“明晓此理”冗余确认卡，直接呈现新事件与新抉择）
    if (choice.nextAct !== undefined) {
      this.advanceAct(choice.nextAct);
    } else if (choice.nextKnot) {
      this.setKnotNode(choice.nextKnot);
    } else {
      this.advanceToNextEvent(node);
    }

    // 将决断后果展示在下一事件上方旁白文本框中
    if (this.state.currentNode) {
      this.state.currentNode.text = aftermathPrefix + (this.state.currentNode.text || '');
    }

    const turnAchs = ArchiveManager.checkTurnUnlocks(this.state, node, choice);
    this.state.newAchievements = (this.state.newAchievements || []).concat(turnAchs);

    return { success: true, state: this.state, newAchievements: this.state.newAchievements };
  }

  /**
   * 概率生成下一个事件（海陆交替流转与挂起 Knot 衔接）
   */
  advanceToNextEvent(previousNode) {
    this.state.discoveredSight = null;
    this.state.epicMajorEvent = null;

    // 1. 陆地回合流转与驻留上限控制：
    if (this.state.currentEnv === 'land') {
      this.state.landStayTurns = (this.state.landStayTurns || 0) + 1;

      if (this.state.landStayTurns < 2) {
        this.state.currentNode = this.generateIslandStayNode();
        return;
      } else {
        // 已达 2 回合上限，拔锚起航返回大海
        this.state.currentEnv = 'sea';
        this.state.landStayTurns = 0;
        this.state.currentIsland = null;
        if (this.state.pendingNextKnot) {
          const k = this.state.pendingNextKnot;
          this.state.pendingNextKnot = null;
          this.setKnotNode(k);
          return;
        }
        this.state.currentNode = this.pickSeaEvent();
        return;
      }
    }

    // 2. 幕间航海过渡完毕：若有挂起的主线 Knot，直接抵达新一幕的主线节点
    if (this.state.pendingNextKnot) {
      const k = this.state.pendingNextKnot;
      this.state.pendingNextKnot = null;
      this.setKnotNode(k);
      return;
    }

    // 3. 海洋回合流转（风暴连发判定）
    if (previousNode && previousNode.env === 'sea' && previousNode.isStormOrDisoriented) {
      const weights = this.state.classInfo.weights || {};
      const chainChance = 0.6 * (weights.stormChainChanceRate || 1.0);
      if (this.state.stormStreak < 2 && Math.random() < chainChance) {
        this.state.stormStreak += 1;
        this.state.currentEnv = 'sea';
        this.state.currentNode = this.pickSeaEvent();
        return;
      }
    }

    this.state.stormStreak = 0;

    // 海洋回合正常结束，即将进入陆地回合：触发远眺海岛决策是否登陆
    this.state.currentNode = this.generateIslandApproachNode();
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

    const cost = sac.cost ? (sac.cost.food || 5) : 5;
    if (res.food < cost) {
      return { success: false, msg: `祭品不足！需要食物储备 ≥ ${cost}` };
    }
    res.food -= cost;

    const luckDelta = (res.luck - 50) * 0.5;
    const classBonus = weights.sacrificeBonus || 0;
    const baseRate = sac.baseRate || 50;
    const successRate = Math.min(95, Math.max(15, Math.round(baseRate + luckDelta + classBonus)));

    const roll = Math.floor(Math.random() * 100) + 1;
    let outcomeType = 'failure';
    let outcomeText = '';
    const appliedDeltas = { food: -cost, sanity: 0, luck: 0, crew: 0, loyalty: 0 };

    if (roll <= successRate) {
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
      outcomeType = 'failure';
      outcomeText = `【⚡ 漠然弃受 · 逆风逆浪】\n狂暴的阴风将黑烟狠狠吹散回甲板，祭火惨淡熄灭。${sac.god}对祭品无动于衷，水手们面面相觑，疑惧暗生。`;
      appliedDeltas.sanity -= 5;
      appliedDeltas.luck -= 2;
    }

    res.sanity += appliedDeltas.sanity;
    res.luck += appliedDeltas.luck;
    res.loyalty += appliedDeltas.loyalty;

    res.sanity = Math.max(0, Math.min(100, res.sanity));
    res.luck = Math.max(0, Math.min(100, res.luck));
    res.loyalty = Math.max(0, Math.min(100, res.loyalty));

    this.state.lastDeltas = appliedDeltas;

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
    const { crew, loyalty, sanity } = this.state.resources;
    let endingKey = 'return';

    if (crew >= 20 && loyalty >= 60 && sanity >= 50) {
      endingKey = 'triumphant'; // 凯旋 · 众多船员
    } else if (crew >= 6 && loyalty >= 25) {
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = OdysseyEngine;
}
if (typeof root !== 'undefined') {
  root.OdysseyEngine = OdysseyEngine;
}
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));

