import { readFile, writeFile } from 'node:fs/promises';
import { parseDocument, renderPortfolio, escapeHTML } from '../portfolio.js';
const root = new URL('../', import.meta.url);
const model = parseDocument(await readFile(new URL('portfolio.md', root), 'utf8'));
let html = await readFile(new URL('index.html', root), 'utf8');
html = html.replace(/<body>[\s\S]*<\/body>/, `<body>\n  <a class="skip-link" href="#main">본문으로 이동</a>\n  <p id="load-status" role="status" hidden></p>\n  <div id="portfolio">${renderPortfolio(model)}</div>\n  <noscript><p>최신 내용은 <a href="./portfolio.md">포트폴리오 원문</a>에서 확인할 수 있습니다.</p></noscript>\n</body>`);
html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHTML(model.profile.name)} | 포트폴리오</title>`).replace(/<script src="\.\/app.js" defer><\/script>/, '<script type="module" src="./app.js"></script>');
await writeFile(new URL('index.html', root), html);
console.log('Static fallback built from portfolio.md.');
