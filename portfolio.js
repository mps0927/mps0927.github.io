// Shared document format for the public page and the plain-text editor.
export const sections = [
  ['projects', '프로젝트'], ['ctf', 'CTF'], ['papers', '논문'],
  ['degrees', '학력'], ['education', '교육·부트캠프'], ['activities', '활동·자격'],
];
const fields = { '기간': 'date', '소속': 'context', '상태': 'status', '구분': 'label', '학점': 'gpa', '결과': 'result' };
const profileFields = { '영문 이름': 'englishName', '이메일': 'email', 'GitHub': 'github' };
export const emptyItem = () => ({ title: '', date: '', context: '', status: '', label: '', gpa: '', result: '', bullets: [], detailTitle: '', detailBullets: [], links: [] });
const blankModel = () => ({ profile: { name: '', englishName: '', email: '', github: '', summary: [], bio: [] }, ...Object.fromEntries(sections.map(([key]) => [key, []])) });
const cleanLine = value => String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
const splitField = line => {
  const index = line.indexOf(':');
  return index < 0 ? null : [line.slice(0, index).trim(), line.slice(index + 1).trim()];
};

export function parseDocument(source) {
  const model = blankModel();
  let section = '', item = null, detail = false;
  for (const [index, original] of source.replace(/^\uFEFF/, '').split(/\r?\n/).entries()) {
    const line = original.trim();
    if (!line) continue;
    if (line.startsWith('# ')) { model.profile.name = line.slice(2).trim(); continue; }
    if (line.startsWith('## ')) {
      const title = line.slice(3).trim();
      section = title === '소개' ? 'summary' : title === '약력' ? 'bio' : sections.find(([, name]) => name === title)?.[0];
      if (!section) throw new Error(`${index + 1}행: 알 수 없는 항목 제목 “${title}”.`);
      item = null; detail = false; continue;
    }
    if (line.startsWith('### ')) {
      if (!Array.isArray(model[section])) throw new Error(`${index + 1}행: 항목을 넣을 분류가 없습니다.`);
      item = { ...emptyItem(), title: line.slice(4).trim() };
      model[section].push(item); detail = false; continue;
    }
    if (line.startsWith('#### ')) {
      if (!item || item.detailTitle) throw new Error(`${index + 1}행: 상세 설명 제목을 확인하세요.`);
      item.detailTitle = line.slice(5).trim(); detail = true; continue;
    }
    if (section === 'summary' || section === 'bio') {
      model.profile[section].push(line.replace(/^[-*] /, '')); continue;
    }
    if (!section) {
      const pair = splitField(line);
      if (!pair || !profileFields[pair[0]]) throw new Error(`${index + 1}행: 소개 위의 항목을 확인하세요.`);
      model.profile[profileFields[pair[0]]] = pair[1]; continue;
    }
    if (!item) throw new Error(`${index + 1}행: 제목(###) 아래에 내용을 적어주세요.`);
    const link = line.match(/^\[([^\]]+)\]\((.*)\)$/);
    if (link) { item.links.push({ label: link[1], url: link[2] }); continue; }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      item[detail ? 'detailBullets' : 'bullets'].push(line.slice(2)); continue;
    }
    const pair = splitField(line);
    if (!detail && pair && fields[pair[0]]) item[fields[pair[0]]] = pair[1];
    else item[detail ? 'detailBullets' : 'bullets'].push(line);
  }
  validateModel(model);
  return model;
}

export function serializeDocument(model) {
  validateModel(model);
  const lines = [`# ${cleanLine(model.profile.name)}`];
  for (const [label, key] of Object.entries(profileFields)) if (model.profile[key]) lines.push(`${label}: ${cleanLine(model.profile[key])}`);
  for (const [key, label] of [['summary', '소개'], ['bio', '약력']]) {
    lines.push('', `## ${label}`, ...model.profile[key].map(value => `- ${cleanLine(value)}`));
  }
  for (const [key, label] of sections) {
    lines.push('', `## ${label}`);
    for (const item of model[key]) {
      lines.push('', `### ${cleanLine(item.title)}`);
      for (const [fieldLabel, field] of Object.entries(fields)) if (item[field]) lines.push(`${fieldLabel}: ${cleanLine(item[field])}`);
      lines.push(...item.bullets.map(value => `- ${cleanLine(value)}`));
      for (const link of item.links) lines.push(`[${cleanLine(link.label)}](${cleanLine(link.url)})`);
      if (item.detailBullets.length || item.detailTitle) {
        lines.push('', `#### ${cleanLine(item.detailTitle) || '상세 설명'}`, ...item.detailBullets.map(value => `- ${cleanLine(value)}`));
      }
    }
  }
  return lines.join('\n') + '\n';
}

export function safeUrl(value, mail = false) {
  try {
    const url = new URL(value);
    return (['https:', 'http:'].includes(url.protocol) || (mail && url.protocol === 'mailto:')) ? url.href : '';
  } catch { return ''; }
}

export function validateModel(model) {
  if (!model?.profile?.name?.trim()) throw new Error('이름을 입력해주세요.');
  const p = model.profile;
  if (p.email && !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(p.email)) throw new Error('이메일 주소를 확인해주세요.');
  if (p.github && !safeUrl(p.github)) throw new Error('GitHub 주소는 https://로 시작하는 주소를 입력해주세요.');
  for (const [key, label] of sections) {
    if (!Array.isArray(model[key])) throw new Error(`${label} 항목을 확인해주세요.`);
    for (const [index, item] of model[key].entries()) {
      if (!item.title.trim()) throw new Error(`${label} ${index + 1}번째 제목을 입력해주세요.`);
      for (const link of item.links) {
        if (!link.label.trim() || /[\[\]\r\n]/.test(link.label) || !safeUrl(link.url)) throw new Error(`${item.title}: 링크 이름과 주소를 확인해주세요.`);
      }
    }
  }
  return true;
}

export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const e = escapeHTML;
function bullet(value) {
  const pair = splitField(value);
  return pair && pair[0].length <= 18 ? `<strong>${e(pair[0])}</strong> ${e(pair[1])}` : e(value);
}
function list(values, extra = '') {
  return values.length ? `<ul class="entry-list ${extra}">${values.map(value => `<li>${bullet(value)}</li>`).join('')}</ul>` : '';
}
const context = text => text ? `<p class="entry-context">${e(text)}</p>` : '';
function heading(item, tag = 'h3', showDate = true) {
  return `<div class="entry-heading"><${tag}>${e(item.title)}</${tag}><div class="entry-meta">${item.status ? `<span class="status">${e(item.status)}</span>` : ''}${showDate && item.date ? `<span class="date">${e(item.date)}</span>` : ''}${item.label ? `<span class="entry-label">${e(item.label)}</span>` : ''}</div></div>`;
}
function details(item) {
  return item.detailBullets.length ? `<details><summary>${e(item.detailTitle || '상세 설명')}</summary><div class="detail-body">${list(item.detailBullets)}</div></details>` : '';
}
function links(item) {
  return item.links.map(link => `<a class="paper-link" href="${e(safeUrl(link.url))}" target="_blank" rel="noopener noreferrer">${e(link.label)} ↗</a>`).join('');
}
function section(id, title, body) {
  return body ? `<section id="${id}" aria-labelledby="${id}-title"><h2 id="${id}-title">${title}</h2>${body}</section>` : '';
}

export function renderPortfolio(model) {
  validateModel(model);
  const p = model.profile;
  const navigation = [['projects', '프로젝트', model.projects.length], ['ctf', 'CTF', model.ctf.length], ['papers', '논문', model.papers.length], ['education', '교육사항', model.degrees.length + model.education.length], ['activities', '활동·자격', model.activities.length]];
  const projects = model.projects.map(item => `<article class="project">${heading(item)}${context(item.context)}${list(item.bullets)}${links(item)}${details(item)}</article>`).join('');
  const ctf = model.ctf.length ? `<div class="table-scroll"><table class="ctf-table"><caption class="sr-only">CTF 대회 성과</caption><thead><tr><th scope="col">연도</th><th scope="col">대회</th><th scope="col">결과</th></tr></thead><tbody>${model.ctf.map(item => `<tr><td class="date">${e(item.date)}</td><td><strong>${e(item.title)}</strong><span class="cell-description">${e(item.context)}</span>${list(item.bullets)}${links(item)}${details(item)}</td><td><span class="result">${e(item.result)}</span></td></tr>`).join('')}</tbody></table></div>` : '';
  const papers = model.papers.map(item => `<article class="paper">${heading(item)}${context(item.context)}${list(item.bullets)}${links(item)}${details(item)}</article>`).join('');
  const degrees = model.degrees.map(item => `<article class="degree">${heading(item, 'h4')}<p>${e(item.context)}</p>${item.gpa ? `<p class="gpa">학점 <strong>${e(item.gpa)}</strong></p>` : ''}${list(item.bullets, 'degree-courses')}${links(item)}${details(item)}</article>`).join('');
  const education = model.education.map(item => `<article class="education-entry"><div class="education-date">${e(item.date)}</div><div>${heading(item, 'h4', false)}${context(item.context)}${list(item.bullets)}${links(item)}${details(item)}</div></article>`).join('');
  const activities = model.activities.map(item => `<article class="activity">${heading(item)}${context(item.context)}${list(item.bullets)}${links(item)}${details(item)}</article>`).join('');
  return `<div class="page" id="top">
    <header class="profile"><div class="profile-heading"><div><h1>${e(p.name)}${p.englishName ? ` <span>${e(p.englishName)}</span>` : ''}</h1>${list(p.summary, 'profile-summary')}</div><button class="print-button" id="print-summary">이력 저장 ↗</button></div>
      <p class="profile-bio">${p.bio.map(e).join('<br>')}</p><div class="profile-links">${p.github ? `<a href="${e(safeUrl(p.github))}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : ''}${p.email ? `<a href="mailto:${e(p.email)}">${e(p.email)}</a><button id="copy-email" data-email="${e(p.email)}" aria-label="이메일 주소 복사">복사</button><span id="copy-status" role="status"></span>` : ''}</div></header>
    <nav class="navigation" aria-label="포트폴리오 목차">${navigation.filter(([, , count]) => count).map(([id, title]) => `<a href="#${id}">${title}</a>`).join('')}</nav>
    <main id="main">${section('projects', '프로젝트', projects)}${section('ctf', 'CTF', ctf)}${section('papers', '논문', papers)}${section('education', '교육사항', `${degrees ? `<h3 class="subheading">학력</h3>${degrees}` : ''}${education ? `<h3 class="subheading course-heading">교육·부트캠프</h3><div class="education-list">${education}</div>` : ''}`)}${section('activities', '활동·자격', activities ? `<div class="activity-list">${activities}</div>` : '')}</main>
    <footer><span>© <span id="year">${new Date().getFullYear()}</span> ${e(p.name)}</span><div class="footer-links"><a href="./edit.html">내용 편집</a> <a href="#top">맨 위로 ↑</a></div></footer>
  </div>`;
}
