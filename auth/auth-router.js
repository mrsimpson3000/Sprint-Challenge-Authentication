const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = require("express").Router();

const Users = require("./auth-model");
const { isValid } = require("./auth-service");
const configVars = require("../config/vars");

router.post("/register", (req, res) => {
  // implement registration
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 12;

    // hash it up
    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    // save user to db
    Users.add(credentials)
      .then((user) => {
        res.status(201).json({ data: user });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res
      .status(400)
      .json({
        message:
          "Please provide the username and password. The password should be alphanumeric.",
      });
  }
});

router.post("/login", (req, res) => {
  // implement login
  const { username, password } = req.body;
  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        // compare the password to the hash stored in the db
        if (user && bcryptjs.compareSync(password, user.password)) {
          // produce (sign) and send the token
          const token = generateToken(user);

          res.status(200).json({ message: "Welcome to our API", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((err) => {
        res.status({ message: err.message });
      });
  } else {
    res
      .status(400)
      .json({
        message:
          "Please provide the username and password. The password should be alphanumeric.",
      });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, configVars.jwtSecret, options);
}

module.exports = router;
