const router = require('express').Router();

const {
getAds,
getAd,
createAd,
updateAd,
deleteAd,
reserveAd,
buyAd
} = require('../controller/AdsController');
const { authenticate } = require('../middleware/auth');

router.get('/', getAds);
router.get('/:id', getAd);
router.post('/', authenticate, createAd);
router.put('/:id', authenticate, updateAd);
router.delete('/:id', authenticate, deleteAd);
router.post('/:id/reserve', authenticate, reserveAd);
router.post('/:id/buy', authenticate, buyAd);

module.exports = router;