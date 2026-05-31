import * as habitRepo from "../repositories/habit.repository.js";
import * as dateUtil from "../utils/date.util.js";

// KST 시간, 주차, 요일값
const { now, weekNum, todayField } = dateUtil.getTimeInfo();

// 전체 습관 목록 조회
export async function getHabits(studyId) {
  const id = Number(studyId);
  if (Number.isNaN(id)) {
    const err = new Error("studyId가 유효하지 않습니다.");
    err.status = 400;
    throw err;
  }

  let habits = await habitRepo.findHabitsByStudyAndWeek(id, weekNum);

  // 습관 없으면 전 주차 습관 복사
  if (habits.length === 0) {
    await habitRepo.cloneHabitsToNextWeek(id, weekNum);
    habits = await habitRepo.findHabitsByStudyAndWeek(id, weekNum);
  }

  return habits;
}

// 습관 생성
export async function createHabit(studyId, payload) {
  const id = Number(studyId);
  if (Number.isNaN(id)) {
    const err = new Error("유효한 studyId가 필요합니다.");
    err.status = 400;
    throw err;
  }

  const { name } = payload;
  if (!name) {
    const err = new Error("name은 필수입니다.");
    err.status = 400;
    throw err;
  }

  return habitRepo.createHabit(id, weekNum, name);
}
// 습관 이름 변경
export async function updateHabit(studyId, habitId, payload) {
  const id = Number(studyId);
  const hid = Number(habitId);

  if (Number.isNaN(id) || Number.isNaN(hid)) {
    const err = new Error("유효한 studyId, habitId가 필요합니다.");
    err.status = 400;
    throw err;
  }

  const habit = await habitRepo.findHabitById(hid);
  if (!habit) {
    const err = new Error("해당 습관을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  const { name: newName } = payload;
  if (!newName) {
    const err = new Error("name은 필수입니다.");
    err.status = 400;
    throw err;
  }

  if (habit.NAME === newName) {
    return { updated: false, message: "이전과 동일한 이름" };
  }

  const result = await habitRepo.updateHabitName(id, habit.NAME, newName);
  return { updated: result.count, newName };
}

// 습관 삭제
export async function deleteHabit(studyId, habitId) {
  const id = Number(studyId);
  const hid = Number(habitId);

  if (Number.isNaN(id) || Number.isNaN(hid)) {
    const err = new Error("유효한 studyId, habitId가 필요합니다.");
    err.status = 400;
    throw err;
  }

  const habit = await habitRepo.findHabitById(hid);
  if (!habit) {
    const err = new Error("해당 습관을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  if (habit.STUDY_ID !== id) {
    const err = new Error("해당 스터디의 습관이 아닙니다.");
    err.status = 403;
    throw err;
  }

  await habitRepo.deleteHabitById(hid);
  return { success: true };
}

// 오늘의 습관 조회
export async function getTodayHabits(studyId) {
  const id = Number(studyId);
  if (Number.isNaN(id)) {
    const err = new Error("studyId가 유효하지 않습니다.");
    err.status = 400;
    throw err;
  }

    let habits = await habitRepo.findHabitsByStudyAndWeek(id, weekNum);

  const result = habits.map(h => ({
    HABIT_ID: h.HABIT_ID,
    NAME: h.NAME,
    isDone: h[todayField],
  }));

  return {
    serverTime: now.format("YYYY-MM-DD HH:mm:ss"),
    weekNum,
    day: todayField,
    habits: result,
  };
}

// 오늘의 습관 체크/해제
export async function toggleTodayHabit(studyId, habitId, isDone) {
  const id = Number(studyId);
  const hid = Number(habitId);

  if (Number.isNaN(id) || Number.isNaN(hid)) {
    const err = new Error("유효한 studyId, habitId가 필요합니다.");
    err.status = 400;
    throw err;
  }

  const habit = await habitRepo.findHabitById(hid);
  if (!habit) {
    const err = new Error("해당 습관이 존재하지 않습니다.");
    err.status = 404;
    throw err;
  }

  if (habit.STUDY_ID !== id) {
    const err = new Error("해당 스터디의 습관이 아닙니다.");
    err.status = 403;
    throw err;
  }

  // 주차 자동 보정
  if (habit.WEEK_NUM !== dateUtil.getWeekNumber()) {
    throw new Error("이전 주차 습관은 수정할 수 없습니다.");
    err.status = 400;
    throw err;
  }

  const updated = await habitRepo.updateToday(hid, todayField, isDone);

  return {
    HABIT_ID: hid,
    NAME: updated.NAME,
    isDone: updated[todayField],
  };
}