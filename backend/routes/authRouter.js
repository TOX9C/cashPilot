const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController.js");
const authUser = require("../authenticateUser.js");

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/me", authUser, (req, res) => {
  res.json({ loggedIn: true });
});

module.exports = authRouter;
