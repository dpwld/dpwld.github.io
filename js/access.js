// Browser-only entry screen; public source and asset URLs remain accessible.
(function () {
  var gate = document.getElementById('portfolioGate');
  var form = document.getElementById('portfolioGateForm');
  var input = document.getElementById('portfolioPassword');
  var error = document.getElementById('portfolioGateError');

  input.focus();
  input.addEventListener('input', function () {
    input.removeAttribute('aria-invalid');
    error.textContent = '';
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (input.value !== '3427') {
      input.setAttribute('aria-invalid', 'true');
      error.textContent = '비밀번호가 맞지 않습니다. 다시 입력해 주세요.';
      input.focus();
      input.select();
      return;
    }

    document.documentElement.classList.remove('portfolio-locked');
    gate.remove();
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.dispatchEvent(new Event('portfolio:unlock'));
  });
})();
