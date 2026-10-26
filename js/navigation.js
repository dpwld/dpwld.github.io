document.addEventListener('portfolio:unlock', function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var entered = false;
  var enterBtn = document.getElementById('heroEnter');

  function scrollToSel(sel) {
    var target = document.querySelector(sel);
    var navHeight = document.querySelector('.topnav').offsetHeight;
    var y = target.getBoundingClientRect().top + scrollY - navHeight;
    scrollTo({ top: Math.max(0, y), behavior: reduce ? 'instant' : 'smooth' });
  }

  if (enterBtn) enterBtn.addEventListener('click', function () {
    entered = true;
    scrollToSel('#projects');
  });
  document.querySelectorAll('.topnav a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      entered = true;
      scrollToSel(a.getAttribute('href'));
    });
  });

  addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || e.repeat || e.defaultPrevented || entered) return;
    if (document.body.classList.contains('modal-open')) return;
    if (e.target.closest('a, button, input, textarea, select, summary, [tabindex], [contenteditable="true"]')) return;
    if (document.querySelector('.hero').getBoundingClientRect().bottom <= 0) return;
    e.preventDefault();
    entered = true;
    scrollToSel('#projects');
  });
}, { once: true });
