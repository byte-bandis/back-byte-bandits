
const Ad = require("../models/Ad");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");
const { tryCatch } = require("../utils/tryCatch");
const publicFolder = "public/images";

/*Crear un chat*/
exports.createChat = tryCatch(async (req, res) => {
    const user = req.user._id;
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            message: "Invalid product ID",
        });
    }

    let chat = await Chat.findOne({ product: productId, buyer: user});

    if(chat){
        return res.status(409).json({
            message: "Chat already exists",
        });
    }

    const ad = await Ad.findById(productId);

    if (!ad) {
        return res.status(404).json({
            message: "Ad not found",
        });
    }

    console.log(ad.user.toString(), user.toString());
    if (ad.user.toString() === user.toString()) {
        return res.status(409).json({
            message: "You cannot chat with yourself",
        });
    }
    
    chat = await Chat.create({ product: productId, buyer: user, seller: ad.user });
    
    res.status(201).json({ chat });
    }
);

/* Obtener chats de un usuario */
exports.getChats = tryCatch(async (req, res) => {
    const user = req.user._id;

    // Obtener los filtros de la query string
    const { buyerId, productId } = req.query;

    if (buyerId && !mongoose.Types.ObjectId.isValid(buyerId)) {
        return res.status(400).json({
            message: "Invalid buyer ID",
        });
    }

    if (productId  &&  !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            message: "Invalid product ID",
        });
    }

    // Crear un objeto de filtro dinámico
    let filters = { $or: [{ buyer: user }, { seller: user }] };

    if (buyerId) {
        filters.buyer = buyerId; // Filtrar por buyerId
    }

    if (productId) {
        filters.product = productId; // Filtrar por productId
    }

    // Consultar los chats según los filtros aplicados y ordenar por fecha de creación
    let chats = await Chat.find(filters)
        .populate('product')
        .populate('buyer')
        .populate('seller')
        .populate('messages.user')
        .sort({ "messages.timestamp": -1 }) // Ordenar de más nuevo a más antiguos
        .lean(); 

    chats = chats.map(chat => {
        const { product } = chat;
        
        if (product && product.photo) {
            product.photo = process.env.NODE_ENV !== 'production' 
                ? `http://${req.headers.host}/${publicFolder}/${product.photo}` 
                : `https://${req.headers.host}/api/${publicFolder}/${product.photo}`;
        }
        
        return chat;
    });

    res.status(200).json({ chats });
});

/*Obtener un chat*/
exports.getChat = tryCatch(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.chatId)) {
        return res.status(400).json({
            message: "Invalid chat ID",
        });
    }

    const chat = await Chat.findById(req.params.chatId)
        .populate('product')
        .populate('buyer')
        .populate('seller')
        .populate('messages.user');

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found",
        });
    }

    if (chat.buyer._id.toString() !== req.user._id && chat.seller._id.toString() !== req.user._id) {
        return res.status(403).json({
            message: "Unauthorized to access this chat",
        });
    }

    res.status(200).json({ chat });
});


/*Eliminar un chat*/
exports.deleteChat = async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.chatId)){
        return res.status(400).json({
            message: "Invalid chat ID",
        });
    }
    
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found",
        });
    }

    await Chat.findByIdAndDelete(req.params.chatId);
    res.status(200).json({ message: 'Chat removed' });
}

