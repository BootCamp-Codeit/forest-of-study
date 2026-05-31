import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

// KST 현재 시각
export function getNowKST() {
  return dayjs().tz("Asia/Seoul");
}

// KST 기준 주차 계산
export function getWeekNumber() {
  const now = getNowKST();
  const firstDay = now.startOf("year").tz("Asia/Seoul");
  return Math.floor(now.diff(firstDay, "week")) + 1;
}

// KST 기반 요일 필드
export function getDayFieldFromDate(date) {
  return ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][date.day()];
}

// 오늘 요일 (DB 칼럼값 리턴)
export function getTodayField() {
  const dow = getNowKST().day(); // 0 (SUN) ~ 6 (SAT);
  return ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][dow];
}

export function getTimeInfo() {
  const now = getNowKST();
  return {
    now,
    weekNum: getWeekNumber(now),
    todayField: getDayFieldFromDate(now),
  };
}