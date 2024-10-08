const router = require('express').Router();
const {  createTransaction, getPendingTransactions, handleTransactions, getTransactionsByUser, getTransactionsFilters, getCountTransactionsBySeller, getCountTransactionsByBuyer } = require('../controller/TransactionsController');
const { authenticate } = require('../middleware/auth');


router.get('/getTransactions', authenticate, getPendingTransactions);
router.post('/handleTransactions', authenticate, handleTransactions);
router.get('/transactionsByUser', authenticate, getTransactionsByUser)
router.post('/:id', authenticate, createTransaction);
router.get('/count/seller', authenticate, getCountTransactionsBySeller);
router.get('/count/buyer', authenticate, getCountTransactionsByBuyer);


module.exports = router