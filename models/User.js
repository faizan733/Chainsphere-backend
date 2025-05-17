const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  
  wallet: {
    type: Number,
    default: 0,
  },
  dob: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
 
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
  },
 
  refral: {
    type: String,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: String,
  },
  auth_token: {
    type: String,
  },
 
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
