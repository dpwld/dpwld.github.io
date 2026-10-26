// 로고는 짧게 튀어 오른 뒤 제자리로 돌아옵니다.
(function () {
  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.tech-pile__item').forEach(function (item) {
    var image = item.querySelector('img');
    function bounce() {
      if (reducedMotion.matches || image.getAnimations().length) return;
      image.animate([
        { transform: 'translateY(0) rotate(0)', offset: 0 },
        { transform: 'translateY(-26px) rotate(7deg)', offset: 0.25 },
        { transform: 'translateY(0) rotate(-3deg)', offset: 0.5 },
        { transform: 'translateY(-10px) rotate(3deg)', offset: 0.7 },
        { transform: 'translateY(0) rotate(0)', offset: 1 }
      ], { duration: 850, easing: 'ease-in-out' });
    }
    item.addEventListener('pointerenter', function (event) {
      if (event.pointerType !== 'touch') bounce();
    });
    item.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'touch') bounce();
    });
  });
})();
