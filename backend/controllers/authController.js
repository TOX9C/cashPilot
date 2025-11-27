const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const z = require("zod");
const prisma = require("../prismaClient");
const userSchema = z.object({
  username: z.string().min(3),
  password: z
    .string()
    .min(8, { message: "Too short" })
    .max(32, { message: "Too long" })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message: "has to include a special charecter",
    }),
});

const login = async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createSessionToken(user.id);
    attachSessionCookie(res, token);
    return res.json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const payload = userSchema.safeParse(req.body ?? {});
  if (!payload.success) {
    const errors = payload.error.issues.map((issue) => issue.message);
    return res.status(400).json({ message: errors });
  }

  const { username, password } = payload.data;

  try {
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPass,
      },
    });

    const token = createSessionToken(user.id);
    attachSessionCookie(res, token);
    return res.status(201).json({ message: "success" });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Username already in use" });
    }
    return res.status(500).json({ message: error.message });
  }
};

const createSessionToken = (userId) => {
  if (!process.env.JWT_CODE) {
    throw new Error("JWT_CODE env variable is missing");
  }
  return jwt.sign({ id: userId }, process.env.JWT_CODE, { expiresIn: "7d" });
};

const attachSessionCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

module.exports = { login, register };
