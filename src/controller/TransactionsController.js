const Transactions = require('../models/Transactions');
const Ad = require("../models/Ad");
const { tryCatch } = require('../utils/tryCatch');
const MyCreditCard = require('../models/myPersonalData/MyCreditCard');
const APIFeatures = require('../utils/ApiFeature');
const publicFolder = "public/images";

//Create a new transaction
exports.createTransaction = tryCatch(async (req, res) => {
    const { id } = req.params;
    const buyerId = req.user._id;
    const ad = await Ad.findById(id);

    if (!ad) {
        return res.status(404).json({
            status: "error",
            message: "Ad not found -createTransaction"
        });
    }

    const buyer = await MyCreditCard.findOne({ user: buyerId });


    if (!buyer || buyer.last4Digits === "----") {
        return res.status(400).json({
            status: "error",
            message: "Buyer or credit card buyer not found -createTransaction"
        });
    }

    const transaction = await Transactions.create({
        buyer: buyerId,
        seller: ad.user._id,
        ad: ad._id,
        price: ad.price,
    });
    transaction.state = "Ordered";
    await transaction.save();



    res.status(201).json({
        status: "success",
        message: "Purchase transaction created correctly",
        data: transaction
    });
});


//Get pending transactions
exports.getPendingTransactions = tryCatch(async (req, res) => {
    const userId = req.user._id; //userId (logged) = seller

    let pendingTransactions = await Transactions.find({
        seller: userId,
        state: "Ordered"
    }).populate("ad buyer");

    pendingTransactions = pendingTransactions.map(transaction => {
        const { ad, ...transactionDetails } = transaction;
        let photoUrl = null;
        if (ad.photo) {

            photoUrl = process.env.NODE_ENV !== 'production'
                ? `http://${req.headers.host}/${publicFolder}/${ad.photo}`
                : `https://${req.headers.host}/api/${publicFolder}/${ad.photo}`;

        }

        return {
            ...transactionDetails._doc,
            ad: {
                ...ad._doc,
                photo: photoUrl
            }
        };
    });


    if (pendingTransactions.length === 0) {
        return res.status(200).json({
            status: "others",
            message: "There is no pending transactions"
        });
    }

    return res.status(200).json({
        status: "success",
        message: "All ordered ads pending for approval or reject",
        data: pendingTransactions,
    });
});


//Handle transactions
exports.handleTransactions = tryCatch(async (req, res) => {
    const { transactionId, action } = req.body;
    const userId = req.user._id; // userId (logged) = seller

    const transaction = await Transactions.findById(transactionId).populate("seller", "username _id");

    if (!transaction || transaction.state !== "Ordered") {
        return res.status(404).json({
            state: "error",
            message: "Transaction not found or not in the correct state"
        });
    }

    if (transaction.seller._id.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not authorized to handle this transaction" });
    }

    if (action === "accept") {
        transaction.state = "Sold";
        const ad = await Ad.findById(transaction.ad);

        if (!ad) {
            return res.status(404).json({
                state: "error",
                message: "Ad not found"
            });
        };

        ad.buyer = transaction.buyer;
        await transaction.save();
        await ad.save();


        res.status(200).json({
            state: "success",
            message: "Transaction accepted succesfully",
            data: transaction,
        });
    } else if (action === "reject") {
        transaction.state = "Cancelled";
        await transaction.save();


        return res.status(200).json({
            state: "success",
            message: "Transaction rejected successfully",
            data: transaction
        });
    } else {
        return res.status(400).json({
            state: "error",
            message: "Invalid action. Use 'accept' or 'reject'."
        });
    }
});


exports.getTransactionsFilters = tryCatch(async (req, res) => {
    const userId = req.user._id;
    req.query.state = { $in: ["Ordered", "Sold"] };
    req.query.seller = userId;
    console.log(req.query);
    const advancedQuery = new APIFeatures(Transactions
        .find({})
        .populate("ad buyer seller")
        .populate({ path: "buyer seller", select: "_id username" })
        , req.query)
        .sort()
        .paginate()
        .filterByUser()
        .fields()
        .filter()
        .searchByTitle()
        .filterByTags()
        .filterByPriceRange()
        .filterByIsBuy();


    let transactions = await advancedQuery.query;
    transactions = transactions.map(transaction => {
        const { ad, ...transactionDetails } = transaction;
        let photoUrl = null;
        if (ad.photo) {

            photoUrl = process.env.NODE_ENV !== 'production'
                ? `http://${req.headers.host}/${publicFolder}/${ad.photo}`
                : `https://${req.headers.host}/api/${publicFolder}/${ad.photo}`;

        }

        return {
            ...transactionDetails._doc,
            ad: {
                ...ad._doc,
                photo: photoUrl
            }
        };
    });

    res.status(200).json({
        state: "success",
        data: transactions,
        message: "Transactions by seller received"
    });
});

exports.getTransactionsByUser = tryCatch(async (req, res) => {
    const userId = req.user._id;


    
    let transactions = await Transactions.find({
        $or: [{ buyer: userId }, { seller: userId }],
        state: { $in: ["Ordered", "Sold"] }
    })
        .populate({ path: "buyer", select: "_id username" })
        .populate({ path: "seller", select: "_id username" })
        .populate("ad", "");
        
        transactions = transactions.map(transaction => {
            const { ad, ...transactionDetails } = transaction;
            let photoUrl = null;
            if (ad.photo) {
    
                photoUrl = process.env.NODE_ENV !== 'production'
                    ? `http://${req.headers.host}/${publicFolder}/${ad.photo}`
                    : `https://${req.headers.host}/api/${publicFolder}/${ad.photo}`;
    
            }
    
            return {
                ...transactionDetails._doc,
                ad: {
                    ...ad._doc,
                    photo: photoUrl
                }
            };
        });
    res.status(200).json({
        state: "success",
        data: transactions,
        message: "Transactions by user received"
    });
})

exports.getCountTransactionsBySeller = tryCatch(async (req, res) => {
    const userId = req.user._id;
    const transactionsCount = await Transactions.countDocuments({
        seller: userId,
    })
    res.status(200).json({
        state: "getAllTransactionsBySeller",
        data: transactionsCount,
        message: "Transactions by seller received"
    });
})

exports.getCountTransactionsByBuyer = tryCatch(async (req, res) => {
    const userId = req.user._id;
    const transactionsCount = await Transactions.countDocuments({
        buyer: userId,
    })
    res.status(200).json({
        state: "getCountTransactionsByBuyer",
        data: transactionsCount,
        message: "Transactions by seller received"
    });
})