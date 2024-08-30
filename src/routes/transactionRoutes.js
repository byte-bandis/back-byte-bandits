const router = require('express').Router();
const { getTransactionsBySeller, getTransactionsByBuyer, getTransactionsByAd, createTransaction, changeState, changePrice } = require('../controller/TransactionsController');
const { authenticate } = require('../middleware/auth');

router.get('/seller/:id', authenticate, getTransactionsBySeller);
router.get('/buyer/:id', authenticate, getTransactionsByBuyer);
router.get('/ad/:id', authenticate, getTransactionsByAd);
router.post('/', authenticate, createTransaction);
router.put('/state/:id', authenticate, changeState);
router.put('/price/:id', authenticate, changePrice);
module.exports = router