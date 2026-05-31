import * as pointService from '../services/point.service.js';

export async function createPointHistory(req, res, next) {
  try {
    const { studyId } = req.params;
    const { point } = req.body;

    const result = await pointService.createPointHistory(studyId, point);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getPointSummary(req, res, next) {
  try {
    const { studyId } = req.params;
    const result = await pointService.getPointSummary(studyId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
