import prisma from '../config/prisma.client.js';

export async function createPointHistoryWithMasterUpdate(studyId, pointValue) {
  return prisma.$transaction(async (tx) => {
    const history = await tx.pOINT_HISTORY.create({
      data: {
        STUDY_ID: studyId,
        POINT: pointValue,
      },
    });

    const master = await tx.pOINT_MASTER.upsert({
      where: { STUDY_ID: studyId },
      update: {
        TOTAL_POINT: { increment: pointValue },
      },
      create: {
        STUDY_ID: studyId,
        TOTAL_POINT: pointValue,
      },
    });

    return {
      history,
      master,
    };
  });
}

export async function getPointSummary(studyId) {
  const [master, history] = await Promise.all([
    prisma.pOINT_MASTER.findUnique({
      where: { STUDY_ID: studyId },
    }),
    prisma.pOINT_HISTORY.findMany({
      where: { STUDY_ID: studyId },
      orderBy: { REG_DATE: 'desc' },
    }),
  ]);

  return {
    totalPoint: master ? master.TOTAL_POINT : 0,
    history,
  };
}
