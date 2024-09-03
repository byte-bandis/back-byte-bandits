
const Ad = require("../models/Ad");
const User = require("../models/User");
const Chat = require("../models/Chat");
const { tryCatch } = require("../utils/tryCatch");
const publicFolder = "public/images";

/*Crear un chat*/
exports.createChat = tryCatch(async (req, res) => {
    const user = req.user._id;
    const { productId } = req.body;

    console.log("product", productId);
    console.log("user", user);
    let chat = await Chat.findOne({ product: productId, buyer: user});

    console.log("chat", chat);
    if(!chat){
        const ad = await Ad.findById(productId);
        chat = await Chat.create({ product: productId, buyer: user, seller: ad.user });
    }

    res.status(201).json({ chat });
    }
);

/* Obtener chats de un usuario */
exports.getChats = tryCatch(async (req, res) => {
    const user = req.user._id;

    // Obtener los filtros de la query string
    const { buyerId, productId } = req.query;

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
        .sort({ createdAt: -1 }) // Ordenar de más nuevo a más antiguos
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
exports.getChat = async (req, res) => {
    const chat = await Chat.findById(req.params.chatId).populate('product').populate('buyer').populate('seller').populate('messages.user');
    res.status(200).json({ chat });
};

/*Eliminar un chat*/
exports.deleteChat = async (req, res, next) => {
    const chat = await Chat.findById(req.params.chatId);
    console.log(chat);
    if (!chat) {
        return next({
            message: "Chat not found",
        });
    }
    await Chat.findByIdAndDelete(req.params.chatId);
    res.status(200).json({ message: 'Chat removed' });
}

