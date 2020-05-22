/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");
const configVars = require("../config/vars");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, configVars.jwtSecret, (err, decodedToken) => {
    if (token) {
      if (err) {
        // the token is invalid
        res.status(401).json({ you: "shall not pass!" });
      } else {
        // the token is valid
        req.jwt = decodedToken;
        next();
      }
    } else {
      res
        .status(400)
        .json({ message: "Please provide the authentication information." });
    }
  });
};
