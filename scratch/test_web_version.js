// scratch/test_web_version.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== 开始验证网页先行体验版 (Web Preview) 完整性 ===\n');

// 1. 检查网页入口与静态资源存在性
const rootDir = path.resolve(__dirname, '..');
const filesToCheck = [
  'index.html',
  'web/style.css',
  'web/app.js',
  'story/game_database.js',
  'core/archive-manager.js',
  'core/save-manager.js',
  'core/engine.js'
];

filesToCheck.forEach(f => {
  const p = path.join(rootDir, f);
  assert(fs.existsSync(p), `文件必须存在: ${f}`);
  const stat = fs.statSync(p);
  assert(stat.size > 0, `文件不可为空: ${f}`);
  console.log(`   ✓ 核心文件存在且有效: ${f} (${stat.size} bytes)`);
});

// 2. 模拟浏览器 window 与 localStorage 环境验证脚本链
console.log('\n2. 模拟浏览器环境加载脚本链并验证全局对象...');
const mockLocalStorage = {};
global.window = global;
global.window.addEventListener = () => {};
global.localStorage = {
  getItem: (k) => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: (k) => { delete mockLocalStorage[k]; }
};

// 模拟 DOM
const mockElements = {};
function createMockElement(id) {
  return {
    id: id,
    style: {},
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {}
    },
    textContent: '',
    innerHTML: '',
    appendChild: () => {},
    querySelectorAll: () => []
  };
}

global.document = {
  getElementById: (id) => {
    if (!mockElements[id]) mockElements[id] = createMockElement(id);
    return mockElements[id];
  },
  querySelectorAll: () => [],
  querySelector: () => null,
  createElement: (tag) => createMockElement(tag),
  addEventListener: () => {}
};

// 加载脚本
require('../story/game_database.js');
assert(window.GAME_DATABASE, 'window.GAME_DATABASE 必须成功挂载');
console.log('   ✓ window.GAME_DATABASE 挂载成功');

require('../core/archive-manager.js');
assert(window.ArchiveManager, 'window.ArchiveManager 必须成功挂载');
console.log('   ✓ window.ArchiveManager 挂载成功');

require('../core/save-manager.js');
assert(window.SaveManager, 'window.SaveManager 必须成功挂载');
console.log('   ✓ window.SaveManager 挂载成功');

require('../core/engine.js');
assert(window.OdysseyEngine, 'window.OdysseyEngine 必须成功挂载');
console.log('   ✓ window.OdysseyEngine 挂载成功');

// 3. 验证浏览器端 SaveManager (基于 LocalStorage)
console.log('\n3. 验证基于 LocalStorage 的存档与读档管理器...');
const engine = new window.OdysseyEngine();
engine.reset('merchant'); // 随军富贾
engine.state.day = 5;
engine.state.resources.food = 88;

const saveRes = window.SaveManager.saveGame(1, engine.exportState());
assert(saveRes.success, '保存到槽位 1 必须成功');

const slots = window.SaveManager.getAllSlotsSummary();
assert.strictEqual(slots[0].isEmpty, false, '槽位 1 不可为空');
assert.strictEqual(slots[0].food, 88, '食物记录必须准确');
console.log('   ✓ 槽位 1 存储成功:', slots[0]);

const loadRes = window.SaveManager.loadGame(1);
assert(loadRes.success, '读取槽位 1 必须成功');
assert.strictEqual(loadRes.data.resources.food, 88);
console.log('   ✓ 槽位 1 读取成功');

// 4. 验证浏览器端 ArchiveManager (基于 LocalStorage)
console.log('\n4. 验证基于 LocalStorage 的图鉴成就管理器...');
const arch = window.ArchiveManager.getArchive();
assert(arch && arch.unlockedAchievements, '必须能获取全局档案');

const directAch = window.ArchiveManager.unlockDirect('ach_steersman');
assert(directAch, '直接解锁成就必须返回成就对象');
assert(mockLocalStorage['ODYSSEY_GLOBAL_ARCHIVE'], '全局档案必须写入 LocalStorage');

const codex = window.ArchiveManager.getArchiveCodexData();
assert.strictEqual(codex.stats.totalAchs, window.GAME_DATABASE.ACHIEVEMENTS.length, `总成就数必须为 ${window.GAME_DATABASE.ACHIEVEMENTS.length}`);
assert(codex.achievements.find(a => a.id === 'ach_steersman' && a.isUnlocked), '执舵者成就必须已点亮');
console.log('   ✓ 图鉴数据汇总读取成功，总成就数:', codex.stats.totalAchs, '已解锁数:', codex.stats.unlockedAchs);

// 5. 验证 web/app.js 语法正确
console.log('\n5. 验证 web/app.js 脚本语法与结构...');
const appJsCode = fs.readFileSync(path.join(rootDir, 'web/app.js'), 'utf-8');
assert(appJsCode.includes('window.App = App'), 'web/app.js 必须暴露 window.App');
// 试运行执行 IIFE
eval(appJsCode);
assert(window.App, 'window.App 必须初始化完成');
console.log('   ✓ web/app.js 解析执行通过，包含模块:', Object.keys(window.App));

console.log('\n======================================================');
console.log('🎉 网页先行体验版 (Web Preview) 环境与逻辑测试全部通过！');
console.log('======================================================\n');
