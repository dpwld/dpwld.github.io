document.addEventListener('DOMContentLoaded', function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 실시간 시계 (Seoul)
  var clock = document.getElementById('clock');
  function tick() {
    var now = new Date();
    var h = now.getHours(), m = String(now.getMinutes()).padStart(2, '0');
    var ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    clock.textContent = String(h).padStart(2, '0') + ':' + m + ' ' + ap + ' Seoul';
  }
  if (clock) { tick(); setInterval(tick, 15000); }

  // 터미널 실행 → 자기소개 → Yes/No 선택
  var hero = document.querySelector('.hero');
  var title = hero.querySelector('h1');
  var story = document.getElementById('typed');
  var lines = story.textContent.trim().split('\n');
  var terminal = document.getElementById('introTerminal');
  var run = document.getElementById('introRun');
  var log = document.getElementById('introLog');
  var status = document.getElementById('introStatus');
  var choice = document.getElementById('introChoice');
  var question = document.getElementById('introQuestion');
  var options = choice.querySelectorAll('button');
  var state = 'idle', selected = 0, introTimer;
  title.hidden = true;
  terminal.hidden = false;
  story.parentElement.hidden = true;
  document.getElementById('heroEnter').hidden = true;
  hero.dataset.intro = state;
  history.scrollRestoration = 'manual';
  if (!location.hash || location.hash === '#top') scrollTo({ top: 0, behavior: 'instant' });
  run.focus({ preventScroll: true });

  function selectOption(index, focus) {
    selected = index;
    options.forEach(function (button, i) {
      button.setAttribute('aria-pressed', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    if (focus) options[index].focus({ preventScroll: true });
  }

  function finishIntro() {
    clearTimeout(introTimer);
    state = 'ready';
    hero.dataset.intro = state;
    story.textContent = lines.join('\n');
    story.parentElement.hidden = false;
    terminal.hidden = true;
    title.hidden = false;
    choice.hidden = false;
    question.textContent = "Want to see what I've built?";
    options[0].textContent = 'Yes';
    options[1].textContent = 'No';
    selectOption(0, false);
  }

  function startIntro() {
    if (state !== 'idle') return;
    state = 'running';
    hero.dataset.intro = state;
    run.hidden = true;
    story.textContent = '';
    story.parentElement.hidden = false;
    status.textContent = 'Starting portfolio. Press Enter to skip the animation.';
    if (reduce) { finishIntro(); return; }
    var steps = [
      { code: '> const profile = await loadProfile("yeji");' },
      { code: '> await profile.connect("finance", "engineering");' },
      { code: '> profile.introduce();' }
    ].concat(lines.map(function (line) { return { line: line }; })).concat([
      { code: '> await portfolio.mount();' },
      { code: '[ready] A little context. Now, the work.' }
    ]);
    var index = 0;
    function printNext() {
      if (index === steps.length) { finishIntro(); return; }
      var step = steps[index++];
      var row = document.createElement('span');
      row.className = 'terminal__line';
      row.textContent = step.code || step.line;
      (step.code ? log : story).appendChild(row);
      introTimer = setTimeout(printNext, step.code ? 130 : 1500);
    }
    printNext();
  }

  function showProjects() {
    clearTimeout(introTimer);
    state = 'done';
    unlocked = true;
    scrollToSel('#projects');
    document.querySelector('#projects .section__title').focus({ preventScroll: true });
  }

  function choose(index) {
    if (state !== 'ready' && state !== 'confirm') return;
    if (state === 'ready' && index === 1) {
      state = 'confirm';
      question.textContent = 'Leave before the good part?';
      options[0].textContent = 'No';
      options[1].textContent = 'Also no';
      selectOption(0, false);
      return;
    }
    if (state === 'confirm') {
      question.textContent = "Good call. Let's take a look.";
      state = 'leaving';
      introTimer = setTimeout(showProjects, 1500);
    } else showProjects();
  }

  run.addEventListener('click', startIntro);
  options.forEach(function (button, index) {
    button.addEventListener('click', function () { choose(index); });
    button.addEventListener('focus', function () { selectOption(index, false); });
  });
  document.querySelector('#projects .section__title').tabIndex = -1;
  var unlocked = false;
  var NAV = 72;

  function heroMax() {
    var hero = document.querySelector('.hero');
    return hero ? Math.max(0, Math.round(hero.getBoundingClientRect().bottom + scrollY - innerHeight)) : 0;
  }

  addEventListener('wheel', function (e) {
    if (unlocked || reduce) return;
    if (document.body.classList.contains('modal-open')) return;
    var delta = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
    var hi = heroMax();
    var target = scrollY + delta;
    if (target < 0 || target > hi) {
      e.preventDefault();
      var y = Math.min(Math.max(target, 0), hi);
      if (Math.abs(y - scrollY) > 1) scrollTo({ top: y, behavior: 'instant' });
    }
  }, { passive: false });

  var clamping = false;
  addEventListener('scroll', function () {
    if (unlocked || reduce || clamping) return;
    if (document.body.classList.contains('modal-open')) return;
    var hi = heroMax();
    if (scrollY > hi + 1) {
      clamping = true;
      scrollTo({ top: hi, behavior: 'instant' });
      requestAnimationFrame(function () { clamping = false; });
    }
  }, { passive: true });

  addEventListener('keydown', function (e) {
    if (unlocked) return;
    var keys = [' ', 'PageDown', 'ArrowDown', 'End'];
    if (keys.indexOf(e.key) === -1) return;
    var tg = e.target;
    if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA')) return;
    if (scrollY >= heroMax() - 1) e.preventDefault();
  });

  function scrollToSel(sel) {
    var n = sel === 'top' ? null : document.querySelector(sel);
    var y = n ? Math.round(n.getBoundingClientRect().top + scrollY - NAV) : 0;
    y = Math.min(y, document.documentElement.scrollHeight - innerHeight);
    scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    var target = y;
    setTimeout(function () {
      if (Math.abs(scrollY - target) > 24) scrollTo({ top: target, behavior: 'instant' });
    }, 1000);
  }
  function unlock() { finishIntro(); state = 'done'; unlocked = true; }
  document.querySelectorAll('.topnav__menu a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); unlock();
      if (a.hasAttribute('data-home')) state = 'ready';
      scrollToSel(a.hasAttribute('data-home') ? 'top' : a.getAttribute('href'));
    });
  });
  var logo = document.querySelector('.topnav__logo');
  if (logo) logo.addEventListener('click', function (e) { e.preventDefault(); unlock(); state = 'ready'; scrollToSel('top'); });
  var contact = document.getElementById('contactBtn');
  if (contact) contact.addEventListener('click', function (e) { e.preventDefault(); unlock(); scrollToSel('footer'); });

  addEventListener('keydown', function (e) {
    if (state === 'done' || state === 'leaving' || e.altKey || e.ctrlKey || e.metaKey) return;
    if (hero.getBoundingClientRect().bottom <= NAV) return;
    if (document.querySelector('.modal.on, .lb.on, .cvview.on')) return;
    var target = e.target;
    if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (target.closest('a') && !target.closest('.topnav__logo')) return;
    if (target.closest('button') && target !== run && !choice.contains(target)) return;
    if (e.repeat && ['Enter', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) !== -1) { e.preventDefault(); return; }
    if ((state === 'ready' || state === 'confirm') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      selectOption(e.key === 'ArrowRight' ? 1 : 0, true);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (state === 'idle') startIntro();
      else if (state === 'running') finishIntro();
      else choose(selected);
    }
  });

  // 섹션 링크로 들어온 경우 인트로를 거치지 않고 해당 위치로 이동합니다.
  if (['#projects', '#works', '#skills', '#cv', '#contact'].indexOf(location.hash) !== -1) {
    unlock();
    scrollToSel(location.hash === '#contact' ? 'footer' : location.hash);
  }
}, { once: true });
