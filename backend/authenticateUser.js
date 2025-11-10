const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || !token.split(" ")[1]) return res.json({ message: "no auth" });
  try {
    const Dtoken = jwt.verify(token.split(" ")[1], process.env.JWT_CODE);
    req.user = Dtoken;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = checkToken;
