import * as focusService from '../services/focus.service.js';

export async function focusSuccess(req, res, next) {
    try {
        const { studyId } = req.params;
        const { timeSec } = req.body; // 초 단위 입력

        const result = await focusService.focusSuccess(studyId, timeSec);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}
