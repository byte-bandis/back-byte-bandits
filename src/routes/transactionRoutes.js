const router = require('express').Router();
const {  createTransaction, handleTransactions, soldTransactions, getTransactionsByBuyer, getTransactionsBySeller } = require('../controller/TransactionsController');
const { authenticate } = require('../middleware/auth');

router.post('/:id', authenticate, createTransaction);
router.post('/handleTransactions/', authenticate, handleTransactions);
router.post('/soldTransactions/', authenticate, soldTransactions);
router.get('/seller/:userId', authenticate, getTransactionsBySeller);
router.get('/buyer/:userId', authenticate, getTransactionsByBuyer);

module.exports = router