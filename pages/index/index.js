// pages/index/index.js
const SaveManager = require('../../core/save-manager.js');
const GAME_DATABASE = require('../../story/game_database.js');
const ArchiveManager = require('../../core/archive-manager.js');

Page({
  data: {
    showRuleModal: false,
    showSaveModal: false,
    showClassModal: false,
    selectedClassId: 'warrior',
    classesList: [],
    saveSlots: [],
    archiveSummary: null
  },

  onLoad() {
    const list = Object.values(GAME_DATABASE.CLASSES).map(c => {
      let perkText = '';
      if (c.id === 'warrior') perkText = '士气刚毅：忠诚流失-25% · 战斗收益+25%';
      else if (c.id === 'priest') perkText = '神眷通灵：祭祀成功率+15%且成效卓越 · 理智衰减-20%';
      else if (c.id === 'helmsman') perkText = '弄潮老手：风暴减员-30% · 迷航连击率-40%';
      else if (c.id === 'merchant') perkText = '精打细算：食物消耗-10% · 港口贸易收益+35%';
      return {
        ...c,
        perkText
      };
    });
    this.setData({ classesList: list });
  },

  onShow() {
    this.refreshSlots();
    this.refreshArchiveSummary();
  },

  refreshArchiveSummary() {
    const codex = ArchiveManager.getArchiveCodexData();
    this.setData({
      archiveSummary: codex.stats
    });
  },

  openArchivePage() {
    wx.navigateTo({
      url: '/pages/archive/archive'
    });
  },

  refreshSlots() {
    const slots = SaveManager.getAllSlotsSummary();
    this.setData({ saveSlots: slots });
  },

  openClassModal() {
    this.setData({ showClassModal: true });
  },

  closeClassModal() {
    this.setData({ showClassModal: false });
  },

  selectClass(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ selectedClassId: id });
  },

  confirmStartGame() {
    this.setData({ showClassModal: false });
    wx.navigateTo({
      url: `/pages/game/game?mode=new&class=${this.data.selectedClassId}`
    });
  },

  openSaveModal() {
    this.refreshSlots();
    this.setData({ showSaveModal: true });
  },

  closeSaveModal() {
    this.setData({ showSaveModal: false });
  },

  loadSlot(e) {
    const slot = e.currentTarget.dataset.slot;
    const target = this.data.saveSlots.find(s => s.slot === slot);
    if (!target || target.isEmpty) {
      wx.showToast({ title: '该槽位无存档', icon: 'none' });
      return;
    }
    this.closeSaveModal();
    wx.navigateTo({
      url: `/pages/game/game?mode=load&slot=${slot}`
    });
  },

  openRuleModal() {
    this.setData({ showRuleModal: true });
  },

  closeRuleModal() {
    this.setData({ showRuleModal: false });
  },

  preventBubble() {
    // 阻止点击弹窗内容时关闭蒙层
  }
});
