const router = require('express').Router();

const {
    createChat,
    getChat,
    getChats,
    deleteChat
} = require('../controller/ChatController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, createChat);
router.get('/', authenticate, getChats);
router.get('/:chatId', authenticate, getChat);
router.delete('/:chatId', authenticate, deleteChat);

module.exports = router;


