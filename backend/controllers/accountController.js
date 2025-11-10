const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAccounts = async (req, res) => {
  const userId = req.user.id;

  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId,
      },
      include: {
        transactions: {
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    return res.json({ accounts });
  } catch (error) {
    console.log(error);
  }
};

const createAccount = async (req, res) => {
  const userId = req.user.id;
  const { name, cash } = req.body;

  try {
    const account = await prisma.account.create({
      data: {
        userId,
        name,
        cash,
      },
    });
    return res.json({ message: "account created" });
  } catch (error) {}
};

module.exports = { getAccounts, createAccount };
