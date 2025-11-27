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
});

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
  });
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues.map((issue) => issue.message),
    });
  }

  const { description, amount, type, accountId } = parsed.data;

  try {
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId },
      select: { id: true },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        type,
        accountId,
      },
    });
    return res.status(201).json({ transaction });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { addTransaction };
