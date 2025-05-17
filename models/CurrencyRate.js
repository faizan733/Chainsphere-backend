const mongoose = require('mongoose');

const currencyRateSchema = new mongoose.Schema({
  currency: {
    type: String,
    enum: ['USDT', 'BNB'],
    required: true,
 
  },
  amount: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
  },
  credit: {
    type: Number,
    required: true,
    min: 0,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CurrencyRate', currencyRateSchema);
