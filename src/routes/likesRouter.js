const router = require('express').Router();
const { getUserLikes, countLikes, setLike, getUserLikeAccount } = require('../controller/LikesController');
const { authenticate } = require('../middleware/auth');

router.get('/wishlist/', authenticate, getUserLikes);
router.get('/wishlist/count', authenticate, getUserLikeAccount);
router.get('/ads/:id', countLikes);
router.post('/', authenticate, setLike);
module.exports = router;
