// core/save-manager.js
/**
 * 存档与读档管理器（基于微信本地存储 Storage）
 * 提供 3 个手动存档槽位与 1 个自动存档槽位
 */

const STORAGE_KEY_PREFIX = 'ODYSSEY_SAVE_SLOT_';
const AUTO_SAVE_KEY = 'ODYSSEY_AUTO_SAVE';

const SaveManager = {
  /**
   * 保存到指定槽位 (slot: 1 | 2 | 3)
   */
  saveGame(slot, gameState) {
    try {
      const saveData = {
        slot,
        timestamp: Date.now(),
        saveTimeStr: new Date().toLocaleString(),
        chapter: (gameState.currentNode && gameState.currentNode.chapter) || gameState.currentNodeId || '航行中',
        day: gameState.day,
        resources: { ...gameState.resources },
        classInfo: gameState.classInfo,
        state: gameState
      };
      wx.setStorageSync(`${STORAGE_KEY_PREFIX}${slot}`, saveData);
      return { success: true, msg: `存档成功（槽位 ${slot}）` };
    } catch (e) {
      console.error('[SaveManager] 保存失败', e);
      return { success: false, msg: '存档失败，存储空间异常' };
    }
  },

  /**
   * 读取指定槽位存档
   */
  loadGame(slot) {
    try {
      const saveData = wx.getStorageSync(`${STORAGE_KEY_PREFIX}${slot}`);
      if (!saveData || !saveData.state) {
        return { success: false, msg: `槽位 ${slot} 没有存档记录` };
      }
      return { success: true, data: saveData.state, meta: saveData };
    } catch (e) {
      console.error('[SaveManager] 读取失败', e);
      return { success: false, msg: '读取存档失败' };
    }
  },

  /**
   * 获取所有槽位的摘要列表（用于存档列表界面展示）
   */
  getAllSlotsSummary() {
    const slots = [];
    for (let i = 1; i <= 3; i++) {
      try {
        const data = wx.getStorageSync(`${STORAGE_KEY_PREFIX}${i}`);
        if (data && data.state) {
          const className = (data.classInfo && data.classInfo.name) ||
                            (data.state.classInfo && data.state.classInfo.name) || '领航者';
          slots.push({
            slot: i,
            isEmpty: false,
            time: data.saveTimeStr,
            day: data.day,
            className: className,
            crew: data.resources ? data.resources.crew : 0,
            food: data.resources ? data.resources.food : 0
          });
        } else {
          slots.push({ slot: i, isEmpty: true });
        }
      } catch (e) {
        slots.push({ slot: i, isEmpty: true });
      }
    }
    return slots;
  },

  /**
   * 自动存档
   */
  autoSave(gameState) {
    try {
      wx.setStorageSync(AUTO_SAVE_KEY, {
        timestamp: Date.now(),
        state: gameState
      });
    } catch (e) {
      console.warn('[SaveManager] 自动存档失败', e);
    }
  },

  /**
   * 读取自动存档
   */
  loadAutoSave() {
    try {
      const data = wx.getStorageSync(AUTO_SAVE_KEY);
      if (data && data.state) {
        return { success: true, data: data.state };
      }
      return { success: false };
    } catch (e) {
      return { success: false };
    }
  },

  /**
   * 清除指定槽位
   */
  deleteSlot(slot) {
    try {
      wx.removeStorageSync(`${STORAGE_KEY_PREFIX}${slot}`);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }
};

module.exports = SaveManager;
