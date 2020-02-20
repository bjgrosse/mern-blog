const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

const app = express();
const posts = require("./routes/post.routes");
const users = require("./routes/user.routes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);
app.use("/api", [posts, users]);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  next();
});

module.exports = app;
