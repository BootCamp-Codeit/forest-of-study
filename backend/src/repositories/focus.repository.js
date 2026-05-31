import prisma from '../config/prisma.client.js';

export function createFocus(studyId, min) {
    return prisma.fOCUS.create({
        data: {
            STUDY_ID: Number(studyId),
            TIME: min, // 분 단위 저장
            UPT_TIME: new Date(),
        }
    });
}

