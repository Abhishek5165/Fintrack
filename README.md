# 💸 Personal Finance Visualizer
A beautiful, responsive, and fully-featured personal finance tracker built with Next.js, React, Recharts, shadcn/ui, and MongoDB (localStorage fallback). Track your expenses, manage budgets, and visualize your financial health—all in a single app.

## ✨ Features
### ✅ Stage 1: Basic Transaction Tracking
Add/Edit/Delete transactions (amount, date, description)

Transaction list with real-time updates

Monthly expenses bar chart

Basic form validation

### ✅ Stage 2: Categories
Predefined spending categories

Category-wise pie chart

Dashboard summary:

Total expenses

Category breakdown

Recent transactions

### ✅ Stage 3: Budgeting
Set monthly budgets per category

Budget vs actual spending chart

Simple spending insights and alerts

### 📊 Tech Stack
Frontend: Next.js, React, TypeScript

UI Library: shadcn/ui

Charts: Recharts

Storage: LocalStorage (MongoDB-ready)

Styling: TailwindCSS with modern glassmorphism & responsive design

### 🧠 Design Highlights
Gradient backgrounds & glass UI elements

Semantic financial color schemes

Smooth micro-interactions & hover animations

Fully responsive mobile-first layout

## ⚙️ Getting Started
### 1. Clone the repo

``` git clone https://github.com/your-username/personal-finance-visualizer.git
cd personal-finance-visualizer ```

### 2. Install dependencies

``` npm install ```

### 3. Run the development server

``` npm run dev ```

### The app will be running at http://localhost:3000

### 🛠️ Configuration
If you face build errors due to font fetching (Google Fonts AbortError), ensure the following in your next.config.js:
```
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: false, // ✅ Prevents AbortError during Google Fonts fetching
};

module.exports = nextConfig;
```
### 📁 Project Structure

```
├── types/finance.ts              # TypeScript types
├── lib/categories.ts            # Predefined categories
├── lib/storage.ts               # LocalStorage utilities
├── lib/finance-utils.ts         # Budgeting/calculation logic
├── components/
│   ├── transaction-form.tsx     # Add/Edit transaction form
│   ├── transaction-list.tsx     # List of transactions
│   ├── dashboard-cards.tsx      # Summary UI cards
│   ├── charts/
│   │   ├── monthly-chart.tsx    # Monthly expenses bar chart
│   │   └── category-chart.tsx   # Category-wise pie chart
│   ├── budget-manager.tsx       # Set and display category budgets
│   └── insights.tsx             # Smart spending insights
├── app/
│   └── page.tsx                 # Main dashboard page
└── next.config.js
```

⚠️ Notes
❌ No authentication/login is implemented (per evaluation guidelines)

✅ Fully functional with mock/sample data

🔒 All transactions persist in browser's localStorage
