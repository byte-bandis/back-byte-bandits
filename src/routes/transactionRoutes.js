const router = require('express').Router();
const {  createTransaction, getPendingTransactions, handleTransactionsUp, soldTransactions, getTransactionsByBuyer, getTransactionsBySeller } = require('../controller/TransactionsController');
const { authenticate } = require('../middleware/auth');


router.get('/getTransactions', authenticate, getPendingTransactions);
router.post('/handleTransactions', authenticate, handleTransactionsUp);
router.post('/soldTransactions/', authenticate, soldTransactions);
router.get('/seller/:userId', authenticate, getTransactionsBySeller);
router.get('/buyer/:userId', authenticate, getTransactionsByBuyer);
router.post('/:id', authenticate, createTransaction);

module.exports = router