const { spawn } = require('child_process');
const http = require('http');

console.log('=== Test Class Card Double Click & Direct Start ===');

const chromeProc = spawn(
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'file:///f:/Projects/Project_Vibe/Odyssey/index.html'
  ]
);

setTimeout(async () => {
  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9224/json', (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => resolve(JSON.parse(raw)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('index.html'));
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
    };

    ws.onopen = async () => {
      await send('Runtime.enable');

      console.log('1. Open modal...');
      await send('Runtime.evaluate', { expression: `window.App.openClassModal()` });

      console.log('2. Double click 3rd card (helmsman)...');
      await send('Runtime.evaluate', {
        expression: `
          const cards = document.querySelectorAll('.class-card');
          if (cards[2]) cards[2].ondblclick();
        `
      });

      const res = await send('Runtime.evaluate', {
        expression: `({
          currentScreen: window.App.currentScreen,
          classId: window.App.engine.state.classId,
          currentNode: window.App.engine.state.currentNode.title
        })`,
        returnByValue: true
      });
      console.log('3. Game state after double click:', res.result.value);

      ws.close();
      chromeProc.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error(e);
    chromeProc.kill();
    process.exit(1);
  }
}, 2000);
