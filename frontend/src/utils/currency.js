// Currency conversion rates (to USD)
const exchangeRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.0,
  CAD: 1.35,
  AUD: 1.52,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.0,
  MXN: 17.0,
  IQD: 1310.0,
};

// Get currency from localStorage or default to USD
export const getCurrency = () => {
  return localStorage.getItem("currency") || "USD";
};

// Set currency in localStorage
export const setCurrency = (currency) => {
  localStorage.setItem("currency", currency);
};

// Convert USD amount to selected currency
export const convertCurrency = (usdAmount) => {
  const currency = getCurrency();
  const rate = exchangeRates[currency] || 1.0;
  return usdAmount * rate;
};

// Format amount with currency symbol
export const formatCurrency = (usdAmount, options = {}) => {
  const currency = getCurrency();
  const convertedAmount = convertCurrency(usdAmount);
  
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSymbol = true,
  } = options;

  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
    CHF: "CHF ",
    CNY: "¥",
    INR: "₹",
    MXN: "MX$",
    IQD: "IQD ",
  };

  const symbol = currencySymbols[currency] || "$";
  const formatted = convertedAmount.toLocaleString("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  if (showSymbol) {
    // For currencies like CHF and IQD, symbol goes before with space
    if (currency === "CHF" || currency === "IQD") {
      return `${symbol}${formatted}`;
    }
    // For most currencies, symbol goes before without space
    return `${symbol}${formatted}`;
  }

  return formatted;
};

// Get currency symbol only
export const getCurrencySymbol = () => {
  const currency = getCurrency();
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
    CHF: "CHF ",
    CNY: "¥",
    INR: "₹",
    MXN: "MX$",
    IQD: "IQD ",
  };
  return currencySymbols[currency] || "$";
};

// Get all available currencies
export const getAvailableCurrencies = () => {
  return [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
    { code: "IQD", name: "Iraqi Dinar", symbol: "IQD" },
  ];
};

