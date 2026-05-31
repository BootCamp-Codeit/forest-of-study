# 공부의 숲 (Forest of Study)

Codeit 풀스택 10기 팀 프로젝트 · **FE + BE monorepo**  
성장 기록을 공유하는 스터디 플랫폼 (스터디·습관·집중·포인트·이모지)

> 개인 포트폴리오용 fork · Organization: [BootCamp-Codeit](https://github.com/BootCamp-Codeit)

---

## Live Demo

| | URL |
|--|-----|
| **Frontend** | https://beginner-project-fe.vercel.app |
| **Backend API** | https://beginner-project-be.onrender.com |
| **Swagger** | https://beginner-project-be.onrender.com/api-docs |

---

## Repository Layout

| 경로 | 설명 | README |
|------|------|--------|
| `frontend/` | React 19 + Vite | [frontend/README.md](./frontend/README.md) |
| `backend/` | Express + Prisma + MySQL | [backend/README.md](./backend/README.md) |

---

## 본인 역할 (김명환)

| 구분 | 담당 |
|------|------|
| **Backend (주)** | Study·Point·Emoji API, Swagger/README, CORS, bcrypt+PEPPER, 4계층 구조·PR 규칙, 팀 BE 리드 |
| **Frontend (일부)** | Study 생성/수정 화면, Emoji 연동·Emojiservice, 배경/카드 CSS, 필터 검증 |
| **팀** | 6명 · 병렬 FE/BE (Habit·Focus·JWT 등은 팀원 담당 — 각 README 참고) |

---

## Quick Start

```bash
# 1) Backend
cd backend && npm install && npm run dev

# 2) Frontend (다른 터미널)
cd frontend && npm install
# .env: VITE_API_URL=http://localhost:3000/api
npm run dev
```

상세·환경 변수·트러블슈팅은 **frontend/backend README**를 참고하세요.

---

## Repository

| 구분 | Organization / Repo |
|------|---------------------|
| **포트폴리오 (본 repo)** | [BootCamp-Codeit/forest-of-study](https://github.com/BootCamp-Codeit/forest-of-study) — FE+BE monorepo |
| **팀 org (원본)** | [codeit-FS-10th](https://github.com/codeit-FS-10th) |
| **팀 FE (분리)** | [beginner-project-FE](https://github.com/codeit-FS-10th/beginner-project-FE) |
| **팀 BE (분리)** | [beginner-project-BE](https://github.com/codeit-FS-10th/beginner-project-BE) |

Codeit FS 10기 팀 저장소([codeit-FS-10th](https://github.com/codeit-FS-10th))는 FE·BE가 **별도 repo**로 운영되었습니다.  
본 저장소는 팀 산출물을 monorepo로 정리한 **개인 포트폴리오 fork**이며, 커밋·개발 리포트는 **본인 작업분** 기준으로 `frontend/`·`backend/` README 하단에 정리했습니다.
