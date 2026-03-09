const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['buy', 'redeem'],
    required: true,
  },
  grams: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  pricePerGram: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['completed', 'processing', 'failed'],
    default: 'completed',
  },
  description: {
    type: String,
    default: '',
  },
}, { timestamps: true })

// Compound index: admin daily/monthly reports filter by type + date
// e.g. "total gold bought today" → { type: 'buy', createdAt: { $gte: today } }
transactionSchema.index({ type: 1, createdAt: -1 })

module.exports = mongoose.model('Transaction', transactionSchema)
