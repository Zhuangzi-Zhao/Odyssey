// core/archive-manager.js
(function(root) {
/**
 * 全局成就与航海图鉴管理器
 * 跨游戏局数持久化存储 (ODYSSEY_GLOBAL_ARCHIVE)
 */

const GAME_DATABASE = (typeof require !== 'undefined') 
  ? require('../story/game_database.js') 
  : (typeof root !== 'undefined' ? root.GAME_DATABASE : null);

const ARCHIVE_STORAGE_KEY = 'ODYSSEY_GLOBAL_ARCHIVE';

// 内存后备存储（支持 Node 环境单元测试）
let _memArchive = null;

const ArchiveManager = {
  /**
   * 获取全局档案数据
   */
  getArchive() {
    let data = null;
    try {
      if (typeof wx !== 'undefined' && wx.getStorageSync) {
        data = wx.getStorageSync(ARCHIVE_STORAGE_KEY);
      } else if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(ARCHIVE_STORAGE_KEY);
        data = raw ? JSON.parse(raw) : null;
      } else {
        data = _memArchive;
      }
    } catch (e) {
      console.warn('[ArchiveManager] 获取存档失败，使用内存缓存', e);
      data = _memArchive;
    }

    if (!data || typeof data !== 'object') {
      data = {
        version: 1,
        unlockedAchievements: {}, // { [achId]: timestamp }
        unlockedSights: [],       // ['sight_1', ...]
        unlockedMajorEvents: [],  // ['major_1', ...]
        unlockedDeities: [],      // ['波塞冬', ...]
        unlockedEndings: [],      // ['triumphant', ...]
        unlockedEncounters: [],   // ['random_1', ...]
        stats: {
          totalVoyages: 0,
          totalDaysSailed: 0,
          totalSacrifices: 0,
          argosCount: 0,
          weaverCount: 0,
          woodenHorseCount: 0
        }
      };
    }

    if (!data.unlockedAchievements) data.unlockedAchievements = {};
    if (!data.unlockedSights) data.unlockedSights = [];
    if (!data.unlockedMajorEvents) data.unlockedMajorEvents = [];
    if (!data.unlockedDeities) data.unlockedDeities = [];
    if (!data.unlockedEndings) data.unlockedEndings = [];
    if (!data.unlockedEncounters) data.unlockedEncounters = [];
    if (!data.stats) {
      data.stats = { totalVoyages: 0, totalDaysSailed: 0, totalSacrifices: 0, argosCount: 0, weaverCount: 0, woodenHorseCount: 0 };
    }

    return data;
  },

  /**
   * 保存全局档案数据
   */
  saveArchive(archive) {
    try {
      _memArchive = archive;
      if (typeof wx !== 'undefined' && wx.setStorageSync) {
        wx.setStorageSync(ARCHIVE_STORAGE_KEY, archive);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archive));
      }
    } catch (e) {
      console.error('[ArchiveManager] 保存全局档案失败', e);
    }
  },

  /**
   * 解锁特定成就
   * @param {string} achId
   * @param {object} archive
   * @returns {object|null} 若为新解锁则返回成就对象，否则返回 null
   */
  unlock(achId, archive) {
    if (!achId) return null;
    const ID_ALIASES = {
      'ach_luck_up': 'ach_first_luck_gain',
      'ach_low_food': 'ach_limit_food',
      'ach_low_loyalty': 'ach_limit_loyalty',
      'ach_low_sanity': 'ach_limit_sanity',
      'ach_low_crew': 'ach_limit_crew',
      'ach_low_luck': 'ach_limit_luck',
      'ach_end_hidden_safe_haven': 'ach_caphireus_miracle',
      'ach_end_caphireus_easter_egg_home': 'ach_caphireus_miracle'
    };
    if (ID_ALIASES[achId]) {
      achId = ID_ALIASES[achId];
    }

    if (!archive.unlockedAchievements[achId]) {
      archive.unlockedAchievements[achId] = Date.now();
      const achDef = GAME_DATABASE.ACHIEVEMENTS.find(a => a.id === achId);
      if (!achDef) {
        console.warn(`[ArchiveManager] 未知成就 ID: ${achId}`);
        return null;
      }
      return achDef;
    }
    return null;
  },

  /**
   * 直接解锁指定成就并保存
   * @param {string} achId
   * @returns {object|null}
   */
  unlockDirect(achId) {
    const archive = this.getArchive();
    const ach = this.unlock(achId, archive);
    if (ach) {
      this.saveArchive(archive);
      return ach;
    }
    return null;
  },

  /**
   * 航海开局记录
   */
  recordStart() {
    const archive = this.getArchive();
    archive.stats.totalVoyages = (archive.stats.totalVoyages || 0) + 1;
    const newAchs = [];
    const ach = this.unlock('ach_start', archive);
    if (ach) newAchs.push(ach);
    this.saveArchive(archive);
    return newAchs;
  },

  /**
   * 记录点亮见闻录
   */
  recordSight(sightId) {
    const archive = this.getArchive();
    const newAchs = [];
    if (!archive.unlockedSights.includes(sightId)) {
      archive.unlockedSights.push(sightId);
    }

    const a1 = this.unlock('ach_first_sight', archive);
    if (a1) newAchs.push(a1);

    if (archive.unlockedSights.length >= 12) {
      const a2 = this.unlock('ach_all_sights', archive);
      if (a2) newAchs.push(a2);
    }

    this.saveArchive(archive);
    return newAchs;
  },

  /**
   * 记录点亮史诗大事件
   */
  recordMajorEvent(majorId) {
    const archive = this.getArchive();
    const newAchs = [];
    if (!archive.unlockedMajorEvents.includes(majorId)) {
      archive.unlockedMajorEvents.push(majorId);
    }

    // 对应单项大事件成就
    const majorAchId = 'ach_' + majorId;
    const a1 = this.unlock(majorAchId, archive);
    if (a1) newAchs.push(a1);

    if (archive.unlockedMajorEvents.length >= 12) {
      const a2 = this.unlock('ach_all_majors', archive);
      if (a2) newAchs.push(a2);
    }

    this.saveArchive(archive);
    return newAchs;
  },

  /**
   * 记录祭祀举行
   */
  recordSacrifice(godName) {
    const archive = this.getArchive();
    const newAchs = [];
    archive.stats.totalSacrifices = (archive.stats.totalSacrifices || 0) + 1;

    if (godName && !archive.unlockedDeities.includes(godName)) {
      archive.unlockedDeities.push(godName);
    }

    const a1 = this.unlock('ach_first_sacrifice', archive);
    if (a1) newAchs.push(a1);

    this.saveArchive(archive);
    return newAchs;
  },

  /**
   * 记录命运判定掷骰（微型事件链或概率事件）
   */
  recordDiceRoll() {
    const archive = this.getArchive();
    const newAchs = [];
    const a = this.unlock('ach_first_dice', archive);
    if (a) newAchs.push(a);
    this.saveArchive(archive);
    return newAchs;
  },

  /**
   * 记录终局达成
   */
  recordEnding(endingKey, state) {
    const archive = this.getArchive();
    const newAchs = [];
    if (!archive.unlockedEndings.includes(endingKey)) {
      archive.unlockedEndings.push(endingKey);
    }

    const achKey = 'ach_end_' + endingKey;
    const a1 = this.unlock(achKey, archive);
    if (a1) newAchs.push(a1);

    if (endingKey === 'hidden_safe_haven' || endingKey === 'caphireus_easter_egg_home') {
      const aMiracle = this.unlock('ach_caphireus_miracle', archive);
      if (aMiracle) newAchs.push(aMiracle);
    }

    // 琴杖之律（完成一次任意大事件并触发任意一个结局）
    if (state && state.majorEventsCount && state.majorEventsCount > 0) {
      const a2 = this.unlock('ach_egg_poet', archive);
      if (a2) newAchs.push(a2);
    }

    this.saveArchive(archive);
    return newAchs;
  },

  /**
   * 回合决策与状态成就检定
   */
  checkTurnUnlocks(state, node, choice) {
    const archive = this.getArchive();
    const newAchs = [];
    const res = state.resources;
    const stats = archive.stats;

    // 1. 极境成就检定
    if (res.food < 10) {
      const a = this.unlock('ach_limit_food', archive);
      if (a) newAchs.push(a);
    }
    if (res.loyalty < 10) {
      const a = this.unlock('ach_limit_loyalty', archive);
      if (a) newAchs.push(a);
    }
    if (res.sanity < 10) {
      const a = this.unlock('ach_limit_sanity', archive);
      if (a) newAchs.push(a);
    }
    if (res.crew <= 3) {
      const a = this.unlock('ach_limit_crew', archive);
      if (a) newAchs.push(a);
    }
    if (res.luck < 10) {
      const a = this.unlock('ach_limit_luck', archive);
      if (a) newAchs.push(a);
    }

    // 2. 远航里程检定
    if (state.day >= 15) {
      const a = this.unlock('ach_sail_day_15', archive);
      if (a) newAchs.push(a);
    }
    if (state.day >= 20) {
      const a = this.unlock('ach_sail_day_20', archive);
      if (a) newAchs.push(a);
    }

    // 3. 神恩上升检定
    if (state.lastDeltas && state.lastDeltas.luck > 0) {
      const a = this.unlock('ach_first_luck_gain', archive);
      if (a) newAchs.push(a);
    }

    // 4. 事件内容与彩蛋检定
    if (node) {
      const nodeText = (node.title || '') + (node.text || '');
      const choiceText = choice ? choice.text : '';

      // 记录随机奇遇
      if (node.id && !archive.unlockedEncounters.includes(node.id)) {
        archive.unlockedEncounters.push(node.id);
      }

      // 首次遭遇战斗
      if (nodeText.includes('海战') || nodeText.includes('作战') || nodeText.includes('战斗') || choiceText.includes('正面迎战') || choiceText.includes('击溃')) {
        const a = this.unlock('ach_first_battle', archive);
        if (a) newAchs.push(a);
      }

      // 首次遭遇海上民族
      if (nodeText.includes('海上民族') || nodeText.includes('外邦战船')) {
        const a = this.unlock('ach_first_sea_people', archive);
        if (a) newAchs.push(a);
      }

      // 彩蛋：阿尔戈斯之眼（善意救助收留）
      if (choiceText.includes('收留') || choiceText.includes('救助') || choiceText.includes('同意搭船') || choiceText.includes('解救')) {
        stats.argosCount = (stats.argosCount || 0) + 1;
        const a = this.unlock('ach_egg_argos', archive);
        if (a) newAchs.push(a);
      }

      // 彩蛋：织布的人（停留观察 / 休整等待）
      if (choiceText.includes('停留') || choiceText.includes('观察') || choiceText.includes('休整') || choiceText.includes('安营') || choiceText.includes('等待')) {
        stats.weaverCount = (stats.weaverCount || 0) + 1;
        if (stats.weaverCount >= 2) {
          const a = this.unlock('ach_egg_weaver', archive);
          if (a) newAchs.push(a);
        }
      }

      // 彩蛋：木马的心脏（计策伪装取胜）
      if (choiceText.includes('诱敌') || choiceText.includes('谈判') || choiceText.includes('盘问') || choiceText.includes('伪装') || choiceText.includes('智取')) {
        stats.woodenHorseCount = (stats.woodenHorseCount || 0) + 1;
        const a = this.unlock('ach_egg_wooden_horse', archive);
        if (a) newAchs.push(a);
      }

      // 彩蛋：被歌声带走的人（大事件8塞壬减员）
      if (node.id === 'major_8' && state.lastDeltas && state.lastDeltas.crew < 0) {
        const a = this.unlock('ach_egg_siren_crew', archive);
        if (a) newAchs.push(a);
      }
    }

    // 5. 选项显式成就解锁 (unlockAchievement)
    if (choice && choice.unlockAchievement) {
      const a = this.unlock(choice.unlockAchievement, archive);
      if (a) newAchs.push(a);
    }

    this.saveArchive(archive);
    return newAchs;
  },

  /**
   * 获取图鉴与成就的综合汇总数据（供主界面徽章与图鉴页展示）
   */
  getArchiveCodexData() {
    const archive = this.getArchive();
    const allAchs = GAME_DATABASE.ACHIEVEMENTS || [];

    // 格式化 38 项成就
    const formattedAchs = allAchs.map(a => {
      const isUnlocked = !!archive.unlockedAchievements[a.id];
      const unlockTime = isUnlocked ? new Date(archive.unlockedAchievements[a.id]).toLocaleDateString() : '';
      return {
        ...a,
        isUnlocked,
        unlockTime
      };
    });

    // 格式化 12 篇见闻录图鉴
    const formattedSights = (GAME_DATABASE.SIGHTS || []).map(s => {
      const isUnlocked = archive.unlockedSights.includes(s.id);
      return {
        id: s.id,
        title: s.title,
        text: isUnlocked ? s.text : '此篇航海隐秘仍笼罩于重重海雾之中，唯有在风平浪静的特定时刻偶遇方能点亮。',
        image: s.image,
        isUnlocked,
        icon: isUnlocked ? '📜' : '🔒'
      };
    });

    // 格式化 12 幕史诗大事件图鉴
    const formattedMajors = (GAME_DATABASE.MAJOR_EVENTS || []).map(m => {
      const isUnlocked = archive.unlockedMajorEvents.includes(m.id);
      return {
        id: m.id,
        title: m.title,
        quote: isUnlocked ? m.quote : '“荷马史诗的此段试炼尚未在你的航程中降临……”',
        text: isUnlocked ? m.text : '命运尚未交汇。保持不同神恩或推进天数，诸神将引渡你的战船直面此劫。',
        image: m.image,
        env: m.env,
        icon: isUnlocked ? m.icon : '🔒',
        isUnlocked
      };
    });

    // 格式化 10 位奥林匹斯诸神图鉴
    const formattedDeities = (GAME_DATABASE.SACRIFICES || []).map(sac => {
      const isUnlocked = archive.unlockedDeities.includes(sac.god);
      return {
        id: sac.id,
        god: sac.god,
        title: sac.title,
        prayer: isUnlocked ? sac.prayer : '尚待在祭坛献上公牛与谷物以获神明指引。',
        blessing: sac.standardReward,
        icon: isUnlocked ? '🏛️' : '🔒',
        isUnlocked
      };
    });

    // 格式化 5 大终局图鉴
    const formattedEndings = Object.values(GAME_DATABASE.ENDINGS || {}).map(end => {
      const isUnlocked = archive.unlockedEndings.includes(end.id);
      return {
        id: end.id,
        title: end.title,
        tag: end.tag,
        desc: isUnlocked ? end.desc : '未达成的命运终局铭文。调整航行中的存活人数、忠诚度与决策以解锁此结局。',
        image: end.image,
        icon: isUnlocked ? end.icon : '🔒',
        isUnlocked
      };
    });

    // 统计各类别达成进度
    const totalAchs = formattedAchs.length;
    const unlockedAchs = formattedAchs.filter(a => a.isUnlocked).length;
    const achRate = totalAchs > 0 ? Math.round((unlockedAchs / totalAchs) * 100) : 0;

    const totalCodex = formattedSights.length + formattedMajors.length + formattedDeities.length + formattedEndings.length;
    const unlockedCodex = formattedSights.filter(s => s.isUnlocked).length +
                          formattedMajors.filter(m => m.isUnlocked).length +
                          formattedDeities.filter(d => d.isUnlocked).length +
                          formattedEndings.filter(e => e.isUnlocked).length;
    const codexRate = totalCodex > 0 ? Math.round((unlockedCodex / totalCodex) * 100) : 0;

    return {
      achievements: formattedAchs,
      sights: formattedSights,
      majorEvents: formattedMajors,
      deities: formattedDeities,
      endings: formattedEndings,
      stats: {
        totalAchs,
        unlockedAchs,
        achRate,
        totalCodex,
        unlockedCodex,
        codexRate,
        sightsCount: formattedSights.filter(s => s.isUnlocked).length + ' / ' + formattedSights.length,
        majorsCount: formattedMajors.filter(m => m.isUnlocked).length + ' / ' + formattedMajors.length,
        deitiesCount: formattedDeities.filter(d => d.isUnlocked).length + ' / ' + formattedDeities.length,
        endingsCount: formattedEndings.filter(e => e.isUnlocked).length + ' / ' + formattedEndings.length
      }
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArchiveManager;
}
if (typeof root !== 'undefined') {
  root.ArchiveManager = ArchiveManager;
}
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));

