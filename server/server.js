const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db')
const goldRoutes = require('./routes/gold')
const authRoutes = require('./routes/auth')
const transactionRoutes = require('./routes/transactions')

const adminRoutes = require('./routes/admin')

// Connect to MongoDB
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/gold', goldRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)

app.use('/api/admin', adminRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'GoldEase API Server is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
