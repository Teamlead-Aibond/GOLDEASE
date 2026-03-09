# GoldEase — Technical Documentation

> A full-stack digital gold investment and jewellery redemption platform

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [How to Run](#4-how-to-run)
5. [Environment Variables](#5-environment-variables)
6. [Database Models](#6-database-models)
7. [API Reference](#7-api-reference)
8. [Authentication & Security](#8-authentication--security)
9. [External API Integration](#9-external-api-integration)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Admin Panel](#11-admin-panel)
12. [Design System](#12-design-system)
13. [Key Business Flows](#13-key-business-flows)

---

## 1. Project Overview

GoldEase is a digital gold investment platform where users can:
- **Buy gold** in rupees or grams (22K/24K) via UPI, Card, Netbanking, or Wallet
- **Track portfolio** with real-time gold price, profit/loss, and transaction history
- **Redeem gold** for physical jewellery (coin, ring, chain, pendant, bracelet, earrings)
- **Receive a redeem code** (RDM-XXXXXX) for in-store verification

Admins can:
- View dashboard analytics (customers, revenue, corpus balance, gold invested)
- Manage customers, payments, and ornament orders
- Verify redeem codes and confirm redemptions
- Export CSV reports (customers, payments, daily/monthly reports, ornaments, redemptions)

---

## 2. Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v20.x | Runtime environment |
| Express.js | v5.2.1 | Web framework |
| MongoDB | v8.0 | NoSQL database |
| Mongoose | v9.2.1 | MongoDB ODM (Object Data Modeling) |
| JSON Web Token | v9.0.3 | Authentication tokens |
| bcryptjs | v3.0.3 | Password hashing |
| express-validator | v7.3.1 | Request validation |
| axios | v1.13.5 | HTTP client (external API calls) |
| cors | v2.8.6 | Cross-Origin Resource Sharing |
| dotenv | v17.3.1 | Environment variable management |
| nodemon | v3.1.14 | Dev auto-restart |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | v19.2.0 | UI library |
| React Router DOM | v7.13.0 | Client-side routing |
| Vite | v7.3.1 | Build tool & dev server |
| Tailwind CSS | v4.2.0 | Utility-first CSS framework |
| ES Modules | — | JavaScript module system |

### External Services
| Service | Purpose |
|---------|---------|
| metals.dev API | Live gold price data (IBJA/MCX rates in INR) |

---

## 3. Project Structure

```
Jewellery_App/
├── server/                          # Backend (Express.js)
│   ├── server.js                    # App entry point (port 5000)
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                  # User JWT authentication
│   │   └── adminAuth.js            # Admin JWT + role check
│   ├── models/
│   │   ├── User.js                  # User schema (profile, KYC, portfolio)
│   │   ├── Transaction.js           # Buy/Redeem transaction records
│   │   ├── Payment.js               # Payment method & status records
│   │   ├── Ornament.js              # Jewellery orders with redeem codes
│   │   └── GoldRate.js              # Gold price history
│   ├── routes/
│   │   ├── auth.js                  # /api/auth/* (register, login, portfolio)
│   │   ├── gold.js                  # /api/gold/* (price, buy, redeem)
│   │   ├── transactions.js          # /api/transactions (history)
│   │   └── admin.js                 # /api/admin/* (dashboard, reports, exports)
│   ├── controllers/
│   │   └── adminDashboard.js        # All admin endpoint handlers (~1079 lines)
│   ├── utils/
│   │   └── goldPriceCache.js        # metals.dev API + 10-min cache
│   ├── scripts/
│   │   └── seedAdmin.js             # Create admin user
│   ├── .env                         # Environment variables
│   └── package.json
│
├── goldease/                        # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx                  # Route definitions
│   │   ├── main.jsx                 # React entry point
│   │   ├── index.css                # Global styles + Tailwind
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # User login
│   │   │   ├── Signup.jsx           # 3-step registration
│   │   │   └── Dashboard.jsx        # User investment dashboard
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top navigation
│   │   │   ├── HeroSection.jsx      # Landing hero with live price
│   │   │   ├── GoldPriceSection.jsx # 24K/22K/18K price cards
│   │   │   ├── HowItWorks.jsx       # Process steps
│   │   │   ├── InvestmentShowcase.jsx # Investment demo
│   │   │   ├── Features.jsx         # Platform features
│   │   │   ├── Testimonials.jsx     # User reviews
│   │   │   ├── FAQ.jsx              # Frequently asked questions
│   │   │   ├── DownloadApp.jsx      # App download CTA
│   │   │   ├── Footer.jsx           # Page footer
│   │   │   ├── WhatsAppWidget.jsx   # Chat widget
│   │   │   ├── ProtectedRoute.jsx   # Auth route guard
│   │   │   └── Dashboard/
│   │   │       ├── Sidebar.jsx      # Dashboard navigation
│   │   │       ├── DashHeader.jsx   # Dashboard header
│   │   │       ├── GoldBalanceCard.jsx
│   │   │       ├── LivePriceCard.jsx
│   │   │       ├── QuickActions.jsx
│   │   │       ├── PriceChart.jsx
│   │   │       ├── RecentTransactions.jsx
│   │   │       ├── BuyGoldModal.jsx # Gold purchase flow
│   │   │       ├── RedeemModal.jsx  # Gold redemption flow
│   │   │       └── RedeemCodeCard.jsx
│   │   ├── admin/
│   │   │   ├── pages/
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminCustomers.jsx
│   │   │   │   ├── AdminPayments.jsx
│   │   │   │   ├── AdminOrnaments.jsx
│   │   │   │   ├── AdminDailyReport.jsx
│   │   │   │   ├── AdminMonthlyReport.jsx
│   │   │   │   └── AdminRedeemVerification.jsx
│   │   │   ├── components/
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── AdminProtectedRoute.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── KPICards.jsx
│   │   │   │   ├── CorpusCard.jsx
│   │   │   │   ├── GoldInvestedCard.jsx
│   │   │   │   ├── CustomersTable.jsx
│   │   │   │   ├── PaymentsTable.jsx
│   │   │   │   ├── OrnamentTable.jsx
│   │   │   │   ├── OrnamentPieChart.jsx
│   │   │   │   ├── RedemptionLogsTable.jsx
│   │   │   │   ├── OrnamentSection.jsx
│   │   │   │   ├── PurchasesSection.jsx
│   │   │   │   ├── RedemptionSection.jsx
│   │   │   │   ├── AveragesSection.jsx
│   │   │   │   ├── DateFilter.jsx
│   │   │   │   ├── PeriodFilter.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   └── ExportButton.jsx
│   │   │   ├── utils/
│   │   │   │   ├── adminApi.js      # Admin API wrapper
│   │   │   │   └── exportCSV.js     # CSV export helper
│   │   │   └── AdminAuthContext.jsx  # Admin auth state
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx       # User auth state
│   │   ├── hooks/
│   │   │   └── useGoldPrice.js       # Gold price hook (10-min refresh)
│   │   └── utils/
│   │       └── api.js                # User API wrapper
│   ├── public/
│   │   └── images/                   # Static images
│   ├── vite.config.js
│   └── package.json
```

---

## 4. How to Run

### Prerequisites
- **Node.js** v18+ (recommended v20)
- **MongoDB** v7+ running on localhost:27017
- **npm** (comes with Node.js)

### Step 1: Clone the project
```bash
git clone <repository-url>
cd Jewellery_App
```

### Step 2: Setup Backend
```bash
cd server
npm install
```

### Step 3: Configure environment
Create `server/.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/goldease
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
METALS_DEV_API_KEY=your_metals_dev_api_key
```

### Step 4: Seed admin user
```bash
npm run seed:admin
```
This creates an admin account:
- Email: `admin@goldease.com`
- Password: `admin123`

### Step 5: Start Backend
```bash
npm run dev        # Development (auto-restart with nodemon)
# or
npm start          # Production
```
Server runs at: **http://localhost:5000**

### Step 6: Setup Frontend
```bash
cd ../goldease
npm install
```

### Step 7: Start Frontend
```bash
npm run dev
```
App runs at: **http://localhost:5173**

### Step 8: Access the application
| URL | Page |
|-----|------|
| http://localhost:5173 | Landing page |
| http://localhost:5173/login | User login |
| http://localhost:5173/signup | User registration |
| http://localhost:5173/dashboard | User dashboard (after login) |
| http://localhost:5173/admin/login | Admin login |
| http://localhost:5173/admin/dashboard | Admin dashboard |
| http://localhost:5173/admin/customers | Customer management |
| http://localhost:5173/admin/payments | Payment tracking |
| http://localhost:5173/admin/ornaments | Ornament orders |
| http://localhost:5173/admin/daily-report | Daily analytics |
| http://localhost:5173/admin/monthly-report | Monthly analytics |
| http://localhost:5173/admin/redeem-verification | Redeem code verification |

### Build for Production
```bash
cd goldease
npm run build       # Outputs to dist/
npm run preview     # Preview production build
```

---

## 5. Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/goldease` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `goldease_jwt_secret_key_2026` |
| `JWT_EXPIRE` | JWT token expiration | `30d` |
| `METALS_DEV_API_KEY` | API key for metals.dev gold price API | `your_api_key_here` |

---

## 6. Database Models

### Users Collection
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name (required) |
| `email` | String | Unique email (required, lowercase) |
| `phone` | String | Phone number (required) |
| `password` | String | bcrypt hash (not selected by default) |
| `role` | String | `user` or `admin` (default: user) |
| `dob` | String | Date of birth |
| `gender` | String | male / female / other |
| `address` | String | Street address |
| `city` | String | City |
| `pincode` | String | PIN code |
| `pan` | String | PAN card number |
| `aadhaar` | String | Aadhaar number |
| `goldBalance` | Number | Gold in grams (default: 0) |
| `walletBalance` | Number | Wallet in rupees (default: 0) |
| `totalInvested` | Number | Total invested in rupees (default: 0) |
| `hasRedeemed` | Boolean | Whether user has redeemed (default: false) |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

### Transactions Collection
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Reference to User |
| `type` | String | `buy` or `redeem` |
| `grams` | Number | Gold weight in grams |
| `amount` | Number | Value in rupees |
| `pricePerGram` | Number | Gold rate at time of transaction |
| `status` | String | `completed` / `processing` / `failed` |
| `description` | String | Transaction description |
| `createdAt` | Date | Auto-generated |

### Payments Collection
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Reference to User |
| `transactionId` | ObjectId | Reference to Transaction |
| `amount` | Number | Payment amount in rupees |
| `method` | String | `upi` / `card` / `netbanking` / `wallet` |
| `status` | String | `success` / `pending` / `failed` |
| `referenceId` | String | Payment reference ID |
| `createdAt` | Date | Auto-generated |

### Ornaments Collection
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Reference to User |
| `ornamentName` | String | Jewellery name (e.g., "Gold Ring") |
| `category` | String | `coin` / `ring` / `necklace` / `bracelet` / `earring` / `bangle` / `pendant` / `chain` / `other` |
| `goldWeightGrams` | Number | Gold weight used |
| `pricePerGram` | Number | Gold rate at redemption |
| `makingCharges` | Number | Making charges in rupees |
| `totalPrice` | Number | Gold value + making charges |
| `status` | String | `ordered` / `processing` / `ready` / `delivered` / `cancelled` |
| `redeemCode` | String | Unique code (format: RDM-XXXXXX) |
| `redeemStatus` | String | `pending` / `completed` |
| `createdAt` | Date | Auto-generated |

### GoldRates Collection
| Field | Type | Description |
|-------|------|-------------|
| `date` | Date | Rate date (unique) |
| `rate22K` | Number | 22K gold rate per gram |

---

## 7. API Reference

### Authentication APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | User | Get current user profile |
| GET | `/api/auth/portfolio` | User | Get portfolio (balance, returns, redeem status) |

### Gold Trading APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/gold/price` | No | Get live 24K/22K/18K gold prices |
| POST | `/api/gold/buy` | User | Buy gold (amount or grams, karat, payment method) |
| POST | `/api/gold/redeem` | User | Redeem gold for jewellery (generates RDM code) |

### Transaction APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/transactions` | User | Get transaction history (paginated, filterable by type) |

### Admin Dashboard APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/admin/login` | No | Admin login (checks role=admin) |
| GET | `/api/admin/me` | Admin | Get admin profile |
| GET | `/api/admin/dashboard-summary` | Admin | KPIs: total customers, today's revenue, etc. |
| GET | `/api/admin/dashboard-extended` | Admin | Detailed analytics by period |
| GET | `/api/admin/daily-report` | Admin | Day-wise transaction breakdown |
| GET | `/api/admin/monthly-report` | Admin | Month-wise analytics with charts |
| GET | `/api/admin/customers` | Admin | Paginated customer list with search |
| GET | `/api/admin/payments` | Admin | Paginated payments with filters |
| GET | `/api/admin/ornaments` | Admin | Paginated ornament orders |
| GET | `/api/admin/ornaments/category-stats` | Admin | Category breakdown |
| GET | `/api/admin/redeem-verify` | Admin | Lookup redeem code |
| PATCH | `/api/admin/redeem-verify/:id/confirm` | Admin | Confirm redemption |
| GET | `/api/admin/redemption-logs` | Admin | Redemption history |
| GET | `/api/admin/customers/:userId/transactions` | Admin | Customer's full transaction log |

### CSV Export APIs (All Admin)

| Endpoint | Description |
|----------|-------------|
| GET `/api/admin/customers/export` | Export customers CSV |
| GET `/api/admin/payments/export` | Export payments CSV |
| GET `/api/admin/daily-report/export` | Export daily report CSV |
| GET `/api/admin/monthly-report/export` | Export monthly report CSV |
| GET `/api/admin/ornaments/export` | Export ornaments CSV |
| GET `/api/admin/redemption-logs/export` | Export redemption logs CSV |

---

## 8. Authentication & Security

### JWT Authentication Flow
```
1. User sends email + password  →  POST /api/auth/login
2. Server verifies password     →  bcryptjs compare
3. Server creates JWT token     →  { id: userId }, expires in 30 days
4. Client stores token          →  localStorage ('goldease_token' or 'goldease_admin_token')
5. Client sends token           →  Authorization: Bearer <token>
6. Middleware verifies token     →  auth.js or adminAuth.js
```

### Password Security
- Hashed with **bcryptjs** (12 salt rounds) before saving
- Never returned in API responses (`select: false` on schema)
- Compared using `user.matchPassword()` method

### Middleware Guards
| Middleware | File | Checks |
|-----------|------|--------|
| `protect` | `middleware/auth.js` | Valid JWT token + user exists |
| `verifyAdmin` | `middleware/adminAuth.js` | Valid JWT + user.role === 'admin' |

### Token Storage
| Token | localStorage Key | Used By |
|-------|-----------------|---------|
| User token | `goldease_token` | User dashboard, buy/redeem, transactions |
| Admin token | `goldease_admin_token` | All admin panel pages |

---

## 9. External API Integration

### Gold Price — metals.dev

| Detail | Value |
|--------|-------|
| Provider | metals.dev |
| Endpoint | `GET https://api.metals.dev/v1/latest` |
| Parameters | `api_key`, `currency=INR`, `unit=g` |
| Cache Duration | 10 minutes (server-side) |
| File | `server/utils/goldPriceCache.js` |

### Price Calculation
```
API returns → ibja_gold (IBJA 24K rate, Indian retail standard)

price24K = ibja_gold                    (e.g., ₹16,132)
price22K = price24K × (22/24)           (e.g., ₹14,788)
price18K = price24K × (18/24)           (e.g., ₹12,099)
```

### Fallback Chain
1. IBJA Gold rate (primary — Indian retail standard)
2. MCX Gold rate (secondary — commodity exchange)
3. Spot Gold rate (tertiary — international)
4. Cached data (if all API calls fail)

---

## 10. Frontend Architecture

### Routing Structure (App.jsx)
```
/                           → Home (landing page)
/login                      → Login
/signup                     → Signup (3-step registration)
/dashboard                  → Dashboard (protected - user only)
/admin/login                → AdminLogin
/admin/                     → AdminLayout (protected - admin only)
  ├── dashboard             → AdminDashboard
  ├── customers             → AdminCustomers
  ├── payments              → AdminPayments
  ├── ornaments             → AdminOrnaments
  ├── daily-report          → AdminDailyReport
  ├── monthly-report        → AdminMonthlyReport
  └── redeem-verification   → AdminRedeemVerification
```

### State Management
- **React Context API** — No Redux/Zustand needed
- `AuthContext` — User login state, token, user object
- `AdminAuthContext` — Admin login state, token, admin object
- `useGoldPrice` hook — Shared gold price state with 10-min auto-refresh

### API Wrappers
| File | Base URL | Token Key | Used By |
|------|----------|-----------|---------|
| `src/utils/api.js` | `http://localhost:5000/api` | `goldease_token` | User pages |
| `src/admin/utils/adminApi.js` | `http://localhost:5000/api` | `goldease_admin_token` | Admin pages |

---

## 11. Admin Panel

### Dashboard Page
- **KPI Cards**: Total Customers, Joined Today
- **Corpus Card**: Balance, Total Invested, Total Redeemed
- **Gold Invested Card**: Total grams, Total value
- **Redemption Section**: Customers redeemed, Redeemed value, Gold redeemed
- **Averages Section**: Avg investment, Avg redemption, Avg ornament price
- **Ornament Section**: Total ornaments, Total value, Category breakdown chart
- **Purchases Table**: Recent buy + ornament orders merged

### Reports
- **Daily Report**: New customers, payments by method table
- **Monthly Report**: Revenue bar charts (current vs previous month), payment method breakdown

### Management Pages
- **Customers**: Search, date filter, pagination, CSV export
- **Payments**: Status/method filter, date range, pagination, CSV export
- **Ornaments**: Category/status filter, date range, pie chart, pagination, CSV export
- **Redeem Verification**: Code lookup → customer info + transaction history → confirm button

---

## 12. Design System

### Brand Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Maroon | `#6B1532` | Primary brand, buttons, accents |
| Dark Maroon | `#4A0E23` | Hover states, gradients |
| Gold | `#D4AF37` | Secondary brand, gold values, highlights |
| Black | `#1a1a1a` | Primary text |
| Dark Gray | `#555` / `#666` | Secondary text |
| Gray | `#999` | Tertiary text, labels |
| Light Gray | `#ccc` | Placeholder text |
| Border | `#E5E5E5` | Card borders, dividers |
| Background | `#F5F5F5` | Page background |
| White | `#FFFFFF` | Card backgrounds |

### Card Style (Unified)
```
bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300
```

### Typography
- Font: System default (Tailwind sans)
- Headings: `font-bold text-[#1a1a1a]`
- Body: `text-sm text-[#666]`
- Labels: `text-xs text-[#999] uppercase tracking-wider`

---

## 13. Key Business Flows

### Buy Gold Flow
```
User selects amount/grams → chooses karat (22K/24K) → selects payment method
    → POST /api/gold/buy
        → Middleware: verify JWT
        → Fetch live gold price (cache or metals.dev)
        → Calculate grams = amount / pricePerGram
        → Update User: goldBalance += grams, totalInvested += amount
        → Create Transaction (type: 'buy')
        → Create Payment record
    → Response: transaction details + updated balance
```

### Redeem Gold Flow
```
User selects jewellery → confirms order
    → POST /api/gold/redeem
        → Middleware: verify JWT
        → Check: hasRedeemed === false, goldBalance > 0
        → Fetch live 22K price
        → Calculate goldValue = grams × price22K
        → Update User: goldBalance = 0, hasRedeemed = true
        → Create Transaction (type: 'redeem')
        → Generate unique RDM-XXXXXX code
        → Create Ornament order (redeemStatus: 'pending')
    → Response: redeem code + transaction details
```

### Admin Verification Flow
```
Admin enters redeem code (e.g., RDM-482913)
    → GET /api/admin/redeem-verify?code=RDM-482913
        → Find Ornament by redeemCode
        → Populate customer details (name, email, phone)
    → Response: customer info + ornament details + status

    → Auto-fetch: GET /api/admin/customers/:userId/transactions
        → All buy/redeem transactions for this customer
    → Display: transaction history table

Admin clicks "Confirm Redemption"
    → PATCH /api/admin/redeem-verify/:ornamentId/confirm
        → Update Ornament: redeemStatus = 'completed'
    → Response: confirmation message
```

---

## Summary

| Metric | Count |
|--------|-------|
| Backend Dependencies | 8 |
| Frontend Dependencies | 3 |
| Database Collections | 5 |
| API Endpoints | 35+ |
| React Pages | 12 (4 user + 8 admin) |
| React Components | 40+ |
| CSV Export Endpoints | 6 |
| External APIs | 1 (metals.dev) |
| Middleware Guards | 2 (user + admin) |
| Seed Scripts | 7 |
