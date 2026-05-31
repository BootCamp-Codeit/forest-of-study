import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { getSeedStudies, DEMO_PASSWORD } from './seed-data.js';

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

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD + pepper, 10);
  const studies = getSeedStudies();

  console.log('🗑️  기존 데이터 삭제 중...');
  await clearAll();

  console.log(`🌱 스터디 ${studies.length}건 생성 중 (비밀번호: ${DEMO_PASSWORD})...`);

  const now = Date.now();

  for (let i = 0; i < studies.length; i++) {
    const { nickname, name, intro, image, daysAgo, points, emojis } = studies[i];
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

    await prisma.pOINT_MASTER.create({
      data: {
        STUDY_ID: study.STUDY_ID,
        TOTAL_POINT: points,
      },
    });

    if (emojis.length > 0) {
      await prisma.eMOJI.createMany({
        data: emojis.map((e) => ({
          STUDY_ID: study.STUDY_ID,
          CODE: e.code,
          COUNTING: e.count,
        })),
      });
    }

    if ((i + 1) % 20 === 0) {
      console.log(`   ${i + 1}/${studies.length} 완료`);
    }
  }

  const total = await prisma.sTUDY.count();
  console.log(`✅ seed 완료 — STUDY ${total}건`);
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
