const mongoose = require('mongoose');

const walletHistorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,

  },
  credit: {
    type: Number,
    required: true,
    
  },
 
}, {
  timestamps: true 
});

module.exports = mongoose.model('WalletHistory', walletHistorySchema);
