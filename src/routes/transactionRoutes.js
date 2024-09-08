const router = require('express').Router();
const { getTransactionsBySeller, getTransactionsByBuyer, getTransactionsByAd, createTransaction, rejectTransaction, changeState, changePrice } = require('../controller/TransactionsController');
const { authenticate } = require('../middleware/auth');

router.get('/seller/', authenticate, getTransactionsBySeller);
router.get('/buyer/', authenticate, getTransactionsByBuyer);
// router.get('/ad/:id', getTransactionsByAd);

router.post('/', authenticate, createTransaction);
router.post('/acceptTransaction/:id', authenticate, createTransaction);
router.post('/rejectTransaction/:id', authenticate, rejectTransaction);
// router.put('/state/:id', authenticate, changeState);
// router.put('/price/:id', authenticate, changePrice);
module.exports = router