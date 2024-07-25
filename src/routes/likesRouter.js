const router = require('express').Router();
const { getUserLikes, countLikes, setLike } = require('../controller/LikesController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getUserLikes);
router.get('/:id', countLikes);
router.post('/', authenticate, setLike);
module.exports = router;
