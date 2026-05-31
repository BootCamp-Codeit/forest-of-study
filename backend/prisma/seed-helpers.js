import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/** @returns {{ weekNum: number, todayField: string }} */
export function getSeedTimeInfo() {
  const now = dayjs().tz('Asia/Seoul');
  const firstDay = now.startOf('year').tz('Asia/Seoul');
  const weekNum = Math.floor(now.diff(firstDay, 'week')) + 1;
  const todayField = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.day()];
  return { weekNum, todayField };
}

/** 스터디 주제별 습관 이름 풀 (10개씩) */
const HABIT_POOLS = [
  ['백준 1문제 풀기', '오답 노트 정리', '시간복잡도 복습', '유형별 1문제', '코테 기출 1개', '손코딩 연습', '자료구조 개념 1개', 'PR 올리기', '30분 집중 타이머', '주간 회고 작성'],
  ['useEffect 정리', '컴포넌트 1개 리팩터', 'React 공식문서 1장', '커스텀 훅 연습', '상태 설계 검토', 'Storybook 컴포넌트', 'Props 타입 점검', '렌더링 최적화 메모', 'Side project 30분', '코드리뷰 요청'],
  ['CS 챕터 1개', '면접 질문 3개 정리', '그림 그리며 복습', '퀴즈 5문제', '핵심 키워드 암기', '블로그 요약 1편', '강의 20분 시청', '개념 설명 연습', '오답노트 업데이트', '주간 목표 체크'],
  ['6시 기상 인증', '물 한 잔 마시기', '아침 스트레칭', '30분 코딩', '저녁 회고 5분', '스마트폰 1시간 제한', '취침 11시', '주간 루틴 점검', '주말 계획 세우기', '습관 트래커 체크'],
  ['RC 10문제', 'LC 1회', '단어 30개', '오답 분석', '문법 1단원', '영어 일기 3줄', '팟캐스트 10분', '스피킹 5분', '모의고사 1회', '주간 점수 기록'],
  ['책 20페이지', '핵심 문장 3개', '요약 1페이지', '실습 예제 따라하기', 'TIL 작성', '북마크 정리', '토론 질문 1개', '주간 독서량', '메모 앱 정리', '다음 챕터 예습'],
  ['PR 1개', '이슈 1개', 'README 업데이트', '배포 확인', '버그 1개 수정', '페어 30분', '스크럼 공유', 'API 테스트', '환경변수 점검', '주간 데모'],
  ['SQL 10문제', 'JOIN 복습', 'ERD 그리기', '실습 DB 쿼리', '인덱스 개념', '기출 1회', '오답 정리', '실무 쿼리 연습', '정규화 복습', '주간 테스트'],
  ['Figma 30분', '와이어프레임 1장', '컴포넌트 1개', '색상 팔레트', '프로토타입 링크', '피드백 반영', '접근성 체크', '모바일 뷰', '디자인 시스템', '주간 포트폴리오'],
  ['자소서 1문단', '포트폴리오 수정', 'GitHub 정리', '링크드인 업데이트', '면접 질문 5개', '모의면접 15분', '프로젝트 설명 연습', '강점 1개 정리', '약점 대응 연습', '주간 지원 현황'],
  ['스피킹 10분', '쉐도잉 5분', '단어 카드', '뉴스 1기사', '발음 교정', '표현 3개 암기', '대화 롤플레이', '오디오 복습', '주간 테스트', '학습 일지'],
  ['헬스 30분', '공부 1시간', '단백질 섭취', '스트레칭', '수면 7시간', '물 2L', '주간 몸무게', '산책 20분', '눈 휴식', '주말 회복'],
  ['JS 1챕터', '클로저 연습', '프로미스 3문제', '이벤트루프 정리', 'ES6 문법', '디바운스 구현', '배열 메서드', '코드 퀴즈', 'MDN 1문서', '주간 정리'],
  ['Spring 1레슨', 'REST API 1개', 'Postman 테스트', 'DTO 설계', '예외처리', '로그 확인', 'JUnit 1개', 'Swagger 정리', 'DB 마이그레이션', '주간 배포'],
  ['Python 30분', '스크립트 1개', 'pandas 연습', '자동화 1건', '가상환경', 'pip 정리', 'Jupyter 노트', '에러 디버깅', '코드 스타일', '주간 프로젝트'],
  ['면접 답변 3개', 'CS 질문 5개', '프로젝트 설명', 'STAR 정리', '기술 블로그', '모의 Q&A', '포트폴리오 리허설', '회고 작성', '약점 보완', '주간 체크'],
  ['TIL 1편', '태그 정리', '썸네일', 'SEO 점검', '댓글 답변', '방문자 분석', '글감 3개', '초안 작성', '교정 1회', '주간 발행'],
  ['영어 20분', '포트폴리오 영문', '이력서 영문', '기술 용어', '발표 연습', '슬랙 영문', '문서 읽기', '주간 목표', '원격 미팅', '타임존 정리'],
  ['기출 5문제', '실기 코딩', '개념 1단원', '오답노트', '모의고사', '필기 요약', '암기 카드', '시간 재기', '주간 진도', '합격 D-day'],
  ['카공 2시간', '사진 인증', '집중 25분×4', '카페 이동', '목표 3개', '방해 요소 차단', '주간 시간', '회고 5분', '음료 제한', '주말 보충'],
];

const EXTRA_HABITS = [
  '오늘의 목표 3줄 적기',
  '책상 정리 5분',
  'Slack/Discord 인사',
  '주간 캘린더 확인',
  '칭찬 스티커 붙이기',
  '물 마시기 리마인더',
  '눈 운동 2분',
  '짧은 산책',
  '감사 1줄',
  '내일 할 일 미리 적기',
];

/**
 * @param {{ name: string, intro: string }} study
 * @param {number} index
 * @returns {string[]}
 */
export function generateHabitNames(study, index) {
  const count = 5 + (index % 6); // 5~10
  const pool = HABIT_POOLS[index % HABIT_POOLS.length];
  const names = new Set();

  names.add(`${study.name} 핵심 1개`);
  names.add('주간 회고 5분');

  for (const name of pool) {
    if (names.size >= count) break;
    names.add(name);
  }

  let extraIdx = 0;
  while (names.size < count && extraIdx < EXTRA_HABITS.length) {
    names.add(EXTRA_HABITS[(index + extraIdx) % EXTRA_HABITS.length]);
    extraIdx++;
  }

  return [...names].slice(0, count);
}

/**
 * @param {number} studyIndex
 * @param {number} habitIndex
 * @param {string} todayField
 */
export function buildDayBooleans(studyIndex, habitIndex, todayField) {
  const data = {};
  for (const day of DAYS) {
    if (day === todayField) {
      // 오늘 체크 여부 — 스터디마다 다양하게
      data[day] = (studyIndex + habitIndex) % 3 !== 0;
    } else {
      // 요일별 활성 패턴 (습관이 해당 요일에 있는지)
      data[day] = (studyIndex + habitIndex + DAYS.indexOf(day)) % 4 !== 0;
    }
  }
  return data;
}

/**
 * @param {number} studyIndex
 * @returns {number[]}
 */
export function generateFocusTimes(studyIndex) {
  const sessionCount = 3 + (studyIndex % 6); // 3~8
  const times = [];
  for (let i = 0; i < sessionCount; i++) {
    const minutes = 15 + ((studyIndex * 7 + i * 11) % 46); // 15~60분
    times.push(minutes * 60); // 초 단위 (API timeSec)
  }
  return times;
}

/**
 * @param {number} totalPoint
 * @param {number} studyIndex
 * @returns {{ point: number, daysAgo: number }[]}
 */
export function generatePointHistory(totalPoint, studyIndex) {
  const entryCount = 4 + (studyIndex % 5);
  const entries = [];
  let remaining = totalPoint;

  for (let i = 0; i < entryCount - 1; i++) {
    const chunk = Math.max(
      5,
      Math.floor(remaining / (entryCount - i) * (0.6 + (i % 3) * 0.2))
    );
    entries.push({
      point: chunk,
      daysAgo: (studyIndex + i * 3) % 45 + 1,
    });
    remaining -= chunk;
  }

  entries.push({ point: Math.max(remaining, 0), daysAgo: 1 });
  return entries;
}

/** @param {number} studyIndex */
export function generateEmojis(studyIndex) {
  const pool = [
    { code: '1F525', count: 3 + (studyIndex % 12) },
    { code: '1F4AA', count: 1 + (studyIndex % 8) },
    { code: '1F680', count: 2 + (studyIndex % 10) },
    { code: '1F4DA', count: 1 + (studyIndex % 6) },
    { code: '1F60A', count: 4 + (studyIndex % 15) },
    { code: '2728', count: 1 + (studyIndex % 9) },
    { code: '1F389', count: 1 + (studyIndex % 7) },
    { code: '1F602', count: 1 + (studyIndex % 5) },
  ];

  const count = 2 + (studyIndex % 3); // 2~4
  return pool.slice(studyIndex % 4, studyIndex % 4 + count);
}
