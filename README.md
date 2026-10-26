# 정예지 포트폴리오

금융 실무, 업무 자동화와 AI 시스템 구축, 연구 프로젝트를 소개하는 개인 포트폴리오입니다.

**[포트폴리오 보기](https://dpwld.github.io/)** · [GitHub 프로필](https://github.com/dpwld) · [LinkedIn](https://www.linkedin.com/in/yejijeong1204/)

## 살펴보기

- [AI와 데이터 프로젝트](https://dpwld.github.io/#projects): Company Finance, Grant Project, CRM Automation, Personal Workspace, Sprint Dashboard와 KAERI·시계열·감성분석 연구
- [기획과 디자인](https://dpwld.github.io/#works): 서비스 기획과 사용자 경험 설계
- [기술과 자격](https://dpwld.github.io/#skills)
- [경력](https://dpwld.github.io/#cv)

## 구성

정적 HTML·CSS와 브라우저 JavaScript로 구성하며 GitHub Pages에서 제공합니다.

프로젝트에 커서를 올리면 짧은 요약과 이미지 미리보기가 표시됩니다. 프로젝트를
클릭하거나 키보드로 선택해 Enter를 누르면 큰 이미지와 전체 설명이 담긴 상세창이
열립니다. 상세창의 이미지 5장은 3초마다 자동 전환되며, 화살표 버튼이나 방향키로도
넘길 수 있습니다. 이미지를 확대하거나 다른 탭을 보는 동안에는 자동 전환을 멈추고,
Esc로 창을 닫을 수 있습니다. 기기의 모션 줄이기 설정도 따릅니다.

접속하면 별도 비밀번호 입력 없이 소개 화면이 표시됩니다. AI·Data 프로젝트 목록은
넓은 화면에서는 번호 순서대로 2열, 좁은 화면에서는 1열로 표시합니다.
첫 표지를 제외한 본문은 데스크톱에서 90% 비율로 표시하되, 콘텐츠 너비와 양옆 여백은 기존 값을 유지합니다.
작은 화면에서는 가독성을 위해 원래 비율을 사용합니다.

| 경로 | 내용 |
| --- | --- |
| `index.html` | 프로젝트 소개와 경력 |
| `css/` | 스타일 |
| `js/` | 내비게이션·소개 애니메이션, 대화상자·이미지 뷰어, 스크롤 표시 효과 |
| `assets/` | 이미지 등 포트폴리오 자료. `proj/highlights/`에 프로젝트별 핵심 이미지 5장 |
| `demo/` | 프로젝트 데모 |
| `docs/` | CV. 프로젝트 PDF는 제공하지 않음 |
| `fonts/` | 글꼴 |
| `tools/protect.py` | 별도 보호 버전 생성 도구. 일반 Pages 실행에는 사용하지 않음 |

## 로컬에서 보기

```bash
git clone https://github.com/dpwld/dpwld.github.io.git
cd dpwld.github.io
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000`을 엽니다.

페이지 내용은 `index.html`, 동작은 `js/`, 스타일은 `css/`에서 수정합니다.
별도 번들링이나 패키지 설치는 필요하지 않습니다. `index.html`의 스크립트 위치와
로드 순서는 각 코드가 참조하는 화면 요소가 생성되는 시점에 맞춰 유지합니다.

`tools/protect.py`는 로컬의 `index.src.html`, `tools/cv_source.pdf`와 `cryptography`
패키지가 필요한 별도 도구입니다. 실행하면 `index.html`과 CV 산출물을 덮어쓰므로
일반 포트폴리오 수정에는 실행하지 않습니다. 원본 파일과 키는 Git에서 제외됩니다.
