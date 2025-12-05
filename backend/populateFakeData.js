const axios = require("axios");
const https = require("https");

// Store cookies manually
let cookies = "";

// Create axios instance with cookie handling
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// Intercept requests to add cookies
api.interceptors.request.use((config) => {
  if (cookies) {
    config.headers.Cookie = cookies;
  }
  return config;
});

// Intercept responses to save cookies
api.interceptors.response.use((response) => {
  const setCookieHeader = response.headers["set-cookie"];
  if (setCookieHeader) {
    cookies = setCookieHeader.map((cookie) => cookie.split(";")[0]).join("; ");
  }
  return response;
});

// Helper function to generate random date within a range
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Helper function to format date for API
function formatDate(date) {
  return date.toISOString();
}

// Transaction types
const transactionTypes = ["rent", "utilities", "food", "transport", "personal", "income"];

// Fake transaction descriptions
const transactionDescriptions = {
  rent: ["Monthly Rent", "Apartment Rent", "House Rent"],
  utilities: ["Electric Bill", "Water Bill", "Internet Bill", "Gas Bill", "Phone Bill"],
  food: ["Grocery Shopping", "Restaurant", "Coffee Shop", "Fast Food", "Supermarket"],
  transport: ["Gas Station", "Uber Ride", "Bus Ticket", "Train Ticket", "Parking Fee"],
  personal: ["Clothing", "Entertainment", "Gym Membership", "Haircut", "Books"],
  income: ["Salary", "Freelance Work", "Investment Return", "Bonus", "Side Hustle"],
};

// Fake account names
const accountNames = ["Main Checking", "Savings Account", "Emergency Fund", "Business Account"];

// Fake goal names
const goalNames = [
  "Vacation Fund",
  "New Car",
  "Emergency Fund",
  "House Down Payment",
  "Wedding Fund",
];

async function populateFakeData() {
  try {
    console.log("🚀 Starting to populate fake data...\n");

    // Step 1: Register a test user
    console.log("1. Registering test user...");
    const username = `testuser_${Date.now()}`;
    const password = "Test123!@#";

    try {
      await api.post("/auth/register", {
        username,
        password,
      });
      console.log(`   ✓ User registered: ${username}\n`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`   ℹ User already exists, trying to login...\n`);
      } else {
        throw error;
      }
    }

    // Step 2: Login to get session cookie
    console.log("2. Logging in...");
    await api.post("/auth/login", {
      username,
      password,
    });
    console.log("   ✓ Logged in successfully\n");

    // Step 3: Create accounts
    console.log("3. Creating accounts...");
    const accounts = [];
    for (let i = 0; i < accountNames.length; i++) {
      const initialBalance = Math.floor(Math.random() * 5000) + 1000; // $1000-$6000
      try {
        const res = await api.post("/account/create", {
          name: accountNames[i],
          cash: initialBalance,
        });
        accounts.push(res.data.account);
        console.log(`   ✓ Created account: ${accountNames[i]} with $${initialBalance}`);
      } catch (error) {
        console.error(`   ✗ Error creating account ${accountNames[i]}:`, error.response?.data || error.message);
      }
    }
    console.log(`\n   Total accounts created: ${accounts.length}\n`);

    if (accounts.length === 0) {
      console.log("   ⚠ No accounts created, cannot add transactions");
      return;
    }

    // Step 4: Add transactions (spread across last 6 months)
    console.log("4. Adding transactions...");
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    let transactionCount = 0;
    const transactionsPerMonth = 15; // ~15 transactions per month

    // Generate transactions for each month going backwards
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
      const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
      
      console.log(`   Creating transactions for ${monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}...`);

      for (let i = 0; i < transactionsPerMonth; i++) {
        const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
        const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        const descriptions = transactionDescriptions[randomType];
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];

        // Generate realistic amounts based on type
        let amount;
        if (randomType === "income") {
          amount = Math.floor(Math.random() * 3000) + 2000; // $2000-$5000
        } else if (randomType === "rent") {
          amount = Math.floor(Math.random() * 1000) + 800; // $800-$1800
        } else if (randomType === "utilities") {
          amount = Math.floor(Math.random() * 200) + 50; // $50-$250
        } else if (randomType === "food") {
          amount = Math.floor(Math.random() * 150) + 20; // $20-$170
        } else if (randomType === "transport") {
          amount = Math.floor(Math.random() * 100) + 10; // $10-$110
        } else {
          amount = Math.floor(Math.random() * 200) + 15; // $15-$215
        }

        // Generate a random date within the month
        const randomDay = Math.floor(Math.random() * (monthEnd.getDate() - 1)) + 1;
        const transactionDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), randomDay);
        // Add random time within the day
        transactionDate.setHours(Math.floor(Math.random() * 24));
        transactionDate.setMinutes(Math.floor(Math.random() * 60));

        // Create transaction with specific date
        try {
          await api.post("/transaction/add", {
            description,
            amount,
            type: randomType,
            accountId: randomAccount.id,
            createdAt: transactionDate.toISOString(),
          });
          transactionCount++;
        } catch (error) {
          console.error(`   ✗ Error adding transaction:`, error.response?.data || error.message);
        }
      }
    }

    // Add some recent transactions for current month
    console.log(`   Creating transactions for current month...`);
    for (let i = 0; i < 10; i++) {
      const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
      const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const descriptions = transactionDescriptions[randomType];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];

      let amount;
      if (randomType === "income") {
        amount = Math.floor(Math.random() * 3000) + 2000;
      } else if (randomType === "rent") {
        amount = Math.floor(Math.random() * 1000) + 800;
      } else {
        amount = Math.floor(Math.random() * 200) + 15;
      }

      // Random date in current month
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const randomDay = Math.floor(Math.random() * (currentMonthEnd.getDate() - 1)) + 1;
      const transactionDate = new Date(now.getFullYear(), now.getMonth(), randomDay);
      transactionDate.setHours(Math.floor(Math.random() * 24));
      transactionDate.setMinutes(Math.floor(Math.random() * 60));

      try {
        await api.post("/transaction/add", {
          description,
          amount,
          type: randomType,
          accountId: randomAccount.id,
          createdAt: transactionDate.toISOString(),
        });
        transactionCount++;
      } catch (error) {
        console.error(`   ✗ Error adding transaction:`, error.response?.data || error.message);
      }
    }

    console.log(`\n   ✓ Total transactions created: ${transactionCount}\n`);

    // Step 5: Create goals
    console.log("5. Creating saving goals...");
    let goalCount = 0;
    for (let i = 0; i < Math.min(goalNames.length, 4); i++) {
      const targetAmount = Math.floor(Math.random() * 20000) + 5000; // $5000-$25000
      const currentAmount = Math.floor(Math.random() * targetAmount * 0.7); // Up to 70% of target

      try {
        const res = await api.post("/goal/add", {
          name: goalNames[i],
          finalAmount: targetAmount,
        });

        // Update goal with current amount
        await api.patch("/goal/update", {
          goalId: res.data.goal.id,
          curAmount: currentAmount,
        });

        console.log(`   ✓ Created goal: ${goalNames[i]} ($${currentAmount} / $${targetAmount})`);
        goalCount++;
      } catch (error) {
        console.error(`   ✗ Error creating goal ${goalNames[i]}:`, error.response?.data || error.message);
      }
    }
    console.log(`\n   Total goals created: ${goalCount}\n`);

    console.log("✅ Fake data population complete!");
    console.log(`\n📊 Summary:`);
    console.log(`   - Username: ${username}`);
    console.log(`   - Password: ${password}`);
    console.log(`   - Accounts: ${accounts.length}`);
    console.log(`   - Transactions: ${transactionCount}`);
    console.log(`   - Goals: ${goalCount}`);
    console.log(`\n💡 You can now login with these credentials to see the fake data!`);

  } catch (error) {
    console.error("❌ Error populating fake data:", error.response?.data || error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run the script
populateFakeData();
