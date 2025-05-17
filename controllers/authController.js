const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ReferralTransaction = require("../models/referralTransaction");
const crypto = require('crypto');
const mailSender = require("../utils/mailSender")
const generateReferralCode = (length = 6) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length }, () => alphabet[crypto.randomInt(0, alphabet.length)]).join("");
  };
  


  
  exports.signup = async (req, res) => {
    try {
      const {
        email,
        password,
     
        firstName,
        lastName,
        rafralcode,
        dob,
        country,
        state,
       
        address,
        city,
        zipCode,
       
       
      } = req.body;
  console.log(req.body);
  
      if (!email || !password  || !firstName || !lastName || !dob || !country || !state || !address || !city || !zipCode) {
        return res.status(400).json({ message: "Pleae fill all required fields." });
      }
  
     
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const referralCode = generateReferralCode();
  
      
      const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        dob,
        country,
        state,
        address,
        city,
        zipCode,
        refral: referralCode,
      });
  
      await newUser.save();


      if (rafralcode) {
        const referringUser = await User.findOne({ refral: rafralcode });
  
        if (referringUser) {
          await ReferralTransaction.create({
            user_id: newUser._id,
            referred_by: rafralcode,
            amount: process.env.REFRAL_AMOUNT,
            to_user: newUser._id,
            by_user: referringUser._id,
          });
  
        
        }
      }
      
  
      return res.status(201).json({ message: "User registered successfully." });
  
    } catch (err) {
      console.error("Signup Error:", err);
      return res.status(500).json({ message: "Server error." });
    }
  };
  

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

      const otp = Math.floor(100000 + Math.random() * 900000).toString(); 


    user.otp = otp;
     user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();


    const emailResponse = await mailSender(
        email,
        "Your OTP Code",
       
          `Your login OTP is: ${otp}`
        
      )

      console.log(emailResponse);
   

    return res.status(200).json({ message: "otp send successfully" });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

   
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    
    user.otp = null;
    user.otpExpiry = null;
    user.auth_token = token;
    await user.save();

    return res.status(200).json({
      message: 'OTP verified successfully.',
      token
    });
  } catch (err) {
    console.error('OTP Verification Error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    const userr = req.user;

    if (!userr) {
      return res.status(401).json({
        status: false,
        message: "User not authenticated",
        data: []
      });
    }

   

    return res.status(200).json({
      status: true,
      message: "User profile fetched successfully",
      data: userr
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
      data: []
    });
  }
};

exports.addrefral = async (req, res) => {
    try {


      
      const userr = req.user;
      const { referredBy } = req.body;
      if (!userr) {
      return res.status(401).json({
        status: false,
        message: "User not authenticated",
        data: []
      });
    }

    // if(!referredBy) {
    //     return res.status(400).json({ message: "Please provide a referral code." });
    // }


    if (referredBy) {
        const referringUser = await User.findOne({ refral: referredBy });
  
        if (referringUser) {
          await ReferralTransaction.create({
            user_id: userr._id,
            referred_by: referredBy,
            amount: process.env.REFRAL_AMOUNT,
            to_user: userr._id,
            by_user: referringUser._id,
          });
  
        
        }
      }
  
      
  
      return res.status(200).json({ message: "Referral  generated",  });
    } catch (error) {
      console.error("Referral code generation error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
exports.getrefral = async (req, res) => {
    try {


      
      const userr = req.user;
      
      if (!userr) {
      return res.status(401).json({
        status: false,
        message: "User not authenticated",
        data: []
      });
    }

    // if(!referredBy) {
    //     return res.status(400).json({ message: "Please provide a referral code." });
    // }


       
          const data = await ReferralTransaction.find({
           
            user_id: userr._id
          
          });
  
     
      
  
      return res.status(200).json({ message: "Referral get", data: data });
    } catch (error) {
      console.error("Referral code generation error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

exports.generateReferralCode = async (req, res) => {
    try {


      
      const {userId} = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
    
  
      let referralCode;
      let exists = true;
      while (exists) {
        referralCode = generateReferralCode();
        exists = await User.findOne({ refral: referralCode });
      }
  
      user.refral = referralCode;
      await user.save();
  
      return res.status(200).json({ message: "Referral code generated", code: referralCode });
    } catch (error) {
      console.error("Referral code generation error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  
exports.alluser = async (req, res) => {
    try {


  const alluser = await User.find();
  
      return res.status(200).json({ message: "All user get successfull", data: alluser });
    } catch (error) {
      console.error("Referral code generation error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
