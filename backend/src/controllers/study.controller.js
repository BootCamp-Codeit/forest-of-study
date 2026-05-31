import * as studyService from '../services/study.service.js';

export async function createStudy(req, res, next) {
  try {
    console.log('받은 payload:', req.body);
    const result = await studyService.createStudy(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getStudy(req, res, next) {
  try {
    const {
      page = '1',
      limit = '10',
      sort = 'newest',
      search = '',
    } = req.query;

    const allowedSortValues = ['newest', 'oldest', 'point_desc', 'point_asc'];

    const safeSort = allowedSortValues.includes(sort) ? sort : 'newest';

    const pagination = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: safeSort,
      search: String(search || '').trim(),
    };

    const result = await studyService.getStudy(pagination);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getStudyDetail(req, res, next) {
  try {
    const { studyId } = req.params;
    const study = await studyService.getStudyDetail(studyId);
    return res.status(200).json(study);
  } catch (err) {
    next(err);
  }
}

export async function verifyStudyPassword(req, res, next) {
  try {
    const { studyId } = req.params;
    const { password } = req.body;

    const result = await studyService.verifyStudyPassword(studyId, password);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateStudy(req, res, next) {
  try {
    const { studyId } = req.params;
    const payload = req.body;

    const result = await studyService.updateStudy(studyId, payload);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteStudy(req, res, next) {
  try {
    const { studyId } = req.params;
    const result = await studyService.deleteStudy(studyId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
