import * as focusRepo from '../repositories/focus.repository.js';
import * as pointService from '../services/point.service.js';

// 포인트 계산 함수
function calcPoint(sec) {
  const base = 3; //기본 성공수당
  const extra = Math.floor(sec / 600); // 10분당 1점

  return base + extra;
}

export async function focusSuccess(studyId, timeSec) {
  const id = Number(studyId);
  if (!id) {
    const err = new Error('유효한 studyId가 필요합니다.');
    err.status = 400;
    throw err;
  }

  const sec = Number(timeSec);
  if (!sec || sec <= 0) {
    const err = new Error('timeSec은 1 이상이어야 합니다.');
    err.status = 400;
    throw err;
  }

  const min = Math.floor(sec / 60);

  // 집중 기록 저장
  await focusRepo.createFocus(id, sec);

  const point = calcPoint(sec);

  const pointResult = await pointService.createPointHistory(id, point); // 포인트 연동

  return {
    message: '집중 성공!',
    time: min,
    second: sec,
    point,
    totalPoint: pointResult.master.TOTAL_POINT,
    history: pointResult.history,
  };
}
