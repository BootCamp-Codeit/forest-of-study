import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const study1 = await prisma.sTUDY.create({
    data: {
      PASSWORD: '1111',
      NICKNAME: 'forest_1',
      NAME: '알고리즘 스터디',
      INTRO: '매일 알고리즘 1문제 풀기',
      IMAGE: null,
    },
  });

  const study2 = await prisma.sTUDY.create({
    data: {
      PASSWORD: '2222',
      NICKNAME: 'forest_2',
      NAME: '영어 회화 스터디',
      INTRO: '매일 30분 영어 공부',
      IMAGE: null,
    },
  });

  const study3 = await prisma.sTUDY.create({
    data: {
      PASSWORD: '3333',
      NICKNAME: 'forest_3',
      NAME: 'CS 개념 정리 스터디',
      INTRO: '운영체제 / 네트워크 복습',
      IMAGE: null,
    },
  });

  console.log('STUDY mock 생성 완료:', {
    study1: study1.STUDY_ID,
    study2: study2.STUDY_ID,
    study3: study3.STUDY_ID,
  });

  // 2) EMOJI mock 데이터 (CODE 기반)
  await prisma.eMOJI.createMany({
    data: [
      { CODE: '1F923', STUDY_ID: study1.STUDY_ID, COUNTING: 3 }, // 🤣
      { CODE: '1F602', STUDY_ID: study1.STUDY_ID, COUNTING: 1 }, // 😂

      { CODE: '1F60A', STUDY_ID: study2.STUDY_ID, COUNTING: 2 }, // 😊
      { CODE: '1F680', STUDY_ID: study2.STUDY_ID, COUNTING: 5 }, // 🚀

      { CODE: '1F4DA', STUDY_ID: study3.STUDY_ID, COUNTING: 4 }, // 📚
    ],
  });

  console.log('EMOJI mock 생성 완료');

  // 3) HABIT mock 데이터
  await prisma.hABIT.createMany({
    data: [
      {
        STUDY_ID: study1.STUDY_ID,
        WEEK_NUM: 1,
        NAME: '알고리즘 1문제 풀기',
        MON: true,
        TUE: true,
        WED: true,
        THU: true,
        FRI: true,
      },
      {
        STUDY_ID: study1.STUDY_ID,
        WEEK_NUM: 1,
        NAME: '문제 복기 노트 작성',
        SAT: true,
        SUN: true,
      },
      {
        STUDY_ID: study2.STUDY_ID,
        WEEK_NUM: 1,
        NAME: '영어 기사 1개 읽기',
        MON: true,
        WED: true,
        FRI: true,
      },
      {
        STUDY_ID: study2.STUDY_ID,
        WEEK_NUM: 1,
        NAME: '영어 스피킹 10분',
        TUE: true,
        THU: true,
      },
      {
        STUDY_ID: study3.STUDY_ID,
        WEEK_NUM: 1,
        NAME: '운영체제 챕터 1 정리',
        MON: true,
        TUE: true,
      },
      {
        STUDY_ID: study3.STUDY_ID,
        WEEK_NUM: 1,
        NAME: '네트워크 개념 복습',
        THU: true,
        FRI: true,
      },
    ],
  });

  console.log('HABIT mock 생성 완료');

  // 4) FOCUS mock 데이터
  await prisma.fOCUS.createMany({
    data: [
      { STUDY_ID: study1.STUDY_ID, TIME: 50 },
      { STUDY_ID: study1.STUDY_ID, TIME: 30 },

      { STUDY_ID: study2.STUDY_ID, TIME: 25 },
      { STUDY_ID: study2.STUDY_ID, TIME: 40 },

      { STUDY_ID: study3.STUDY_ID, TIME: 60 },
    ],
  });

  console.log('FOCUS mock 생성 완료');

  // 5) POINT_MASTER mock 데이터
  await prisma.pOINT_MASTER.createMany({
    data: [
      {
        STUDY_ID: study1.STUDY_ID,
        TOTAL_POINT: 150,
      },
      {
        STUDY_ID: study2.STUDY_ID,
        TOTAL_POINT: 80,
      },
      {
        STUDY_ID: study3.STUDY_ID,
        TOTAL_POINT: 200,
      },
    ],
  });

  console.log('POINT_MASTER mock 생성 완료');

  // 6) POINT_HISTORY mock 데이터
  await prisma.pOINT_HISTORY.createMany({
    data: [
      { STUDY_ID: study1.STUDY_ID, POINT: 50 },
      { STUDY_ID: study1.STUDY_ID, POINT: 100 },

      { STUDY_ID: study2.STUDY_ID, POINT: 30 },
      { STUDY_ID: study2.STUDY_ID, POINT: 50 },

      { STUDY_ID: study3.STUDY_ID, POINT: 80 },
      { STUDY_ID: study3.STUDY_ID, POINT: 120 },
    ],
  });

  console.log('POINT_HISTORY mock 생성 완료');

  console.log('✅ seed 완료');
}

main()
  .catch((e) => {
    console.error('❌ seed 중 에러 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
