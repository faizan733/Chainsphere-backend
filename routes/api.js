const express = require("express");
const auth = require('../middleware/auth');
const router = express.Router();


const { signup, login , verifyOtp ,getUserProfile ,addrefral , getrefral, generateReferralCode , alluser} = require("../controllers/authController");
const { addcredit ,credithistory , getCreditsByCurrency ,userdashboard , totaltokensale , updateratetoken} = require("../controllers/walletController");


router.post("/auth/signup",signup);
router.post("/auth/login",login);
router.post("/auth/verify-otp",verifyOtp);
router.post("/auth/me",auth.checkAuth ,getUserProfile);
router.post("/referral/apply",auth.checkAuth ,addrefral);
router.get("/referral/stats",auth.checkAuth ,getrefral);
router.post("/purchase",auth.checkAuth ,addcredit);
router.get("/purchase/history",auth.checkAuth ,credithistory);
router.get("/credit-by-currency",getCreditsByCurrency);
router.get("/dashboard",auth.checkAuth ,userdashboard);
router.get("/admin/users",alluser);
router.get("/admin/stats",totaltokensale);
router.post("/admin/token-rate",updateratetoken);



router.get("/generateReferralCode",generateReferralCode);




module.exports = router;