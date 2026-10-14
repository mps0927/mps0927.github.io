# 이재우 | Jaewoo Lee

[포트폴리오](https://mps0927.github.io/) · [내용 편집](https://mps0927.github.io/edit.html)

## 내용 수정

1. **내용 편집**에서 소개·프로젝트·교육 등 원하는 항목 선택.
2. 제목·기간·설명 수정 후 **미리보기**로 확인.
3. **사이트에 반영하기** → **수정한 내용 복사** → **GitHub 저장 화면 열기**.
4. GitHub 파일 내용 안을 클릭하고 전체 선택 후 붙여넣기. **Commit changes**로 저장 확정.

홈페이지 반영까지 보통 1~2분 소요. 작성 중인 초안은 현재 브라우저에 보관되며, GitHub에서 저장해야 공개 반영.

[자세한 수정 안내](./EDITING.md) · [원본 문서](./portfolio.md)

## 파일 구성

| 파일 | 용도 |
| --- | --- |
| `portfolio.md` | 소개·프로젝트·교육 내용 원본 |
| `edit.html`, `editor.js`, `editor.css` | 내용 편집 화면 |
| `portfolio.js` | 문서 읽기·저장·화면 표시 |
| `styles.css` | 공개 홈페이지 디자인 |
| `index.html` | 홈페이지와 마지막 생성본 |
| `app.js` | 최신 문서 불러오기·이메일 복사·이력 저장 |

내용을 고칠 때 HTML 수정은 불필요. 홈페이지가 `portfolio.md`를 읽어 자동 표시.

## 개발·검증

외부 패키지 설치 없이 Node.js로 실행.

```powershell
npm test
npm run build
npm run preview
```

[로컬 미리보기](http://127.0.0.1:4554/) · [로컬 편집기](http://127.0.0.1:4554/edit.html)

`npm run build`는 문서에서 정적 HTML을 재생성하는 명령. 일반적인 내용 편집에는 실행 불필요.

## 디자인 되돌리기

편집 기능과 공개 홈페이지 디자인은 별도 커밋으로 관리. 디자인 변경 커밋은 `styles.css`만 수정하므로 해당 커밋만 되돌리면 내용과 편집 기능 유지.

디자인 변경 이력 확인: `git log --oneline -- styles.css`

`git revert 디자인커밋번호` 실행 후 `git push origin main`으로 반영. `reset --hard`나 강제 푸시는 불필요.
