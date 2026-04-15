import express from 'express';
import { saveSearch, getHistory } from '../controllers/searchController.js';

const router = express.Router();

router.post('/search', saveSearch);
router.get('/history/:user_id', getHistory);

export default router;