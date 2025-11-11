require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/authRouter.js");
const accountRouter = require("./routes/accountRouter.js");
const transactionRouter = require("./routes/transactionRouter.js");
const goalRouter = require("./routes/goalRouter.js");

app.use("/auth", authRouter);
app.use("/account", accountRouter);
app.use("/transaction", transactionRouter);
app.use("/goal", goalRouter);

app.listen(3000, () => {
  console.log("server is up");
});
