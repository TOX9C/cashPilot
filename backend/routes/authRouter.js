const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController.js");
const authUser = require("../authenticateUser.js");

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authUser, async (req, res) => {
  try {
    const prisma = require("../prismaClient");
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ loggedIn: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = authRouter;
