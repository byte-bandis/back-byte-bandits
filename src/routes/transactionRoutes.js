const router = require('express').Router();
const {  createTransaction, getPendingTransactions, handleTransactions, getTransactionsByBuyer, getTransactionsBySeller, getTransactionsByUser } = require('../controller/TransactionsController');
const { authenticate } = require('../middleware/auth');


router.get('/getTransactions', authenticate, getPendingTransactions);
router.post('/handleTransactions', authenticate, handleTransactions);
router.get('/transactionsByUser', authenticate, getTransactionsByUser)
router.post('/:id', authenticate, createTransaction);

module.exports = router