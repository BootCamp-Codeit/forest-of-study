import * as emojiService from '../services/emoji.service.js';

export async function addOrIncreaseEmoji(req, res, next) {
  try {
    const studyId = Number(req.params.studyId);
    const { code } = req.body;

    if (!Number.isInteger(studyId) || studyId <= 0) {
      return res.status(400).json({ message: '유효하지 않은 studyId 입니다.' });
    }

    if (!code) {
      return res.status(400).json({ message: 'code 값이 필요합니다.' });
    }

    const result = await emojiService.addOrIncreaseEmoji(studyId, code);

    return res.status(result.isNew ? 201 : 200).json({
      message: result.isNew ? '이모지 첫 생성' : '이모지 카운트 증가',
      data: result.emoji,
    });
  } catch (err) {
    next(err);
  }
}

export async function getEmojisByStudy(req, res, next) {
  try {
    const studyId = Number(req.params.studyId);
    const emojis = await emojiService.getEmojisByStudy(studyId);
    return res.status(200).json({ data: emojis });
  } catch (err) {
    next(err);
  }
}
