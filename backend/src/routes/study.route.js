import { Router } from 'express';
import * as studyController from '../controllers/study.controller.js';
import habitRouter from './habit.route.js';
import focusRouter from './focus.route.js';

const router = Router();

/**
 * @openapi
 * /api/studies:
 *   get:
 *     summary: 스터디 목록 조회 (페이지네이션)
 *     tags:
 *       - Study
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호 (1부터 시작)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 한 페이지당 항목 수
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           default: newest
 *         description: '정렬 기준 (예: newest, oldest 등)'
 *     responses:
 *       200:
 *         description: 스터디 목록을 성공적으로 가져옴
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: 전체 스터디 개수
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       STUDY_ID:
 *                         type: integer
 *                       NAME:
 *                         type: string
 *                       NICKNAME:
 *                         type: string
 *                       INTRO:
 *                         type: string
 *                         nullable: true
 *                       IMAGE:
 *                         type: string
 *                         nullable: true
 *                         description: '배경 코드 (예: green, yellow, blue, pink, mouse_tablet, tablet_bottle, diamond, leaf)'
 *                       REG_DATE:
 *                         type: string
 *                         format: date-time
 *                       UPT_DATE:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *             example:
 *               total: 2
 *               page: 1
 *               limit: 10
 *               totalPages: 1
 *               items:
 *                 - STUDY_ID: 1
 *                   NAME: "오늘의 습관 스터디"
 *                   NICKNAME: "킴명"
 *                   INTRO: "열심히 해보자"
 *                   IMAGE: "green"
 *                   REG_DATE: "2025-12-01T10:00:00.000Z"
 *                   UPT_DATE: "2025-12-01T10:00:00.000Z"
 *                 - STUDY_ID: 2
 *                   NAME: "코딩 스터디"
 *                   NICKNAME: "홍길동"
 *                   INTRO: "하루 1커밋"
 *                   IMAGE: "leaf"
 *                   REG_DATE: "2025-12-01T11:00:00.000Z"
 *                   UPT_DATE: null
 *       500:
 *         description: 서버 에러
 *
 *   post:
 *     summary: 스터디 생성
 *     tags:
 *       - Study
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - nickname
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "오늘의 습관 스터디"
 *               nickname:
 *                 type: string
 *                 example: "킴명"
 *               password:
 *                 type: string
 *                 example: "1234"
 *               intro:
 *                 type: string
 *                 example: "열심히 해보자"
 *               image:
 *                 type: string
 *                 nullable: true
 *                 description: '배경 코드 (예: green, yellow, blue, pink, mouse_tablet, tablet_bottle, diamond, leaf)'
 *                 example: "leaf"
 *     responses:
 *       201:
 *         description: 생성된 스터디 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 STUDY_ID:
 *                   type: integer
 *                 NAME:
 *                   type: string
 *                 NICKNAME:
 *                   type: string
 *                 INTRO:
 *                   type: string
 *                   nullable: true
 *                 IMAGE:
 *                   type: string
 *                   nullable: true
 *                   description: '배경 코드 (예: green, yellow, blue, pink, mouse_tablet, tablet_bottle, diamond, leaf)'
 *                 REG_DATE:
 *                   type: string
 *                   format: date-time
 *                 UPT_DATE:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *             example:
 *               STUDY_ID: 1
 *               NAME: "오늘의 습관 스터디"
 *               NICKNAME: "킴명"
 *               INTRO: "열심히 해보자"
 *               IMAGE: "mouse_tablet"
 *               REG_DATE: "2025-12-01T10:00:00.000Z"
 *               UPT_DATE: "2025-12-01T10:00:00.000Z"
 *       400:
 *         description: 잘못된 요청 (name, nickname, password 누락 등)
 *       500:
 *         description: 서버 에러
 */

/**
 * @openapi
 * /api/studies/{studyId}:
 *   get:
 *     summary: 스터디 상세 조회
 *     tags:
 *       - Study
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 스터디 ID
 *     responses:
 *       200:
 *         description: 스터디 상세 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 STUDY_ID:
 *                   type: integer
 *                 NAME:
 *                   type: string
 *                 NICKNAME:
 *                   type: string
 *                 INTRO:
 *                   type: string
 *                   nullable: true
 *                 IMAGE:
 *                   type: string
 *                   nullable: true
 *                   description: '배경 코드 (예: green, yellow, blue, pink, mouse_tablet, tablet_bottle, diamond, leaf)'
 *                 REG_DATE:
 *                   type: string
 *                   format: date-time
 *                 UPT_DATE:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *             example:
 *               STUDY_ID: 1
 *               NAME: "오늘의 습관 스터디"
 *               NICKNAME: "킴명"
 *               INTRO: "열심히 해보자"
 *               IMAGE: "yellow"
 *               REG_DATE: "2025-12-01T10:00:00.000Z"
 *               UPT_DATE: "2025-12-02T09:30:00.000Z"
 *       400:
 *         description: studyId가 유효하지 않음
 *       404:
 *         description: 스터디를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *
 *   patch:
 *     summary: 스터디 정보 수정
 *     tags:
 *       - Study
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 스터디 ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               nickname:
 *                 type: string
 *               password:
 *                 type: string
 *               intro:
 *                 type: string
 *               image:
 *                 type: string
 *                 nullable: true
 *                 description: '배경 코드 (예: green, yellow, blue, pink, mouse_tablet, tablet_bottle, diamond, leaf)'
 *     responses:
 *       200:
 *         description: 수정된 스터디 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 STUDY_ID:
 *                   type: integer
 *                 NAME:
 *                   type: string
 *                 NICKNAME:
 *                   type: string
 *                 INTRO:
 *                   type: string
 *                   nullable: true
 *                 IMAGE:
 *                   type: string
 *                   nullable: true
 *                   description: '배경 코드 (예: green, yellow, blue, pink, mouse_tablet, tablet_bottle, diamond, leaf)'
 *                 REG_DATE:
 *                   type: string
 *                   format: date-time
 *                 UPT_DATE:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *             example:
 *               STUDY_ID: 1
 *               NAME: "오늘의 습관 스터디(수정)"
 *               NICKNAME: "킴명"
 *               INTRO: "열심히 해보자🔥"
 *               IMAGE: "pink"
 *               REG_DATE: "2025-12-01T10:00:00.000Z"
 *               UPT_DATE: "2025-12-02T10:00:00.000Z"
 *       400:
 *         description: 유효한 studyId가 아니거나 수정할 값이 없음
 *       404:
 *         description: 스터디를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *
 *   delete:
 *     summary: 스터디 삭제
 *     tags:
 *       - Study
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 스터디 ID
 *     responses:
 *       200:
 *         description: 스터디 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *             example:
 *               success: true
 *       400:
 *         description: 유효하지 않은 studyId
 *       404:
 *         description: 스터디를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @openapi
 * /api/studies/{studyId}/verify-password:
 *   post:
 *     summary: 스터디 비밀번호 검증
 *     tags:
 *       - Study
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 스터디 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: 비밀번호 검증 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 verified:
 *                   type: boolean
 *             example:
 *               verified: true
 *       400:
 *         description: 잘못된 요청 (password 누락 또는 studyId가 숫자가 아님)
 *       401:
 *         description: 비밀번호 불일치
 *       404:
 *         description: 스터디를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

router.post('/', studyController.createStudy); // 스터디 생성
router.get('/', studyController.getStudy); // 스터디 목록 조회
router.get('/:studyId', studyController.getStudyDetail); // 스터디 단건 조회
router.patch('/:studyId', studyController.updateStudy); // 스터디 수정
router.delete('/:studyId', studyController.deleteStudy); // 스터디 삭제

// 비밀번호 검증 API
router.post('/:studyId/verify-password', studyController.verifyStudyPassword);

// 오늘의 습관 하위 라우트
router.use('/:studyId/habits', habitRouter);

// 오늘의 집중 하위 라우트
router.use('/:studyId/focus', focusRouter);

export default router;
