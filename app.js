import { parseDocument, renderPortfolio } from './portfolio.js';

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

try {
  const response = await fetch('./portfolio.md', { cache: 'no-store' });
  if (!response.ok) throw new Error('Document unavailable');
  const model = parseDocument(await response.text());
  document.getElementById('portfolio').innerHTML = renderPortfolio(model);
  document.title = model.profile.name + ' | 포트폴리오';
  const anchor = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (anchor) anchor.scrollIntoView({ behavior: 'instant' });
} catch {
  const status = document.getElementById('load-status');
  status.hidden = false;
  status.textContent = '최신 내용을 불러오지 못해 마지막 저장본을 표시하고 있습니다. 새로고침 후 다시 확인해주세요.';
}
