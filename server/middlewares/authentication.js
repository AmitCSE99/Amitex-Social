const jwt = require("jsonwebtoken");
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
function checkFrontendToken(req, res, next) {
  // const authHeader = req.headers["authorization"];
  // console.log(authHeader);
  // const token = authHeader && authHeader.split(" ")[1];
  const token = req.query.token;
  console.log("This is token", token);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) {
      return res.status(200).json({ success: false, message: "Token expired" });
    }
    req.user = user;
    req.accessToken = token;
    next();
  });
}
module.exports = {
  authenticateToken,
  checkFrontendToken,
};
