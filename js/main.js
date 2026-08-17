/* ====================================================
   孙舒颜 · 一本手账 — 交互脚本
   - 翻页：点击入口 / 返回按钮
   - 塔罗牌：点击抽取技能牌
   - 彩蛋：悬停重要内容
   ==================================================== */
(function () {
  'use strict';

  // ==================== DOM 引用 ====================
  const pages     = document.querySelectorAll('.page');
  const homePage  = document.getElementById('page-home');
  const entries   = document.querySelectorAll('.entry[data-target]');
  const backBtns  = document.querySelectorAll('.bookmark-back');
  const tocItems  = document.querySelectorAll('.toc-item');
  const eggLayer  = document.getElementById('eggLayer');
  const eggText   = document.getElementById('eggText');
  const eggClose  = document.getElementById('eggClose');
  const workCards = document.querySelectorAll('.work-card[data-egg]');
  const hobbyCards= document.querySelectorAll('.hobby-card[data-egg]');

  // 塔罗牌元素
  const tarotDrawBtn    = document.getElementById('tarotDrawBtn');
  const tarotShuffleBtn = document.getElementById('tarotShuffleBtn');
  const tarotStage      = document.getElementById('tarotStage');
  const tarotDeck       = document.getElementById('tarotDeck');
  const deckCount       = document.getElementById('deckCount');
  const tarotDrawnList  = document.getElementById('tarotDrawnList');
  const tarotDrawnArea  = document.getElementById('tarotDrawnArea');

  // ==================== 技能牌数据（7张新分类） ====================
  const SKILL_CARDS = [
    {
      id: 'ai',
      icon: '🤖',
      title: 'AI 应用',
      desc: '将Claude、ChatGPT、WorkBuddy等AI工具融入日常办公与项目推进；具备Prompt Engineering实践经验，能够有效优化输出质量；掌握Prompt优化与AI工具链落地，覆盖数据测算、文档生成、调研整理场景。',
      note: 'AI 不是替代，是放大器',
      color: '#a8b8c8'
    },
    {
      id: 'soft',
      icon: '💡',
      title: '软技能',
      desc: '具备商家全链路运营、跨部门协同攻坚、行业趋势洞察能力；习惯以数据锚定方向，在复杂多变的业务场景中把控节奏，稳扎稳打推动目标落地。',
      note: '能在不确定中保持节奏',
      color: '#efe4cc'
    },
    {
      id: 'tools',
      icon: '🛠️',
      title: '办公工具',
      desc: '精通Office全家桶，可通过Excel高级函数搭建运营台账与数据模型，输出标准化方案与汇报材料；熟练使用飞书、Notion进行项目与需求管理，适配多团队协作节奏。',
      note: '工具用顺手，效率翻倍',
      color: '#bfb5a4'
    },
    {
      id: 'content',
      icon: '✍️',
      title: '内容设计',
      desc: '熟练使用秀米完成公众号推文排版优化，可通过Canva独立设计海报、信息长图；曾支撑新媒体内容产出，单篇推文最高阅读量1600+，兼顾质感与传播效果。',
      note: '能写能剪，必要的时候自己上手',
      color: '#e8b5b0'
    },
    {
      id: 'data',
      icon: '📊',
      title: '数据分析',
      desc: '熟练使用Excel函数、SQL表连接、窗口函数、Stata，让数据说话而不是堆数据。',
      note: '让数据说话，而不是堆数据',
      color: '#b5c9b0'
    },
    {
      id: 'lang',
      icon: '🗣️',
      title: '语言能力',
      desc: '普通话一级乙等，CET6：513，可阅读英文行业研报。',
      note: '语言是工具，证书是顺手拿的',
      color: '#e8d8a8'
    },
    {
      id: 'special',
      icon: '⭐',
      title: '特长素养',
      desc: '古筝 · 舞蹈',
      note: '艺术细菌嘎嘎的',
      color: '#d4a5a5'
    }
  ];

  let currentPageId = 'page-home';
  let deck = [...SKILL_CARDS];      // 当前牌堆
  let drawn = [];                   // 已抽出的牌

  // ==================== 工具函数 ====================
  function getPage(id) {
    return document.getElementById(id);
  }

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ==================== 翻页 ====================
  function flipTo(targetId, direction) {
    const current = getPage(currentPageId);
    const target  = getPage(targetId);
    if (!target || current === target) return;

    if (current) {
      const outClass = (direction === 'back') ? 'flip-out-back' : 'is-flip-out';
      current.classList.add(outClass);
      const dur = 420;
      setTimeout(() => {
        current.classList.remove('is-active', 'is-flip-out', 'flip-out-back', 'is-flip-in');
      }, dur);
    }

    target.classList.add('is-active');
    void target.offsetWidth;
    target.classList.add('is-flip-in');
    setTimeout(() => {
      target.classList.remove('is-flip-in');
    }, 720);

    currentPageId = targetId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  entries.forEach((entry) => {
    entry.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = 'page-' + entry.dataset.target;
      flipTo(targetId, 'forward');
    });
  });

  // 首页中央笔记本点击跳转
  const mainNotebook = document.getElementById('main-notebook');
  if (mainNotebook) {
    mainNotebook.addEventListener('click', (e) => {
      e.preventDefault();
      const target = mainNotebook.dataset.target;
      if (target) flipTo('page-' + target, 'forward');
    });
  }

  backBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const page = btn.closest('.page');
      if (!page) return;
      if (page.id === 'page-toc') {
        // 目录页返回首页
        flipTo('page-home', 'back');
      } else {
        // 其他内页返回目录
        flipTo('page-toc', 'back');
      }
    });
  });

  // 目录页板块条目跳转
  tocItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = 'page-' + item.dataset.target;
      flipTo(targetId, 'forward');
    });
  });

  // 下一页按钮
  const nextBtns = document.querySelectorAll('.next-page-btn');
  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = 'page-' + btn.dataset.next;
      flipTo(targetId, 'forward');
    });
  });

  // ==================== 彩蛋 ====================
  function showEgg(text) {
    if (!eggLayer || !eggText) return;
    eggText.textContent = text || '— 彩蛋来啦 —';
    eggLayer.classList.add('is-open');
    eggLayer.setAttribute('aria-hidden', 'false');
    setTimeout(() => { hideEgg(); }, 3200);
  }
  function hideEgg() {
    if (!eggLayer) return;
    eggLayer.classList.remove('is-open');
    eggLayer.setAttribute('aria-hidden', 'true');
  }
  if (eggClose) eggClose.addEventListener('click', hideEgg);
  if (eggLayer) {
    eggLayer.addEventListener('click', (e) => {
      if (e.target === eggLayer) hideEgg();
    });
  }

  workCards.forEach((card) => {
    let timer;
    card.addEventListener('mouseenter', () => {
      timer = setTimeout(() => showEgg(card.dataset.egg), 900);
    });
    card.addEventListener('mouseleave', () => clearTimeout(timer));
    card.addEventListener('click', () => {
      if (window.matchMedia('(hover: none)').matches) showEgg(card.dataset.egg);
    });
  });
  hobbyCards.forEach((card) => {
    let timer;
    card.addEventListener('mouseenter', () => {
      timer = setTimeout(() => showEgg(card.dataset.egg), 900);
    });
    card.addEventListener('mouseleave', () => clearTimeout(timer));
    card.addEventListener('click', () => {
      if (window.matchMedia('(hover: none)').matches) showEgg(card.dataset.egg);
    });
  });

  // ==================== 塔罗牌抽取 ====================
  function updateDeckVisual() {
    if (!tarotDeck) return;
    const backs = tarotDeck.querySelectorAll('.tarot-card-back');
    backs.forEach((b, i) => {
      b.style.display = i < deck.length ? 'block' : 'none';
    });
    if (tarotDrawBtn) tarotDrawBtn.disabled = deck.length === 0;
  }

  function createSkillCardHTML(card, startFlipped) {
    return `
      <div class="tarot-card ${startFlipped ? 'is-flipped' : ''}" id="tarot-card-${card.id}">
        <div class="tarot-card-inner">
          <!-- 名称面（默认显示） -->
          <div class="tarot-card-front" style="border-color:${card.color}">
            <span class="tc-icon">${card.icon}</span>
            <h4 class="tc-title">${card.title}</h4>
            <p class="tc-hint">点击翻转查看详情</p>
          </div>
          <!-- 详情面（点击翻转后显示） -->
          <div class="tarot-card-back-face" style="border-color:${card.color}">
            <span class="tc-icon">${card.icon}</span>
            <h4 class="tc-title">${card.title}</h4>
            <div class="tc-desc"><p>${card.desc}</p></div>
            <p class="tc-note">${card.note}</p>
          </div>
        </div>
      </div>
    `;
  }

  function bindCardFlip(cardEl) {
    if (!cardEl) return;
    cardEl.addEventListener('click', () => {
      cardEl.classList.toggle('is-flipped');
    });
  }

  function drawCard() {
    if (deck.length === 0 || !tarotStage) return;

    const idx = Math.floor(Math.random() * deck.length);
    const card = deck.splice(idx, 1)[0];
    drawn.push(card);
    updateDeckVisual();

    // 清空展示区并放入新牌（初始显示名称面，不翻转）
    tarotStage.innerHTML = createSkillCardHTML(card, false);
    const cardEl = tarotStage.querySelector('.tarot-card');

    // 绑定点击翻转事件
    bindCardFlip(cardEl);

    // 飞入动画
    cardEl.classList.add('is-flying');

    // 添加到已抽出列表
    addToDrawnList(card);

    // 显示已抽出区域
    if (tarotDrawnArea) tarotDrawnArea.style.display = 'block';
  }

  function addToDrawnList(card) {
    if (!tarotDrawnList) return;
    const item = document.createElement('div');
    item.className = 'tarot-drawn-item';
    item.innerHTML = `<span class="td-icon">${card.icon}</span><span class="td-title">${card.title}</span>`;
    item.addEventListener('click', () => {
      // 点击已抽出的牌，在舞台重新展示（初始显示名称面）
      if (!tarotStage) return;
      tarotStage.innerHTML = createSkillCardHTML(card, false);
      const el = tarotStage.querySelector('.tarot-card');
      bindCardFlip(el);
      void el.offsetWidth;
      window.scrollTo({ top: tarotStage.offsetTop - 100, behavior: 'smooth' });
    });
    tarotDrawnList.appendChild(item);
  }

  function shuffleDeck() {
    deck = shuffleArray(SKILL_CARDS);
    drawn = [];
    updateDeckVisual();

    // 重置展示区
    if (tarotStage) {
      tarotStage.innerHTML = `
        <div class="tarot-placeholder">
          <span class="placeholder-icon">🐾</span>
          <p class="handwritten">点击「抽一张」<br/>看看能抽到什么技能牌~</p>
        </div>
      `;
    }

    // 清空已抽出列表
    if (tarotDrawnList) tarotDrawnList.innerHTML = '';
    if (tarotDrawnArea) tarotDrawnArea.style.display = 'none';
  }

  if (tarotDrawBtn) {
    tarotDrawBtn.addEventListener('click', drawCard);
  }
  if (tarotShuffleBtn) {
    tarotShuffleBtn.addEventListener('click', shuffleDeck);
  }

  // 初始化牌堆显示
  updateDeckVisual();

  // ==================== 键盘 & 页面恢复 ====================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideEgg();
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      pages.forEach((p) => {
        if (p.id !== 'page-home') p.classList.remove('is-active', 'is-flip-in', 'is-flip-out', 'flip-out-back');
        else p.classList.add('is-active');
      });
      currentPageId = 'page-home';
    }
  });

  if (homePage) homePage.classList.add('is-active');
})();
