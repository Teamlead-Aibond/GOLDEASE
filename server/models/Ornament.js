const mongoose = require('mongoose')

const ornamentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  ornamentName: {
    type: String,
    required: [true, 'Ornament name is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['coin', 'ring', 'necklace', 'bracelet', 'earring', 'bangle', 'pendant', 'chain', 'other'],
    required: [true, 'Category is required'],
  },
  goldWeightGrams: {
    type: Number,
    required: [true, 'Gold weight is required'],
  },
  pricePerGram: {
    type: Number,
    required: [true, 'Price per gram is required'],
  },
  makingCharges: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
  },
  status: {
    type: String,
    enum: ['ordered', 'processing', 'ready', 'delivered', 'cancelled'],
    default: 'ordered',
  },
  redeemCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  redeemStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
}, { timestamps: true })

// Compound index: admin reports filter by status + date
ornamentSchema.index({ status: 1, createdAt: -1 })
ornamentSchema.index({ redeemCode: 1 })

module.exports = mongoose.model('Ornament', ornamentSchema)
