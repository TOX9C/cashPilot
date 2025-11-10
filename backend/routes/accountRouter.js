const { Router } = require("express");
const accountController = require("../controllers/accountController");
const authUser = require("../authenticateUser");

const accountRouter = Router();

accountRouter.get("/get", authUser, accountController.getAccounts);
accountRouter.post("/create", authUser, accountController.createAccount);

module.exports = accountRouter;
