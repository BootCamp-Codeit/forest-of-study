import * as studyRepo from '../repositories/study.repository.js';
import bcrypt from 'bcrypt';
import * as jwtUtil from '../utils/jwt.util.js';

// 🔐 서비스 전역 pepper
const PEPPER = process.env.PEPPER_SECRET;

if (!PEPPER) {
  throw new Error('PEPPER_SECRET 환경변수가 설정되어 있지 않습니다.');
}

//============================== createStudy ==============================//

export async function createStudy(payload) {
  const { name, nickname, password, intro, image: imageCode } = payload;

  console.log('서비스에서 사용하는 imageCode:', imageCode);
  if (!name || !nickname || !password) {
    const err = new Error('name, nickname, password는 필수입니다.');
    err.status = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password + PEPPER, 10);

  const study = await studyRepo.createStudy({
    NAME: name,
    NICKNAME: nickname,
    PASSWORD: hashedPassword,
    INTRO: intro ?? null,
    IMAGE: imageCode ?? null,
  });

  const { PASSWORD, ...safeStudy } = study;
  return safeStudy;
}

//============================== getStudy ==============================//

export async function getStudy({ page, limit, sort = 'newest', search } = {}) {
  const take = limit;
  const skip = (page - 1) * limit;

  const [studies, total] = await Promise.all([
    studyRepo.getStudy({ skip, take, sort, search }),
    studyRepo.countStudies(search),
  ]);

  const safeStudies = studies.map(
    ({ PASSWORD, POINT_MASTER, EMOJI, ...rest }) => ({
      ...rest,
      totalPoint: POINT_MASTER?.TOTAL_POINT ?? 0,
      emojis: (EMOJI ?? []).map((emoji) => ({
        code: emoji.CODE,
        counting: emoji.COUNTING ?? 0,
      })),
    })
  );

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    items: safeStudies,
  };
}

//============================== getStudyDetail ==============================//

export async function getStudyDetail(studyId) {
  if (!studyId) {
    const err = new Error("studyId는 필수입니다.");
    err.status = 400;
    throw err;
  }

  const id = Number(studyId);
  if (Number.isNaN(id)) {
    const err = new Error("studyId는 숫자여야 합니다.");
    err.status = 400;
    throw err;
  }

  const study = await studyRepo.findStudyById(id);

  if (!study) {
    const err = new Error("해당 스터디를 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  // HABIT 도 같이 구조 분해
  const { PASSWORD, POINT_MASTER, EMOJI, HABIT, ...safeStudy } = study;

  return {
    ...safeStudy,
    totalPoint: POINT_MASTER?.TOTAL_POINT ?? 0,
    emojis: (EMOJI ?? []).map((emoji) => ({
      code: emoji.CODE,
      counting: emoji.COUNTING ?? 0,
    })),
    // ✅ 상세 응답에 하빗 전체 추가
    habits: HABIT ?? [],
  };
}

// ============================== verifyStudyPassword ============================== //

export async function verifyStudyPassword(studyId, password) {
  if (!password) {
    const err = new Error('password는 필수입니다.');
    err.status = 400;
    throw err;
  }

  const id = Number(studyId);
  if (Number.isNaN(id)) {
    const err = new Error('studyId는 숫자여야 합니다.');
    err.status = 400;
    throw err;
  }

  const study = await studyRepo.findStudyById(id);

  if (!study) {
    const err = new Error('해당 스터디를 찾을 수 없습니다.');
    err.status = 404;
    throw err;
  }

  let isMatch = await bcrypt.compare(password + PEPPER, study.PASSWORD);

  if (!isMatch) {
    const legacyMatch = await bcrypt.compare(password, study.PASSWORD);

    if (legacyMatch) {
      const newHash = await bcrypt.hash(password + PEPPER, 10);
      await studyRepo.updateStudy(id, { PASSWORD: newHash });

      isMatch = true;
    }
  }

  if (!isMatch) {
    const err = new Error('비밀번호가 일치하지 않습니다.');
    err.status = 401;
    throw err;
  }

  const token = jwtUtil.signToken({ studyId: study.STUDY_ID });

  return { verified: true, token };

  
}

// ============================== updateStudy ============================== //

export async function updateStudy(studyId, payload) {
  const id = Number(studyId);
  if (!studyId || Number.isNaN(id)) {
    const err = new Error('유효한 studyId가 필요합니다.');
    err.status = 400;
    throw err;
  }

  const { name, nickname, password, intro, image: imageCode } = payload || {};

  if (
    name === undefined &&
    nickname === undefined &&
    password === undefined &&
    intro === undefined &&
    imageCode === undefined
  ) {
    const err = new Error('수정할 값이 없습니다.');
    err.status = 400;
    throw err;
  }

  const updateData = {};

  if (name !== undefined) updateData.NAME = name;
  if (nickname !== undefined) updateData.NICKNAME = nickname;
  if (intro !== undefined) updateData.INTRO = intro;

  if (imageCode !== undefined) updateData.IMAGE = imageCode;

  if (password !== undefined) {
    const hashedPassword = await bcrypt.hash(password + PEPPER, 10);
    updateData.PASSWORD = hashedPassword;
  }

  const exist = await studyRepo.findStudyById(id);
  if (!exist) {
    const err = new Error('해당 스터디를 찾을 수 없습니다.');
    err.status = 404;
    throw err;
  }

  const updated = await studyRepo.updateStudy(id, updateData);

  const { PASSWORD, ...safeStudy } = updated;
  return safeStudy;
}

// ============================== deleteStudy ============================== //

export async function deleteStudy(studyId) {
  const id = Number(studyId);
  if (!studyId || Number.isNaN(id)) {
    const err = new Error('유효한 studyId가 필요합니다.');
    err.status = 400;
    throw err;
  }

  const exist = await studyRepo.findStudyById(id);
  if (!exist) {
    const err = new Error('해당 스터디를 찾을 수 없습니다.');
    err.status = 404;
    throw err;
  }

  // 실제 삭제
  await studyRepo.deleteStudy(id);

  return { success: true };
}
