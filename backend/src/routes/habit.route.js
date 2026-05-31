import { Router } from 'express';
import * as habitController from '../controllers/habit.controller.js';
import { verifyStudyAuth } from '../middlewares/auth.middleware.js';
const router = Router({ mergeParams: true });

/**
 * @openapi
 * /api/studies/{studyId}/habits:
 *   get:
 *     summary: 해당 스터디의 이번 주차 전체 습관 목록 조회
 *     tags:
 *       - Habit
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 습관 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   HABIT_ID:
 *                     type: integer
 *                   STUDY_ID:
 *                     type: integer
 *                   NAME:
 *                     type: string
 *                   WEEK_NUM:
 *                     type: integer
 *                   SUN:
 *                     type: boolean
 *                   MON:
 *                     type: boolean
 *                   TUE:
 *                     type: boolean
 *                   WED:
 *                     type: boolean
 *                   THU:
 *                     type: boolean
 *                   FRI:
 *                     type: boolean
 *                   SAT:
 *                     type: boolean
 *                   REG_DATE:
 *                     type: string
 *                     format: date-time
 *                   UPT_DATE:
 *                     type: string
 *                     format: date-time
 *             example:
 *               - HABIT_ID: 1
 *                 STUDY_ID: 1
 *                 NAME: "물 2L 마시기"
 *                 WEEK_NUM: 1
 *                 SUN: false
 *                 MON: true
 *                 TUE: false
 *                 WED: false
 *                 THU: false
 *                 FRI: false
 *                 SAT: false
 *                 REG_DATE: "2025-12-01T00:00:00.000Z"
 *                 UPT_DATE: "2025-12-01T00:00:00.000Z"
 *       400:
 *         description: studyId가 유효하지 않음
 *       500:
 *         description: 서버 에러
 *
 *   post:
 *     summary: 이번 주차에 새로운 습관 생성
 *     tags:
 *       - Habit
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "물 2L 마시기"
 *     responses:
 *       201:
 *         description: 습관 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 HABIT_ID:
 *                   type: integer
 *                 STUDY_ID:
 *                   type: integer
 *                 NAME:
 *                   type: string
 *                 WEEK_NUM:
 *                   type: integer
 *                 SUN:
 *                   type: boolean
 *                 MON:
 *                   type: boolean
 *                 TUE:
 *                   type: boolean
 *                 WED:
 *                   type: boolean
 *                 THU:
 *                   type: boolean
 *                 FRI:
 *                   type: boolean
 *                 SAT:
 *                   type: boolean
 *                 REG_DATE:
 *                   type: string
 *                   format: date-time
 *                 UPT_DATE:
 *                   type: string
 *                   format: date-time
 *             example:
 *               HABIT_ID: 3
 *               STUDY_ID: 1
 *               NAME: "운동 30분"
 *               WEEK_NUM: 1
 *               SUN: false
 *               MON: false
 *               TUE: false
 *               WED: false
 *               THU: false
 *               FRI: false
 *               SAT: false
 *               REG_DATE: "2025-12-02T00:00:00.000Z"
 *               UPT_DATE: "2025-12-02T00:00:00.000Z"
 *       400:
 *         description: studyId 또는 name이 유효하지 않음
 *       500:
 *         description: 서버 에러
 */

/**
 * @openapi
 * /api/studies/{studyId}/habits/{habitId}:
 *   patch:
 *     summary: 습관 이름 수정 (동일 이름 전체 일괄 변경)
 *     tags:
 *       - Habit
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "물 1.5L 마시기"
 *     responses:
 *       200:
 *         description: 습관 이름 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   nullable: true
 *                 updated:
 *                   type: integer
 *                   nullable: true
 *                 newName:
 *                   type: string
 *                   nullable: true
 *             examples:
 *               no-change:
 *                 value:
 *                   message: "이전과 동일한 이름"
 *                   updated: 0
 *                   newName: "물 1.5L 마시기"
 *               updated:
 *                 value:
 *                   updated: 3
 *                   newName: "물 1.5L 마시기"
 *       400:
 *         description: 파라미터 또는 name이 유효하지 않음
 *       404:
 *         description: 해당 습관을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *
 *   delete:
 *     summary: 습관 삭제
 *     tags:
 *       - Habit
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 습관 삭제 성공
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
 *         description: 잘못된 파라미터
 *       403:
 *         description: 해당 스터디에 속하지 않은 습관
 *       404:
 *         description: 습관을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @openapi
 * /api/studies/{studyId}/habits/today:
 *   get:
 *     summary: 오늘 날짜 기준 오늘의 습관 목록 조회
 *     tags:
 *       - Habit
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 오늘의 습관 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serverTime:
 *                   type: string
 *                   description: 서버 현재 시간 (YYYY-MM-DD HH:mm:ss)
 *                 weekNum:
 *                   type: integer
 *                 day:
 *                   type: string
 *                   description: SUN~SAT
 *                 habits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       HABIT_ID:
 *                         type: integer
 *                       NAME:
 *                         type: string
 *                       isDone:
 *                         type: boolean
 *             example:
 *               serverTime: "2025-12-02 11:30:00"
 *               weekNum: 1
 *               day: "TUE"
 *               habits:
 *                 - HABIT_ID: 1
 *                   NAME: "물 2L 마시기"
 *                   isDone: false
 *                 - HABIT_ID: 2
 *                   NAME: "30분 독서"
 *                   isDone: true
 *       400:
 *         description: studyId가 유효하지 않음
 *       500:
 *         description: 서버 에러
 */

/**
 * @openapi
 * /api/studies/{studyId}/habits/{habitId}/today:
 *   patch:
 *     summary: 오늘의 습관 완료/취소 토글
 *     tags:
 *       - Habit
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isDone
 *             properties:
 *               isDone:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 오늘의 습관 상태 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 HABIT_ID:
 *                   type: integer
 *                 NAME:
 *                   type: string
 *                 isDone:
 *                   type: boolean
 *             example:
 *               HABIT_ID: 1
 *               NAME: "물 2L 마시기"
 *               isDone: true
 *       400:
 *         description: 파라미터 또는 body가 유효하지 않음
 *       403:
 *         description: 해당 스터디의 습관이 아님
 *       404:
 *         description: 습관을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

router.get('/', habitController.getHabits);

router.use(verifyStudyAuth);// 습관 API 보호
router.get('/today', habitController.getTodayHabits);
router.post('/', habitController.createHabit);
router.patch('/:habitId', habitController.updateHabit);
router.delete('/:habitId', habitController.deleteHabit);
router.patch('/:habitId/today', habitController.toggleTodayHabit);

export default router;
