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
    if (btn.closest('#projectDetail')) restartProjectSlideshow();
    return;
  }
  // 프로젝트 미리보기 → 상세창, 상세창 이미지 → 라이트박스
  var img = e.target.closest('.fig__stage img');
  if (img) {
    e.preventDefault(); e.stopPropagation();
    var item = img.closest('.plist__item');
    if (item) openProjectDetail(item);
    else openLightbox(img.closest('.fig'));
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
  if (fig.closest('#projectDetail')) clearInterval(projectSlideTimer);
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
  if (lbFigure.closest('#projectDetail')) restartProjectSlideshow();
}
lb.addEventListener('click', function (e) {
  var nav = e.target.closest('.lb__nav');
  if (nav) { lbGo(+nav.dataset.d); return; }
  if (e.target.closest('.lb__x') || e.target === lb) closeLightbox();
});

// ── 프로젝트 상세창: 기존 내용과 이미지 5장을 그대로 사용 ──
var projectDetail = document.getElementById('projectDetail');
var projectSource = null;
var projectSlideTimer;
var projectMotion = matchMedia('(prefers-reduced-motion: reduce)');
function restartProjectSlideshow() {
  clearInterval(projectSlideTimer);
  if (!projectDetail.classList.contains('on') || document.hidden || lb.classList.contains('on') || projectMotion.matches) return;
  projectSlideTimer = setInterval(function () {
    figGo(projectDetail.querySelector('.fig'), 1);
  }, 3000);
}
projectMotion.addEventListener('change', restartProjectSlideshow);
document.addEventListener('visibilitychange', restartProjectSlideshow);
function openProjectDetail(item) {
  projectSource = item;
  projectDetail.querySelector('.modal__org').textContent = item.querySelector('.plist__org').textContent;
  projectDetail.querySelector('.modal__title').textContent = item.querySelector('h3').textContent;
  var brief = item.querySelector('.plist__brief').cloneNode(true);
  brief.querySelector('.plist__cue').remove();
  projectDetail.querySelector('.project-modal__brief').textContent = brief.textContent.trim();
  var figure = item.querySelector('.fig').cloneNode(true);
  figure.querySelectorAll('img').forEach(function (img) { img.loading = 'eager'; });
  figure.insertAdjacentHTML('beforeend', '<div class="fig__nav"><button class="fig__btn" data-d="-1" aria-label="이전 이미지">‹</button><span class="fig__cnt"></span><button class="fig__btn" data-d="1" aria-label="다음 이미지">›</button></div><p class="fig__caption" aria-live="polite"></p>');
  figGo(figure, 0);
  projectDetail.querySelector('.project-modal__gallery').replaceChildren(figure);
  var paragraphs = item.querySelectorAll('.plist__more p');
  projectDetail.querySelector('.modal__body').replaceChildren(
    ...Array.from(paragraphs, function (p) { return p.cloneNode(true); })
  );
  var note = item.querySelector('.plist__note');
  projectDetail.querySelector('.project-modal__note').textContent = note ? note.textContent : '';
  projectDetail.classList.add('on');
  projectDetail.scrollTop = 0;
  document.body.classList.add('modal-open');
  projectDetail.querySelector('.modal__x').focus({ preventScroll: true });
  restartProjectSlideshow();
}

// ── 프로젝트 호버: 짧은 요약과 미리보기 ──
document.querySelectorAll('.plist__item').forEach(function (item) {
  var timer;
  var figure = item.querySelector('.fig');
  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function isExpanded() {
    return item.matches(':focus-visible, :has(:focus-visible)') ||
      (matchMedia('(hover: hover) and (pointer: fine)').matches && item.matches(':hover'));
  }
  function updatePreview() {
    clearInterval(timer);
    if (isExpanded()) item.classList.add('is-preview-open');
    if (!isExpanded() || reducedMotion.matches) return;
    timer = setInterval(function () {
      if (!isExpanded()) { clearInterval(timer); return; }
      var bounds = figure.getBoundingClientRect();
      if (document.hidden || document.body.classList.contains('modal-open') || reducedMotion.matches || bounds.bottom <= 0 || bounds.top >= innerHeight) return;
      figGo(figure, 1);
    }, 4000);
  }
  item.tabIndex = 0;
  item.setAttribute('aria-haspopup', 'dialog');
  item.setAttribute('aria-controls', 'projectDetail');
  item.addEventListener('pointerenter', updatePreview);
  item.addEventListener('pointerleave', updatePreview);
  item.addEventListener('focusin', updatePreview);
  item.addEventListener('focusout', function () { setTimeout(updatePreview, 0); });
  item.addEventListener('keydown', function () { setTimeout(updatePreview, 0); });
  reducedMotion.addEventListener('change', updatePreview);
  item.addEventListener('click', function (e) {
    if (e.target.closest('a, button, .fig')) return;
    openProjectDetail(item);
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
  if (m === projectDetail) {
    clearInterval(projectSlideTimer);
    projectSource.focus({ preventScroll: true });
  }
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
  if (e.key === 'Tab' && projectDetail.classList.contains('on')) {
    var controls = projectDetail.querySelectorAll('button, [tabindex="0"]');
    var first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    return;
  }
  var fig = e.target.closest('.fig') || document.querySelector('.modal.on .fig');
  if (fig && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    e.preventDefault();
    figGo(fig, e.key === 'ArrowLeft' ? -1 : 1);
    if (fig.closest('#projectDetail')) restartProjectSlideshow();
    return;
  }
  if (e.key === 'Enter' || e.key === ' ') {
    if (e.target.matches('.fig__stage')) {
      e.preventDefault(); e.stopPropagation();
      var item = e.target.closest('.plist__item');
      if (item) openProjectDetail(item);
      else openLightbox(fig);
      return;
    }
    if (e.target.matches('.plist__item')) {
      e.preventDefault(); e.stopPropagation(); openProjectDetail(e.target); return;
    }
  }
  var card = e.target.closest && e.target.closest('.work[data-work]');
  if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); openModal(card.dataset.work); }
});
