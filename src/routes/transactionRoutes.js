const router = require('express').Router();
const {  createTransaction, getPendingTransactions, handleTransactions, getTransactionsByBuyer, getTransactionsBySeller, getTransactionsByUser, getAllTransactionsBySeller } = require('../controller/TransactionsController');
const { authenticate } = require('../middleware/auth');


router.get('/getTransactions', authenticate, getPendingTransactions);
router.post('/handleTransactions', authenticate, handleTransactions);
router.get('/seller', authenticate, getTransactionsBySeller);
router.get('/buyer', authenticate, getTransactionsByBuyer);
router.get('transactionsByUser', authenticate, getTransactionsByUser)
router.post('/:id', authenticate, createTransaction);
router.get('/count/seller', authenticate, getAllTransactionsBySeller);

module.exports = router