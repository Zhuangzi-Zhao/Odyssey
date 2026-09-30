// web/app.js - 奥德赛：归乡之路 (Odyssey: Nostos) 网页先行体验版核心控制器
(function () {
  'use strict';

  // 全局音频合成器（无需外置音频文件，纯原生 Web Audio API 合成音效）
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'triumph') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.15, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.45);
        });
      } else if (type === 'wave') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.6);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      // 忽略音频限制
    }
  }

  // 资源路径标准化（支持 file://、根路径与相对路径）
  function resolveImg(src) {
    if (!src) return '';
    if (src.startsWith('/img/')) {
      return 'img/' + src.slice(5);
    }
    return src;
  }

  // 主控制器对象
  const App = {
    engine: null,
    currentScreen: 'title', // 'title' | 'game' | 'archive'
    typewriterTimer: null,
    autoTimer: null,
    isTypingDone: true,
    fullStoryText: '',
    displayedStoryText: '',
    isAutoMode: false,
    selectedClassId: 'warrior',
    saveModalMode: 'save',
    archiveCurrentTab: 'achievements',
    archiveCurrentCat: 'all',
    newAchievementToastTimer: null,

    init() {
      if (!window.OdysseyEngine || !window.GAME_DATABASE) {
        console.error('核心引擎或数据库未加载！');
        return;
      }
      this.engine = new window.OdysseyEngine();
      this.bindEvents();
      this.renderTitleScreen();
      this.showScreen('title');
    },

    bindEvents() {
      // 屏幕切换与全局按键监听
      window.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '4') {
          const idx = parseInt(e.key, 10) - 1;
          if (this.currentScreen === 'game' && !document.querySelector('.modal-mask:not([style*="display: none"])')) {
            this.chooseOption(idx);
          }
        } else if (e.key === ' ' || e.key === 'Enter') {
          if (this.currentScreen === 'game' && !this.isTypingDone) {
            this.finishTypewriter();
          }
        } else if (e.key === 'Escape') {
          this.closeAllModals();
        } else if (e.key === 'h' || e.key === 'H') {
          if (this.currentScreen === 'game') this.openHistoryModal();
        } else if (e.key === 'p' || e.key === 'P') {
          if (this.currentScreen === 'game') this.openSacrificeModal();
        } else if (e.key === 's' || e.key === 'S') {
          if (this.currentScreen === 'game') this.openSaveModal('save');
        }
      });
    },

    showScreen(screenId) {
      this.currentScreen = screenId;
      document.querySelectorAll('.screen-view').forEach(s => s.style.display = 'none');
      const target = document.getElementById(`screen-${screenId}`);
      if (target) target.style.display = 'flex';
      window.scrollTo(0, 0);

      if (screenId === 'title') {
        this.renderTitleScreen();
      } else if (screenId === 'archive') {
        this.renderArchiveScreen();
      }
    },

    openModal(modalId) {
      playSound('click');
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'flex';
    },

    closeModal(modalId) {
      playSound('click');
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'none';
    },

    closeAllModals() {
      document.querySelectorAll('.modal-mask').forEach(m => m.style.display = 'none');
    },

    // ==============================================================
    // TITLE SCREEN LOGIC
    // ==============================================================
    renderTitleScreen() {
      const summary = window.ArchiveManager ? window.ArchiveManager.getArchiveCodexData().stats : null;
      const pill = document.getElementById('title-archive-summary');
      if (pill && summary) {
        pill.textContent = `(${summary.unlockedAchs}/${summary.totalAchs})`;
      }
    },

    openClassModal() {
      const list = Object.values(window.GAME_DATABASE.CLASSES);
      const container = document.getElementById('class-select-list');
      container.innerHTML = '';

      const updateBtnText = (cName) => {
        const btnText = document.getElementById('btn-confirm-class-text');
        if (btnText) {
          btnText.textContent = `⚓ 以【${cName}】启航 · 踏入爱琴海`;
        }
      };

      list.forEach(c => {
        let perkText = '';
        if (c.id === 'warrior') perkText = '士气刚毅：忠诚流失-25% · 战斗食物收益+25%';
        else if (c.id === 'priest') perkText = '神眷通灵：祭祀成功率+15%且成效卓越 · 理智衰减-20%';
        else if (c.id === 'helmsman') perkText = '弄潮老手：风暴减员-30% · 迷航连击率-40%';
        else if (c.id === 'merchant') perkText = '精打细算：食物消耗-10% · 港口贸易收益+35%';

        const card = document.createElement('div');
        const isSel = c.id === this.selectedClassId;
        card.className = `class-card ${isSel ? 'selected' : ''}`;
        card.setAttribute('data-id', c.id);

        card.onclick = () => {
          this.selectedClassId = c.id;
          document.querySelectorAll('.class-card').forEach(cc => cc.classList.remove('selected'));
          card.classList.add('selected');
          updateBtnText(c.name);
          playSound('click');
        };

        // 双击卡片直接以该身份快速启航
        card.ondblclick = () => {
          this.selectedClassId = c.id;
          this.startNewGame();
        };

        card.innerHTML = `
          <div class="class-header">
            <div class="class-name-tag">
              <span>${c.icon}</span>
              <span>${c.name}</span>
            </div>
            <span class="class-diff-badge">${c.difficulty || '难度适中'}</span>
          </div>
          <div class="class-desc-text">${c.desc}</div>
          <div class="class-res-preview">
            <span>粮 ${c.initialResources.food}</span>
            <span>智 ${c.initialResources.sanity}</span>
            <span>恩 ${c.initialResources.luck}</span>
            <span>员 ${c.initialResources.crew}</span>
            <span>忠 ${c.initialResources.loyalty}</span>
          </div>
          <div class="class-perk-text">✦ ${perkText}</div>
        `;
        container.appendChild(card);
      });

      const selObj = list.find(c => c.id === this.selectedClassId) || list[0];
      if (selObj) updateBtnText(selObj.name);

      this.openModal('modal-class-select');
    },

    startNewGame() {
      try {
        if (!this.engine && window.OdysseyEngine) {
          this.engine = new window.OdysseyEngine();
        }
        this.closeModal('modal-class-select');
        this.engine.reset(this.selectedClassId);
        playSound('wave');
        this.showScreen('game');
        this.renderCurrentNode();

        if (this.engine.state.newAchievements && this.engine.state.newAchievements.length > 0) {
          this.triggerAchievementToast(this.engine.state.newAchievements[0]);
        }
      } catch (err) {
        console.error('开启新游戏异常:', err);
        alert('进入航海发生异常：' + err.message);
      }
    },

    // ==============================================================
    // GAME SCREEN LOGIC
    // ==============================================================
    renderCurrentNode() {
      const state = this.engine.state;
      const node = state.currentNode;
      if (!node) return;

      // 1. HUD 状态条渲染
      document.getElementById('hud-day').textContent = `航行第 ${state.day} 天`;
      document.getElementById('hud-class-icon').textContent = state.classInfo.icon;
      document.getElementById('hud-class-name').textContent = state.classInfo.name;

      // 环境地标
      const envBadge = document.getElementById('hud-env-badge');
      const envIcon = document.getElementById('hud-env-icon');
      const envLabel = document.getElementById('hud-env-label');
      envBadge.className = `hud-env-badge env-${node.env || 'sea'} ${node.landType ? 'land-' + node.landType : ''}`;
      envIcon.textContent = node.icon || '⛵';
      envLabel.textContent = node.envLabel || (node.env === 'sea' ? '茫茫大海' : '陆地探索');

      // 5项物资指标
      const res = state.resources;
      const deltas = state.lastDeltas || {};

      this.updateMetric('food', res.food, deltas.food, 20);
      this.updateMetric('sanity', res.sanity, deltas.sanity, 25);
      this.updateMetric('luck', res.luck, deltas.luck, 20);
      this.updateMetric('crew', res.crew, deltas.crew, 5);
      this.updateMetric('loyalty', res.loyalty, deltas.loyalty, 25);

      // 二阶危机警报
      const alertsBox = document.getElementById('alerts-container');
      alertsBox.innerHTML = '';
      if (state.secondOrderAlerts && state.secondOrderAlerts.length > 0) {
        state.secondOrderAlerts.forEach(al => {
          const banner = document.createElement('div');
          banner.className = 'alert-banner';
          banner.textContent = al;
          alertsBox.appendChild(banner);
        });
      }

      // 幕次与目标 Banner
      const actBadge = document.getElementById('act-pill-badge');
      const actTitle = document.getElementById('act-pill-title');
      const actTheme = document.getElementById('act-pill-theme');
      const objText = document.getElementById('act-objective-text');
      const actPill = document.getElementById('act-pill-container');

      actPill.className = `act-pill act-pill-${state.currentAct}`;
      actBadge.textContent = `第 ${state.currentAct === 0 ? '序' : state.currentAct} 幕`;
      actTitle.textContent = state.actTitle || '';
      actTheme.textContent = state.actTheme ? `· ${state.actTheme}` : '';
      objText.textContent = state.currentObjective || node.objective || '';

      // 2. 场景插图视窗
      const visualImage = document.getElementById('scene-visual-img');
      const visualPlaceholder = document.getElementById('scene-visual-ph');
      const visualChapter = document.getElementById('visual-title-text');
      const visualIcon = document.getElementById('visual-glyph-text');
      const visualHint = document.getElementById('visual-hint-text');

      if (node.image) {
        visualImage.src = resolveImg(node.image);
        visualImage.style.display = 'block';
        visualPlaceholder.style.display = 'none';
      } else {
        visualImage.style.display = 'none';
        visualPlaceholder.style.display = 'flex';
        visualIcon.textContent = node.icon || '⛵';
        visualChapter.textContent = node.chapter || node.title || '爱琴海域';
        if (node.isMajorChallenge) {
          visualHint.textContent = '〔 险局当前 · 待突破考验解锁史诗插画 〕';
        } else {
          visualHint.textContent = '〔 场景原画 / 插画预留展示位 〕';
        }
      }

      // 3. 剧场对白舞台
      const speakerTag = document.getElementById('stage-speaker-tag');
      const speakerName = document.getElementById('stage-speaker-name');
      const sceneIconTag = document.getElementById('stage-scene-icon');

      if (node.speaker) {
        speakerTag.style.display = 'inline-block';
        speakerName.textContent = node.speaker;
      } else {
        speakerTag.style.display = 'none';
      }
      sceneIconTag.textContent = node.icon || '⛵';

      // 启动打字机效果
      this.startTypewriter(node.text || '');

      // 4. 命运抉择选项卡片
      this.renderChoices(node.choices || []);

      // 5. 弹窗触发检定（大事件插画、见闻录）
      if (state.epicMajorEvent && state.epicMajorEvent.isCollectionUnlocked) {
        this.openEpicCollectorModal(state.epicMajorEvent);
      } else if (state.discoveredSight) {
        this.openSightModal(state.discoveredSight);
      }

      // 6. 新成就横幅
      if (state.newAchievements && state.newAchievements.length > 0) {
        this.triggerAchievementToast(state.newAchievements[0]);
      }

      // 7. 自动模式调度
      if (this.isAutoMode && !state.gameEnded) {
        this.scheduleAutoNext();
      }
    },

    updateMetric(id, val, delta, dangerThreshold) {
      const numElem = document.getElementById(`stat-val-${id}`);
      const fillElem = document.getElementById(`stat-fill-${id}`);
      const deltaElem = document.getElementById(`stat-delta-${id}`);

      numElem.textContent = val;
      if (val <= dangerThreshold) {
        numElem.classList.add('text-danger');
      } else {
        numElem.classList.remove('text-danger');
      }

      fillElem.style.width = `${Math.min(100, Math.max(0, val))}%`;

      if (delta && delta !== 0) {
        deltaElem.style.display = 'inline';
        deltaElem.textContent = delta > 0 ? `+${delta}` : `${delta}`;
        deltaElem.className = `stat-delta ${delta > 0 ? 'positive' : 'negative'}`;
      } else {
        deltaElem.style.display = 'none';
      }
    },

    startTypewriter(text) {
      if (this.typewriterTimer) {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }

      this.fullStoryText = text;
      this.displayedStoryText = '';
      this.isTypingDone = false;

      const textBox = document.getElementById('stage-story-text');
      const cursor = document.getElementById('typing-cursor');
      const tapHint = document.getElementById('stage-tap-hint');

      cursor.style.display = 'inline-block';
      tapHint.style.display = 'block';

      let charIndex = 0;
      const speed = 18; // 打字速度

      this.typewriterTimer = setInterval(() => {
        if (charIndex < this.fullStoryText.length) {
          this.displayedStoryText += this.fullStoryText[charIndex];
          textBox.textContent = this.displayedStoryText;
          charIndex++;
        } else {
          this.finishTypewriter();
        }
      }, speed);
    },

    finishTypewriter() {
      if (this.typewriterTimer) {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }
      this.isTypingDone = true;
      document.getElementById('stage-story-text').textContent = this.fullStoryText;
      document.getElementById('typing-cursor').style.display = 'none';
      document.getElementById('stage-tap-hint').style.display = 'none';
    },

    renderChoices(choices) {
      const listContainer = document.getElementById('choices-list');
      listContainer.innerHTML = '';

      choices.forEach((c, idx) => {
        const check = this.engine.isChoiceAvailable(c);
        const item = document.createElement('div');
        item.className = `choice-item ${check.available ? 'choice-enabled' : 'choice-disabled'}`;

        item.onclick = () => {
          if (check.available) {
            this.chooseOption(idx);
          } else {
            playSound('click');
          }
        };

        let reasonHtml = '';
        if (!check.available) {
          reasonHtml = `
            <div class="choice-reason-box">
              <span>🔒</span>
              <span>${check.reason}</span>
            </div>
          `;
        }

        item.innerHTML = `
          <div class="choice-main-row">
            <div class="choice-idx-badge">0${idx + 1}</div>
            <div class="choice-content-wrap">
              <div class="choice-text">${c.text}</div>
              ${reasonHtml}
            </div>
          </div>
        `;
        listContainer.appendChild(item);
      });
    },

    chooseOption(idx) {
      if (!this.isTypingDone) {
        this.finishTypewriter();
        return;
      }

      playSound('click');
      const res = this.engine.makeChoice(idx);

      if (!res.success) {
        alert(res.msg || '无法选择该选项');
        return;
      }

      if (res.ending) {
        this.showEndingModal(res.ending);
        return;
      }

      this.renderCurrentNode();
    },

    scheduleAutoNext() {
      if (this.autoTimer) clearTimeout(this.autoTimer);
      this.autoTimer = setTimeout(() => {
        if (!this.isAutoMode || this.engine.state.gameEnded) return;
        if (!this.isTypingDone) {
          this.finishTypewriter();
          this.scheduleAutoNext();
          return;
        }
        // 自动选择第一个可用选项
        const choices = this.engine.state.currentNode.choices || [];
        for (let i = 0; i < choices.length; i++) {
          if (this.engine.isChoiceAvailable(choices[i]).available) {
            this.chooseOption(i);
            break;
          }
        }
      }, 2000);
    },

    toggleAutoMode() {
      this.isAutoMode = !this.isAutoMode;
      const btn = document.getElementById('btn-tool-auto');
      if (btn) {
        btn.classList.toggle('tool-btn-active', this.isAutoMode);
        document.getElementById('tool-auto-text').textContent = this.isAutoMode ? '自动中' : '自动';
      }
      playSound('click');
      if (this.isAutoMode) {
        this.scheduleAutoNext();
      } else if (this.autoTimer) {
        clearTimeout(this.autoTimer);
      }
    },

    // ==============================================================
    // MODALS: HISTORY, SACRIFICE, SAVE, SIGHT, EPIC, ENDING
    // ==============================================================
    openHistoryModal() {
      const list = document.getElementById('history-timeline-list');
      list.innerHTML = '';
      const hist = this.engine.state.history || [];

      if (hist.length === 0) {
        list.innerHTML = '<div style="color: #64748b; text-align: center; padding: 20px;">暂无历史日志</div>';
      } else {
        hist.forEach((h, i) => {
          const item = document.createElement('div');
          item.className = 'history-item';
          item.innerHTML = `
            <div class="history-day-tag">◆ 第 ${h.day} 天 · ${h.chapter}（${h.envLabel || ''}）</div>
            <div class="history-body-text">${h.text}</div>
            <div class="history-choice-text">抉择：【${h.chosenText}】</div>
          `;
          list.appendChild(item);
        });
      }

      this.openModal('modal-history');
    },

    openSacrificeModal() {
      const container = document.getElementById('sacrifice-grid-list');
      container.innerHTML = '';
      const sacrifices = window.GAME_DATABASE.SACRIFICES || [];
      const res = this.engine.state.resources;
      const weights = (this.engine.state.classInfo && this.engine.state.classInfo.weights) || {};
      const luckDelta = (res.luck - 50) * 0.5;
      const classBonus = weights.sacrificeBonus || 0;

      sacrifices.forEach((s, idx) => {
        const baseRate = s.baseRate || 50;
        const successRate = Math.min(95, Math.max(15, Math.round(baseRate + luckDelta + classBonus)));
        const cost = s.cost ? s.cost.food || 5 : 5;
        const canAfford = res.food >= cost;

        const card = document.createElement('div');
        card.className = 'sacrifice-card';
        card.style.opacity = canAfford ? '1' : '0.5';

        card.onclick = () => {
          if (!canAfford) {
            alert(`食物不足！需要食物储备 ≥ ${cost}`);
            return;
          }
          const sacRes = this.engine.performSacrifice(idx);
          if (sacRes.success) {
            playSound(sacRes.type === 'great_success' ? 'triumph' : 'click');
            alert(sacRes.msg);
            this.closeModal('modal-sacrifice');
            this.renderCurrentNode();
          } else {
            alert(sacRes.msg);
          }
        };

        card.innerHTML = `
          <div class="sac-header-row">
            <span class="sac-god-name">${s.god} · ${s.title}</span>
            <span class="sac-rate-badge">${successRate}% 蒙允</span>
          </div>
          <div class="sac-prayer-text">“${s.prayer}”</div>
          <div class="sac-cost-row">
            <span class="sac-cost">消耗：食物 -${cost}</span>
            <span class="sac-benefit">庇佑：神恩幸运加持</span>
          </div>
        `;
        container.appendChild(card);
      });

      this.openModal('modal-sacrifice');
    },

    openSaveModal(mode = 'save') {
      this.saveModalMode = mode;
      document.getElementById('save-modal-title').textContent = mode === 'save' ? '◆ 航海存档 ◆' : '◆ 载入航海档案 ◆';
      this.refreshSaveSlots();
      this.openModal('modal-save');
    },

    refreshSaveSlots() {
      const container = document.getElementById('save-slots-list');
      container.innerHTML = '';
      const slots = window.SaveManager.getAllSlotsSummary();

      slots.forEach(s => {
        const card = document.createElement('div');
        card.className = 'save-slot-card';

        let metaHtml = '';
        let btnHtml = '';

        if (s.isEmpty) {
          metaHtml = `
            <div class="slot-title">槽位 0${s.slot} · 空存档</div>
            <div class="slot-detail">暂无航行记录</div>
          `;
          btnHtml = `
            <button class="btn btn-gold" style="padding: 6px 14px; font-size: 12px;" onclick="window.App.handleSlotAction(${s.slot}, 'save')">存入</button>
          `;
        } else {
          metaHtml = `
            <div class="slot-title">槽位 0${s.slot} · 第 ${s.day} 天（${s.className}）</div>
            <div class="slot-detail">${s.time} · 船员 ${s.crew} 人 · 粮食 ${s.food}</div>
          `;
          btnHtml = `
            <button class="btn btn-secondary" style="padding: 6px 10px; font-size: 12px; margin-right: 6px;" onclick="window.App.handleSlotAction(${s.slot}, 'load')">读取</button>
            <button class="btn btn-gold" style="padding: 6px 10px; font-size: 12px;" onclick="window.App.handleSlotAction(${s.slot}, 'save')">覆盖</button>
          `;
        }

        card.innerHTML = `
          <div class="slot-meta">${metaHtml}</div>
          <div class="slot-actions">${btnHtml}</div>
        `;
        container.appendChild(card);
      });
    },

    handleSlotAction(slot, action) {
      if (action === 'save') {
        const res = window.SaveManager.saveGame(slot, this.engine.exportState());
        if (res.success) {
          playSound('click');
          alert(`已保存至槽位 0${slot}`);
          this.refreshSaveSlots();
        } else {
          alert('保存失败');
        }
      } else if (action === 'load') {
        const res = window.SaveManager.loadGame(slot);
        if (res.success) {
          playSound('wave');
          this.engine.importState(res.data);
          this.closeModal('modal-save');
          this.showScreen('game');
          this.renderCurrentNode();
        } else {
          alert(res.msg || '读取失败');
        }
      }
    },

    openEpicCollectorModal(epic) {
      playSound('triumph');
      document.getElementById('epic-full-img').src = resolveImg(epic.image);
      document.getElementById('epic-title-text').textContent = epic.title;
      document.getElementById('epic-quote-text').textContent = epic.quote || '';
      document.getElementById('epic-desc-text').textContent = epic.aftermath || epic.text || '';
      this.openModal('modal-epic-collector');
    },

    openSightModal(sight) {
      playSound('triumph');
      document.getElementById('sight-full-img').src = resolveImg(sight.image);
      document.getElementById('sight-title-text').textContent = sight.title;
      document.getElementById('sight-desc-text').textContent = sight.text || '';
      this.openModal('modal-sight');
    },

    showEndingModal(ending) {
      playSound('triumph');
      const st = this.engine.state;
      document.getElementById('ending-cover-img').src = resolveImg(ending.image || '/img/重要配图/凯旋结局2.png');
      document.getElementById('ending-title-text').textContent = ending.title;
      document.getElementById('ending-desc-text').textContent = ending.desc;
      document.getElementById('ending-quote-text').textContent = ending.quote || '';

      document.getElementById('end-stat-crew').textContent = `${st.resources.crew} 人`;
      document.getElementById('end-stat-loyalty').textContent = `${st.resources.loyalty}`;
      document.getElementById('end-stat-days').textContent = `第 ${st.day} 天`;

      this.openModal('modal-ending');
    },

    triggerAchievementToast(ach) {
      if (!ach) return;
      playSound('triumph');
      const banner = document.getElementById('achievement-toast');
      document.getElementById('toast-trophy-icon').textContent = ach.icon || '🏆';
      document.getElementById('toast-ach-name').textContent = ach.name || '';
      document.getElementById('toast-ach-desc').textContent = ach.desc || ach.hint || '';

      banner.style.display = 'flex';

      if (this.newAchievementToastTimer) clearTimeout(this.newAchievementToastTimer);
      this.newAchievementToastTimer = setTimeout(() => {
        banner.style.display = 'none';
      }, 5000);
    },

    // ==============================================================
    // ARCHIVE / CODEX SCREEN LOGIC
    // ==============================================================
    renderArchiveScreen() {
      const codex = window.ArchiveManager.getArchiveCodexData();
      const stats = codex.stats;

      document.getElementById('arc-ach-ratio').textContent = `${stats.unlockedAchs} / ${stats.totalAchs}`;
      document.getElementById('arc-ach-rate').textContent = `(${stats.achRate}%)`;
      document.getElementById('arc-ach-bar').style.width = `${stats.achRate}%`;

      document.getElementById('arc-codex-ratio').textContent = `${stats.unlockedCodex} / ${stats.totalCodex}`;
      document.getElementById('arc-codex-rate').textContent = `(${stats.codexRate}%)`;
      document.getElementById('arc-codex-bar').style.width = `${stats.codexRate}%`;

      document.getElementById('tab-badge-ach').textContent = `(${stats.unlockedAchs}/${stats.totalAchs})`;
      document.getElementById('tab-badge-sights').textContent = `(${stats.sightsCount})`;
      document.getElementById('tab-badge-majors').textContent = `(${stats.majorsCount})`;
      document.getElementById('tab-badge-deities').textContent = `(${stats.deitiesCount})`;
      document.getElementById('tab-badge-endings').textContent = `(${stats.endingsCount})`;

      this.switchArchiveTab(this.archiveCurrentTab);
    },

    switchArchiveTab(tab) {
      this.archiveCurrentTab = tab;
      document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('tab-item-active'));
      const activeTabBtn = document.getElementById(`tab-btn-${tab}`);
      if (activeTabBtn) activeTabBtn.classList.add('tab-item-active');

      const content = document.getElementById('archive-tab-content');
      content.innerHTML = '';
      const codex = window.ArchiveManager.getArchiveCodexData();

      if (tab === 'achievements') {
        this.renderArchiveAchievements(codex.achievements, content);
      } else if (tab === 'sights') {
        this.renderArchiveSights(codex.sights, content);
      } else if (tab === 'majors') {
        this.renderArchiveMajors(codex.majorEvents, content);
      } else if (tab === 'deities') {
        this.renderArchiveDeities(codex.deities, content);
      } else if (tab === 'endings') {
        this.renderArchiveEndings(codex.endings, content);
      }
    },

    renderArchiveAchievements(allAchs, container) {
      const filterBar = document.createElement('div');
      filterBar.className = 'category-filter-row';
      const categories = ['all', '启程与归来', '史诗大事件', '见闻与历程', '极境成就', '命运彩蛋', '远航里程'];

      categories.forEach(cat => {
        const pill = document.createElement('div');
        pill.className = `cat-pill ${this.archiveCurrentCat === cat ? 'cat-pill-active' : ''}`;
        pill.textContent = cat === 'all' ? '全部' : cat;
        pill.onclick = () => {
          this.archiveCurrentCat = cat;
          this.switchArchiveTab('achievements');
        };
        filterBar.appendChild(pill);
      });
      container.appendChild(filterBar);

      const listDiv = document.createElement('div');
      listDiv.className = 'achievements-list';

      const filtered = this.archiveCurrentCat === 'all' 
        ? allAchs 
        : allAchs.filter(a => a.category === this.archiveCurrentCat);

      filtered.forEach(a => {
        const card = document.createElement('div');
        card.className = `achievement-card stone-card ${a.isUnlocked ? 'ach-unlocked' : 'ach-locked'}`;
        card.innerHTML = `
          <div class="ach-icon-box">${a.isUnlocked ? a.icon : '🔒'}</div>
          <div class="ach-body-box">
            <div class="ach-header-row">
              <span class="ach-name">${a.name}</span>
              <span class="ach-cat-tag">〔${a.category}〕</span>
            </div>
            <div class="ach-desc">${a.isUnlocked ? a.desc : (a.hint || '未知成就')}</div>
            ${a.isUnlocked && a.quote ? `<div class="ach-quote">${a.quote}</div>` : ''}
          </div>
        `;
        listDiv.appendChild(card);
      });
      container.appendChild(listDiv);
    },

    renderArchiveSights(sights, container) {
      const listDiv = document.createElement('div');
      listDiv.className = 'codex-list';

      sights.forEach(s => {
        const card = document.createElement('div');
        card.className = `codex-card ${s.isUnlocked ? 'codex-card-unlocked' : 'codex-card-locked'}`;
        card.innerHTML = `
          ${s.isUnlocked && s.image ? `<img class="codex-img-preview" src="${resolveImg(s.image)}"/>` : ''}
          <div class="codex-title-row">
            <span class="codex-title">${s.isUnlocked ? s.title : '🔒 未知见闻'}</span>
            <span>${s.isUnlocked ? '📜 已点亮' : '封存'}</span>
          </div>
          <div class="codex-body">${s.text}</div>
        `;
        listDiv.appendChild(card);
      });
      container.appendChild(listDiv);
    },

    renderArchiveMajors(majors, container) {
      const listDiv = document.createElement('div');
      listDiv.className = 'codex-list';

      majors.forEach(m => {
        const card = document.createElement('div');
        card.className = `codex-card ${m.isUnlocked ? 'codex-card-unlocked' : 'codex-card-locked'}`;
        card.innerHTML = `
          ${m.isUnlocked && m.image ? `<img class="codex-img-preview" src="${resolveImg(m.image)}"/>` : ''}
          <div class="codex-title-row">
            <span class="codex-title">${m.isUnlocked ? m.title : '🔒 未知大事件'}</span>
            <span>${m.isUnlocked ? '🏛️ 已经历' : '待探索'}</span>
          </div>
          <div class="codex-body">${m.desc || m.aftermath || m.text}</div>
          ${m.isUnlocked && m.quote ? `<div class="ach-quote">${m.quote}</div>` : ''}
        `;
        listDiv.appendChild(card);
      });
      container.appendChild(listDiv);
    },

    renderArchiveDeities(deities, container) {
      const listDiv = document.createElement('div');
      listDiv.className = 'codex-list';

      deities.forEach(d => {
        const card = document.createElement('div');
        card.className = `codex-card ${d.isUnlocked ? 'codex-card-unlocked' : 'codex-card-locked'}`;
        card.innerHTML = `
          <div class="codex-title-row">
            <span class="codex-title">${d.icon} ${d.name} · ${d.title}</span>
            <span>${d.isUnlocked ? '✨ 庇佑已至' : '待祈祭'}</span>
          </div>
          <div class="codex-body">${d.desc}</div>
        `;
        listDiv.appendChild(card);
      });
      container.appendChild(listDiv);
    },

    renderArchiveEndings(endings, container) {
      const listDiv = document.createElement('div');
      listDiv.className = 'codex-list';

      endings.forEach(e => {
        const card = document.createElement('div');
        card.className = `codex-card ${e.isUnlocked ? 'codex-card-unlocked' : 'codex-card-locked'}`;
        card.innerHTML = `
          <div class="codex-title-row">
            <span class="codex-title">${e.icon} ${e.name}</span>
            <span>${e.isUnlocked ? '🌅 已达成' : '🔒 未知归途'}</span>
          </div>
          <div class="codex-body">${e.desc}</div>
          ${e.isUnlocked && e.quote ? `<div class="ach-quote">${e.quote}</div>` : ''}
        `;
        listDiv.appendChild(card);
      });
      container.appendChild(listDiv);
    }
  };

  window.App = App;
  window.addEventListener('DOMContentLoaded', () => App.init());
})();
