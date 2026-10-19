(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  var targets = document.querySelectorAll('.plist__item, .work, .stats__item, .skill-row, .cv-item, .section__head, .cred-cols > div');
  targets.forEach(function (el) { el.classList.add('reveal'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(function (el) { io.observe(el); });
})();
