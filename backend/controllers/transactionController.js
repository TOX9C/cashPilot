const z = require("zod");
const prisma = require("../prismaClient");

const transactionTypes = [
  "rent",
  "utilities",
  "food",
  "transport",
  "personal",
  "income",
];
const transactionSchema = z.object({
  description: z.string().min(1),
  amount: z.coerce.number().min(1),
  type: z.enum(transactionTypes),
  accountId: z.coerce.number().int().positive(),
  createdAt: z.coerce.date().optional(),
});

const getTransactions = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Get all user's accounts first
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { id: true, name: true },
    });

    const accountIds = accounts.map((acc) => acc.id);
    const accountMap = new Map(accounts.map((acc) => [acc.id, acc.name]));

    // Get all transactions for these accounts
    const transactions = await prisma.transaction.findMany({
      where: {
        accountId: { in: accountIds },
      },
      include: {
        Account: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format transactions with account name
    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      description: t.description,
      amount: t.amount,
      type: t.type,
      accountId: t.accountId,
      accountName: t.Account.name,
      createdAt: t.createdAt,
    }));

    return res.json({ transactions: formattedTransactions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addTransaction = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const body = req.body ?? {};
  const parsed = transactionSchema.safeParse({
    description: body.description ?? body.desc,
    amount: body.amount,
    type: body.type,
    accountId: body.accountId,
    createdAt: body.createdAt,
  });
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues.map((issue) => issue.message),
    });
  }

  const { description, amount, type, accountId, createdAt } = parsed.data;

  try {
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId },
      select: { id: true, cash: true },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Calculate new balance based on transaction type
    // Income increases balance, expenses decrease balance
    const balanceChange = type === "income" ? amount : -amount;
    const newBalance = account.cash + balanceChange;

    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create the transaction
      const transactionData = {
        description,
        amount,
        type,
        accountId,
      };
      if (createdAt) {
        transactionData.createdAt = createdAt;
      }
      const transaction = await tx.transaction.create({
        data: transactionData,
      });

      // Update the account balance
      await tx.account.update({
        where: { id: accountId },
        data: { cash: newBalance },
      });

      // Fetch the account name for the response
      const updatedAccount = await tx.account.findUnique({
        where: { id: accountId },
        select: { name: true },
      });

      return {
        transaction,
        accountName: updatedAccount.name,
      };
    });

    return res.status(201).json({
      transaction: {
        id: result.transaction.id,
        description: result.transaction.description,
        amount: result.transaction.amount,
        type: result.transaction.type,
        accountId: result.transaction.accountId,
        accountName: result.accountName,
        createdAt: result.transaction.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, addTransaction };
