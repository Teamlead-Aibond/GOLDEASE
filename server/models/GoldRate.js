const mongoose = require('mongoose')

const goldRateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required'],
    unique: true,
  },
  rate22K: {
    type: Number,
    required: [true, '22K rate is required'],
  },
})

goldRateSchema.index({ date: -1 })

module.exports = mongoose.model('GoldRate', goldRateSchema)
