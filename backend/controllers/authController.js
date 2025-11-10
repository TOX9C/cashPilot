const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bccypt = require("bcrypt");
const z = require("zod");

const prisma = new PrismaClient();
const userSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, { message: "Too short" })
    .max(32, { message: "Too long" })
    .includes("!@#$%^&*", { message: "has to include a special chartecter" }),
});

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = prisma.user.findMany({
      where: {
        username,
      },
    });
    if (!user) return res.json({ message: "usenrame not found" });
    const match = await bccypt.compare(password, user.password);
    if (!match) return res.json({ message: "wrong password" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_CODE, {
      expiresIn: "7d",
    });
    return res.json({ token });
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ message: "no info" });
  userSchema.parse({ username, password });
  try {
    const salt = await bccypt.genSalt();
    const hashedPass = await bccypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPass,
      },
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_CODE, {
      expiresIn: "7d",
    });
    return res.json({ token });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

module.exports = { login, register };
