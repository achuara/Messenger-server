import express from 'express';

import { createMessages, getMessages } from '../controllers/messages.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', createMessages);
router.get('/:conversationId', getMessages);

export default router;