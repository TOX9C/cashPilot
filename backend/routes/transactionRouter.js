const { Router } = require("express");
const transactionController = require("../controllers/transactionController");
const authUser = require("../authenticateUser");
const transactionRouter = Router();

transactionRouter.post("/add", authUser, transactionController.addTransaction);

module.exports = transactionRouter;
