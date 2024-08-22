const router = require('express').Router();
const {
  getComments,
  addComment,
  updateComment,
  deleteComment
} = require('../controller/CommentsController');
const { authenticate } = require('../middleware/auth');

router.get('/:id', getComments);
router.post('/:id', authenticate, addComment);
router.put('/:id', authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

module.exports = router;
