require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());

const authRouter = require("./routes/authRouter.js");
const accountRouter = require("./routes/accountRouter.js");

app.use("/auth", authRouter);
app.use("/account", accountRouter);

app.listen(3000, () => {
  console.log("server is up");
});
