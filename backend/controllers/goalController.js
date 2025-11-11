const { PrismaClient } = require("@prisma/client");
const z = require("zod");
const goalSchema = z.object({
  name: z.string(),
  finalAmount: z.number().min(1),
});
const prisma = new PrismaClient();

const getGoals = async (req, res) => {
  const userId = req.user.id;
  try {
    const goals = await prisma.goal.findMany({
      where: {
        userId,
      },
    });
    return res.json({ goals });
  } catch (error) {
    console.log(error);
  }
};

const addGoal = async (req, res) => {
  const userId = req.user.id;
  const { name, finalAmount } = req.body;
  goalSchema.parse({ name, finalAmount });
  try {
    const goal = await prisma.goal.create({
      data: {
        name,
        finalAmount,
        userId,
        curAmount: 0,
      },
    });
    return res.json({ goal });
  } catch (error) {
    console.log(error);
  }
};

const updateGoal = async (req, res) => {
  const userId = req.user.id;
  const { goalId, curAmount } = req.body;
  try {
    const goal = await prisma.goal.update({
      where: {
        id: goalId,
        userId: userId,
      },
      data: {
        curAmount,
      },
    });
    return res.json({ goal });
  } catch (error) {
    console.log(error);
  }
};

const removeGoal = async (req, res) => {
  const userId = req.user.id;
  const { goalId } = req.body;
  try {
    await prisma.goal.delete({
      where: {
        userId,
        id: goalId,
      },
    });
    return res.json({ message: "Goal deleted" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getGoals, addGoal, updateGoal, removeGoal };
