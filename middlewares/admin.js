const localStorage = require("localStorage");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.TOKEN_SECRET;

const adminMiddleware = (req, res, next) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return res.redirect("/panel/login");
  }

  jwt.verify(token, jwtKey, (err, user) => {
    if (err) return res.redirect("/");
    next();
  });
};

module.exports = adminMiddleware;
