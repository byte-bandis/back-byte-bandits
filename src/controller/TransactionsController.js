const Transactions = require('../models/Transactions');
const Ad = require("../models/Ad")
const User = require("../models/User")
const { tryCatch } = require('../utils/tryCatch');
const mongoose = require('mongoose');

//Create a new transaction
exports.createTransaction = tryCatch(async (req, res) => {
    console.log(req.body)
    const {id} = req.body;
    const buyerId = req.user._id;

    console.log(id)
    const ad = await Ad.findById(id)
    console.log(ad)
    if(!ad){
        return res.status(404).json({message: "Ad not found controller"})
    }

    const transaction = await Transactions.create({
        buyer: buyerId,
        seller: ad.user._id,
        ad: ad._id,
        price: ad.price,
    })
    transaction.state= "Ordered";
    await transaction.save()
    

    console.log(transaction)

    res.status(201).json({success: true, data: transaction})
})


//Accept transaction
exports.acceptTransaction = tryCatch(async(req,res) =>{
    const {transactionId} = req.params;
    console.log(transactionId)

    const transaction = await Transactions.findById(transactionId).populate("ad seller")
    console.log(transaction)
    if(!transaction || transaction.state != "Ordered"){
        return res.status(404).json({message: "Transaction not found"})
    }

    if(transaction.seller._id.toString() !== req.user._id.toString()){
        return res.status(403).json({message: "Not authorized"})
    }

    transaction.state= "Sold";
    const ad = await Ad.findById(transaction.ad)
    ad.buyer = transaction.buyer;
    await transaction.save()
    await ad.save()

    console.log(transaction)

    res.status(200).json({ 
        success: true, 
        data: transaction,
     })
    }
)


//Reject transaction
exports.rejectTransaction = tryCatch(async(req,res)=> {
    const { transactionId} = req.params;

    const transaction = await Transactions.findById(transactionId).populate("ad seller")
    if(!transaction || transaction.state != "Ordered"){
        return res.status(404).json({message: "Transaction not found"})
    }

    if(transaction.seller._id.toString() !== req.user._id.toString()){
        return res.status(403).json({message: "No authorized"})
    }

    transaction.state = "Cancelled"
    await transaction.save()

    console.log(transaction)

    res.status(200).json({
        success: true,
        data: transaction,
    })
})

exports.getTransactionsBySeller = tryCatch(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId); // Convertir a ObjectId
    console.log(userId);
    const transactions = await Transactions.find({ seller: userId }).populate("ad seller");
    console.log(transactions);
    res.status(200).json({ transactions });
});

exports.getTransactionsByBuyer = tryCatch(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId)
    console.log(userId)
    const transaction = await Transactions.find({ buyer: userId }).populate("ad buyer");
    console.log(transaction)
    res.status(200).json({ transaction });
})


// exports.getTransactionsByAd = tryCatch(async (req, res) => {
//     const adId = req.params.id;
//     const transactions = await Transactions.find({ ad: adId });
//     res.status(200).json({ transactions });
// })

// // Cambio de esstado de la transaccion
// exports.changeState = tryCatch(async (req, res) => {
//     const { id } = req.params;
//     const { state } = req.body;
//     const transaction = await Transactions.findByIdAndUpdate(id, { state });
//     res.status(200).json({ transaction });
// })


// //cambio de precio de la trasancion

// exports.changePrice = tryCatch(async (req, res) => {
//     const { id } = req.params;
//     const { price } = req.body;
//     const transaction = await Transactions.findByIdAndUpdate(id, { price });
//     res.status(200).json({ transaction });
// })