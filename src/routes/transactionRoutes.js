const router = require('express').Router();
const {  acceptTransaction, createTransaction, rejectTransaction, getTransactionsByBuyer, getTransactionsBySeller } = require('../controller/TransactionsController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, createTransaction);
router.post('/acceptTransaction/:transactionId', authenticate, acceptTransaction);
router.post('/rejectTransaction/:id', authenticate, rejectTransaction);
router.get('/seller/:userId', authenticate, getTransactionsBySeller);
router.get('/buyer/:userId', authenticate, getTransactionsByBuyer);

module.exports = router