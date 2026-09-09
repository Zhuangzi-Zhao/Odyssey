// pages/game/game.js
const OdysseyEngine = require('../../core/engine.js');
const SaveManager = require('../../core/save-manager.js');
const GAME_DATABASE = require('../../story/game_database.js');

Page({
  data: {
    state: null,
    currentNode: null,
    processedChoices: [],
    displayedText: '',
    isTypingDone: false,
    showDeltas: false,
    deltas: null,
    secondOrderAlerts: [],
    
    // 弹窗与控制
    showHistoryModal: false,
    historyEndId: '',
    showSaveModal: false,
    saveModalMode: 'save', // 'save' | 'load'
    saveSlots: [],
    isAutoMode: false,

    // 祭祀系统弹窗
    showSacrificeModal: false,
    sacrificesList: [],
    sacrificeResult: null,

    // 史诗主线大事件特刊弹窗
    showEpicModal: false,
    epicEventData: null,

    // 航海见闻录发现弹窗
    showSightModal: false,
    currentSight: null,

    // 成就即时解锁横幅
    newAchievementToast: null
  },

  onLoad(options) {
    this.engine = new OdysseyEngine();
    this.typewriterTimer = null;
    this.autoTimer = null;
    this.toastTimer = null;
    this.achievementQueue = [];

    if (options.mode === 'load' && options.slot) {
      const res = SaveManager.loadGame(options.slot);
      if (res.success) {
        this.engine.importState(res.data);
        wx.showToast({ title: `已读取槽位 ${options.slot}`, icon: 'success' });
      } else {
        this.engine.reset('warrior');
        wx.showToast({ title: '读档失败，已开启新局', icon: 'none' });
      }
    } else {
      // 新游戏，根据选定职业初始化
      const classId = options.class || 'warrior';
      this.engine.reset(classId);
    }

    if (this.engine.state.newAchievements && this.engine.state.newAchievements.length > 0) {
      this.triggerAchievementToast(this.engine.state.newAchievements);
    }

    this.renderCurrentNode();
  },

  onUnload() {
    this.clearTimers();
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  },

  clearTimers() {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  },

  /**
   * 计算与生成祭祀列表（含实时动态成功率）
   */
  prepareSacrificesList() {
    if (!this.engine || !this.engine.state) return [];
    const res = this.engine.state.resources;
    const weights = (this.engine.state.classInfo && this.engine.state.classInfo.weights) || {};
    const luckDelta = (res.luck - 50) * 0.5;
    const classBonus = weights.sacrificeBonus || 0;

    return GAME_DATABASE.SACRIFICES.map((s, idx) => {
      const baseRate = s.baseRate || 50;
      const rate = Math.min(95, Math.max(15, Math.round(baseRate + luckDelta + classBonus)));
      return {
        ...s,
        index: idx,
        calculatedRate: rate,
        canAfford: res.food >= (s.cost ? s.cost.food : 5)
      };
    });
  },

  /**
   * 渲染当前剧情节点与打字机动画
   */
  renderCurrentNode(isTransition = false) {
    this.clearTimers();
    const currentNode = this.engine.getCurrentNode();
    const state = this.engine.state;

    if (!currentNode) {
      console.error('节点不存在:', state.currentNodeId);
      return;
    }

    // 预处理选项可用性
    const processedChoices = (currentNode.choices || []).map(choice => {
      const check = this.engine.isChoiceAvailable(choice);
      return {
        ...choice,
        available: check.available,
        reason: check.reason || ''
      };
    });

    const updatePayload = {
      state: state,
      currentNode: currentNode,
      processedChoices: processedChoices,
      displayedText: '',
      isTypingDone: false,
      secondOrderAlerts: state.secondOrderAlerts || []
    };

    // 检查弹窗：史诗大事件特刊与航海见闻录严格互斥，保证绝不同时或连续重叠弹窗
    if (state.epicMajorEvent) {
      updatePayload.showEpicModal = true;
      updatePayload.epicEventData = state.epicMajorEvent;
      updatePayload.showSightModal = false;
    } else if (state.discoveredSight) {
      updatePayload.showSightModal = true;
      updatePayload.currentSight = state.discoveredSight;
      updatePayload.showEpicModal = false;
    } else {
      updatePayload.showEpicModal = false;
      updatePayload.showSightModal = false;
    }

    this.setData(updatePayload);

    // 触发数值变动闪烁动画
    if (isTransition && state.lastDeltas) {
      this.setData({
        deltas: state.lastDeltas,
        showDeltas: true
      });
      setTimeout(() => {
        this.setData({ showDeltas: false });
      }, 2500);
    }

    // 自动保存
    SaveManager.autoSave(state);

    // 启动打字机
    this.startTypewriter(currentNode.text);
  },

  /**
   * 打字机效果
   */
  startTypewriter(fullText) {
    let index = 0;
    const speed = 22; // 每个字 22ms
    this.typewriterTimer = setInterval(() => {
      if (index < fullText.length) {
        index += 1;
        this.setData({
          displayedText: fullText.substring(0, index)
        });
      } else {
        this.completeTypewriter();
      }
    }, speed);
  },

  /**
   * 快速完成打字
   */
  completeTypewriter() {
    this.clearTimers();
    const fullText = this.data.currentNode ? this.data.currentNode.text : '';
    this.setData({
      displayedText: fullText,
      isTypingDone: true
    });

    // 自动模式逻辑
    if (this.data.isAutoMode && !this.data.showEpicModal && !this.data.showSightModal && !this.data.showSacrificeModal) {
      this.autoTimer = setTimeout(() => {
        const availableIdx = this.data.processedChoices.findIndex(c => c.available);
        if (availableIdx !== -1) {
          this.executeChoice(availableIdx);
        }
      }, 2200);
    }
  },

  /**
   * 点击屏幕任意区域：快速跳过打字
   */
  handleScreenTap() {
    if (!this.data.isTypingDone) {
      this.completeTypewriter();
    }
  },

  /**
   * 点击选项
   */
  onSelectChoice(e) {
    const index = e.currentTarget.dataset.index;
    this.executeChoice(index);
  },

  /**
   * 执行选择
   */
  executeChoice(index) {
    if (!this.data.isTypingDone) {
      this.completeTypewriter();
      return;
    }

    const res = this.engine.makeChoice(index);
    if (!res.success) {
      wx.showToast({ title: res.msg || '无法选择此项', icon: 'none' });
      return;
    }

    // 检查本回合新达成的成就并播放横幅
    if (res.newAchievements && res.newAchievements.length > 0) {
      this.triggerAchievementToast(res.newAchievements);
    }

    // 判断游戏是否结束
    if (res.ending) {
      this.goToEnding(res.ending);
      return;
    }

    // 渲染下一节点
    this.renderCurrentNode(true);
  },

  /**
   * 关闭史诗大事件弹窗，直面抉择
   */
  closeEpicModal() {
    this.setData({ showEpicModal: false });
  },

  /**
   * 关闭见闻录弹窗
   */
  closeSightModal() {
    this.setData({ showSightModal: false });
  },

  /**
   * 触发成就即时解锁横幅队列
   */
  triggerAchievementToast(newAchs) {
    if (!newAchs || newAchs.length === 0) return;
    const queue = (this.achievementQueue || []).concat(newAchs);
    this.achievementQueue = queue;
    if (!this.data.newAchievementToast) {
      this.showNextAchievementToast();
    }
  },

  showNextAchievementToast() {
    if (!this.achievementQueue || this.achievementQueue.length === 0) {
      this.setData({ newAchievementToast: null });
      return;
    }

    const current = this.achievementQueue.shift();
    this.setData({ newAchievementToast: current });

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.showNextAchievementToast();
    }, 3800);
  },

  openArchivePage() {
    wx.navigateTo({
      url: '/pages/archive/archive'
    });
  },

  /**
   * 祭祀系统相关方法
   */
  openSacrificeModal() {
    const list = this.prepareSacrificesList();
    this.setData({
      showSacrificeModal: true,
      sacrificesList: list,
      sacrificeResult: null
    });
  },

  closeSacrificeModal() {
    this.setData({
      showSacrificeModal: false,
      sacrificeResult: null
    });
  },

  executeSacrifice(e) {
    const index = e.currentTarget.dataset.index;
    const res = this.engine.performSacrifice(index);
    if (!res.success) {
      wx.showToast({ title: res.msg || '祭祀未能举行', icon: 'none' });
      return;
    }

    if (res.newAchievements && res.newAchievements.length > 0) {
      this.triggerAchievementToast(res.newAchievements);
    }

    const updatedList = this.prepareSacrificesList();
    this.setData({
      state: this.engine.state,
      sacrificesList: updatedList,
      sacrificeResult: res,
      deltas: res.appliedDeltas,
      showDeltas: true
    });

    setTimeout(() => {
      this.setData({ showDeltas: false });
    }, 2500);
  },

  confirmSacrificeResult() {
    this.setData({ sacrificeResult: null });
  },

  /**
   * 跳转至结局页
   */
  goToEnding(ending) {
    const finalState = this.engine.state;
    const payload = {
      day: finalState.day,
      crew: finalState.resources.crew,
      food: finalState.resources.food,
      sanity: finalState.resources.sanity,
      luck: finalState.resources.luck,
      loyalty: finalState.resources.loyalty,
      classInfo: finalState.classInfo,
      unlockedSights: finalState.unlockedSights,
      unlockedAchievements: finalState.unlockedAchievements,
      ending: ending
    };

    wx.redirectTo({
      url: `/pages/ending/ending?data=${encodeURIComponent(JSON.stringify(payload))}`
    });
  },

  /**
   * 自动播放开关
   */
  toggleAutoMode() {
    const newMode = !this.data.isAutoMode;
    this.setData({ isAutoMode: newMode });
    wx.showToast({
      title: newMode ? '已开启自动航行' : '已关闭自动',
      icon: 'none'
    });
    if (newMode && this.data.isTypingDone) {
      this.completeTypewriter();
    }
  },

  /**
   * 历史记录回顾
   */
  openHistoryModal() {
    this.setData({
      showHistoryModal: true,
      historyEndId: 'history-end'
    });
  },

  closeHistoryModal() {
    this.setData({ showHistoryModal: false });
  },

  /**
   * 存读档弹窗
   */
  openSaveModal() {
    const slots = SaveManager.getAllSlotsSummary();
    this.setData({
      showSaveModal: true,
      saveModalMode: 'save',
      saveSlots: slots
    });
  },

  openLoadModal() {
    const slots = SaveManager.getAllSlotsSummary();
    this.setData({
      showSaveModal: true,
      saveModalMode: 'load',
      saveSlots: slots
    });
  },

  closeSaveModal() {
    this.setData({ showSaveModal: false });
  },

  handleSlotClick(e) {
    const slot = e.currentTarget.dataset.slot;
    if (this.data.saveModalMode === 'save') {
      const res = SaveManager.saveGame(slot, this.engine.exportState());
      if (res.success) {
        wx.showToast({ title: res.msg, icon: 'success' });
        this.closeSaveModal();
      } else {
        wx.showToast({ title: res.msg, icon: 'none' });
      }
    } else {
      // 读档
      const res = SaveManager.loadGame(slot);
      if (res.success) {
        this.engine.importState(res.data);
        this.closeSaveModal();
        this.renderCurrentNode();
        wx.showToast({ title: `已读取槽位 ${slot}`, icon: 'success' });
      } else {
        wx.showToast({ title: res.msg, icon: 'none' });
      }
    }
  },

  preventBubble() {
    // 阻止冒泡
  }
});
