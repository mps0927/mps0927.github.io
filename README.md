# 이재우

[포트폴리오](https://mps0927.github.io/) · [블로그](https://mps0927.github.io/blog/) · [내용 수정 방법](EDITING.md)

프로젝트, CTF, 논문, 학력·교육 이력 정리.

## 내용 수정

수정할 문서를 열고 연필 아이콘 → 글 수정 → **Commit changes…**로 저장. GitHub Actions에서 Jekyll 빌드·배포 자동 실행.

| 내용 | 문서 |
| --- | --- |
| 소개·연락처 | [index.md](index.md) |
| 프로젝트 | [_projects](_projects) |
| CTF | [_ctf](_ctf) |
| 논문 | [_papers](_papers) |
| 학력·교육 | [_education](_education) |
| 활동·자격 | [_activities](_activities) |
| 블로그 글 | [_posts](_posts) |

파일 위쪽 `---` 사이에는 제목·기간·순서, 아래에는 Markdown 본문 작성. 자세한 예시는 [작성 안내](EDITING.md) 참고.

## 구성

- Jekyll + Markdown + GitHub Actions + GitHub Pages.
- `_layouts`, `_includes`: 화면 구성.
- `styles.css`: 포트폴리오 디자인.
- `content.css`: Markdown 본문·블로그 스타일.
- `.github/workflows/pages.yml`: 빌드, 링크 검사, 배포.

## 로컬 미리보기

Ruby와 Bundler가 설치된 환경에서 실행.

```sh
bundle install
bundle exec jekyll serve
```

브라우저에서 `http://localhost:4000` 확인. GitHub 웹에서 글만 수정할 때는 로컬 설치 불필요.

## 변경 이력

- `250a2ba`: 이전 문서 편집기 도입.
- `5b4da36`: 포트폴리오 디자인 변경. `styles.css`만 수정한 커밋.
- Jekyll 전환은 디자인과 별도 커밋. 디자인만 되돌릴 때 `git revert 5b4da36` 사용.

Jekyll 전환 전체를 되돌릴 경우 해당 커밋을 되돌리고, 저장소 **Settings → Pages → Source**를 **Deploy from a branch / main / root**로 복원.
