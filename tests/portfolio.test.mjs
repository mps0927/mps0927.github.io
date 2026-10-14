import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseDocument, serializeDocument, renderPortfolio, emptyItem } from '../portfolio.js';
const source = await readFile(new URL('../portfolio.md', import.meta.url), 'utf8');

test('Every field survives repeated edit/save cycles, including Korean and links', () => {
  const first = parseDocument(source);
  assert.deepEqual(parseDocument(serializeDocument(first)), first);
  assert.equal(serializeDocument(parseDocument(serializeDocument(first))), serializeDocument(first));
  assert.equal(first.projects.length, 3);
  assert.equal(first.education.length, 4);
  assert.equal(first.papers[0].links.length, 2);
});

test('Adding and removing entries survives document serialization', () => {
  const model = parseDocument(source);
  model.projects.push({ ...emptyItem(), title: '테스트 & 분석', bullets: ['역할: 도구 개발', '기술: C++, Python'], detailTitle: '팀 결과', detailBullets: ['한글·특수문자 "보존"'], links: [{ label: '자료', url: 'https://example.com/?a=1&b=2' }] });
  model.education.splice(1, 1);
  assert.deepEqual(parseDocument(serializeDocument(model)), model);
});

test('Edited HTML is rendered as text and cannot create script or attribute injection', () => {
  const model = parseDocument(source);
  model.profile.name = '<img src=x onerror=alert(1)>';
  model.projects[0].bullets.push('역할: <script>alert(1)</script>');
  model.papers[0].links[0].label = '" onmouseover="alert(1)';
  const html = renderPortfolio(model);
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img src=x'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('&quot; onmouseover=&quot;'));
});

test('Unsafe link protocols and malformed email cannot be published', () => {
  const model = parseDocument(source);
  model.papers[0].links[0].url = 'javascript:alert(1)';
  assert.throws(() => serializeDocument(model), /링크/);
  model.papers[0].links[0].url = 'https://example.com';
  model.profile.email = '" onclick="alert(1)';
  assert.throws(() => renderPortfolio(model), /이메일/);
});

test('Unknown document sections fail visibly rather than discarding content', () => {
  assert.throws(() => parseDocument(source + '\n## 잘못된 분류\n중요한 내용\n'), /알 수 없는/);
});

test('Navigation remains valid when optional sections are empty', () => {
  const model = parseDocument(source);
  model.papers = []; model.ctf = []; model.degrees = []; model.education = [];
  const html = renderPortfolio(model);
  assert.ok(!html.includes('href="#ctf"'));
  assert.ok(!html.includes('href="#education"'));
  assert.ok(html.includes('id="projects"'));
  assert.ok(html.includes('href="./edit.html"'));
});
