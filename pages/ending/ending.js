// pages/ending/ending.js
const GAME_DATABASE = require('../../story/game_database.js');

Page({
  data: {
    ending: {},
    classInfo: null,
    stats: {},
    sightsList: []
  },

  onLoad(options) {
    if (options.data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(options.data));
        const unlockedIds = decoded.unlockedSights || [];
        const fullSights = GAME_DATABASE.SIGHTS.filter(s => unlockedIds.includes(s.id));
        const endId = decoded.ending && decoded.ending.id;
        const fullEnding = Object.assign({}, GAME_DATABASE.ENDINGS[endId] || {}, decoded.ending || {});

        this.setData({
          ending: fullEnding,
          classInfo: decoded.classInfo || null,
          sightsList: fullSights,
          stats: {
            day: decoded.day || 1,
            crew: decoded.crew !== undefined ? decoded.crew : 0,
            food: decoded.food !== undefined ? decoded.food : 0,
            sanity: decoded.sanity !== undefined ? decoded.sanity : 0,
            luck: decoded.luck !== undefined ? decoded.luck : 0,
            loyalty: decoded.loyalty !== undefined ? decoded.loyalty : 0
          }
        });
      } catch (e) {
        console.error('解析结局数据失败', e);
      }
    }
  },

  restartGame() {
    const classId = (this.data.classInfo && this.data.classInfo.id) || 'warrior';
    wx.redirectTo({
      url: `/pages/game/game?mode=new&class=${classId}`
    });
  },

  backToTitle() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  openArchivePage() {
    wx.navigateTo({
      url: '/pages/archive/archive'
    });
  }
});
