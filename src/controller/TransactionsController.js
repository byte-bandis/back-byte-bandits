const Transactions = require('../models/Transactions');
const { tryCatch } = require('../utils/tryCatch');

exports.getTransactionsBySeller = tryCatch(async (req, res) => {
    const userId = req.params.id;
    const transactions = await Transactions.find({ seller: userId });
    res.status(200).json({ transactions });
})

exports.getTransactionsByBuyer = tryCatch(async (req, res) => {
    const userId = req.params.id;
    const transactions = await Transactions.find({ buyer: userId });
    res.status(200).json({ transactions });
})

exports.getTransactionsByAd = tryCatch(async (req, res) => {
    const adId = req.params.id;
    const transactions = await Transactions.find({ ad: adId });
    res.status(200).json({ transactions });
})

exports.createTransaction = tryCatch(async (req, res) => {
    const seller = req.user._id
    const {buyer, ad, price } = req.body;
    const transaction = await Transactions.create({ seller, buyer, ad, price });
    res.status(201).json({ transaction });
})

// Cambio de esstado de la transaccion
exports.changeState = tryCatch(async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
    const transaction = await Transactions.findByIdAndUpdate(id, { state });
    res.status(200).json({ transaction });
})


//cambio de precio de la trasancion

exports.changePrice = tryCatch(async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;
    const transaction = await Transactions.findByIdAndUpdate(id, { price });
    res.status(200).json({ transaction });
})