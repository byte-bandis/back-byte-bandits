const Like = require('../models/Like');
const APIFeatures = require('../utils/ApiFeature');
const { tryCatch } = require('../utils/tryCatch');
const publicFolder = "public/images";

exports.getUserLikeAccount = tryCatch(async (req, res) => {
    const userId = req.user._id;
    const count = await Like.countDocuments({ user: userId });
    res.status(200).json({ count });
})
exports.setLike = tryCatch(async (req, res) => {
    const { adId } = req.body;
    const userId = req.user._id;


    const existingLike = await Like.findOne({ ad: adId, user: userId });
    if (existingLike) {
        const likeId = existingLike._id;
        await Like.findByIdAndDelete(likeId);
        res.status(204).json({ message: 'Like removed', ad: adId, user: userId });
    } else {
        const like = await Like.create({ ad: adId, user: userId });
        res.status(201).json({ like });
    }
});


exports.countLikes = tryCatch(async (req, res) => {
    const adId = req.params.id;
    const count = await Like.countDocuments({ ad: adId });
    res.status(200).json({ adId, count });
});

exports.getUserLikes = tryCatch(async (req, res) => {
    const userId = req.user._id;
    const likesquery = new APIFeatures(Like.find({ user: userId }, req.query).populate('ad'), req.query)
        .sort()
        .paginate()
        .fields()
        .filter()
        .searchByTitle()
        .filterByTags()
        .filterByPriceRange()
        .filterByIsBuy();
    
    let likes = await likesquery.query.populate('ad');
    likes = likes.map(({ _doc: { ad, ...like } }) => {
        if (ad.photo) {
            ad.photo = process.env.NODE_ENV !== 'production' ? `http://${req.headers.host}/${publicFolder}/${ad.photo}` : `https://${req.headers.host}/api/${publicFolder}/${ad.photo}`;
        }      
        return { ad, ...like };
    })
 
    res.status(200).json({ likes });
});