# Backend — 공부의 숲 API

Express + Prisma + MySQL 기반 REST API  
스터디·습관·집중·포인트·이모지 도메인

> monorepo: `forest-of-study/backend` · 포트폴리오 담당 범위 문서

---

## 1. Live Demo & API Docs

| | URL |
|--|-----|
| **API Base** | https://beginner-project-be.onrender.com |
| **Swagger UI** | https://beginner-project-be.onrender.com/api-docs |
| **Health** | `GET /api/health` (로컬·배포 동일 패턴) |
| **로컬** | http://localhost:3000 |

---

## 2. 본인 담당 범위

**김명환 · Backend Lead (주 담당)**

| 도메인 / 영역 | 본인 작업 | 비고 |
|---------------|-----------|------|
| **Study** | CRUD, 목록 필터·정렬·페이지네이션, 비밀번호 검증 API | |
| **Point** | 지급/차감, `$transaction`으로 HISTORY·MASTER 동기 | |
| **Emoji** | CODE(hex) 기반 저장·카운트, Unicode→Code 통일 | |
| **Swagger / README** | 전역 API 명세, 팀 연동용 문서 | |
| **인프라·공통** | 4계층 구조, CORS, bcrypt+PEPPER, Logtail, PR 템플릿 | |
| **Habit / Focus / JWT Guard** | — | 팀원(`wanderingsunbi` 등) 담당, 리드로 merge·연동 |

---

## 3. 아키텍처 & 요청 흐름

```
Client (Vite FE)
    │  axios  Authorization: Bearer (studyId별, verify-password 후)
    ▼
Express
    ├── routes/          ← URL·Swagger 태그
    ├── controllers/     ← req/res, status code
    ├── services/        ← 비즈니스 규칙 (주차, 포인트, emoji code)
    └── repositories/    ← Prisma 쿼리
            ▼
        MySQL (Prisma)
```

**대표 흐름 — 스터디 비밀번호 보호**

1. `POST /api/studies/{id}/verify-password` → JWT 발급  
2. 이후 `PATCH /api/studies/{id}`, `/habits/*`, `/focus/*` 등에 Bearer 첨부  
3. 응답 DTO에서 `PASSWORD` 필드 **항상 제외**

**대표 흐름 — 포인트 (Focus 등)**

1. `POST /api/studies/{id}/focus` → service  
2. `point.repository`에서 **`$transaction`**: `POINT_HISTORY` insert + `POINT_MASTER` upsert  
3. 한 요청 안에서 잔액·이력 불일치 방지

---

## 4. 기술 스택

| | |
|--|--|
| Runtime | Node.js, Express |
| ORM | Prisma, MySQL |
| Auth | JWT (study scope), bcrypt + **PEPPER** |
| Docs | Swagger (`/api-docs`) |
| Log | Winston + Logtail (선택 env) |

---

## 5. API 구조 (요약)

| 영역 | 기능 |
|------|------|
| **Study** | 생성·조회·수정·삭제, 비밀번호 검증, 목록 검색/정렬 |
| **Habit** | 주차(`WEEK_NUM`)별 습관, 오늘 체크 |
| **Focus** | 집중 기록 + 포인트 자동 지급 |
| **Point** | 이력·잔액 |
| **Emoji** | `(STUDY_ID, CODE)` 단위 카운트 |

상세 스키마·예시 body → **Swagger**

### 공통 에러

```json
{ "message": "에러 설명" }
```

| 코드 | 의미 |
|------|------|
| 400 | 검증 실패 |
| 401 | 비밀번호 불일치 |
| 403 | 다른 스터디 자원 |
| 404 | 리소스 없음 |

### 도메인 규칙 (FE 연동 필수)

- **Habit**: 월요일 기준 `WEEK_NUM`, 요일 boolean (`MON`…`SUN`)  
- **Emoji**: body `{ "code": "1F923" }` — **hex CODE** (Unicode 문자 직접 저장 X)  
- **Study password**: 생성 시 bcrypt(+PEPPER) 해싱, API 응답에 password 미포함  

---

## 6. 실행 방법

### 환경 변수 (`.env` — `.env.example` 참고)

```env
DATABASE_URL=mysql://...
PEPPER_SECRET=...
JWT_SECRET=...
CORS_ORIGIN=http://localhost:5173
LOGTAIL_TOKEN=...          # 선택
```

### 로컬

```bash
npm install
npx prisma generate
# DB 준비 후
npm run dev
```

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (기본 3000) |
| Swagger | http://localhost:3000/api-docs |

---

## 7. 기술적 의사결정 (요약)

| 주제 | 선택 | 이유 |
|------|------|------|
| 계층 구조 | Route → Controller → Service → Repository | 6인 병렬 시 책임 분리·PR 리뷰 용이 |
| API 계약 | Swagger + README | FE 해석 차이·CORS 지연 감소 |
| 비밀번호 | bcrypt + **PEPPER** (env) | DB 유출 시 pepper 없이는 rainbow table 공격 난이도 상승 |
| Emoji 저장 | **CODE(hex)** 통일 | Unicode/CODE 혼용 시 카운트·조회 불일치 |
| 포인트 | Prisma **`$transaction`** | HISTORY만 쌓이거나 MASTER만 바뀌는 split 방지 |
| CORS | `CORS_ORIGIN` env 단일화 | Vite port·Vercel URL 변경 시 코드 수정 최소화 |
| 로그 | Logtail (선택) | Render 배포 환경에서 원인 추적 |

---

## 8. 트러블슈팅 (대표)

| 증상 | 원인 | 조치 |
|------|------|------|
| FE에서 CORS error | Origin 미등록 / port 불일치 | `CORS_ORIGIN`에 `http://localhost:5173` 또는 Vercel URL |
| Emoji 카운트 안 올라감 | FE unicode vs BE `CODE` 불일치 | FE·BE **hex code** 로 통일 (커밋 2025-12-04) |
| 목록 페이지 깨짐 | pagination 파라미터 불일치 | Study list API hotfix (2025-12-03) |
| habit.route merge 충돌 | PR 중 라우트 중복 | habit.route 정리·hotfix (2025-12-01) |

---

## 9. 개발 리포트 (날짜별 · 본인 커밋 기준)

> Codeit FS 10기 `beginner-project-BE` 작업 이력을 포트폴리오용으로 재구성했습니다.

---

### 2025-11-22 ~ 11-27 · 기반 구축

**상황**  
팀 프로젝트 시작, BE 골격·DB 연동이 필요했습니다.

**검토**  
- 라우트에 로직 직접 작성 vs **4계층 분리**  
- Prisma `db pull` vs schema-first  

**선택 & 이유**  
- **Express 4계층** + Prisma `db pull` → ERD 기반 빠른 출발, 역할별 PR 가능  
- **PR 템플릿**·`.gitignore` → 6명 병렬 시 리뷰 기준 통일  

**결과**  
Config·Base Routes·DB 연동·Study API 초안까지 일정 내 기반 완료.

---

### 2025-11-28 ~ 12-01 · Study / Point / Swagger

**상황**  
메인 목록·정렬·Point API 필요, FE 연동 전 **명세 선행** 필요.

**선택 & 이유**  
- **Point API** + repository에서 **`$transaction`** (HISTORY + MASTER)  
- **Swagger** (~ point.route) — FE가 URL·body 해석 없이 연동  

**트러블슈팅**  
- `habit.route.js` PR merge 시 **라우트 중복** → hotfix로 정리  

**결과**  
Study·Point 도메인 Swagger 기준 연동 가능 상태.

---

### 2025-12-02 · Emoji API · CORS · README

**상황**  
Emoji 도메인 추가, 로컬 FE(Vite 5173/5174)와 **CORS 반복 실패**.

**검토**  
- CORS를 코드에 하드코딩 vs **`CORS_ORIGIN` env**  
- Emoji 필드: unicode 문자 vs **CODE**  

**선택 & 이유**  
- **env CORS** — 배포·로컬 port 변경 시 재배포 없이 수정  
- **emoji-api 영역** + Swagger 1·2차 정리  
- **팀 README** — Base URL·도메인 규칙 문서화  

**결과**  
로컬 FE↔BE 통신 안정화, Emoji API Swagger 반영.

---

### 2025-12-03 · Study Pagination Hotfix

**상황**  
목록 페이지네이션 파라미터 불일치로 목록 깨짐.

**조치**  
Study pagination hotfix.

**결과**  
메인 목록·더보기 FE 연동 정상화.

---

### 2025-12-04 · Emoji Unicode → CODE

**상황**  
Unicode와 CODE 혼용으로 **저장·카운트·상세 표시** 불일치.

**선택 & 이유**  
- DB unique `(STUDY_ID, CODE)`에 맞춰 **hex CODE** 단일 형식  
- FE와 형식 맞춤 (대소문자 정규화는 FE에서 추가)  

**결과**  
클릭→저장→조회 플로우 안정화 (연속 hotfix 커밋).

---

### 2025-12-05 · PEPPER · Logtail · Swagger 정리

**상황**  
스터디 비밀번호 보안 강화, Render 배포 후 **로그 확인** 필요.

**선택 & 이유**  
- **bcrypt + PEPPER** (`PEPPER_SECRET`) — pepper 없이는 offline attack 어렵게  
- **Logtail + Better Stack Uptime** — 프로덕션 에러·다운타임 가시화  
- Swagger v1.0·Emoji 섹션 2차 수정  

**결과**  
보안·운영 가시성·문서 품질 개선, 팀 merge 리드 지속.

---

### 2025-12-06 ~ 12-07 · Swagger 마무리 · 팀 merge

**상황**  
배포 직전 Swagger UI·스키마 마지막 정리, 다수 feature branch merge.

**조치**  
Swagger background image 등 UI 정리, **dev/main merge 리드**.

**결과**  
Vercel·Render 데모 배포 및 팀 통합 완료.

---

## 10. 관련 문서

- monorepo 루트: [../README.md](../README.md)  
- Frontend: [../frontend/README.md](../frontend/README.md)  
- Swagger (운영): https://beginner-project-be.onrender.com/api-docs  
