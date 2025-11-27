const z = require("zod");
const prisma = require("../prismaClient");

const goalSchema = z.object({
  name: z.string().min(1),
  finalAmount: z.coerce.number().int().min(1),
});

const goalUpdateSchema = z.object({
  goalId: z.coerce.number().int().positive(),
  curAmount: z.coerce.number().int().min(0),
});

const goalIdSchema = z.object({ goalId: z.coerce.number().int().positive() });

const getGoals = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const goals = await prisma.goal.findMany({
      where: {
        userId,
      },
    });
    return res.json({ goals });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addGoal = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parsed = goalSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues.map((issue) => issue.message),
    });
  }

  const { name, finalAmount } = parsed.data;
  try {
    const goal = await prisma.goal.create({
      data: {
        name,
        finalAmount,
        userId,
        curAmount: 0,
      },
    });
    return res.status(201).json({ goal });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateGoal = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parsed = goalUpdateSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues.map((issue) => issue.message),
    });
  }

  const { goalId, curAmount } = parsed.data;
  try {
    const existingGoal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
      select: { id: true },
    });

    if (!existingGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: { curAmount },
    });
    return res.json({ goal });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeGoal = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parsed = goalIdSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues.map((issue) => issue.message),
    });
  }
  const { goalId } = parsed.data;
  try {
    const existingGoal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
      select: { id: true },
    });

    if (!existingGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    await prisma.goal.delete({
      where: { id: goalId },
    });
    return res.json({ message: "Goal deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getGoals, addGoal, updateGoal, removeGoal };
