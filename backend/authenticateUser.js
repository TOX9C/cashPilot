const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  try {
    const Dtoken = jwt.verify(token, process.env.JWT_CODE);
    req.user = Dtoken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired" });
  }
};

module.exports = checkToken;
