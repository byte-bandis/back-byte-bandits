const router = require('express').Router();

const {
    createChat,
    getChat,
    getChats
} = require('../controller/ChatController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, createChat);
router.get('/:userId', authenticate, getChats);
router.get('/:chatId', authenticate, getChat);

module.exports = router;


