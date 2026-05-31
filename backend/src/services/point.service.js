import * as pointRepo from '../repositories/point.repository.js';
import * as studyRepo from '../repositories/study.repository.js';

export async function createPointHistory(studyId, pointValue) {
  if (!pointValue || isNaN(pointValue)) {
    const err = new Error('point 값이 필요합니다.');
    err.status = 400;
    throw err;
  }

  // 1) 스터디 존재 여부 확인
  const study = await studyRepo.findStudyById(Number(studyId));
  if (!study) {
    const err = new Error('존재하지 않는 스터디입니다.');
    err.status = 404;
    throw err;
  }

  // 2) 포인트 이력 + 누적 포인트 업데이트 (트랜잭션)
  const result = await pointRepo.createPointHistoryWithMasterUpdate(
    Number(studyId),
    Number(pointValue)
  );

  return result;
}

export async function getPointSummary(studyId) {
  const study = await studyRepo.findStudyById(Number(studyId));
  if (!study) {
    const err = new Error('존재하지 않는 스터디입니다.');
    err.status = 404;
    throw err;
  }

  return pointRepo.getPointSummary(Number(studyId));
}
