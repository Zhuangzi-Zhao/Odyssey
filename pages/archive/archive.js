// pages/archive/archive.js
const ArchiveManager = require('../../core/archive-manager.js');

Page({
  data: {
    currentTab: 'achievements', // 'achievements' | 'sights' | 'majors' | 'deities' | 'endings'
    archiveData: null,
    achCategory: 'all',
    filteredAchievements: [],
    selectedDetailItem: null,
    showDetailModal: false
  },

  onShow() {
    this.refreshData();
  },

  refreshData() {
    const data = ArchiveManager.getArchiveCodexData();
    this.setData({ archiveData: data }, () => {
      this.filterAchievements();
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  switchAchCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ achCategory: cat }, () => {
      this.filterAchievements();
    });
  },

  filterAchievements() {
    if (!this.data.archiveData) return;
    const cat = this.data.achCategory;
    const all = this.data.archiveData.achievements || [];
    if (cat === 'all') {
      this.setData({ filteredAchievements: all });
    } else {
      const filtered = all.filter(a => a.category === cat);
      this.setData({ filteredAchievements: filtered });
    }
  },

  openDetail(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      selectedDetailItem: item,
      showDetailModal: true
    });
  },

  closeDetail() {
    this.setData({
      showDetailModal: false,
      selectedDetailItem: null
    });
  },

  goBack() {
    wx.navigateBack({
      fail() {
        wx.reLaunch({ url: '/pages/index/index' });
      }
    });
  },

  preventBubble() {}
});
