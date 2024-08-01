const Ad = require('../models/Ad');
const { tryCatch } = require('../utils/tryCatch');

const APIFeatures = require('../utils/ApiFeature');
/* Obtener anuncios */
exports.getAds = tryCatch(async (req, res) => {
  const advancedQuery = new APIFeatures(Ad.find({}), req.query)
    .sort()
    .paginate()
    .fields()
    .filter();
  const ads = await advancedQuery.query;
  res.status(200).json({ ads });
});
/* obtener un anuncio */
exports.getAd = tryCatch(async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  res.status(200).json({ ad });
});
/* crear un anuncio */
exports.createAd = tryCatch(async (req, res) => {
  const user = req.user._id;
  let { adTitle, adBody, sell, price, tags } = req.body;
  let photo = req.file.filename;
   tags = tags.replace(' ', '').split(',')
  console.log(tags);
  const ad = await Ad.create({ adTitle, adBody, sell, price, photo, tags, user });

  res.status(201).json({
    success: true,
    data: ad
  });
});
/* actualizar un anuncio */
exports.updateAd = tryCatch(async (req, res, next) => {
  let ad = await Ad.findById(req.params.id);
  if (!ad) {
    return next({
      message: 'Ad not found'
    });
  }

  if (ad.user.toString() !== req.user._id) {
    return next({
      message: 'Not authorized to update this ad'
    });
  }

  ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: ad
  });
});
/* Reservar un anuncio */
exports.reserveAd = tryCatch(async (req, res, next) => {
  let ad = await Ad.findById(req.params.id);
  if (!ad) {
    return next({
      message: 'Ad not found'
    });
  }

  if (ad.reservedBy) {
    return next({
      message: 'Ad already reserved'
    });
  }

  ad.reservedBy = req.user._id;
  await ad.save();

  res.status(200).json({
    success: true,
    data: ad
  });
});
/* Comprar un anuncio */
exports.buyAd = tryCatch(async (req, res, next) => {
  let ad = await Ad.findById(req.params.id);
  if (!ad) {
    return next({
      message: 'Ad not found'
    });
  }

  if (ad.buyer) {
    return next({
      message: 'Ad already sold'
    });
  }

  if (ad.reservedBy && ad.reservedBy.toString() !== req.user._id) {
    return next({
      message: 'Ad is reserved by another user'
    });
  }

  ad.buyer = req.user._id;
  await ad.save();

  res.status(200).json({
    success: true,
    data: ad
  });
});
/* eliminar un anuncio */
exports.deleteAd = tryCatch(async (req, res, next) => {
  let ad = await Ad.findById(req.params.id);
  if (!ad) {
    return next({
      message: 'Ad not found'
    });
  }

  if (ad.user.toString() !== req.user._id) {
    return next({
      message: 'Not authorized to delete this ad'
    });
  }

  await ad.remove();
  res.status(200).json({
    success: true,
    data: {}
  });
});