import prisma from "../config/prisma.client.js";

// 전체 습관 목록 가져오기
export async function findHabitsByStudy(studyId) {
  return prisma.hABIT.findMany({
    where: {
        STUDY_ID: Number(studyId)
    },
    orderBy: {
        HABIT_ID: "asc"
    },
  });
}

// 주차별 습관 조회
export async function findHabitsByStudyAndWeek(studyId, weekNum) {
  const habits = await prisma.hABIT.findMany({
    where: {
        STUDY_ID: Number(studyId),
        WEEK_NUM: weekNum
    },
    orderBy: {
        HABIT_ID: "asc"
    },
  });

  return habits;
}

// 주차 자동 생성용
export async function cloneHabitsToNextWeek(studyId, weekNum) {
  const previousWeek = weekNum - 1;

  const prevHabits = await prisma.hABIT.findMany({
    where: {
        STUDY_ID: Number(studyId),
        WEEK_NUM: previousWeek
    },
  });

  if (prevHabits.length === 0) return [];

  const newHabits = await Promise.all(
    prevHabits.map(h =>
      prisma.hABIT.create({
        data: {
          STUDY_ID: h.STUDY_ID,
          WEEK_NUM: weekNum,
          NAME: h.NAME,
          MON: false,
          TUE: false,
          WED: false,
          THU: false,
          FRI: false,
          SAT: false,
          SUN: false,
          UPT_DATE: new Date(),
        },
      })
    )
  );

  return newHabits;
}

// 습관 생성
export function createHabit(studyId, weekNum, name) {
  return prisma.hABIT.create({
    data: {
      STUDY_ID: Number(studyId),
      WEEK_NUM: weekNum,
      NAME: name,
      UPT_DATE: new Date(),
    },
  });
}

// 습관 개별 조회 (필요할까?)
export function findHabitById(habitId) {
  return prisma.hABIT.findUnique({
    where: { HABIT_ID: Number(habitId) },
  });
}

// 습관 삭제
export function deleteHabitById(habitId) {
  return prisma.hABIT.delete({
    where: { HABIT_ID: Number(habitId) },
  });
}

// 습관 이름 수정
export function updateHabitName(studyId, oldName, newName) {
  return prisma.hABIT.updateMany({
    where: { STUDY_ID: Number(studyId), NAME: oldName },
    data: { NAME: newName, UPT_DATE: new Date() },
  });
}

// 오늘의 습관 체크/해제
export function updateToday(habitId, todayKey, isDone) {
  return prisma.hABIT.update({
    where: { HABIT_ID: Number(habitId) },
    data: {
      [todayKey]: isDone,
      UPT_DATE: new Date(),
    },
  });
}

// 반환값은 기존 컨트롤러/서비스 로직과 동일하게 동작합니다
// 날짜는 repository에서 처리하지 않고 service에서 처리하도록 역할 분리 유지했습니다