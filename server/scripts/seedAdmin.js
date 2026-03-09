const mongoose = require('mongoose')
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const User = require('../models/User')

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')

    const adminEmail = 'admin@goldease.com'

    // Check if admin already exists
    const existing = await User.findOne({ email: adminEmail })
    if (existing) {
      console.log('Admin already exists:', adminEmail)
      process.exit(0)
    }

    // Create admin user (password will be hashed by pre-save hook)
    await User.create({
      name: 'Admin',
      email: adminEmail,
      phone: '0000000000',
      password: 'admin123',
      role: 'admin',
    })

    console.log('Admin created successfully')
    console.log('  Email:    admin@goldease.com')
    console.log('  Password: admin123')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error.message)
    process.exit(1)
  }
}

seedAdmin()
