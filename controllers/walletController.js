const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CurrencyRate = require("../models/CurrencyRate");
const Wallethistory = require("../models/Wallethistory");

const referralTransaction = require("../models/referralTransaction");



  


  
 

exports.addcredit = async (req, res) => {
  try {


    const userr = req.user;

    if (!userr) {
      return res.status(401).json({
        status: false,
        message: "User not authenticated",
        data: []
      });
    }

    const {currency , amount , credit} = req.body;
    if (!currency || !amount || !credit) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

     const userdata = await User.findById(userr._id);
    if (!userdata) {
      return res.status(404).json({ message: "User not found." });
    }

    userdata.wallet = userdata.wallet + credit
    await  userdata.save();
   



    const walletHistory = new Wallethistory({
      user_id: userr._id,
      currency: currency,
      amount: amount,
      credit: credit
    });

    await walletHistory.save();



    return res.status(200).json({ message: "credit add successfully" });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
exports.credithistory = async (req, res) => {
  try {


    const userr = req.user;

    if (!userr) {
      return res.status(401).json({
        status: false,
        message: "User not authenticated",
        data: []
      });
    }

   
    

    const data = await Wallethistory.find({
     
         user_id: userr._id
        
    });



    return res.status(200).json({ message: "wallet history get" ,  data: data });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.getCreditsByCurrency = async (req, res) => {
  try {
    const { currency, amount } = req.body;

    if (!currency || !amount) {
      return res.status(400).json({ success: false, message: 'Currency and amount are required.' });
    }

    
    const rate = await CurrencyRate.findOne({ currency }).sort({ updatedAt: -1 });

    if (!rate) {
      return res.status(404).json({ success: false, message: `No rate found for currency: ${currency}` });
    }

    const peramount =  rate.credit / rate.amount;
    const finalcredit = (amount  * peramount );

    return res.status(200).json({
      success: true,
      data: {
        currency,
        amount,
        calculatedCredit: finalcredit
      }
    });
  } catch (error) {
    console.error('Error calculating credits:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.userdashboard = async (req, res) => {
  try {
    const userr = req.user;

    if (!userr) {
      return res.status(401).json({
        status: false,
        message: "User not authenticated",
        data: []
      });
    }

    
    const userdata = await User.findById(userr._id);
    if (!userdata) {
      return res.status(404).json({ message: "User not found." });
    }

    const userWalletHistory = await Wallethistory.find({ user_id: userr._id });
    const userrfrals = await referralTransaction.find({ user_id: userr._id });

    return res.status(200).json({
      success: true,
      data: {
        wallet: userdata.wallet,
        walletHistory: userWalletHistory,
       referralTransaction: userrfrals
      }
    });
  } catch (error) {
    console.error('Error calculating credits:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.totaltokensale = async (req, res) => {
  try {
   
    
  
    const userWalletHistory = await Wallethistory.find();
     const credits = userWalletHistory.reduce((acc, item) => {
      return acc + item.credit;
    }, 0);


    return res.status(200).json({
      success: true,
      wallet:credits
    });
  } catch (error) {
    console.error('Error calculating credits:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.updateratetoken = async (req, res) => {
  try {
   
    
   const {currency , amount , credit} = req.body;
    if (!currency || !amount || !credit) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

     const data = await CurrencyRate.create({
      currency: currency,
      amount: amount,
      credit: credit
     })


    return res.status(200).json({
      success: true,
      message: "Rate updated successfully",
    });
  } catch (error) {
    console.error('Error calculating credits:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};