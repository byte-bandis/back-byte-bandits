const router = require('express').Router();
const { getUserLikes, countLikes, setLike } = require('../controller/LikesController');
const { authenticate } = require('../middleware/auth');

router.get('/wishlist/:username/', authenticate, getUserLikes);
router.get('/ads/:id', countLikes);
router.post('/', authenticate, setLike);
module.exports = router;
