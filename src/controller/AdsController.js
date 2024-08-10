const Ad = require("../models/Ad");
const User = require("../models/User");
const { tryCatch } = require("../utils/tryCatch");

const APIFeatures = require("../utils/ApiFeature");
/* Obtener anuncios */
exports.adsAccount = tryCatch(async (req, res) => {
  const count = await Ad.countDocuments();
  res.status(200).json({ count });
});
exports.getAds = tryCatch(async (req, res) => {
  const advancedQuery = new APIFeatures(Ad.find({}), req.query)
    .sort()
    .paginate()
    .fields()
    .filter();

  let ads = await advancedQuery.query;
  const publicFolder = "public/images";

  ads = ads.map(({ _doc: { photo, ...ad } }) => ({
    ...ad,
    photo: `http://${req.headers.host}/${publicFolder}/${photo}`,
  }));
  console.log(ads);
  res.status(200).json({ ads });
});
/* obtener un anuncio */
exports.getAd = tryCatch(async (req, res) => {
  let ad = await Ad.findById(req.params.id);
  ad = [
    {
      ...ad._doc,
      photo: `http://${req.headers.host}/public/images/${ad.photo}`,
    },
  ];

  console.log(ad);

  res.status(200).json({ ad });
});
/* crear un anuncio */
exports.createAd = tryCatch(async (req, res) => {
  const user = req.user._id;
  let { adTitle, adBody, sell, price, tags } = req.body;
  let photo = "";
  if(req.file){
    photo = req.file.filename;
  }
  tags = tags.replace(" ", "").split(",");
  console.log(tags);
  const ad = await Ad.create({
    adTitle,
    adBody,
    sell,
    price,
    photo,
    tags,
    user,
  });

  res.status(201).json({
    success: true,
    data: ad,
  });
});
/* actualizar un anuncio */
exports.updateAd = tryCatch(async (req, res, next) => {
  let ad = await Ad.findById(req.params.id);
  if (!ad) {
    return next({
      message: "Ad not found",
    });
  }

  if (ad.user.toString() !== req.user._id) {
    return next({
      message: "Not authorized to update this ad",
    });
  }

  ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: ad,
  });
});
/* Reserve an ad */
exports.reserveAd = tryCatch(async (req, res, next) => {
  let ad = await Ad.findById(req.params.id);
  if (!ad) {
    return next({
      message: "Ad not found",
      statusCode: 404,
    });
  }

  const user = await user.findById(req.user._id);
  if (!user) {
    return next({
      message: "User does not exist",
      statusCode: 404,
    });
  }

  if (user.reserved.some((reservedAd) => reservedAd.products.equals(ad._id)))
    return next({
      message: "Ad already reserved by this user",
      statusCode: 400,
    });

  user.reserved.push({ product: ad._id });
  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

/* List all ads reserved by an user */
exports.allReservedAds = tryCatch(async (req, res, next) => {
  const userId = req.user.id;

  let user = await User.findById(userId).populate("reserved");

  if (!user || user.reserved.length === 0) {
    return next({
      message: "There is no ads reserved",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/* Comprar un anuncio */
exports.buyAd = tryCatch(async (req, res, next) => {
  let ad = await Ad.findById(req.params.id);
  if (!ad) {
    return next({
      message: "Ad not found",
    });
  }

  if (ad.buyer) {
    return next({
      message: "Ad already sold",
    });
  }

  if (ad.reservedBy && ad.reservedBy.toString() !== req.user._id) {
    return next({
      message: "Ad is reserved by another user",
    });
  }

  ad.buyer = req.user._id;
  await ad.save();

  res.status(200).json({
    success: true,
    data: ad,
  });
});
/* eliminar un anuncio */
exports.deleteAd = tryCatch(async (req, res, next) => {
  let ad = await Ad.findById(req.params.id);
  if (!ad) {
    return next({
      message: "Ad not found",
    });
  }

  if (ad.user.toString() !== req.user._id) {
    return next({
      message: "Not authorized to delete this ad",
    });
  }

  await ad.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
