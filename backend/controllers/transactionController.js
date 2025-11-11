const { PrismaClient } = require("@prisma/client");
const z = require("zod");

const types = ["rent", "utilites", "food", "trasport", "personal", "income"];
const tranSchema = z.object({
  descripton: z.string(),
  amount: z.number().min(1),
  type: z.enum(types),
});

const prisma = new PrismaClient();

const addTransaction = async (req, res) => {
  const userId = req.user.id;
  const { desc, amount, type, accountId } = req.body;
  tranSchema.parse({ description: desc, amount, type });
  try {
    const transaction = await prisma.transaction.create({
      data: {
        descripton: desc,
        amount,
        type,
        accountId,
      },
    });
    return res.json({ message: "Transaction created" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addTransaction };
