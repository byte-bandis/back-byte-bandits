const Transactions = require('../models/Transactions');
const Ad = require("../models/Ad")
const User = require("../models/User")
const { tryCatch } = require('../utils/tryCatch');
const mongoose = require('mongoose');
const MyCreditCard = require('../models/myPersonalData/MyCreditCard');

//Create a new transaction
exports.createTransaction = tryCatch(async (req, res) => {
    console.log(req.body)
    const {id} = req.body;
    const buyerId = req.user._id;
    const ad = await Ad.findById(id)

    if(!ad){
        return res.status(404).json({
            state: "error",
            message: "Ad not found -createTransaction"})
    }

    const buyer = await MyCreditCard.findOne({user: buyerId})

 
    if(!buyer || buyer.last4Digits === "----" ){
         return res.status(400).json({
            state: "error",
            message: "Buyer or credit card buyer not found -createTransaction"
        })
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

    res.status(201).json({
        state: "success", 
        message: "Purchase transaction created correctly",
        data: transaction})
})


//Accept transaction
exports.acceptTransaction = tryCatch(async(req,res) =>{
    const {transactionId} = req.params;
    console.log(transactionId)

    const transaction = await Transactions.findById(transactionId).populate({path: "seller", select: "_id username"})
    console.log(transaction)
    if(!transaction || transaction.state != "Ordered"){
        return res.status(404).json({
            state: "error",
            message: "Transaction not found - acceptTransaction"})
    }

    if(transaction.seller._id.toString() !== req.user._id.toString()){
        return res.status(403).json({message: "Not authorized - acceptTransaction"})
    }

    transaction.state= "Sold";
    const ad = await Ad.findById(transaction.ad)
    ad.buyer = transaction.buyer;
    await transaction.save()
    await ad.save()

    console.log(transaction)

    res.status(200).json({ 
        state: "success", 
        message: "Transaction accepted succesfully",
        data: transaction,
     })
    }
)


//Reject transaction
exports.rejectTransaction = tryCatch(async(req,res)=> {
    const { transactionId} = req.params;

    const transaction = await Transactions.findById(transactionId).populate({path: "seller", select: "_id username"})
    if(!transaction || transaction.state != "Ordered"){
        return res.status(404).json({message: "Transaction not found - rejectTransaction"})
    }

    if(transaction.seller._id.toString() !== req.user._id.toString()){
        return res.status(403).json({message: "No authorized - rejectTransaction"})
    }

    transaction.state = "Cancelled"
    await transaction.save()

    console.log(transaction)

    res.status(200).json({
        state: "success",
        message: "Transaction rejected succesfully",
        data: transaction,
    })
})

exports.getTransactionsBySeller = tryCatch(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    console.log(userId);
    const transactions = await Transactions.find({ seller: userId, state: "Sold" }).populate({path: "seller", select: "_id username"});
    console.log(transactions);
    res.status(200).json({state: "success", data: transactions});
});

exports.getTransactionsByBuyer = tryCatch(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId)
    console.log(userId)
    const transactions = await Transactions.find({ buyer: userId, state: "Cancelled" }).populate({path: "seller", select: "_id username"});
    console.log(transactions)
    res.status(200).json({state: "success", data: transactions});
})
