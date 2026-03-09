# GoldEase — Business Document

> Digital Gold Investment & Jewellery Redemption Platform

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Stakeholders](#2-business-stakeholders)
3. [Business Problem](#3-business-problem)
4. [Solution](#4-solution)
5. [Target Audience](#5-target-audience)
6. [Business Model](#6-business-model)
7. [Platform Features](#7-platform-features)
8. [User Journey](#8-user-journey)
9. [Admin Operations](#9-admin-operations)
10. [Revenue Streams](#10-revenue-streams)
11. [Gold Pricing Strategy](#11-gold-pricing-strategy)
12. [Product Catalogue](#12-product-catalogue)
13. [Security & Compliance](#13-security--compliance)
14. [Key Metrics & KPIs](#14-key-metrics--kpis)
15. [Current Platform Statistics](#15-current-platform-statistics)
16. [Competitive Advantages](#16-competitive-advantages)
17. [Future Roadmap](#17-future-roadmap)
18. [Glossary](#18-glossary)

---

## 1. Executive Summary

GoldEase is a digital gold investment platform that enables customers to **buy gold online in small amounts** and **redeem it as physical jewellery** from a trusted jewellery store. It bridges the gap between digital gold savings and traditional jewellery purchase by offering a convenient, transparent, and secure platform.

### Key Value Proposition
- **For Customers**: Buy gold at live market rates, accumulate over time, and convert to jewellery when ready — no need to save large lump sums
- **For the Jewellery Business**: Build a loyal customer base through recurring digital investments that convert to jewellery purchases with guaranteed demand

### Platform at a Glance
| Metric | Value |
|--------|-------|
| Total Registered Customers | 57 |
| Customers Who Redeemed | 23 |
| Pending Redemptions | 3 |
| Gold Karats Supported | 22K, 24K |
| Payment Methods | UPI, Card, Netbanking, Wallet |
| Jewellery Categories | 6 (Coin, Ring, Pendant, Chain, Bracelet, Earrings) |

---

## 2. Business Stakeholders

### Stakeholder Map

```
                            ┌───────────────────────┐
                            │    JEWELLERY STORE     │
                            │       OWNER            │
                            │   (Primary Business    │
                            │    Stakeholder)        │
                            └───────────┬───────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ↓                   ↓                   ↓
          ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
          │   CUSTOMERS     │ │  STORE ADMIN    │ │  STORE STAFF    │
          │   (End Users)   │ │  (Operations)   │ │  (Fulfilment)   │
          └─────────────────┘ └─────────────────┘ └─────────────────┘
                    │                   │                   │
                    ↓                   ↓                   ↓
          ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
          │  PAYMENT        │ │  GOLD PRICE     │ │  JEWELLERY      │
          │  GATEWAY        │ │  PROVIDER       │ │  ARTISANS       │
          │  (Razorpay)     │ │  (metals.dev)   │ │  (Craftsmen)    │
          └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Internal Stakeholders

| Stakeholder | Role | Responsibilities | Interest in Platform |
|-------------|------|-----------------|---------------------|
| **Jewellery Store Owner** | Business Owner & Decision Maker | Sets business strategy, approves product catalogue, determines making charges, manages finances, oversees corpus utilization | Revenue growth, customer acquisition, competitive advantage over traditional schemes |
| **Store Admin** | Platform Operations Manager | Manages admin dashboard, verifies redemptions, monitors KPIs, exports reports, tracks customers and payments | Smooth daily operations, accurate reporting, fraud prevention |
| **Store Staff (Sales)** | In-Store Fulfilment | Handles walk-in customers with RDM codes, verifies identity, hands over jewellery, upsells additional products | Quick verification process, customer satisfaction, cross-selling opportunities |
| **Jewellery Artisans/Goldsmiths** | Product Fulfilment | Craft jewellery items (rings, chains, pendants, etc.) based on ornament orders from the platform | Predictable order volume, clear specifications (weight, category, karat) |

### External Stakeholders

| Stakeholder | Role | Responsibilities | Dependency |
|-------------|------|-----------------|------------|
| **Customers (End Users)** | Gold Investors & Jewellery Buyers | Register, buy gold, track portfolio, redeem for jewellery | Core revenue source — all investments flow through customers |
| **Payment Gateway (Razorpay)** | Payment Processing Partner | Processes UPI, card, netbanking, and wallet payments securely | Critical dependency — without payment gateway, no gold purchases possible |
| **Gold Price Provider (metals.dev API)** | Market Data Supplier | Supplies real-time IBJA gold rates (22K, 24K, 18K) | Essential for pricing — stale prices would cause incorrect gold calculations |
| **IBJA (Indian Bullion & Jewellers Association)** | Rate Benchmark Authority | Sets the official retail gold rate used across Indian jewellery market | Industry standard — all pricing is based on IBJA benchmark |
| **Cloud Hosting Provider** | Infrastructure | Hosts the server, database, and frontend application | Platform availability depends on uptime |
| **Regulatory Bodies** | Compliance Oversight | RBI, SEBI, BIS (Bureau of Indian Standards) for gold purity standards, IT department for tax compliance | Must comply with KYC norms, gold trading regulations, and data protection laws |

### Stakeholder Interest vs. Influence Matrix

```
HIGH INFLUENCE
    │
    │  ┌─────────────────┐    ┌─────────────────┐
    │  │  Store Owner     │    │  Regulatory      │
    │  │  (Manage         │    │  Bodies          │
    │  │   Closely)       │    │  (Monitor)       │
    │  └─────────────────┘    └─────────────────┘
    │
    │  ┌─────────────────┐    ┌─────────────────┐
    │  │  Store Admin     │    │  Payment Gateway │
    │  │  (Manage         │    │  (Keep           │
    │  │   Closely)       │    │   Satisfied)     │
    │  └─────────────────┘    └─────────────────┘
    │
    │  ┌─────────────────┐    ┌─────────────────┐
    │  │  Customers       │    │  Gold Price API  │
    │  │  (Manage         │    │  (Monitor)       │
    │  │   Closely)       │    │                  │
    │  └─────────────────┘    └─────────────────┘
    │
    │  ┌─────────────────┐    ┌─────────────────┐
    │  │  Store Staff     │    │  Artisans        │
    │  │  (Keep           │    │  (Keep           │
    │  │   Informed)      │    │   Informed)      │
    │  └─────────────────┘    └─────────────────┘
    │
LOW INFLUENCE
    └──────────────────────────────────────────────→
    LOW INTEREST                         HIGH INTEREST
```

### Stakeholder Communication Plan

| Stakeholder | Communication Channel | Frequency | Information Shared |
|-------------|----------------------|-----------|-------------------|
| **Store Owner** | Admin Dashboard, Monthly Reports, CSV Exports | Daily dashboard, Monthly review | KPIs, corpus balance, revenue, growth metrics, redemption trends |
| **Store Admin** | Admin Panel (real-time) | Continuous / Real-time | New signups, pending redemptions, daily transactions, customer data |
| **Store Staff** | Redeem Verification Page | Per customer visit | RDM code lookup, customer identity, ornament details |
| **Customers** | Platform UI, WhatsApp Widget | On-demand | Gold prices, portfolio value, transaction history, redeem status |
| **Payment Gateway** | API Integration (automated) | Per transaction | Payment status, settlement, refund requests |
| **Gold Price Provider** | API Polling (automated) | Every 10 minutes | Live gold rates (22K, 24K, 18K) |

### Value Each Stakeholder Receives

| Stakeholder | Value Proposition |
|-------------|-------------------|
| **Store Owner** | New revenue channel, loyal customer base, working capital through corpus, competitive edge, data-driven decisions |
| **Store Admin** | Automated reporting (no manual registers), fraud-proof verification with RDM codes, complete customer visibility |
| **Store Staff** | Easy verification process (just search RDM code), customer history available for personalized service |
| **Artisans** | Predictable orders with clear specs, advance notice through pending redemptions |
| **Customers** | Flexible gold savings (₹100+), live transparent pricing, secure digital portfolio, convenient jewellery redemption |
| **Payment Gateway** | Transaction volume and processing fees |
| **Gold Price Provider** | API subscription revenue |

---

## 3. Business Problem

### Traditional Jewellery Purchase Challenges

**For Customers:**
- Buying jewellery requires a **large one-time payment** (₹30,000–₹2,00,000+)
- Monthly savings schemes at jewellery stores are **manual and inflexible** — fixed amount, fixed tenure, must visit store
- No visibility into **live gold rates** — customers don't know if they're paying fair prices
- No way to track **investment growth** over time
- **Physical visit required** for every payment and purchase

**For Jewellery Business:**
- Customer **drop-off** in traditional chit/savings schemes (forget to pay, lose interest)
- **No digital presence** — losing younger, tech-savvy customers to apps like Paytm Gold, Google Pay Gold
- **Unpredictable demand** — don't know when customers will walk in to buy
- **Manual record-keeping** of scheme payments, customer details, redemption tracking
- No **analytics or reporting** for business decisions

---

## 4. Solution

GoldEase solves these problems with a **three-step digital gold journey**:

```
   STEP 1                    STEP 2                     STEP 3
┌─────────────┐         ┌──────────────┐          ┌──────────────┐
│  BUY GOLD   │         │   ACCUMULATE │          │    REDEEM    │
│             │         │              │          │              │
│ Buy gold    │         │ Watch your   │          │ Convert gold │
│ in any      │────────→│ gold grow    │─────────→│ to jewellery │
│ amount,     │         │ with live    │          │ of your      │
│ anytime     │         │ market rates │          │ choice       │
└─────────────┘         └──────────────┘          └──────────────┘
  ₹100 to ₹1L+          Track returns              Get a unique
  22K or 24K             Portfolio view              RDM code
  UPI/Card/Net           Price charts                Walk-in pickup
```

---

## 5. Target Audience

### Primary Customers

| Segment | Description | Behaviour |
|---------|-------------|-----------|
| **Young Professionals (25-35)** | First-time gold buyers, digitally native | Prefer mobile/web apps, buy in small amounts (₹500-₹5,000/month) |
| **Working Women (28-45)** | Saving for own jewellery or gifts | Regular monthly investments, goal-oriented (wedding, festival) |
| **Family Investors (35-55)** | Parents saving for children's weddings | Larger investments, long-term accumulation, trust brand reputation |
| **Festival/Occasion Buyers** | Buy during Akshaya Tritiya, Dhanteras, Diwali | Seasonal spikes, influenced by auspicious dates and offers |

### Secondary Stakeholders

| Stakeholder | Role |
|-------------|------|
| **Store Admin** | Manages platform, verifies redemptions, tracks business metrics |
| **Store Staff** | Uses redeem codes for in-store jewellery handover |
| **Jewellery Artisans** | Fulfil ornament orders based on redemption requests |

---

## 6. Business Model

### How GoldEase Works — Business Perspective

```
                        ┌──────────────────┐
                        │    CUSTOMER      │
                        │   buys gold      │
                        │   digitally      │
                        └────────┬─────────┘
                                 │
                          Pays ₹5,000
                          (gets 0.33g gold)
                                 │
                                 ↓
                        ┌──────────────────┐
                        │    GOLDEASE      │
                        │    PLATFORM      │
                        │                  │
                        │ • Records gold   │
                        │   balance        │
                        │ • Tracks money   │
                        │   received       │
                        │ • Corpus grows   │
                        └────────┬─────────┘
                                 │
                     ┌───────────┴───────────┐
                     │                       │
                     ↓                       ↓
           ┌─────────────────┐    ┌──────────────────┐
           │  CORPUS FUND    │    │   REDEMPTION     │
           │                 │    │                  │
           │  Money sits in  │    │  When customer   │
           │  the business   │    │  redeems, gold   │
           │  until customer │    │  is converted    │
           │  redeems        │    │  to jewellery    │
           └─────────────────┘    └──────────────────┘
```

### The Corpus Model
- **Corpus Balance** = Total Invested by all customers − Total Redeemed
- This money is available to the business as **working capital** until redemption
- The business can use this corpus to **purchase raw gold**, **fund operations**, or **earn interest**
- When a customer redeems, the business fulfils the jewellery order from existing inventory or new procurement

---

## 7. Platform Features

### Customer-Facing Features

| Feature | Description | Business Benefit |
|---------|-------------|-----------------|
| **Live Gold Price** | Real-time 22K/24K/18K prices from IBJA rates (metals.dev API) | Transparency builds trust |
| **Buy Gold** | Purchase in rupees (₹100+) or grams, choose 22K or 24K | Low entry barrier increases conversions |
| **Multiple Payment Methods** | UPI, Debit/Credit Card, Netbanking, Wallet | Reduces payment friction |
| **Portfolio Dashboard** | Gold balance, current value, profit/loss, return % | Engagement — customers check daily |
| **Price Chart** | Historical gold rate visualization | Educates customers, encourages buying on dips |
| **Transaction History** | Complete buy/redeem log with filters | Transparency and record-keeping |
| **Redeem for Jewellery** | Choose from 6 jewellery types, get instant RDM code | Converts digital gold to store footfall |
| **Redeem Code (RDM-XXXXXX)** | Unique 6-digit verification code | Fraud prevention, smooth store experience |
| **Investment Showcase** | Shows how ₹1,000/month grows over time | Motivates new users to start investing |
| **WhatsApp Chat Widget** | AI-powered FAQ bot with live price info | Reduces support queries, available 24/7 |

### Admin-Facing Features

| Feature | Description | Business Benefit |
|---------|-------------|-----------------|
| **Dashboard KPIs** | Total customers, today's signups, revenue, gold traded | Real-time business health check |
| **Corpus Balance** | Total invested vs total redeemed | Know available working capital |
| **Customer Management** | Search, filter, view KYC, transaction history | Full customer visibility |
| **Payment Tracking** | Status monitoring by method, date range filters | Financial reconciliation |
| **Ornament Orders** | Track orders by category, status (ordered → delivered) | Fulfilment pipeline management |
| **Redeem Verification** | Lookup RDM code, see customer details, confirm handover | Fraud-proof store verification |
| **Customer Transaction Log** | See a customer's full buy/redeem history during verification | Understand customer's investment journey |
| **Daily Report** | Day-wise breakdown of transactions and payment methods | Daily business review |
| **Monthly Report** | Revenue charts, month-over-month comparison | Strategic planning and forecasting |
| **CSV Exports** | Export customers, payments, reports, ornaments, redemptions | Accounting, tax filing, audits |

---

## 8. User Journey

### Journey 1: New Customer — From Signup to First Purchase

```
┌─────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────────┐
│  VISIT  │    │   SIGN UP    │    │  FIRST BUY   │    │  REGULAR    │
│ WEBSITE │───→│              │───→│              │───→│  INVESTOR   │
│         │    │ 3-step form  │    │ ₹1,000 via   │    │             │
│ Sees    │    │ 1. Account   │    │ UPI          │    │ Buys gold   │
│ live    │    │ 2. Personal  │    │              │    │ monthly     │
│ gold    │    │ 3. KYC       │    │ Gets 0.067g  │    │             │
│ price   │    │    (PAN,     │    │ gold at      │    │ Watches     │
│         │    │    Aadhaar)  │    │ 22K rate     │    │ portfolio   │
│ Reads   │    │              │    │              │    │ grow        │
│ FAQ     │    │ Gets JWT     │    │ Sees in      │    │             │
│         │    │ token        │    │ portfolio    │    │ Gets price  │
│ Checks  │    │              │    │              │    │ alerts      │
│ reviews │    │ Auto-login   │    │ Transaction  │    │             │
│         │    │              │    │ recorded     │    │             │
└─────────┘    └──────────────┘    └──────────────┘    └─────────────┘
```

### Journey 2: Existing Customer — Redemption

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   DECIDES    │    │   SELECTS    │    │   CONFIRMS   │    │  VISITS      │
│  TO REDEEM   │───→│  JEWELLERY   │───→│    ORDER     │───→│   STORE      │
│              │    │              │    │              │    │              │
│ Has enough   │    │ Gold Coin    │    │ Reviews:     │    │ Shows        │
│ gold balance │    │ Gold Ring    │    │ • Gold: 2.5g │    │ RDM-482913   │
│              │    │ Gold Pendant │    │ • Value: ₹37K│    │ to admin     │
│ Clicks       │    │ Gold Chain   │    │ • Making: ₹800│   │              │
│ "Redeem      │    │ Gold Bracelet│    │ • Profit: +5%│    │ Admin        │
│  Gold"       │    │ Gold Earrings│    │              │    │ verifies &   │
│              │    │              │    │ Clicks       │    │ confirms     │
│              │    │ Picks "Gold  │    │ "Confirm"    │    │              │
│              │    │  Ring"       │    │              │    │ Receives     │
│              │    │              │    │ Gets code:   │    │ jewellery    │
│              │    │              │    │ RDM-482913   │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### Journey 3: Admin — Daily Operations

```
Morning                     During Day                    End of Day
┌──────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│ CHECK        │    │ HANDLE REDEMPTIONS   │    │ REVIEW           │
│ DASHBOARD    │    │                      │    │ REPORTS          │
│              │    │ • Customer walks in  │    │                  │
│ • New        │    │   with RDM code      │    │ • Daily report   │
│   customers  │    │ • Admin searches     │    │ • Revenue        │
│ • Revenue    │    │   code               │    │ • New signups    │
│   today      │    │ • Verifies customer  │    │ • Export CSV     │
│ • Corpus     │    │   details            │    │   for accounting │
│   balance    │    │ • Views transaction  │    │                  │
│ • Gold       │    │   history            │    │ • Monthly report │
│   price      │    │ • Confirms handover  │    │   for planning   │
└──────────────┘    └──────────────────────┘    └──────────────────┘
```

---

## 9. Admin Operations

### Redeem Verification — Step by Step

This is the most critical business operation. When a customer walks into the store:

| Step | Admin Action | System Response |
|------|-------------|-----------------|
| 1 | Customer shows RDM code (e.g., RDM-482913) | — |
| 2 | Admin enters code in Redeem Verification page | System displays customer name, email, phone |
| 3 | Admin verifies customer identity (matches Aadhaar/PAN) | System shows ornament details, gold weight, value |
| 4 | Admin reviews customer's full transaction history | System auto-loads all buy/redeem records |
| 5 | Admin hands over jewellery | — |
| 6 | Admin clicks "Confirm Redemption" | Status changes: pending → completed |
| 7 | Record is final | Shows in Redemption Logs, exportable as CSV |

### Admin Dashboard Sections

| Section | What Admin Sees | Business Decision It Enables |
|---------|----------------|------------------------------|
| **Total Customers** | 57 registered users | Marketing effectiveness |
| **Joined Today** | New signups today | Campaign tracking |
| **Corpus Balance** | Total invested − Total redeemed | Available working capital |
| **Total Gold Invested** | Grams + rupee value | Gold procurement planning |
| **Customer Redemptions** | Count, value, grams redeemed | Jewellery inventory planning |
| **Average Ticket Prices** | Avg investment, avg redemption, avg ornament | Pricing strategy |
| **Ornament Procurement** | Orders by category with value | What to stock more of |
| **Gold Purchases & Ornaments** | Recent transactions table | Day-to-day monitoring |

---

## 10. Revenue Streams

| Revenue Source | Description | Example |
|---------------|-------------|---------|
| **Making Charges** | Charged when customer redeems gold for jewellery | Gold Ring: ₹800, Gold Chain: ₹2,500 |
| **Spread on Gold Price** | Difference between buy and sell price of gold | Buy at IBJA rate, slight markup possible |
| **Corpus Utilization** | Invested money available as working capital until redemption | ₹10L corpus can earn interest or fund operations |
| **Increased Footfall** | Redemptions bring customers to the physical store | Cross-sell/upsell opportunity at store |
| **Customer Loyalty** | Digital scheme creates long-term relationship | Repeat purchases, referrals, festival buying |

### Making Charges by Jewellery Type

| Jewellery | Making Charges | Typical Gold Weight |
|-----------|---------------|-------------------|
| Gold Coin | ₹250 | 1g |
| Gold Ring | ₹800 | 2g |
| Gold Pendant | ₹600 | 1.5g |
| Gold Chain | ₹2,500 | 5g |
| Gold Bracelet | ₹1,500 | 3g |
| Gold Earrings | ₹700 | 1.5g |

---

## 11. Gold Pricing Strategy

### How Gold Price is Determined

```
metals.dev API (live data)
        │
        ↓
┌─────────────────────────┐
│   IBJA Rate (Primary)   │ ← Indian Bullion & Jewellers Association
│   India's official      │    Most trusted retail benchmark
│   retail gold rate      │
└────────────┬────────────┘
             │
      ┌──────┴──────┐
      ↓              ↓
┌───────────┐  ┌───────────┐
│   22K     │  │   24K     │
│ = 24K ×   │  │ = IBJA    │
│   22/24   │  │   rate    │
│           │  │           │
│ Used for  │  │ Used for  │
│ jewellery │  │ pure gold │
│ purchases │  │ investment│
└───────────┘  └───────────┘
```

### Price Update Frequency
- Server fetches from metals.dev every **10 minutes**
- Cached on server to avoid API rate limits
- Frontend auto-refreshes every **10 minutes**
- If API is down, last cached price is used with a "Cached" indicator

### Why 22K is Primary
- Indian jewellery market predominantly trades in **22K gold**
- 22K is the standard for making jewellery (pure 24K is too soft)
- Customers understand and trust 22K pricing
- Our platform shows 22K as the main price on dashboard and landing page

---

## 12. Product Catalogue

### Available Jewellery for Redemption

| # | Product | Gold Weight | Making Charges | Min Gold Needed |
|---|---------|------------|----------------|-----------------|
| 1 | Gold Coin | 1g | ₹250 | 1g |
| 2 | Gold Ring | 2g | ₹800 | 2g |
| 3 | Gold Pendant | 1.5g | ₹600 | 1.5g |
| 4 | Gold Chain | 5g | ₹2,500 | 5g |
| 5 | Gold Bracelet | 3g | ₹1,500 | 3g |
| 6 | Gold Earrings | 1.5g | ₹700 | 1.5g |

### How Redemption Value is Calculated

```
Example: Customer has 2.5g gold, current 22K rate = ₹14,788/g

Gold Value     = 2.5g × ₹14,788  = ₹36,970
Making Charges = Gold Ring         = ₹800
Total Order    = ₹36,970 + ₹800   = ₹37,770

Customer receives: Gold Ring (2.5g, 22K)
Customer pays:     Nothing extra (gold value covers it)
Making charges:    Deducted from wallet or paid at store
```

### Redemption Rules
- Customer's **entire gold balance** is redeemed (no partial redemption)
- Each customer can redeem **once per scheme cycle**
- A unique **RDM-XXXXXX** code is generated for store verification
- Redemption status starts as **"pending"** until admin confirms handover
- After redemption, customer can **rejoin the scheme** to start fresh

---

## 13. Security & Compliance

### Data Security

| Measure | Implementation |
|---------|---------------|
| **Password Protection** | bcrypt hashing with 12 salt rounds — passwords never stored in plain text |
| **JWT Authentication** | Signed tokens with 30-day expiry, separate tokens for user and admin |
| **Role-Based Access** | Users can only access their own data; admin routes require admin role |
| **Input Validation** | All API inputs validated (email format, password length, amount ranges) |
| **API Key Protection** | External API keys stored on server only, never exposed to frontend |

### KYC (Know Your Customer)

| Document | Purpose | Collected At |
|----------|---------|-------------|
| **PAN Card** | Tax compliance, identity verification | Signup Step 3 |
| **Aadhaar Card** | Government ID verification | Signup Step 3 |
| **Phone Number** | Contact and OTP verification (future) | Signup Step 1 |
| **Email** | Account recovery, communication | Signup Step 1 |
| **Address** | Delivery and identity verification | Signup Step 2 |

### Audit Trail
- Every transaction (buy/redeem) is permanently recorded with timestamp
- Payment records include method, status, and reference ID
- Redemption logs track code generation, verification, and confirmation
- All data is exportable as CSV for external audits

---

## 14. Key Metrics & KPIs

### Customer Metrics
| KPI | What It Measures | Where to Find |
|-----|-----------------|---------------|
| Total Customers | Platform adoption | Admin Dashboard |
| New Customers Today | Daily growth rate | Admin Dashboard |
| Customers Redeemed | Conversion from digital to physical | Admin Dashboard |
| Redemption Rate | % of customers who redeemed | Redeemed ÷ Total × 100 |

### Financial Metrics
| KPI | What It Measures | Where to Find |
|-----|-----------------|---------------|
| Corpus Balance | Available working capital | Admin Dashboard |
| Total Invested | All money received from customers | Admin Dashboard |
| Total Redeemed | Money converted to jewellery | Admin Dashboard |
| Revenue Today | Daily incoming payments | Admin Dashboard |
| Average Investment | Ticket size per buy transaction | Admin Dashboard |
| Average Redemption | Value per redemption | Admin Dashboard |

### Operational Metrics
| KPI | What It Measures | Where to Find |
|-----|-----------------|---------------|
| Pending Redemptions | Orders waiting for store handover | Redeem Verification |
| Completed Redemptions | Successfully delivered orders | Redemption Logs |
| Ornament Orders by Category | Which jewellery is most popular | Ornament Section |
| Payment Method Distribution | Which payment methods customers prefer | Daily/Monthly Report |

---

## 15. Current Platform Statistics

Based on live database (as of March 2026):

### Customer Overview
| Metric | Value |
|--------|-------|
| Total Registered Customers | 57 |
| Customers Who Redeemed | 23 (40.4%) |
| Customers Not Yet Redeemed | 34 (59.6%) |
| Pending Redemptions (awaiting store confirmation) | 3 |
| Completed Redemptions | 18 |

### Redemption Breakdown
| Status | Count | Customer Examples |
|--------|-------|-------------------|
| **Completed** | 18 | Rajesh Kumar, Priya Sharma, Nandhini V, Suresh Babu |
| **Pending** | 3 | Gayathri R (RDM-599365), Murugan S (RDM-334399), Sangeetha M (RDM-509416) |

### Ornament Categories Available
- Coin, Ring, Necklace, Bracelet, Earring, Bangle, Pendant, Chain

---

## 16. Competitive Advantages

### vs. Traditional Jewellery Schemes

| Factor | Traditional Scheme | GoldEase |
|--------|-------------------|----------|
| **Minimum Investment** | ₹1,000-₹5,000/month fixed | ₹100+ anytime, any amount |
| **Payment** | Cash/cheque at store | UPI, Card, Netbanking, Wallet |
| **Price Transparency** | Shopkeeper quotes price | Live IBJA rate displayed |
| **Tracking** | Paper receipts | Digital portfolio with charts |
| **Flexibility** | Fixed tenure (11-12 months) | Buy anytime, redeem when ready |
| **Store Visit** | Required every month | Only for final redemption |
| **Reports** | Manual registers | Automated CSV exports |

### vs. Digital Gold Apps (Paytm Gold, Google Pay Gold)

| Factor | Digital Gold Apps | GoldEase |
|--------|------------------|----------|
| **Redemption** | Cash out or generic coins | Physical jewellery from YOUR store |
| **Customer Relationship** | Customer belongs to Paytm/Google | Customer belongs to YOUR business |
| **Store Footfall** | Zero | Every redemption brings customer in |
| **Cross-sell** | None | Upsell other jewellery at store |
| **Branding** | Their brand | Your brand |
| **Making Charges Revenue** | Goes to third party | Goes to your business |
| **Customer Data** | They own it | You own it |

---

## 17. Future Roadmap

### Phase 2 — Planned Enhancements

| Feature | Business Impact | Priority |
|---------|----------------|----------|
| **SIP (Systematic Investment Plan)** | Auto-debit monthly, higher retention | High |
| **Mobile App (Android/iOS)** | Push notifications, wider reach | High |
| **Partial Redemption** | Redeem part of gold, keep investing rest | Medium |
| **Multiple Scheme Cycles** | Customer can run multiple savings plans simultaneously | Medium |
| **Referral Program** | Existing customers bring new ones, bonus gold | Medium |
| **Festival Offers** | Bonus gold on Akshaya Tritiya, Dhanteras, Diwali | Medium |
| **OTP Verification** | SMS OTP on signup and redemption for security | High |
| **Real-time Notifications** | Push/email when gold price drops, order status changes | Medium |
| **Custom Jewellery Orders** | Upload design, get quote, redeem for custom piece | Low |
| **EMI on Making Charges** | Pay making charges in instalments | Low |
| **Multi-store Support** | Multiple branches with centralized dashboard | Low |
| **Gift Gold** | Send gold to friends/family as digital gift | Low |

---

## 18. Glossary

| Term | Definition |
|------|-----------|
| **IBJA** | Indian Bullion and Jewellers Association — sets the benchmark gold rate for Indian retail market |
| **MCX** | Multi Commodity Exchange — India's commodity trading exchange, provides gold futures pricing |
| **22K Gold** | 91.67% pure gold (22 parts gold, 2 parts alloy) — standard for Indian jewellery |
| **24K Gold** | 99.9% pure gold — used for coins and investment bars |
| **Making Charges** | Labour and craftsmanship cost added on top of gold value when making jewellery |
| **Corpus** | Total pool of money invested by all customers that hasn't been redeemed yet |
| **Redeem Code (RDM)** | Unique 6-digit code (format: RDM-XXXXXX) generated when customer redeems gold for jewellery |
| **KYC** | Know Your Customer — identity verification process (PAN, Aadhaar) required by financial regulations |
| **JWT** | JSON Web Token — digital authentication token that proves user identity for 30 days |
| **Portfolio** | Customer's gold holdings including balance (grams), invested amount (₹), current value, and returns |
| **SIP** | Systematic Investment Plan — auto-recurring monthly investment (planned for Phase 2) |
| **IBJA Rate** | The benchmark per-gram gold price published by IBJA, used as the base price on GoldEase |
| **Karat** | Unit measuring gold purity — 24K is purest, 22K is standard for jewellery, 18K is lower purity |

---

*Document Version: 1.0 | Last Updated: March 2026 | Platform: GoldEase by [Your Jewellery Store Name]*
