const z = require("zod");
const prisma = require("../prismaClient");

const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  cash: z.number().int().nonnegative(),
});

const getAccounts = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId,
      },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ accounts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createAccount = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parsed = accountSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues.map((issue) => issue.message),
    });
  }

  const { name, cash } = parsed.data;

  try {
    const account = await prisma.account.create({
      data: {
        userId,
        name,
        cash,
      },
    });
    return res.status(201).json({ account });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateAccount = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parsed = z
    .object({
      accountId: z.coerce.number().int().positive(),
      name: z.string().min(1, "Account name is required").optional(),
      cash: z.number().int().nonnegative().optional(),
    })
    .safeParse(req.body ?? {});

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues.map((issue) => issue.message),
    });
  }

  const { accountId, name, cash } = parsed.data;

  try {
    const existingAccount = await prisma.account.findFirst({
      where: { id: accountId, userId },
      select: { id: true },
    });

    if (!existingAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (cash !== undefined) updateData.cash = cash;

    const account = await prisma.account.update({
      where: { id: accountId },
      data: updateData,
    });

    return res.json({ account });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parsed = z
    .object({
      accountId: z.coerce.number().int().positive(),
    })
    .safeParse(req.body ?? {});

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues.map((issue) => issue.message),
    });
  }

  const { accountId } = parsed.data;

  try {
    const existingAccount = await prisma.account.findFirst({
      where: { id: accountId, userId },
      select: { id: true },
    });

    if (!existingAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    await prisma.account.delete({
      where: { id: accountId },
    });

    return res.json({ message: "Account deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAccounts, createAccount, updateAccount, deleteAccount };
