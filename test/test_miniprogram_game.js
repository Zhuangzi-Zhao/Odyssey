const fs = require('fs');
const path = require('path');

console.log('=== Testing WeChat Mini Program game page loading ===');

// Mock wx environment
global.wx = {
  getStorageSync: (k) => null,
  setStorageSync: (k, v) => {},
  showToast: (o) => console.log('Toast:', o.title),
  navigateTo: (o) => console.log('Navigate to:', o.url),
  navigateBack: () => console.log('Navigate back')
};

let pageConfig = null;
global.Page = (cfg) => {
  pageConfig = cfg;
};

// Require game.js
try {
  require('../pages/game/game.js');
  console.log('✓ pages/game/game.js loaded without syntax errors');
} catch (e) {
  console.error('✗ Error loading pages/game/game.js:', e);
  process.exit(1);
}

// Simulate onLoad({ mode: 'new', class: 'warrior' })
const instance = Object.assign({}, pageConfig, {
  setData: function(data) {
    this.data = Object.assign({}, this.data, data);
  }
});

try {
  instance.onLoad({ mode: 'new', class: 'warrior' });
  console.log('✓ onLoad executed successfully');
  console.log('Current node:', instance.data.currentNode.title);
  console.log('Processed choices:', instance.data.processedChoices.length);
} catch (e) {
  console.error('✗ Error in onLoad:', e);
}
