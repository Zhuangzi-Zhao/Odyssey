// core/save-manager.js
(function(root) {
/**
 * 存档与读档管理器（跨平台支持：微信小程序 Storage 与 Web LocalStorage）
 * 提供 3 个手动存档槽位与 1 个自动存档槽位
 */

const STORAGE_KEY_PREFIX = 'ODYSSEY_SAVE_SLOT_';
const AUTO_SAVE_KEY = 'ODYSSEY_AUTO_SAVE';

const storage = {
  get(key) {
    try {
      if (typeof wx !== 'undefined' && wx.getStorageSync) {
        return wx.getStorageSync(key);
      }
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      }
    } catch (e) {
      console.warn('[SaveManager] storage.get 异常', e);
    }
    return null;
  },
  set(key, val) {
    try {
      if (typeof wx !== 'undefined' && wx.setStorageSync) {
        return wx.setStorageSync(key, val);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(val));
      }
    } catch (e) {
      console.warn('[SaveManager] storage.set 异常', e);
    }
  },
  remove(key) {
    try {
      if (typeof wx !== 'undefined' && wx.removeStorageSync) {
        return wx.removeStorageSync(key);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('[SaveManager] storage.remove 异常', e);
    }
  }
};

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
      storage.set(`${STORAGE_KEY_PREFIX}${slot}`, saveData);
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
      const saveData = storage.get(`${STORAGE_KEY_PREFIX}${slot}`);
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
        const data = storage.get(`${STORAGE_KEY_PREFIX}${i}`);
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
      storage.set(AUTO_SAVE_KEY, {
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
      const data = storage.get(AUTO_SAVE_KEY);
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
      storage.remove(`${STORAGE_KEY_PREFIX}${slot}`);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SaveManager;
}
if (typeof root !== 'undefined') {
  root.SaveManager = SaveManager;
}
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));

