# 포트폴리오·블로그 작성 방법

**문서 수정 → Commit changes → 자동 배포** 순서. HTML 편집이나 다른 화면으로 복사·붙여넣기 불필요.

## 포트폴리오 수정

1. 아래에서 문서 선택.
2. GitHub 로그인 후 연필 아이콘 **Edit this file** 선택.
3. 글 수정. **Preview** 탭에서 제목·목록 확인.
4. **Commit changes…** → 변경 내용 입력 → `main` 브랜치에 저장.
5. [Actions](https://github.com/mps0927/mps0927.github.io/actions)에서 **Build and deploy Jekyll** 성공 후 홈페이지 확인.

GitHub의 Preview는 문서 형식 미리보기. 사이트 디자인은 배포 후 홈페이지에서 확인.

| 수정할 내용 | 문서 |
| --- | --- |
| 소개·이름·연락처 | [index.md 수정](https://github.com/mps0927/mps0927.github.io/edit/main/index.md) |
| UDS Fuzzer | [uds-fuzzer.md 수정](https://github.com/mps0927/mps0927.github.io/edit/main/_projects/uds-fuzzer.md) |
| 조향 피드백 | [steer-by-wire.md 수정](https://github.com/mps0927/mps0927.github.io/edit/main/_projects/steer-by-wire.md) |
| AI·Agent 연구 | [embodied-ai.md 수정](https://github.com/mps0927/mps0927.github.io/edit/main/_projects/embodied-ai.md) |
| CTF | [_ctf](https://github.com/mps0927/mps0927.github.io/tree/main/_ctf) |
| 논문 | [_papers](https://github.com/mps0927/mps0927.github.io/tree/main/_papers) |
| 학력·교육 | [_education](https://github.com/mps0927/mps0927.github.io/tree/main/_education) |
| 활동·자격 | [_activities](https://github.com/mps0927/mps0927.github.io/tree/main/_activities) |

## 문서 읽는 법

프로젝트 하나가 파일 하나. 예시:

```markdown
---
title: 프로젝트 제목
order: 4
period: "2026.10 — 현재"
organization: 소속 또는 팀 이름
status: 진행 중
---

- **내용** 프로젝트 설명.
- **역할** 직접 맡은 작업.
- **기술** 사용한 기술.
- **도구** 사용한 도구.
```

- `title`: 제목, `period`: 기간, `organization`: 소속, `status`: 상태.
- `order`: 표시 순서. 작은 숫자가 위에 표시.
- `---` 두 줄과 항목 이름은 유지하고 값·본문 수정.
- 본문은 `-`로 항목 구분. `**글자**`는 굵게 표시.
- 상세 설명이 있는 문서는 `detail_body: |` 아래의 들여쓰기를 유지해 수정.
- 학력·교육의 `category`는 학력 `degree`, 교육·부트캠프 `training` 사용.

항목 추가는 같은 폴더의 기존 문서를 복사해 **Add file → Create new file**로 새 `.md` 파일 생성. 본문·제목·기간 수정 후 `order` 지정. 삭제는 해당 문서의 **Delete file** 사용.

## 블로그 글 추가

1. [_posts 폴더](https://github.com/mps0927/mps0927.github.io/tree/main/_posts)에서 **Add file → Create new file** 선택.
2. 파일 이름을 `2026-10-14-first-post.md`처럼 `연도-월-일-글주소.md` 형식으로 입력. 날짜는 실제 게시할 날짜, 글주소는 짧은 영문 사용.
3. 아래 형식으로 작성 후 **Commit changes…**로 저장.

````markdown
---
title: "글 제목"
description: "글 내용을 한 문장으로 요약"
tags: [보안, CAN]
---

여기부터 본문 작성.

## 소제목

- 첫 번째 내용
- 두 번째 내용

```python
print("Hello")
```
````

글 목록과 개별 글 주소는 자동 생성. 예시 주소는 `/blog/2026/10/14/first-post/`. 아직 오지 않은 날짜의 글은 기본적으로 게시되지 않음.

작성 예시는 [_drafts/post-template.md](_drafts/post-template.md)에도 보관. `_drafts`는 홈페이지에 배포되지 않지만, 이 저장소는 공개 저장소이므로 파일 자체는 공개.

## 이미지 넣기

1. 저장소에서 `assets/images` 폴더에 이미지 업로드. 폴더가 없으면 **Add file → Create new file**에서 `assets/images/.gitkeep` 생성 후 업로드.
2. 본문에 아래처럼 입력.

```markdown
![이미지 설명](/assets/images/example.png)
```

## 잘못 수정했을 때

문서의 **History**에서 이전 내용을 확인해 복원. 배포 실패 시 마지막 성공한 홈페이지는 유지. Actions의 실패 단계에서 오류 확인 후 문서의 `---`, 따옴표, 들여쓰기를 점검.

Windows에서도 GitHub 웹 편집만 이용하면 Ruby나 Jekyll 설치 불필요.
