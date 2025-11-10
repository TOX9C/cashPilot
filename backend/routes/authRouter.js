const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController.js");

authRouter.post("/login", authController.login);
authRouter.post("/regiser", authController.register);

module.exports = authRouter;
