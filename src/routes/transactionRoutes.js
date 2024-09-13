const router = require('express').Router();
const {  createTransaction, getPendingTransactions, handleTransactions, soldTransactions, getTransactionsByBuyer, getTransactionsBySeller } = require('../controller/TransactionsController');
const { authenticate } = require('../middleware/auth');


router.get('/getTransactions', authenticate, getPendingTransactions);
router.post('/handleTransactions', authenticate, handleTransactions);
router.get('/seller/:userId', authenticate, getTransactionsBySeller);
router.get('/buyer/:userId', authenticate, getTransactionsByBuyer);
router.post('/:id', authenticate, createTransaction);

module.exports = router