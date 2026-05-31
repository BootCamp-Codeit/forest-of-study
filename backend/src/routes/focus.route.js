import { Router } from 'express';
import * as focusController from '../controllers/focus.controller.js';
import { verifyStudyAuth } from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

/**
 * @openapi
 * /api/studies/{studyId}/focus:
 *   post:
 *     summary: 오늘의 집중 성공 기록 + 포인트 적립
 *     tags:
 *       - Focus
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
 *               - timeSec
 *             properties:
 *               timeSec:
 *                 type: integer
 *                 description: 집중한 시간(초 단위)
 *                 example: 1800
 *     responses:
 *       201:
 *         description: 집중 기록 및 포인트 적립 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "집중 성공!"
 *                 time:
 *                   type: integer
 *                   description: 집중 시간(분 단위, 내림 처리)
 *                   example: 30
 *                 second:
 *                   type: integer
 *                   description: 집중 시간(초 단위)
 *                   example: 1800
 *                 point:
 *                   type: integer
 *                   description: 이번 집중으로 적립된 포인트
 *                   example: 6
 *                 totalPoint:
 *                   type: integer
 *                   description: 적립 후 누적 포인트 (POINT_MASTER.TOTAL_POINT)
 *                   example: 120
 *                 history:
 *                   type: object
 *                   description: 이번에 생성된 포인트 이력 레코드(POINT_HISTORY)
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
 *             example:
 *               message: "집중 성공!"
 *               time: 30
 *               second: 1800
 *               point: 6
 *               totalPoint: 120
 *               history:
 *                 POINT_ID: 10
 *                 STUDY_ID: 1
 *                 POINT: 6
 *                 REG_DATE: "2025-12-02T11:30:00.000Z"
 *                 UPT_DATE: "2025-12-02T11:30:00.000Z"
 *       400:
 *         description: 유효하지 않은 studyId이거나 timeSec이 1 미만인 경우
 *       404:
 *         description: 존재하지 않는 스터디 (포인트 적립 과정에서 발생)
 *       500:
 *         description: 서버 에러
 */

router.use(verifyStudyAuth);
router.post('/', focusController.focusSuccess);

export default router;
