# Frontend — 공부의 숲

React 19 + Vite 기반 SPA  
스터디 생성·상세·습관·집중·이모지 반응 UI

> monorepo: `forest-of-study/frontend` · 포트폴리오 담당 범위 문서

---

## 1. Live Demo & API Docs

| | URL |
|--|-----|
| **Frontend** | https://forest-of-study-mu.vercel.app |
| **Backend API** | https://forest-of-study-kxj4.onrender.com |
| **Swagger** | https://forest-of-study-kxj4.onrender.com/api-docs |
| **로컬 FE** | http://localhost:5173 |
| **로컬 BE** | http://localhost:3000 |

### 데모 체험

모든 시드 스터디(100건) **비밀번호 공통**: `qwert12345!`

---

## 2. 본인 담당 범위

**김명환 · Backend Lead + Frontend 일부**

| 화면 / 영역 | 본인 작업 | 비고 |
|-------------|-----------|------|
| **Study (생성·수정)** | 배경 선택 UI, CSS·미디어쿼리, 입력 Validation | `/study`, `?mode=edit&id=` |
| **Emoji (Detail)** | `Emojiservice`, hex CODE 대문자 정규화, BE 연동 | BE Emoji API와 형식 통일 |
| **Card / Background** | 카드 배경·폰트 색, Study 수정에 따른 Card.jsx | |
| **공통** | Toast import 경로 수정, FE merge 리드 | |
| **Home 목록·검색** | — | 팀원(`kioiti`) 담당 |
| **Habit / Focus** | — | 팀원(`yesong joo`, `wanderingsunbi`) 담당 |
| **Detail 전반 CSS** | — | 팀원 주 담당, 본인은 Emoji·Card 연동 |

---

## 3. 아키텍처 & 요청 흐름

```
Browser (React SPA)
    │  react-router-dom — ?id=studyId 쿼리 기반
    ▼
pages/ (Home, Detail, Study, Habit, Focus)
    │  hooks, components (atoms → organism)
    ▼
src/api/
    ├── axiosInstance.js   baseURL = VITE_API_URL
    └── service/             studyservice, habitservice, focusApi, Emojiservice
            │  Authorization: Bearer (sessionStorage, study별)
            ▼
        Backend REST API
```

**대표 흐름 — 스터디 생성**

1. `/study` → 폼 입력·배경 선택·Validation  
2. `POST /api/studies` (axiosInstance)  
3. 성공 시 Toast + 목록/상세로 이동  

**대표 흐름 — 이모지 반응 (본인 담당)**

1. Detail에서 emoji-picker 선택  
2. `Emojiservice` — unicode → **hex CODE (대문자)** 변환  
3. `POST /api/studies/{id}/emojis` → BE `(STUDY_ID, CODE)` 카운트  

**대표 흐름 — 비밀번호 보호 (팀 공통)**

1. 수정·습관·집중 진입 시 `ModalPwd`  
2. `POST /api/studies/{id}/verify-password` → JWT  
3. `tokenStorage.js` → axios interceptor가 Bearer 자동 첨부  

---

## 4. 기술 스택

| | |
|--|--|
| Framework | React 19 |
| Build | Vite |
| Routing | react-router-dom v7 |
| HTTP | axios (`src/api/axiosInstance.js`) |
| UI | react-toastify, emoji-picker-react |
| Deploy | Vercel (`vercel.json` SPA rewrite) |

---

## 5. 화면·라우트 (요약)

| 경로 | 페이지 | 기능 |
|------|--------|------|
| `/` | Home | 스터디 목록·검색·정렬·더보기 |
| `/detail?id={studyId}` | Detail | 상세·이모지·비밀번호 모달 |
| `/study` | Study | 생성·수정 (**본인 CSS·Validation**) |
| `/habit?id={studyId}` | Habit | 오늘 습관·체크 |
| `/focus?id={studyId}` | Focus | 집중 타이머·포인트 |

### API 모듈 ↔ BE

| FE Service | BE Domain |
|------------|-----------|
| `studyservice.js` | Study, Point |
| `habitservice.js` | Habit |
| `focusApi.js` | Focus |
| `Emojiservice.js` | Emoji (**본인 연동**) |

상세 body·에러 코드 → **Swagger** + [backend/README.md](../backend/README.md)

---

## 6. 실행 · 배포

### 환경 변수

```env
# 로컬
VITE_API_URL=http://localhost:3000/api

# Vercel (Production / Preview)
VITE_API_URL=https://forest-of-study-kxj4.onrender.com/api
```

> `/api`까지 포함. 변경 후 **Redeploy** 필수 (Vite는 빌드 시 env 주입).

### Vercel (monorepo)

| 항목 | 값 |
|------|-----|
| Repository | `BootCamp-Codeit/forest-of-study` |
| **Root Directory** | `frontend` ← repo 루트 `./` 아님 |
| Framework | Vite |
| Build | `npm run build` |
| Output | `dist` |

### 로컬

```bash
npm install
npm run dev
```

BE를 먼저 실행 (`backend/` — `npm run dev`).

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (5173) |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 미리보기 |
| `npm run lint` | ESLint |

### 폴더 구조

```
src/
├── api/axiosInstance.js, service/
├── pages/           Home, Detail, Study, Habit, Focus
├── components/      atoms, molecule, organism
├── hooks/           useEmojiReactions 등
├── utils/           tokenStorage, recentStudy
└── styles/
```

Alias: `@pages`, `@api`, `@molecule`, `@utils` (`vite.config.js`)

---

## 7. 기술적 의사결정 (요약)

| 주제 | 선택 | 이유 |
|------|------|------|
| BE 연동 | `VITE_API_URL` 단일 baseURL | 환경별 URL 변경 시 코드 수정 없음 |
| studyId 전달 | 쿼리 `?id=` | SPA 라우트 단순화, 페이지 간 공통 패턴 |
| Emoji payload | **hex CODE + 대문자** | BE unique key `(STUDY_ID, CODE)`와 일치 |
| 인증 | study scope JWT + sessionStorage | 전역 회원 없이 스터디별 보호 |
| Study UI | 배경 preset + 미디어쿼리 | 모바일·데스크톱 동일 UX |
| Validation | 생성 폼 클라이언트 검증 | BE 400 전 불필요 요청·UX 피드백 감소 |

---

## 8. 트러블슈팅 (대표)

| 증상 | 원인 | 조치 |
|------|------|------|
| CORS / Network Error | FE가 **예전·중단된 BE** URL 호출 | `VITE_API_URL` → Render URL + **Redeploy** |
| POST `/studies` **405** | `VITE_API_URL` **미설정** → Vercel 자신에 POST | env 설정 + Redeploy |
| Network에 `vercel.app/studies` | baseURL undefined | Settings → Environment Variables 확인 |
| Emoji 카운트 안 올라감 | unicode vs hex CODE | `Emojiservice` 대문자 CODE (2025-12-04) |
| Toast 안 뜸 | import 경로 오류 | Toast hotfix (2025-12-04) |
| Study 생성 UI 깨짐 | 배경 그리드·미디어쿼리 | CSS 수정 (2025-12-05~06) |

---

## 9. 개발 리포트 (날짜별 · 본인 커밋 기준)

> Codeit FS 10기 `beginner-project-FE` 작업 이력을 포트폴리오용으로 재구성했습니다.  
> BE 주 담당이므로 FE는 **Study·Emoji·Card** 중심입니다.

---

### 2025-12-02 · Emoji UI 1차

**상황**  
Detail 이모지 탭·피커 연동 필요, merge 충돌로 파일 깨짐.

**검토**  
- emoji-picker-react 직접 POST vs **service 레이어 분리**  
- 상대 경로 fetch vs axios baseURL  

**선택 & 이유**  
- **`Emojiservice` + axiosInstance** — BE Swagger와 동일 baseURL, CORS·env 일관  
- 충돌 파일 제외 후 Emoji 플로우 재구성  

**결과**  
이모지 선택 → API 호출 1차 연동 완료.

---

### 2025-12-03 · Emoji UI 2차

**상황**  
탭 UI·스타일 미완, BE와 데이터 형식 재확인 필요.

**조치**  
Emoji 2차 수정, 이모지 탭 CSS 정리.

**결과**  
Detail 이모지 UX 안정화.

---

### 2025-12-04 · BE 형식 통일 (Emoji · Study)

**상황**  
BE가 **Unicode → hex CODE** 로 통일(동일 날 BE hotfix). FE는 소문자 code 전송으로 카운트 불일치.

**검토**  
- BE에 lowercase 허용 vs **FE에서 대문자 정규화**  

**선택 & 이유**  
- **대문자 CODE** — DB·Swagger 스펙 그대로, BE 수정 최소화  
- **`Emojiservice` 수정** + Study 생성 Validation·배경 CSS  

**트러블슈팅**  
- CARD Background·Toast 경로 hotfix  

**결과**  
Emoji 클릭→저장→조회 end-to-end 정상. Study 생성 폼 UX 개선.

---

### 2025-12-05 · Study 페이지 CSS

**상황**  
배경 이미지 그리드가 해상도별로 깨짐.

**선택 & 이유**  
- **미디어쿼리**로 배경 preset 그리드 조정 — JS 로직 추가 없이 CSS만으로 대응  

**결과**  
Study 생성·수정 화면 모바일/데스크톱 레이아웃 정리.

---

### 2025-12-06 · Background · Card 연동

**상황**  
Study 수정 API 변경에 Card 컴포넌트 표시 불일치.

**조치**  
Background 이미지·Study CSS 수정, **Card.jsx** hotfix.

**결과**  
목록 카드 배경·폰트 색이 선택값과 일치.

---

### 2025-12-07 ~ 12-08 · 통합 merge

**상황**  
JWT·Focus hotfix 등 팀원 브랜ch 다수 merge.

**조치**  
develop/main **PR merge 리드** (Emoji·Study 변경과 충돌 최소화).

**결과**  
Vercel 배포·데모 가능 상태.

---

### 2026-05 · monorepo Vercel 재배포

**상황**  
팀 FE repo → `BootCamp-Codeit/forest-of-study` monorepo, Vercel Root Directory 설정 필요.

**검토**  
- Vercel Team(Pro) vs **Hobby** 개인/팀  
- Root `./` vs **`frontend`**

**선택 & 이유**  
- Root Directory **`frontend`** — monorepo에서 Vite 빌드 경로 분리  
- **`VITE_API_URL`** = Render BE `/api` — env는 **Redeploy**해야 빌드 반영  

**트러블슈팅**  
- 예전 `beginner-project-be` URL → CORS  
- env 비움 → **405** (Vercel SPA에 POST)  
- 해결: `https://forest-of-study-kxj4.onrender.com/api` + Redeploy  

**결과**  
https://forest-of-study-mu.vercel.app 에서 홈·생성·더보기 정상.

---

## 10. 관련 문서

| | 링크 |
|--|------|
| monorepo 루트 | [../README.md](../README.md) |
| Backend | [../backend/README.md](../backend/README.md) |
| Swagger (운영) | https://forest-of-study-kxj4.onrender.com/api-docs |
| **팀 org** | [codeit-FS-10th](https://github.com/codeit-FS-10th) |
| **팀 FE (원본)** | [beginner-project-FE](https://github.com/codeit-FS-10th/beginner-project-FE) |
| **팀 BE (원본)** | [beginner-project-BE](https://github.com/codeit-FS-10th/beginner-project-BE) |
| **포트폴리오 repo** | [BootCamp-Codeit/forest-of-study](https://github.com/BootCamp-Codeit/forest-of-study) |

### 배포 체크리스트

- [x] Vercel Root Directory = `frontend`
- [x] `VITE_API_URL` = `https://forest-of-study-kxj4.onrender.com/api`
- [x] env 변경 후 Redeploy
- [x] `vercel.json` SPA rewrite
- [x] BE health / Swagger / 홈 목록 확인
