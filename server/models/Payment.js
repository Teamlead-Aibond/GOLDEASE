const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: 0,
  },
  method: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'wallet'],
    required: [true, 'Payment method is required'],
  },
  status: {
    type: String,
    enum: ['success', 'pending', 'failed'],
    default: 'pending',
  },
  referenceId: {
    type: String,
    default: '',
  },
}, { timestamps: true })

// Compound index: admin queries filter by status + date range
// e.g. "all successful payments today" → { status: 'success', createdAt: { $gte: today } }
paymentSchema.index({ status: 1, createdAt: -1 })

// Index: lookup all payments for a specific user
paymentSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Payment', paymentSchema)
