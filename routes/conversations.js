import express from 'express';

import { createConversation, getConversation, getConversationTwoId, getOneConversation } from '../controllers/conversations.js';
import auth from '../middleware/auth.js';

const router = express.Router();


router.post('/', createConversation);
router.get('/:userId', getConversation);
router.get('/find/:conversationId', getOneConversation);
router.get('/find/:firstUserId/:secondUserId', getConversationTwoId);

export default router;