import { sections, emptyItem, parseDocument, serializeDocument, renderPortfolio, escapeHTML as e } from './portfolio.js';

const $ = id => document.getElementById(id);
const draftKey = 'portfolio-editor:mps0927:v1';
const local = ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname);
const sourceURL = 'https://api.github.com/repos/mps0927/mps0927.github.io/contents/portfolio.md?ref=main';
let model, baseDocument, active = 'profile', pendingDraft = null, deleted = null, dirty = false, stored = true;
let preparedDocument = '', verified = false;
const groups = [['profile', '소개·연락처'], ...sections];

function status(message, error = false) {
  $('editor-status').textContent = message;
  $('editor-status').classList.toggle('error', error);
}

async function fetchSource() {
  const response = await fetch(local ? './portfolio.md' : sourceURL, { cache: 'no-store', signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('최신 문서를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
  if (local) return response.text();
  const result = await response.json();
  if (result.encoding !== 'base64') throw new Error('문서 형식을 확인하지 못했습니다.');
  return new TextDecoder().decode(Uint8Array.from(atob(result.content.replace(/\s/g, '')), char => char.charCodeAt(0)));
}

function keepDraft() {
  dirty = true;
  try {
    localStorage.setItem(draftKey, JSON.stringify({ base: baseDocument, model, updated: new Date().toISOString() }));
    stored = true;
    status('이 브라우저에 초안 보관 중 · 공개하려면 ‘사이트에 반영하기’를 눌러주세요.');
  } catch {
    stored = false;
    status('이 브라우저에서는 초안 보관이 제한돼요. 창을 닫기 전에 문서 백업을 받아주세요.', true);
  }
}

function field(path, label, value, { multiline = false, help = '', type = 'text' } = {}) {
  const id = `field-${path.replaceAll('.', '-')}`;
  const content = Array.isArray(value) ? value.join('\n') : (value || '');
  return `<label class="field" for="${id}"><span>${e(label)}${help ? ` <small>${e(help)}</small>` : ''}</span>${multiline ? `<textarea id="${id}" data-path="${path}" data-lines="true" rows="${Math.min(9, Math.max(3, content.split('\n').length + 1))}">${e(content)}</textarea>` : `<input id="${id}" data-path="${path}" type="${type}" value="${e(content)}">`}</label>`;
}

function profileForm() {
  const p = model.profile;
  return `<section class="entry-editor"><div class="field-grid">${field('profile.name', '이름', p.name)}${field('profile.englishName', '영문 이름', p.englishName)}</div>${field('profile.summary', '소개', p.summary, { multiline: true, help: '한 줄에 한 문장. 앞의 -는 자동으로 붙어요.' })}${field('profile.bio', '짧은 약력', p.bio, { multiline: true })}<div class="field-grid">${field('profile.email', '이메일', p.email, { type: 'email' })}${field('profile.github', 'GitHub 주소', p.github, { type: 'url' })}</div></section>`;
}

function itemForm(item, index) {
  const path = `${active}.${index}`;
  const title = `${groups.find(([key]) => key === active)[1]} ${index + 1}`;
  const metadata = `${field(`${path}.date`, '기간', item.date)}${active !== 'ctf' ? field(`${path}.status`, '진행 상태', item.status, { help: '예: 진행 중. 없으면 비워두기.' }) : field(`${path}.result`, '결과', item.result)}`;
  const detail = ['projects', 'papers'].includes(active) || item.detailBullets.length || item.detailTitle;
  return `<section class="entry-editor" data-entry="${index}"><div class="entry-toolbar"><h3>${e(title)}</h3><div class="tools"><button type="button" data-move="${index}" data-direction="-1" aria-label="${e(title)} 위로 이동" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" data-move="${index}" data-direction="1" aria-label="${e(title)} 아래로 이동" ${index === model[active].length - 1 ? 'disabled' : ''}>↓</button><button type="button" data-remove="${index}" aria-label="${e(title)} 삭제">삭제</button></div></div>
    ${field(`${path}.title`, '제목', item.title)}<div class="field-grid">${metadata}</div>${field(`${path}.context`, '소속·설명', item.context)}${active === 'degrees' ? field(`${path}.gpa`, '학점', item.gpa) : ''}${active === 'activities' ? field(`${path}.label`, '구분', item.label, { help: '예: 동아리, 자격' }) : ''}
    ${field(`${path}.bullets`, '내용', item.bullets, { multiline: true, help: '한 줄에 한 항목. 예: 역할: CAN 데이터 분석' })}
    ${detail ? `${field(`${path}.detailTitle`, '펼쳐보기 제목', item.detailTitle, { help: '상세 설명이 필요할 때만 입력' })}${field(`${path}.detailBullets`, '상세 설명', item.detailBullets, { multiline: true })}` : ''}
    <div class="links-label">관련 링크</div>${item.links.map((link, linkIndex) => `<div class="link-row"><input aria-label="${e(title)} 링크 ${linkIndex + 1} 이름" data-path="${path}.links.${linkIndex}.label" value="${e(link.label)}" placeholder="링크 이름"><input aria-label="${e(title)} 링크 ${linkIndex + 1} 주소" data-path="${path}.links.${linkIndex}.url" type="url" value="${e(link.url)}" placeholder="https://"><button type="button" data-remove-link="${index}" data-link="${linkIndex}" aria-label="${e(title)} 링크 ${linkIndex + 1} 삭제">×</button></div>`).join('')}<button type="button" class="subtle-button" data-add-link="${index}">+ 링크 추가</button>
  </section>`;
}

function renderForm() {
  $('editor-nav').innerHTML = groups.map(([key, label]) => `<button type="button" data-group="${key}" ${active === key ? 'aria-current="page"' : ''} ${pendingDraft ? 'disabled' : ''}>${label}</button>`).join('');
  const title = groups.find(([key]) => key === active)[1];
  $('editor-form').innerHTML = `<div class="section-heading"><div><h2>${title}</h2><p>내용 수정 후 상단의 미리보기로 확인하세요.</p></div>${active !== 'profile' ? '<button type="button" data-add>+ 항목 추가</button>' : ''}</div>${active === 'profile' ? profileForm() : model[active].map(itemForm).join('') || '<p class="empty-message">등록된 항목이 없어요. 항목 추가를 눌러 작성하세요.</p>'}`;
  $('editor-form').inert = Boolean(pendingDraft);
  for (const id of ['preview-button', 'publish-button', 'backup-button']) $(id).disabled = Boolean(pendingDraft);
}

function setValue(path, value) {
  const keys = path.split('.');
  const target = keys.slice(0, -1).reduce((object, key) => object[key], model);
  target[keys.at(-1)] = value;
}

function download(text, filename = 'portfolio.md') {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function checkDocument() {
  try { return serializeDocument(model); }
  catch (error) { status(error.message, true); $('editor-status').scrollIntoView({ block: 'center' }); return null; }
}

$('editor-form').addEventListener('submit', event => event.preventDefault());
$('editor-form').addEventListener('input', event => {
  const input = event.target;
  if (!input.dataset.path) return;
  setValue(input.dataset.path, input.dataset.lines ? input.value.split(/\r?\n/).map(line => line.trim().replace(/^[-*] /, '')).filter(Boolean) : input.value);
  keepDraft();
});

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.close) $(button.dataset.close).close();
  if (button.dataset.group) { active = button.dataset.group; renderForm(); }
  if (button.hasAttribute('data-add')) { model[active].push(emptyItem()); keepDraft(); renderForm(); $('editor-form').querySelector('.entry-editor:last-child input').focus(); }
  if (button.hasAttribute('data-remove')) {
    const index = Number(button.dataset.remove);
    deleted = { section: active, index, item: model[active].splice(index, 1)[0] };
    $('undo-banner').hidden = false; keepDraft(); renderForm();
  }
  if (button.hasAttribute('data-move')) {
    const index = Number(button.dataset.move), next = index + Number(button.dataset.direction);
    if (next >= 0 && next < model[active].length) {
      [model[active][index], model[active][next]] = [model[active][next], model[active][index]];
      keepDraft(); renderForm();
    }
  }
  if (button.hasAttribute('data-add-link')) { model[active][Number(button.dataset.addLink)].links.push({ label: '', url: '' }); keepDraft(); renderForm(); }
  if (button.hasAttribute('data-remove-link')) { model[active][Number(button.dataset.removeLink)].links.splice(Number(button.dataset.link), 1); keepDraft(); renderForm(); }
});

$('undo-delete').addEventListener('click', () => {
  if (!deleted) return;
  model[deleted.section].splice(Math.min(deleted.index, model[deleted.section].length), 0, deleted.item);
  active = deleted.section; deleted = null; $('undo-banner').hidden = true; keepDraft(); renderForm();
});

$('preview-button').addEventListener('click', () => {
  if (!checkDocument()) return;
  $('preview-frame').srcdoc = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="${e(new URL('.', location.href).href)}"><link rel="stylesheet" href="./styles.css"></head><body>${renderPortfolio(model)}</body></html>`;
  $('preview-dialog').showModal();
});

$('publish-button').addEventListener('click', async () => {
  preparedDocument = checkDocument();
  if (!preparedDocument) return;
  verified = false; $('copy-document').disabled = true; $('copy-source').value = '';
  $('publish-status').textContent = '다른 곳에서 수정한 내용이 있는지 확인 중…';
  $('publish-dialog').showModal();
  try {
    const current = serializeDocument(parseDocument(await fetchSource()));
    if (current !== baseDocument && current !== preparedDocument) throw new Error('편집 중 원본이 변경됐어요. 초안을 백업한 뒤 새로고침해서 최신 내용을 확인해주세요. 덮어쓰기를 막기 위해 복사를 잠시 멈췄어요.');
    verified = true; $('copy-document').disabled = false; $('copy-source').value = preparedDocument;
    $('publish-status').textContent = '내용 준비 완료. 아직 홈페이지에 반영되지 않았어요.';
  } catch (error) { $('publish-status').textContent = error.message; }
});

$('copy-document').addEventListener('click', async () => {
  if (!verified) return;
  try {
    await navigator.clipboard.writeText(preparedDocument);
    $('publish-status').textContent = '복사 완료. GitHub 저장 화면에서 전체 선택 후 붙여넣어 주세요.';
  } catch {
    $('manual-copy').open = true; $('copy-source').focus(); $('copy-source').select();
    $('publish-status').textContent = '자동 복사가 제한됐어요. 아래 선택된 문서를 직접 복사해주세요.';
  }
});
$('github-save').addEventListener('click', event => { if (!verified) { event.preventDefault(); $('publish-status').textContent = '최신 원문 확인이 끝난 뒤 저장 화면을 열 수 있어요. 안내 내용을 확인해주세요.'; } });
$('select-document').addEventListener('click', () => { $('copy-source').focus(); $('copy-source').select(); });
$('backup-button').addEventListener('click', () => { const text = checkDocument(); if (text) download(text); });

function clearPending() { pendingDraft = null; $('draft-banner').hidden = true; renderForm(); }
$('restore-draft').addEventListener('click', () => { model = pendingDraft.model; clearPending(); keepDraft(); });
$('discard-draft').addEventListener('click', () => { try { localStorage.removeItem(draftKey); } catch {} clearPending(); status('최신 원문으로 시작. 작성한 내용은 이 브라우저에 보관돼요.'); });
$('download-draft').addEventListener('click', () => {
  try { download(serializeDocument(pendingDraft.model), 'portfolio-draft.md'); }
  catch { download(JSON.stringify(pendingDraft, null, 2), 'portfolio-draft.json'); }
});
window.addEventListener('beforeunload', event => { if (dirty && !stored) { event.preventDefault(); event.returnValue = ''; } });

try {
  model = parseDocument(await fetchSource());
  baseDocument = serializeDocument(model);
  let draft;
  try { draft = JSON.parse(localStorage.getItem(draftKey)); } catch { stored = false; }
  if (draft?.base && draft.model?.profile && sections.every(([key]) => Array.isArray(draft.model[key]))) {
    let same = false;
    try { same = serializeDocument(draft.model) === baseDocument; } catch {}
    if (same) { try { localStorage.removeItem(draftKey); } catch {} }
    else {
      pendingDraft = draft;
      const conflict = draft.base !== baseDocument;
      $('draft-banner').hidden = false;
      $('draft-message').textContent = conflict ? '이전 초안 이후 원문이 바뀌었어요. 초안을 백업한 뒤 최신 원문에서 새로 시작해주세요.' : '이 브라우저에 작성하던 초안이 있어요. 이어서 편집할 수 있습니다.';
      $('restore-draft').hidden = conflict;
    }
  }
  renderForm();
  status(stored ? '최신 내용 불러옴 · 작성한 내용은 이 브라우저에만 보관돼요.' : '최신 내용 불러옴 · 이 브라우저에서는 초안 보관이 제한될 수 있어요.');
} catch (error) {
  status(error.message, true);
  $('editor-form').innerHTML = '<p>새로고침하거나 왼쪽의 ‘문서 직접 열기’를 이용해주세요.</p>';
}
