
const path = require('path');
const Ad = require("../models/Ad");
const User = require("../models/User");
const { tryCatch } = require("../utils/tryCatch");
const removePhotoFile = require("../utils/removePhotoFile");
const APIFeatures = require("../utils/ApiFeature");
const mongoose = require("mongoose");
const publicFolder = "public/images";
/* Obtener anuncios */
exports.adsAccount = tryCatch(async (req, res) => {
    if (req.query.hasOwnProperty('user')) {
        try {
            const user = await User.find({username:req.query.user});
            req.query.user= user[0]._id.toString();
        } catch (error) {
            console.log(error);
            
            res.status(200).json({ ads:[] });
        
    }

    }
    let count = 0;
    
    if (req.query.hasOwnProperty('sell')) {
        req.query.sell = req.query.sell === 'true';
        
    }
    
    const advancedQuery = new APIFeatures(Ad.countDocuments({}), req.query)
        .sort()
        .paginate()
        .filterByUser()
        .fields()
        .filter()
        .searchByTitle()
        .filterByTags()
        .filterByPriceRange()
        .filterByIsBuy();
    const ads = await advancedQuery.query;
     count = ads.length
    res.status(200).json({ count });
});
exports.getAds = tryCatch(async (req, res) => {
    if (req.query.hasOwnProperty('sell')) {
        req.query.sell = req.query.sell === 'true';
        
    }
    if (req.query.hasOwnProperty('available')) {
        req.query.available = req.query.available === 'true';  
    } else {
        req.query.available = true; 
    }

    if (req.query.hasOwnProperty('user')) {
        try {
            const user = await User.find({username:req.query.user});
            req.query.user= user[0]._id.toString();
        } catch (error) {
            console.log(error);
            
            res.status(200).json({ ads:[] });
        
    }

    }
    
    const advancedQuery = new APIFeatures(Ad.find({}).populate('user'), req.query)
        .sort()
        .paginate()
        .filterByUser()
        .fields()
        .filter()
        .searchByTitle()
        .filterByTags()
        .filterByPriceRange()
        .filterByIsBuy();

    let ads = await advancedQuery.query.populate('user');

    ads = ads.map(({ _doc: { photo, ...ad } }) => {
        if (photo) {
            return {
                ...ad,
                photo: process.env.NODE_ENV !== 'production' ? `http://${req.headers.host}/${publicFolder}/${photo}` : `https://${req.headers.host}/api/${publicFolder}/${photo}`,
            };
        } else {
            return { photo, ...ad };
        }
    });

    res.status(200).json({ ads });
});
/* obtener un anuncio */
exports.getAd = tryCatch(async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {

        res.status(404).json({ message: "Ad not found", data: [] });
    } else {

        let ad = await Ad.findById(id).populate('user');
        if (!ad || ad.available === false) {
            res.status(404).json({ message: "Ad not found", data: [] });
        }
        if (ad.photo) {
            ad.photo = process.env.NODE_ENV !== 'production' ? `http://${req.headers.host}/${publicFolder}/${ad.photo}` : `https://${req.headers.host}/api/${publicFolder}/${ad.photo}`;
        }
        ad = [ad];

        res.status(200).json({ ad });
    }
});
/* crear un anuncio */
exports.createAd = tryCatch(async (req, res) => {
    const user = req.user._id;
    let { adTitle, adBody, sell, price, tags } = req.body;
    let photo = "";
    if (req.file) {
        photo = req.file.filename;
    }
    tags = tags.replace(" ", "").split(",");
    const newAd = await Ad.create({
        adTitle,
        adBody,
        sell,
        price,
        photo,
        tags,
        user,
    });
    const ad = await Ad.findById(newAd._id).populate('user');

    if (ad.photo) {
        ad.photo = `${req.protocol}://${req.headers.host}/${process.env.NODE_ENV !== 'production' ? publicFolder : `api/${publicFolder}`}/${ad.photo}`;
    }

    if (!ad) {
        return next({
            message: "Ad not created",
        });
    }

    res.status(201).json({
        success: true,
        data: ad,
    });
});
/* actualizar un anuncio */
exports.updateAd = tryCatch(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

        return next({
            message: "Ad not found",
        });
    }
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

    if (ad.sell.toString() !== req.body.sell) {
        return res.status(400).json({
            message: "Cannot change transaction type status",
        });
    }

    let { adTitle, adBody, sell, price, tags } = req.body;
    let photo = ad.photo;
    if (req.file) {
        photo = req.file.filename;
        if (req.body.deletePhoto) {
            const oldPhotoPath = path.join(__dirname, '..', 'public', 'images', req.body.deletePhoto);
            removePhotoFile(oldPhotoPath);
        }
    } else if (req.body.deletePhoto) {
        const oldPhotoPath = path.join(__dirname, '..', 'public', 'images', req.body.deletePhoto);
        removePhotoFile(oldPhotoPath);
        photo = "";
    }

    if (tags) {
        tags = req.body.tags.replace(" ", "").split(",");
    }

    ad = await Ad.findByIdAndUpdate(req.params.id, {
        adTitle,
        adBody,
        sell,
        price,
        tags,
        photo,
    }, {
        new: true,
        runValidators: true,
    }).populate('user');

    if (ad.photo) {
        ad.photo = `${req.protocol}://${req.headers.host}/${process.env.NODE_ENV !== 'production' ? publicFolder : `api/${publicFolder}`}/${ad.photo}`;
    }

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

    ad.reservedBy = req.user._id;
    await ad.save();

    res.status(200).json({
        success: true,
        data: ad
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
/* exports.deleteAd = tryCatch(async (req, res, next) => {
    const toDeleteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(toDeleteId)) {

        res.status(404).json({ message: "Ad not found" });
    }
    let ad = await Ad.findById(toDeleteId);
    if (!ad) {
        return next({
            message: "Ad not found",
        });
    }
    const currentUser = req.user._id;
    if (ad.user.toString() !== currentUser) {
        return next({
            message: "Not authorized to delete this ad",
        });
    }

    await ad.deleteOne({ _id: toDeleteId });

    if (ad.photo !== "") {
        const photoPath = path.join(__dirname, '..', 'public', 'images', ad.photo);
        removePhotoFile(photoPath);
    }

    res.status(200).json({
        success: true,
        data: {},
    });
}); */

//Metodo de eliminacion de anuncio cambiando status a eliminado
exports.deleteAd = tryCatch(async (req, res, next) => {
    const toDeleteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(toDeleteId)) {

        res.status(404).json({ message: "Ad not found" });
    }
    let ad = await Ad.findById(toDeleteId);
    if (!ad) {
        return next({
            message: "Ad not found",
        });
    }
    const currentUser = req.user._id;
    if (ad.user.toString() !== currentUser) {
        return next({
            message: "Not authorized to delete this ad",
        });
    }

    ad.available = false;
    await ad.save();
})

