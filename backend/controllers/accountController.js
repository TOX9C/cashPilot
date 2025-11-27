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

module.exports = { getAccounts, createAccount };
