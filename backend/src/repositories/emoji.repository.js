import prisma from '../config/prisma.client.js';

export async function findEmojiByStudyAndCode(studyId, code) {
  return prisma.eMOJI.findUnique({
    where: {
      STUDY_ID_CODE: {
        STUDY_ID: studyId,
        CODE: code,
      },
    },
  });
}

export async function createEmoji(studyId, code) {
  return prisma.eMOJI.create({
    data: {
      STUDY_ID: studyId,
      CODE: code,
      COUNTING: 1,
    },
  });
}

export async function increaseEmojiCount(studyId, code) {
  return prisma.eMOJI.update({
    where: {
      STUDY_ID_CODE: {
        STUDY_ID: studyId,
        CODE: code,
      },
    },
    data: {
      COUNTING: { increment: 1 },
    },
  });
}

export async function findEmojisByStudy(studyId) {
  return prisma.eMOJI.findMany({
    where: { STUDY_ID: studyId },
    orderBy: { COUNTING: 'desc' },
  });
}
