// src/services/emoji.service.js
import * as emojiRepository from '../repositories/emoji.repository.js';

export async function addOrIncreaseEmoji(studyId, code) {
  // 1) 이 스터디에서 이 이모지 쓴 적 있는지 확인
  const existing = await emojiRepository.findEmojiByStudyAndCode(studyId, code);

  // 2) 없으면 새로 생성
  if (!existing) {
    const created = await emojiRepository.createEmoji(studyId, code);
    return {
      isNew: true,
      emoji: created,
    };
  }

  // 3) 있으면 COUNTING + 1
  const updated = await emojiRepository.increaseEmojiCount(studyId, code);

  return {
    isNew: false,
    emoji: updated,
  };
}

export async function getEmojisByStudy(studyId) {
  const list = await emojiRepository.findEmojisByStudy(studyId);
  return list;
}
