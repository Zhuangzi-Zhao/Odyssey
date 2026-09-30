const { spawn } = require('child_process');
const http = require('http');

console.log('=== Real Chrome Testing for Class Select & Start Game ===');

const chromeProc = spawn(
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'file:///f:/Projects/Project_Vibe/Odyssey/index.html'
  ]
);

setTimeout(async () => {
  try {
    // 1. Get targets
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9223/json', (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => resolve(JSON.parse(raw)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('index.html'));
    if (!pageTarget) {
      console.error('Target page not found:', targets);
      chromeProc.kill();
      process.exit(1);
    }

    console.log('Found page target:', pageTarget.url);
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();
    function send(method, params = {}) {
      const id = msgId++;
      return new Promise((resolve) => {
        pending.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data.result);
        pending.delete(data.id);
      }
      if (data.method === 'Runtime.consoleAPICalled') {
        console.log(`[Browser Console ${data.params.type}]:`, data.params.args.map(a => a.value || a.description).join(' '));
      }
      if (data.method === 'Runtime.exceptionThrown') {
        console.error('[Browser Exception]:', data.params.exceptionDetails.text, data.params.exceptionDetails.exception?.description);
      }
    };

    ws.onopen = async () => {
      await send('Runtime.enable');
      await send('Console.enable');

      console.log('1. Page loaded. Checking initial screen...');
      let res = await send('Runtime.evaluate', {
        expression: `({
          currentScreen: window.App ? window.App.currentScreen : 'no App',
          titleDisplay: document.getElementById('screen-title').style.display,
          gameDisplay: document.getElementById('screen-game').style.display
        })`,
        returnByValue: true
      });
      console.log('Initial screen state:', res.result.value);

      console.log('2. Opening class modal...');
      await send('Runtime.evaluate', {
        expression: `window.App.openClassModal()`
      });

      res = await send('Runtime.evaluate', {
        expression: `({
          modalDisplay: document.getElementById('modal-class-select').style.display,
          cardsCount: document.querySelectorAll('.class-card').length,
          selectedClass: window.App.selectedClassId
        })`,
        returnByValue: true
      });
      console.log('Class modal state:', res.result.value);

      console.log('3. Clicking second character card (priest)...');
      await send('Runtime.evaluate', {
        expression: `
          const cards = document.querySelectorAll('.class-card');
          if (cards[1]) cards[1].click();
        `
      });

      res = await send('Runtime.evaluate', {
        expression: `({
          selectedClass: window.App.selectedClassId,
          modalDisplay: document.getElementById('modal-class-select').style.display,
          currentScreen: window.App.currentScreen
        })`,
        returnByValue: true
      });
      console.log('After selecting priest:', res.result.value);

      console.log('4. Clicking start game button ("⚓ 登船 · 踏入爱琴海")...');
      res = await send('Runtime.evaluate', {
        expression: `
          (() => {
            try {
              window.App.startNewGame();
              return { success: true };
            } catch(e) {
              return { error: e.message, stack: e.stack };
            }
          })()
        `,
        returnByValue: true
      });
      console.log('startNewGame result:', res.result.value);

      res = await send('Runtime.evaluate', {
        expression: `
          (() => ({
            currentScreen: window.App.currentScreen,
            titleDisplay: document.getElementById('screen-title').style.display,
            gameDisplay: document.getElementById('screen-game').style.display,
            archiveDisplay: document.getElementById('screen-archive').style.display,
            modalDisplay: document.getElementById('modal-class-select').style.display,
            currentNode: window.App.engine.state.currentNode ? window.App.engine.state.currentNode.title : null,
            storyText: document.getElementById('stage-story-text').textContent
          }))()
        `,
        returnByValue: true
      });
      console.log('After startNewGame screen state:', JSON.stringify(res.result.value, null, 2));

      console.log('5. Clicking first choice option on the game screen...');
      res = await send('Runtime.evaluate', {
        expression: `
          (() => {
            try {
              window.App.chooseOption(0);
              return {
                success: true,
                currentScreen: window.App.currentScreen,
                day: window.App.engine.state.day,
                nextNode: window.App.engine.state.currentNode.title
              };
            } catch(e) {
              return { error: e.message, stack: e.stack };
            }
          })()
        `,
        returnByValue: true
      });
      console.log('chooseOption result:', JSON.stringify(res.result.value, null, 2));

      ws.close();
      chromeProc.kill();
      process.exit(0);
    };

  } catch (err) {
    console.error('Test error:', err);
    chromeProc.kill();
    process.exit(1);
  }
}, 2000);
