
const Ad = require("../models/Ad");
const User = require("../models/User");
const Chat = require("../models/Chat");
const { tryCatch } = require("../utils/tryCatch");

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

/*Obtener chats de un usuario*/
exports.getChats = tryCatch(async (req, res) => {
    const user = req.user._id;
    const chats = await Chat.find({ $or: [{ buyer: user }, { seller: user }] }).populate('product').populate('buyer').populate('seller').populate('messages.user');
    res.status(200).json({ chats });
});

/*Obtener un chat*/
exports.getChat = async (req, res) => {
    const chat = await Chat.findById(req.params.id).populate('product').populate('buyer').populate('seller').populate('messages.user');
    res.status(200).json({ chat });
};

