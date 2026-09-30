const assert = require('assert');
const fs = require('fs');

console.log('=== Testing startNewGame flow in Node mock environment ===');

const mockLocalStorage = {};
global.window = global;
global.window.scrollTo = () => {};
global.window.addEventListener = () => {};
global.localStorage = {
  getItem: (k) => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: (k) => { delete mockLocalStorage[k]; }
};

// Parse HTML elements to know which IDs actually exist
const html = fs.readFileSync('index.html', 'utf8');
const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
const knownIds = new Set(idMatches);
console.log(`Total IDs found in index.html: ${knownIds.size}`);

const domStore = {};
function getElement(id) {
  if (!domStore[id]) {
    domStore[id] = {
      id,
      style: {},
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); }
      },
      textContent: '',
      innerHTML: '',
      src: '',
      children: [],
      appendChild(child) { this.children.push(child); },
      querySelectorAll(sel) { return []; }
    };
  }
  return domStore[id];
}

global.document = {
  getElementById(id) {
    if (!knownIds.has(id)) {
      console.warn(`WARNING: getElementById called with unknown ID: '${id}'`);
    }
    return getElement(id);
  },
  querySelectorAll(sel) {
    if (sel === '.screen-view') {
      return [getElement('screen-title'), getElement('screen-game'), getElement('screen-archive')];
    }
    if (sel === '.modal-mask') {
      return [getElement('modal-class-select'), getElement('modal-rule')];
    }
    if (sel === '.class-card') {
      return [];
    }
    return [];
  },
  querySelector(sel) {
    return null;
  },
  createElement(tag) {
    return {
      tagName: tag,
      style: {},
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); }
      },
      textContent: '',
      innerHTML: '',
      children: [],
      appendChild(child) { this.children.push(child); }
    };
  }
};

require('../story/game_database.js');
require('../core/archive-manager.js');
require('../core/save-manager.js');
require('../core/engine.js');
require('../web/app.js');

try {
  console.log('1. Calling window.App.init()...');
  window.App.init();
  console.log('   Current screen:', window.App.currentScreen);

  console.log('2. Calling window.App.openClassModal()...');
  window.App.openClassModal();

  console.log('3. Calling window.App.startNewGame()...');
  window.App.startNewGame();
  console.log('   Current screen after startNewGame:', window.App.currentScreen);
  console.log('   Screen display states:');
  console.log('     screen-title:', getElement('screen-title').style.display);
  console.log('     screen-game:', getElement('screen-game').style.display);
  console.log('     screen-archive:', getElement('screen-archive').style.display);
  console.log('   Stage text content:', getElement('stage-text').textContent || window.App.displayedStoryText);
  console.log('   Engine current node:', window.App.engine.state.currentNode.title);
} catch (e) {
  console.error('CRASH in test:', e);
}
