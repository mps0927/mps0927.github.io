document.addEventListener('click', async event => {
  if (event.target.closest('#print-summary')) window.print();
  const copy = event.target.closest('#copy-email');
  if (!copy) return;
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(copy.dataset.email);
    status.textContent = '복사 완료';
  } catch { status.textContent = '이메일 주소를 선택해 복사해주세요.'; }
});
