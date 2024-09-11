const Transactions = require('../models/Transactions');
const Ad = require("../models/Ad")
const User = require("../models/User")
const { tryCatch } = require('../utils/tryCatch');
const mongoose = require('mongoose');
const MyCreditCard = require('../models/myPersonalData/MyCreditCard');

//Create a new transaction
exports.createTransaction = tryCatch(async (req, res) => {
    console.log(req.body)
    const { id } = req.params;
    const buyerId = req.user._id;
    const ad = await Ad.findById(id)

    if(!ad){
        return res.status(404).json({
            status: "error",
            message: "Ad not found -createTransaction"})
    }

    const buyer = await MyCreditCard.findOne({user: buyerId})

 
    if(!buyer || buyer.last4Digits === "----" ){
         return res.status(400).json({
            status: "error",
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
        status: "success", 
        message: "Purchase transaction created correctly",
        data: transaction})
})


//Handle transaction
exports.handleTransactions = tryCatch(async(req,res) =>{
    const {transactionId} = req.body;
    const {action} = req.body
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

    if(action==="accept"){
        transaction.state= "Reserved";
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
    }else if(action==="reject"){
        transaction.state="Cancelled"
       
        await transaction.save()

        console.log(transaction)

        res.status(200).json({
            state: "success",
            message: "Transaction rejected succesfully",
            data: transaction
        }) 
    }else{
        return res.status(400).json({
            state: "error",
            message: "Invalid action. Use 'accept' o 'reject'"
        })
    }   
    }
)


//Sold transaction
exports.soldTransactions = tryCatch(async(req,res)=> {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const {action} = req.body;

    const transaction = await Transactions.findById(transactionId)
    .populate({seller: userId, state:"Reserved" })

    if(action==="accept"){
        transaction.state="Sold"
        await transaction.save()

        return res.status(200).json({
            state: "success",
            message: "Product sold successfuylly",
            data: transaction,
        })
    }else if(action==="reject"){
        transaction.state="Cancelled"
        await transaction.save()

        return res.status(200).json({
            state: "success",
            message: "Sold successfully cancelled",
            data: transaction,
        })
    }else{
        return res.status(400).json({
            state: "error",
            message: "Invalid action. Use 'accept' or 'reject'"
        })
    }
    
})

exports.getTransactionsBySeller = tryCatch(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    console.log(userId);
    const transactions = await Transactions.find({ seller: userId, state: "Sold" })
    .populate({path: "seller", select: "_id username"});

    console.log(transactions);
    res.status(200).json({state: "success", data: transactions});
});

exports.getTransactionsByBuyer = tryCatch(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId)
    console.log(userId)
    const transactions = await Transactions.find({ buyer: userId, state: "Sold" })
    .populate({path: "seller", select: "_id username"});

    console.log(transactions)
    res.status(200).json({state: "success", data: transactions});
})
