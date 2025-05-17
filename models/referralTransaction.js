const mongoose = require("mongoose");

const referralTransactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  referred_by: { type: String }, 
  amount: { type: Number}, 

  to_user: { type: mongoose.Schema.Types.ObjectId, ref: "User", }, 
  by_user: { type: mongoose.Schema.Types.ObjectId, ref: "User", }, 
},
{ timestamps: true });

module.exports = mongoose.model("ReferralTransaction", referralTransactionSchema);
