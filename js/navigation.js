(function () {
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

  // 타이핑 인트로 + 첫 화면 게이트 (Enter로 해제 후엔 자유 스크롤)
  var el = document.getElementById('typed');
  var enterBtn = document.getElementById('heroEnter');
  var unlocked = false;
  var NAV = 72;

  function heroMax() {
    var stats = document.querySelector('.stats');
    return stats ? Math.max(0, Math.round(stats.getBoundingClientRect().bottom + scrollY - innerHeight)) : 0;
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
  function unlock() { unlocked = true; }
  function showEnter() { if (enterBtn) enterBtn.classList.add('on'); }

  if (enterBtn) enterBtn.addEventListener('click', function (e) { e.stopPropagation(); unlock(); scrollToSel('#projects'); });
  document.querySelectorAll('.topnav__menu a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); unlock();
      scrollToSel(a.hasAttribute('data-home') ? 'top' : a.getAttribute('href'));
    });
  });
  var logo = document.querySelector('.topnav__logo');
  if (logo) logo.addEventListener('click', function (e) { e.preventDefault(); scrollToSel('top'); });
  var contact = document.getElementById('contactBtn');
  if (contact) contact.addEventListener('click', function (e) { e.preventDefault(); unlock(); scrollToSel('footer'); });

  addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || unlocked) return;
    if (document.querySelector('.modal.on') || document.getElementById('lightbox').classList.contains('on')
        || document.getElementById('cvView').classList.contains('on')) return;
    if (document.getElementById('coGate') && document.getElementById('coGate').classList.contains('on')) return;
    var tg = e.target;
    if (tg && tg !== document.body && (tg.tagName === 'A' || tg.tagName === 'BUTTON' || tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA')) return;
    e.preventDefault(); unlock(); scrollToSel('#projects');
  });

  if (el) {
    var full = el.getAttribute('data-text');
    if (reduce) { el.textContent = full; document.querySelector('.caret').style.display = 'none'; showEnter(); }
    else {
      var i = 0, done = false;
      function finish() { if (done) return; done = true; el.textContent = full; showEnter(); }
      function typeStep() {
        if (done) return;
        if (i <= full.length) { el.textContent = full.slice(0, i); i += 2; setTimeout(typeStep, 24); }
        else { done = true; showEnter(); }
      }
      setTimeout(typeStep, 700);
      addEventListener('click', function (e) { if (!e.target.closest('button, a')) finish(); }, { once: true });
    }
  }

})();
