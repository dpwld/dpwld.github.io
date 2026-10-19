# 정예지 포트폴리오

금융 실무, 업무 자동화와 AI 시스템 구축, 연구 프로젝트를 소개하는 개인 포트폴리오입니다.

**[포트폴리오 보기](https://dpwld.github.io/)** · [GitHub 프로필](https://github.com/dpwld) · [LinkedIn](https://www.linkedin.com/in/yejijeong1204/)

## 살펴보기

- [AI와 데이터 프로젝트](https://dpwld.github.io/#projects): 사내 AI 업무 시스템, job-scout, 연구 파이프라인과 평가 경험
- [기획과 디자인](https://dpwld.github.io/#works): 서비스 기획과 사용자 경험 설계
- [기술과 자격](https://dpwld.github.io/#skills)
- [경력](https://dpwld.github.io/#cv)

## 구성

정적 HTML·CSS와 브라우저 JavaScript로 구성하며 GitHub Pages에서 제공합니다.

접속할 때 비밀번호 입력 화면을 표시합니다. 이는 브라우저에서 동작하는 간단한
진입 장치이며, 서버 인증이나 파일 접근 보호가 아닙니다. 공개 저장소의 소스와
자료 주소는 직접 열 수 있으므로 민감한 자료를 보호하는 용도로 사용하지 않습니다.

| 경로 | 내용 |
| --- | --- |
| `index.html` | 프로젝트 소개와 경력 |
| `css/` | 스타일 |
| `js/` | 비밀번호 입력 화면, 내비게이션·소개 애니메이션, 대화상자·이미지 뷰어, 스크롤 표시 효과 |
| `assets/` | 이미지 등 포트폴리오 자료 |
| `demo/` | 프로젝트 데모 |
| `docs/` | 프로젝트 문서 |
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
