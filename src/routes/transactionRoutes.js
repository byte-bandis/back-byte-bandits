const router = require('express').Router();
const { getTransactionsBySeller, getTransactionsByBuyer, acceptTransaction, getTransactionsByAd, createTransaction, rejectTransaction, changeState, changePrice } = require('../controller/TransactionsController');
const { authenticate } = require('../middleware/auth');

router.get('/seller/:userId', authenticate, getTransactionsBySeller);
router.get('/buyer/:userId', authenticate, getTransactionsByBuyer);
// router.get('/ad/:id', getTransactionsByAd);

router.post('/', authenticate, authenticate, createTransaction);
router.post('/acceptTransaction/:transactionId', authenticate, acceptTransaction);
router.post('/rejectTransaction/:id', authenticate, rejectTransaction);
// router.put('/state/:id', authenticate, changeState);
// router.put('/price/:id', authenticate, changePrice);
module.exports = router