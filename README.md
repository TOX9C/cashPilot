# 💰 CashPilot

A modern, full-stack personal finance management application built with React and Node.js. Track your expenses, manage multiple accounts, set savings goals, and visualize your financial data with beautiful charts and insights.

![CashPilot Dashboard](screenshots/dashboard.png)

## ✨ Features

### 📊 Dashboard
- **Overview Cards**: View your total balance, monthly income, and expenses at a glance
- **Money Flow Chart**: Interactive bar chart showing income vs expenses over time
- **Recent Transactions**: Quick access to your latest financial activity
- **Spending by Category**: Visual breakdown of expenses by category
- **Savings Goals Preview**: Track progress toward your financial goals

### 💳 Account Management
- **Multiple Accounts**: Create and manage multiple accounts (checking, savings, etc.)
- **Account Overview**: View total balance across all accounts
- **Transaction History**: See all transactions for each account
- **Account Actions**: Edit account details or remove accounts

### 💸 Transaction Tracking
- **Add Transactions**: Record income and expenses with categories
- **Transaction Categories**: 
  - Income
  - Rent
  - Utilities
  - Food & Drink
  - Transportation
  - Personal
- **Filter & Search**: Filter by type (income/expense) and search transactions
- **Summary Cards**: View total income, expenses, and net balance

### 🎯 Savings Goals
- **Goal Creation**: Set financial goals with target amounts
- **Progress Tracking**: Monitor your progress toward each goal
- **Overall Progress**: See combined progress across all goals
- **Goal Management**: Update current amounts or delete goals

### ⚙️ Settings & Preferences
- **Multi-Currency Support**: Choose from 11+ currencies including:
  - USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN, IQD
- **Currency Conversion**: Automatic conversion and formatting
- **User Account**: View and manage your account settings
- **Logout**: Secure session management

### 🔐 Authentication
- **User Registration**: Create an account with secure password requirements
- **Login System**: JWT-based authentication with session cookies
- **Protected Routes**: Secure access to all financial data

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful chart library
- **Axios** - HTTP client
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **Prisma** - Modern ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Zod** - Schema validation

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cashpilot"
JWT_CODE="your-secret-jwt-key-here"
NODE_ENV="development"
PORT=3000
CLIENT_ORIGIN="http://localhost:5173"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. (Optional) Populate with fake data:
```bash
node populateFakeData.js
```

6. Start the backend server:
```bash
node app.js
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🚀 Usage

1. **Register**: Create a new account on the registration page
2. **Login**: Sign in with your credentials
3. **Create Accounts**: Add your financial accounts (checking, savings, etc.)
4. **Add Transactions**: Record your income and expenses
5. **Set Goals**: Create savings goals and track your progress
6. **View Dashboard**: See your financial overview and insights
7. **Change Currency**: Set your preferred currency in Settings

## 📁 Project Structure

```
cashPilot/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── routes/          # API routes
│   ├── prisma/          # Database schema
│   ├── app.js           # Express app setup
│   └── populateFakeData.js  # Script to generate test data
├── frontend/
│   ├── src/
│   │   ├── comps/       # React components
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── README.md
```

## 📸 Screenshots

### Dashboard
![Dashboard View](screenshots/dashboard.png)
*Overview of your financial health with cards, charts, and recent transactions*

### Accounts Page
![Accounts View](screenshots/accounts.png)
*Manage multiple accounts and view transaction history*

### Transactions Page
![Transactions View](screenshots/transactions.png)
*Track all your income and expenses with filtering and search*

### Goals Page
![Goals View](screenshots/goals.png)
*Set and track your savings goals with progress visualization*

### Settings Page
![Settings View](screenshots/settings.png)
*Configure currency preferences and account settings*

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for session management
- Input validation with Zod schemas
- Protected API routes
- CORS configuration

## 🌍 Currency Support

CashPilot supports multiple currencies with automatic conversion:
- **USD** - US Dollar ($)
- **EUR** - Euro (€)
- **GBP** - British Pound (£)
- **JPY** - Japanese Yen (¥)
- **CAD** - Canadian Dollar (C$)
- **AUD** - Australian Dollar (A$)
- **CHF** - Swiss Franc (CHF)
- **CNY** - Chinese Yuan (¥)
- **INR** - Indian Rupee (₹)
- **MXN** - Mexican Peso (MX$)
- **IQD** - Iraqi Dinar (IQD)

All amounts are stored in USD in the database and converted for display based on your preference.

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Accounts
- `GET /account/get` - Get all user accounts
- `POST /account/create` - Create a new account
- `PATCH /account/update` - Update an account
- `DELETE /account/delete` - Delete an account

### Transactions
- `GET /transaction/get` - Get all transactions
- `POST /transaction/add` - Add a new transaction

### Goals
- `GET /goal/get` - Get all savings goals
- `POST /goal/add` - Create a new goal
- `PATCH /goal/update` - Update goal progress
- `DELETE /goal/delete` - Delete a goal

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

Built with ❤️ for better financial management

---

**Note**: Make sure to set up your PostgreSQL database and environment variables before running the application.
