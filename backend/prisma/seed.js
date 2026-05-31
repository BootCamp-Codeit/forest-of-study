import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { getSeedStudies, DEMO_PASSWORD } from './seed-data.js';
import {
  getSeedTimeInfo,
  generateHabitNames,
  buildDayBooleans,
  generateFocusTimes,
  generatePointHistory,
  generateEmojis,
} from './seed-helpers.js';

const prisma = new PrismaClient();

async function clearAll() {
  await prisma.eMOJI.deleteMany();
  await prisma.fOCUS.deleteMany();
  await prisma.hABIT.deleteMany();
  await prisma.pOINT_HISTORY.deleteMany();
  await prisma.pOINT_MASTER.deleteMany();
  await prisma.sTUDY.deleteMany();
}

async function main() {
  const pepper = process.env.PEPPER_SECRET;
  if (!pepper) {
    throw new Error('PEPPER_SECRET 환경변수가 필요합니다.');
  }

  const { weekNum, todayField } = getSeedTimeInfo();
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD + pepper, 10);
  const studies = getSeedStudies();

  console.log('🗑️  기존 데이터 삭제 중...');
  await clearAll();

  console.log(
    `🌱 스터디 ${studies.length}건 + 습관·집중·포인트·이모지 생성 (비밀번호: ${DEMO_PASSWORD})...`
  );
  console.log(`   현재 주차 WEEK_NUM=${weekNum}, 오늘=${todayField}`);

  const now = Date.now();

  for (let i = 0; i < studies.length; i++) {
    const { nickname, name, intro, image, daysAgo, points } = studies[i];
    const regDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    const study = await prisma.sTUDY.create({
      data: {
        NICKNAME: nickname,
        NAME: name,
        INTRO: intro,
        IMAGE: image,
        PASSWORD: hashedPassword,
        REG_DATE: regDate,
        UPT_DATE: regDate,
      },
    });

    const studyId = study.STUDY_ID;

    // 습관 5~10개 (현재 주차)
    const habitNames = generateHabitNames({ name, intro }, i);
    await prisma.hABIT.createMany({
      data: habitNames.map((habitName, habitIdx) => ({
        STUDY_ID: studyId,
        WEEK_NUM: weekNum,
        NAME: habitName,
        ...buildDayBooleans(i, habitIdx, todayField),
        REG_DATE: regDate,
        UPT_DATE: new Date(),
      })),
    });

    // 집중 기록 3~8건
    const focusTimes = generateFocusTimes(i);
    await prisma.fOCUS.createMany({
      data: focusTimes.map((timeSec, fi) => ({
        STUDY_ID: studyId,
        TIME: timeSec,
        REG_DATE: new Date(now - (fi + 1) * 24 * 60 * 60 * 1000),
        UPT_TIME: new Date(),
      })),
    });

    // 포인트 이력 + 마스터
    const historyEntries = generatePointHistory(points, i);
    await prisma.pOINT_HISTORY.createMany({
      data: historyEntries.map(({ point, daysAgo: d }) => ({
        STUDY_ID: studyId,
        POINT: point,
        REG_DATE: new Date(now - d * 24 * 60 * 60 * 1000),
        UPT_DATE: new Date(),
      })),
    });

    await prisma.pOINT_MASTER.create({
      data: {
        STUDY_ID: studyId,
        TOTAL_POINT: points,
      },
    });

    // 이모지 2~4종
    const emojis = generateEmojis(i);
    await prisma.eMOJI.createMany({
      data: emojis.map((e) => ({
        STUDY_ID: studyId,
        CODE: e.code,
        COUNTING: e.count,
      })),
    });

    if ((i + 1) % 20 === 0) {
      console.log(`   ${i + 1}/${studies.length} 완료`);
    }
  }

  const [studyCount, habitCount, focusCount] = await Promise.all([
    prisma.sTUDY.count(),
    prisma.hABIT.count(),
    prisma.fOCUS.count(),
  ]);

  console.log(`✅ seed 완료`);
  console.log(`   STUDY ${studyCount} · HABIT ${habitCount} · FOCUS ${focusCount}`);
  console.log(`   데모 비밀번호: ${DEMO_PASSWORD} (모든 스터디 공통)`);
}

main()
  .catch((e) => {
    console.error('❌ seed 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
