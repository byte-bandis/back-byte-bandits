
const Ad = require("../models/Ad");
const Chat = require("../models/Chat");
const User = require("../models/User");
const mongoose = require("mongoose");
const { tryCatch } = require("../utils/tryCatch");
const publicFolder = "public/images";

/*Crear un chat*/
exports.createChat = tryCatch(async (req, res) => {
    const user = req.user._id;
    const { productId, buyerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            message: "Invalid product ID",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
        return res.status(400).json({
            message: "Invalid buyer ID",
        });
    }

    const ad = await Ad.findById(productId);

    if (!ad) {
        return res.status(404).json({
            message: "Ad not found",
        });
    }

    if (ad.user.toString() === buyerId) {
        return res.status(409).json({
            message: "You can't chat with product owner",
        });
    }

    const buyer = await User.findById(buyerId);

    if (!buyer) {
        return res.status(404).json({
            message: "Buyer not found",
        });
    }

    let chat = await Chat.findOne({ product: productId, buyer: buyerId});

    if(chat){
        return res.status(409).json({
            message: "Chat already exists",
        });
    }
    
    if (user.toString() === buyerId) {
        chat = await Chat.create({ product: productId, buyer: user, seller: ad.user });
    } else {
        chat = await Chat.create({ product: productId, buyer: buyerId, seller: user });
    }
    
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
        const newChat = { ...chat };
        const newProduct = { ...newChat.product };
        
        if (newProduct && newProduct.photo) {
            newProduct.photo = process.env.NODE_ENV !== 'production' 
                ? `http://${req.headers.host}/${publicFolder}/${newProduct.photo}` 
                : `https://${req.headers.host}/api/${publicFolder}/${newProduct.photo}`;
        }
        
        newChat.product = newProduct;
        return newChat;
    });

    if(req.query.isExtended === 'true') {
        return res.status(200).json({ chats });
    }
        else {
    res.status(200).json({ chats: 
        chats.map(chat => {
            return {
                _id: chat._id,
                product: chat.product,
                buyer: chat.buyer,
                seller: chat.seller,
                messages: {
                    totalMessages: chat.messages.length,
                    totalUnreadMessages: chat.messages.filter(message => message.read === false && message.user._id.toString() !== user).length,
                }
            };
        }
    )
    });
    }
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

    const { product } = chat;
    if (product && product.photo) {
        product.photo = process.env.NODE_ENV !== 'production' 
            ? `http://${req.headers.host}/${publicFolder}/${product.photo}` 
            : `https://${req.headers.host}/api/${publicFolder}/${product.photo}`;
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

