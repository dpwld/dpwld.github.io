// ── 이미지 슬라이더: 이벤트 위임 (모달 안에서도 동작) ──
function figGo(fig, d) {
  var imgs = fig.querySelectorAll('.fig__stage img');
  if (imgs.length < 2) return;
  var i = ((+fig.dataset.i || 0) + d + imgs.length) % imgs.length;
  fig.dataset.i = i;
  imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
  var cnt = fig.querySelector('.fig__cnt');
  if (cnt) cnt.textContent = (i + 1) + ' / ' + imgs.length;
  var caption = fig.querySelector('.fig__caption');
  if (caption) caption.textContent = imgs[i].alt;
}
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.fig__btn');
  if (btn) {
    e.preventDefault(); e.stopPropagation();
    figGo(btn.closest('.fig'), +btn.dataset.d);
    return;
  }
  // 이미지 클릭 → 라이트박스
  var img = e.target.closest('.fig__stage img');
  if (img) {
    e.preventDefault(); e.stopPropagation();
    openLightbox(img.closest('.fig'));
  }
});

// ── 라이트박스 ──
var lb = document.getElementById('lightbox');
var lbSrcs = [], lbCaptions = [], lbIdx = 0;
var lbFigure = null;
function lbRender() {
  lb.querySelector('.lb__img').src = lbSrcs[lbIdx];
  lb.querySelector('.lb__img').alt = lbCaptions[lbIdx];
  lb.querySelector('.lb__caption').textContent = lbCaptions[lbIdx];
  lb.querySelector('.lb__cnt').textContent = (lbIdx + 1) + ' / ' + lbSrcs.length;
  lb.querySelectorAll('.lb__nav').forEach(function (b) { b.style.display = lbSrcs.length > 1 ? '' : 'none'; });
}
function lbGo(d) {
  figGo(lbFigure, d);
  lbIdx = +lbFigure.dataset.i;
  lbRender();
}
function openLightbox(fig) {
  lbFigure = fig;
  var item = fig.closest('.plist__item');
  if (item) item.classList.add('previewing');
  lbSrcs = [].map.call(fig.querySelectorAll('.fig__stage img'), function (i) { return i.src; });
  lbCaptions = [].map.call(fig.querySelectorAll('.fig__stage img'), function (i) { return i.alt; });
  lbIdx = +fig.dataset.i || 0;
  lbRender();
  lb.classList.add('on');
  document.body.classList.add('modal-open');
  lb.querySelector('.lb__x').focus();
}
function closeLightbox() {
  lb.classList.remove('on');
  if (!document.querySelector('.modal.on')) document.body.classList.remove('modal-open');
  lbFigure.querySelector('.fig__stage').focus({ preventScroll: true });
  var item = lbFigure.closest('.plist__item');
  if (item) item.classList.remove('previewing');
}
lb.addEventListener('click', function (e) {
  var nav = e.target.closest('.lb__nav');
  if (nav) { lbGo(+nav.dataset.d); return; }
  if (e.target.closest('.lb__x') || e.target === lb) closeLightbox();
});

// ── 프로젝트 상세: 마우스 호버, 터치·키보드 토글 ──
document.querySelectorAll('.plist__item').forEach(function (item) {
  item.tabIndex = 0;
  item.addEventListener('click', function (e) {
    if (e.target.closest('a, button, .fig')) return;
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    item.classList.toggle('open');
  });
});

// ── CV 뷰어 ──
var cvView = document.getElementById('cvView');
var cvBtn = document.getElementById('cvOpen');
if (cvBtn) cvBtn.addEventListener('click', function () {
  var f = cvView.querySelector('.cvview__frame');
  if (!f.dataset.loaded) {
    f.dataset.loaded = '1';
    f.src = 'docs/cv.pdf#toolbar=0&navpanes=0&view=FitH';
  }
  cvView.classList.add('on');
  document.body.classList.add('modal-open');
});
cvView.addEventListener('click', function (e) {
  if (e.target.closest('.cvview__x') || e.target === cvView) {
    cvView.classList.remove('on');
    if (!document.querySelector('.modal.on')) document.body.classList.remove('modal-open');
  }
});

// ── 웍스 모달: 이벤트 위임 ──
function openModal(n) {
  var m = document.getElementById('modal-' + n);
  if (!m) return;
  m.classList.add('on');
  document.body.classList.add('modal-open');
  var x = m.querySelector('.modal__x'); if (x) x.focus();
}
function closeModal(m) {
  m.classList.remove('on');
  if (!lb.classList.contains('on')) document.body.classList.remove('modal-open');
}
document.addEventListener('click', function (e) {
  var card = e.target.closest('.work[data-work]');
  if (card) { openModal(card.dataset.work); return; }
  if (e.target.closest('.modal__x')) { closeModal(e.target.closest('.modal')); return; }
  var m = e.target.closest('.modal');
  if (m && e.target === m) closeModal(m);
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (lb.classList.contains('on')) { closeLightbox(); return; }
    if (cvView.classList.contains('on')) { cvView.classList.remove('on'); document.body.classList.remove('modal-open'); return; }
    document.querySelectorAll('.modal.on').forEach(closeModal);
    return;
  }
  if (lb.classList.contains('on')) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      lbGo(e.key === 'ArrowLeft' ? -1 : 1);
      return;
    }
    if (e.key === 'Tab') {
      var buttons = [].filter.call(lb.querySelectorAll('button'), function (b) { return b.style.display !== 'none'; });
      var first = buttons[0], last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    return;
  }
  if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
  var fig = e.target.closest('.fig') || document.querySelector('.modal.on .fig');
  if (fig && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    e.preventDefault();
    figGo(fig, e.key === 'ArrowLeft' ? -1 : 1);
    return;
  }
  if (e.key === 'Enter' || e.key === ' ') {
    if (e.target.matches('.fig__stage')) {
      e.preventDefault(); e.stopPropagation(); openLightbox(fig); return;
    }
    if (e.target.matches('.plist__item')) {
      e.preventDefault(); e.stopPropagation(); e.target.classList.toggle('open'); return;
    }
  }
  var card = e.target.closest && e.target.closest('.work[data-work]');
  if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); openModal(card.dataset.work); }
});
