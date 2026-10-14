"""Check generated pages before publishing. Uses the Python standard library."""
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import unquote, urlsplit


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.ids = set()
        self.links = []
        self.lang = None
        self.in_heading = False
        self.heading = ''
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f"Duplicate id: {attrs['id']}"
            self.ids.add(attrs['id'])
        if tag == 'html':
            self.lang = attrs.get('lang')
        if tag == 'h1':
            self.in_heading = True
        for attr in ('href', 'src'):
            if attrs.get(attr):
                self.links.append(attrs[attr])

    def handle_endtag(self, tag):
        if tag == 'h1':
            self.in_heading = False

    def handle_data(self, data):
        if self.in_heading:
            self.heading += data


root = Path(sys.argv[1]).resolve()
pages = {}
for path in root.rglob('*.html'):
    html = path.read_text(encoding='utf8')
    assert '{% ' not in html and '{{ ' not in html, f'Unrendered Liquid in {path}'
    pages[path] = Page(html)
    assert pages[path].lang == 'ko', f'Missing Korean lang in {path}'
    assert 'main' in pages[path].ids, f'Missing main in {path}'

home = root / 'index.html'
assert home in pages
assert pages[home].heading.strip() and '.md' not in pages[home].heading, 'Profile name replaced by a Jekyll filename'
for section in ['projects', 'ctf', 'papers', 'education', 'activities']:
    if any(Path('_' + section).glob('*.md')):
        assert section in pages[home].ids, f'Missing portfolio section: {section}'
assert root / 'blog/index.html' in pages
assert root / 'edit.html' in pages
for path, page in pages.items():
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        target = (root / unquote(url.path).lstrip('/') if url.path.startswith('/') else path.parent / unquote(url.path)) if url.path else path
        target = target.resolve()
        assert target.is_relative_to(root), f'Link outside site: {link}'
        if target.is_dir():
            target /= 'index.html'
        assert target.is_file(), f'Broken link in {path.relative_to(root)}: {link}'
        if url.fragment and target in pages:
            assert unquote(url.fragment) in pages[target].ids, f'Missing anchor in {path}: {link}'

for name in ['README.md', 'EDITING.md', 'Gemfile', 'scripts', 'tests', '_drafts', 'editor.js', 'portfolio.js']:
    assert not (root / name).exists(), f'Source/editor file exposed: {name}'
fixture = root / 'blog/2000/01/01/build-check/index.html'
if '--expect-post' in sys.argv:
    assert fixture in pages, 'New Markdown post did not generate a route'
    html = fixture.read_text(encoding='utf8')
    assert '<h2' in html and '<pre' in html and 'Hello' in html, 'Post Markdown did not render'
    assert '/blog/2000/01/01/build-check/' in (root / 'blog/index.html').read_text(encoding='utf8')
else:
    assert not fixture.exists(), 'Build fixture must never be published'
print(f'Passed: {len(pages)} pages, local links, anchors, unpublished sources, blog rendering.')
