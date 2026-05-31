# 공부의 숲 (Forest of Study)

Codeit 풀스택 10기 팀 프로젝트 · **FE + BE monorepo**  
성장 기록을 공유하는 스터디 플랫폼 (스터디·습관·집중·포인트·이모지)

> 개인 포트폴리오용 fork · Organization: [BootCamp-Codeit](https://github.com/BootCamp-Codeit)

---

## Live Demo

| | URL |
|--|-----|
| **Frontend (Vercel)** | https://forest-of-study-mu.vercel.app |
| **Backend API (Render)** | https://forest-of-study-kxj4.onrender.com |
| **Swagger** | https://forest-of-study-kxj4.onrender.com/api-docs |
| **Health Check** | https://forest-of-study-kxj4.onrender.com/api/health |

> Render Free tier는 **15분 미사용 시 sleep** → 첫 요청 30~50초 걸릴 수 있습니다.

### 데모 체험 (채용·리뷰용)

| | |
|--|--|
| **스터디 비밀번호 (공통)** | `qwert12345!` |
| **홈 목록** | 시드 **100건** — 더보기·검색·정렬 체험 가능 |
| **체험 가능 기능** | 상세·수정·습관·집중·이모지 (비밀번호 보호 UI) |

---

## Repository Layout

| 경로 | 설명 | README |
|------|------|--------|
| `frontend/` | React 19 + Vite | [frontend/README.md](./frontend/README.md) |
| `backend/` | Express + Prisma + MySQL 호환 DB | [backend/README.md](./backend/README.md) |

---

## 본인 역할 (김명환)

| 구분 | 담당 |
|------|------|
| **Backend (주)** | Study·Point·Emoji API, Swagger/README, CORS, bcrypt+PEPPER, 4계층 구조·PR 규칙, 팀 BE 리드 |
| **Frontend (일부)** | Study 생성/수정 화면, Emoji 연동·Emojiservice, 배경/카드 CSS, 필터 검증 |
| **포트폴리오 (개인)** | monorepo 구성, Render/Vercel 재배포, TiDB 연동, 데모 시드 100건, README·개발 리포트 |
| **팀** | 6명 · 병렬 FE/BE (Habit·Focus·JWT 등은 팀원 담당 — 각 README 참고) |

---

## Quick Start (로컬)

```bash
# 1) Backend
cd backend
cp .env.example .env   # DATABASE_URL, PEPPER_SECRET, JWT_SECRET 입력
npm install && npx prisma generate && npx prisma db push
npm run dev

# 2) Frontend (다른 터미널)
cd frontend
# .env: VITE_API_URL=http://localhost:3000/api
npm install && npm run dev
```

| 로컬 URL | |
|----------|--|
| FE | http://localhost:5173 |
| BE | http://localhost:3000 |
| Swagger | http://localhost:3000/api-docs |

---

## 배포 (monorepo)

팀 원본은 FE·BE **분리 repo** → 포트폴리오는 **단일 monorepo**로 재구성 후 배포했습니다.

### Vercel (Frontend)

| 항목 | 값 |
|------|-----|
| Repository | `BootCamp-Codeit/forest-of-study` |
| **Root Directory** | `frontend` |
| Framework | Vite |
| Build | `npm run build` |
| Output | `dist` |
| **Environment** | `VITE_API_URL=https://forest-of-study-kxj4.onrender.com/api` |

env 변경 후 **Redeploy** 필수 (Vite는 빌드 시점에 env 주입).

### Render (Backend)

| 항목 | 값 |
|------|-----|
| Repository | `BootCamp-Codeit/forest-of-study` |
| **Root Directory** | `backend` |
| Build | `npm install && npx prisma generate && npx prisma db push` |
| Start | `npm start` |
| **Environment** | `DATABASE_URL`, `PEPPER_SECRET`, `JWT_SECRET` |

### Database (TiDB Cloud)

Render Free에는 MySQL이 없어 **[TiDB Cloud Starter](https://tidbcloud.com)** (MySQL 호환, Free) 사용.

- Connection String → Render `DATABASE_URL` (`?sslaccept=strict` 포함)
- **IP Access** → `0.0.0.0/0` (Render outbound IP 대응)

---

## Repository

| 구분 | Organization / Repo |
|------|---------------------|
| **포트폴리오 (본 repo)** | [BootCamp-Codeit/forest-of-study](https://github.com/BootCamp-Codeit/forest-of-study) |
| **팀 org (원본)** | [codeit-FS-10th](https://github.com/codeit-FS-10th) |
| **팀 FE (분리)** | [beginner-project-FE](https://github.com/codeit-FS-10th/beginner-project-FE) |
| **팀 BE (분리)** | [beginner-project-BE](https://github.com/codeit-FS-10th/beginner-project-BE) |

Codeit FS 10기 팀 저장소는 FE·BE **별도 repo**로 운영되었습니다.  
본 저장소는 팀 산출물을 monorepo로 정리한 **개인 포트폴리오 fork**이며, 상세·개발 리포트는 `frontend/`·`backend/` README를 참고하세요.

---

## 포트폴리오 마이그레이션 요약 (2026-05)

| 작업 | 내용 |
|------|------|
| monorepo | `BootCamp-Codeit/forest-of-study` — `frontend/` + `backend/` |
| Vercel | Root Directory `frontend`, `VITE_API_URL` 연동 |
| Render | Root Directory `backend`, TiDB `DATABASE_URL` |
| DB 스키마 | `prisma db push` — 최초 배포 시 테이블 생성 |
| 데모 데이터 | `npm run db:seed` — 스터디 100건, 비밀번호 `qwert12345!` |
| 문서 | README 3종 + 날짜별 개발 리포트 |

---

## 트러블슈팅 (배포)

| 증상 | 원인 | 조치 |
|------|------|------|
| 홈 "불러오는 중…" / CORS | FE가 **예전 BE URL** 호출 | Vercel `VITE_API_URL` → 새 Render URL + Redeploy |
| POST `/studies` **405** | `VITE_API_URL` **미설정** → Vercel 자신에게 요청 | env 설정 후 Redeploy |
| `STUDY table does not exist` | DB 연결만 되고 **스키마 미생성** | Build에 `npx prisma db push` 추가 |
| Render DB 연결 실패 | TiDB IP 미허용 | TiDB IP Access `0.0.0.0/0` |

상세 → [backend/README.md](./backend/README.md) · [frontend/README.md](./frontend/README.md)
