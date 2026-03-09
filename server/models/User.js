const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // KYC - Personal Details
  dob: { type: String, default: '' },
  gender: { type: String, enum: ['', 'male', 'female', 'other'], default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  pincode: { type: String, default: '' },
  // KYC - Documents
  pan: { type: String, default: '' },
  aadhaar: { type: String, default: '' },
  // Portfolio
  goldBalance: { type: Number, default: 0 },       // grams
  walletBalance: { type: Number, default: 0 },      // rupees
  totalInvested: { type: Number, default: 0 },      // rupees
  hasRedeemed: { type: Boolean, default: false },
}, { timestamps: true })

// Indexes for admin panel queries
userSchema.index({ role: 1, createdAt: -1 })

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
