import { Router } from 'express';
import * as pointController from '../controllers/point.controller.js';

const router = Router();

/**
 * @openapi
 * /api/studies/{studyId}/points/history:
 *   post:
 *     summary: 포인트 이력 생성 + 누적 포인트 업데이트
 *     tags:
 *       - Point
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
 *               - point
 *             properties:
 *               point:
 *                 type: integer
 *                 description: 적립(+) 또는 차감(-)할 포인트 값
 *           example:
 *             point: 10
 *     responses:
 *       201:
 *         description: 생성된 포인트 이력과 최신 누적 포인트 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: object
 *                   description: 새로 생성된 포인트 이력 레코드 (POINT_HISTORY)
 *                   properties:
 *                     POINT_ID:
 *                       type: integer
 *                     STUDY_ID:
 *                       type: integer
 *                     POINT:
 *                       type: integer
 *                     REG_DATE:
 *                       type: string
 *                       format: date-time
 *                     UPT_DATE:
 *                       type: string
 *                       format: date-time
 *                 master:
 *                   type: object
 *                   description: 업데이트된 포인트 마스터 정보 (POINT_MASTER)
 *                   properties:
 *                     TOTAL_POINT_ID:
 *                       type: integer
 *                     STUDY_ID:
 *                       type: integer
 *                     TOTAL_POINT:
 *                       type: integer
 *             example:
 *               history:
 *                 POINT_ID: 15
 *                 STUDY_ID: 1
 *                 POINT: 10
 *                 REG_DATE: "2025-12-02T11:30:00.000Z"
 *                 UPT_DATE: "2025-12-02T11:30:00.000Z"
 *               master:
 *                 TOTAL_POINT_ID: 3
 *                 STUDY_ID: 1
 *                 TOTAL_POINT: 120
 *       400:
 *         description: point 값이 없거나 숫자가 아님
 *       404:
 *         description: 존재하지 않는 스터디
 *       500:
 *         description: 서버 에러
 */

/**
 * @openapi
 * /api/studies/{studyId}/points:
 *   get:
 *     summary: 누적 포인트 + 포인트 이력 목록 조회
 *     tags:
 *       - Point
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 스터디 ID
 *     responses:
 *       200:
 *         description: 누적 포인트와 이력 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPoint:
 *                   type: integer
 *                   description: 현재까지의 누적 포인트 (없으면 0)
 *                 history:
 *                   type: array
 *                   description: 포인트 이력 목록 (최신순)
 *                   items:
 *                     type: object
 *                     properties:
 *                       POINT_ID:
 *                         type: integer
 *                       STUDY_ID:
 *                         type: integer
 *                       POINT:
 *                         type: integer
 *                       REG_DATE:
 *                         type: string
 *                         format: date-time
 *                       UPT_DATE:
 *                         type: string
 *                         format: date-time
 *             example:
 *               totalPoint: 120
 *               history:
 *                 - POINT_ID: 15
 *                   STUDY_ID: 1
 *                   POINT: 10
 *                   REG_DATE: "2025-12-02T11:30:00.000Z"
 *                   UPT_DATE: "2025-12-02T11:30:00.000Z"
 *                 - POINT_ID: 12
 *                   STUDY_ID: 1
 *                   POINT: 50
 *                   REG_DATE: "2025-12-01T09:10:00.000Z"
 *                   UPT_DATE: "2025-12-01T09:10:00.000Z"
 *       404:
 *         description: 존재하지 않는 스터디
 *       500:
 *         description: 서버 에러
 */

router.post('/:studyId/points/history', pointController.createPointHistory);
router.get('/:studyId/points', pointController.getPointSummary);

export default router;
