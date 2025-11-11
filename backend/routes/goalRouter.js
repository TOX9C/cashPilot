const { Router } = require("express");
const authUser = require("../authenticateUser");
const goalRouter = Router();
const goalController = require("../controllers/goalController");

goalRouter.get("/get", authUser, goalController.getGoals);
goalRouter.post("/add", authUser, goalController.addGoal);
goalRouter.patch("/update", authUser, goalController.updateGoal);
goalRouter.delete("/delete", authUser, goalController.removeGoal);

module.exports = goalRouter;
