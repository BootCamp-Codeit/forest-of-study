import { Router } from 'express';
import studyRouter from './study.route.js';
import pointRouter from './point.route.js';
import emojiRouter from './emoji.route.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server running' });
});

router.use('/studies', pointRouter);
router.use('/studies', studyRouter);
router.use('/studies', emojiRouter);

export default router;
