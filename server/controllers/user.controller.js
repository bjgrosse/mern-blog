const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cuid = require("cuid");
const keys = require("../config/keys");
const validator = require("./validator");
const { updateAuthorName } = require("../services/postService");

// extract just the fields from the user model that we want to send
// back to the client
const getUserProfileFields = ({ name, email, dateAdded, cuid }) => ({
  name,
  email,
  dateAdded,
  cuid
});

function createJwt(user, callback) {
  // create JWT payload
  const payload = {
    id: user.id
  };

  jwt.sign(
    payload,
    keys.authSecretKey,
    {
      expiresIn: 31556926 // 1 year in seconds
    },
    (err, token) => {
      callback(err, "Bearer " + token);
    }
  );
}

/**
 * Save a user
 * @param req
 * @param res
 * @returns void
 */
registerUser = (req, res) => {
  let errors = {};

  // Let's sanitize inputs
  let data = {
    name: validator.sanitize(req.body.name),
    email: validator.sanitize(req.body.email),
    password: validator.sanitize(req.body.password),
    password2: validator.sanitize(req.body.password2)
  };

  // check required fields
  validator.checkRequired(
    data,
    ["name", "email", "password", "password2"],
    errors
  );

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (
    !validator.isLength(data.password, {
      min: 6,
      max: 30
    })
  ) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  if (!validator.isEmpty(errors)) {
    return res.status(403).json(errors);
  }

  User.findOne({ email: data.email }).then(user => {
    if (user) {
      return res.status(403).json({ email: "Email already exists" });
    } else {
      // create hash for password, then save
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(data.password, salt, (err, hash) => {
          if (err) throw err;

          const newUser = new User(data);

          newUser.password = hash;
          newUser.cuid = cuid();

          newUser
            .save()
            .then(user => {
              createJwt(user, (err, token) => {
                res.json({
                  user: getUserProfileFields(user),
                  token: token
                });
              });
            })
            .catch(err => res.status(500).send(err));
        });
      });
    }
  });
};

/**
 * Save a user
 * @param req
 * @param res
 * @returns void
 */
updateUserProfile = (req, res) => {
  if (req.body.cuid !== req.user.cuid) {
    return res.status(401).send();
  }

  let errors = {};

  // Let's sanitize inputs
  let data = {
    name: validator.sanitize(req.body.name),
    email: validator.sanitize(req.body.email)
  };

  // check required fields
  validator.checkRequired(data, ["name", "email"], errors);

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (!validator.isEmpty(errors)) {
    return res.status(403).json(errors);
  }

  User.findOne({ email: data.email }).then(user => {
    if (user && user.cuid !== req.body.cuid) {
      return res.status(403).json({ email: "Email already exists" });
    } else {
      User.findOne({ cuid: req.body.cuid }).then(user => {
        user
          .updateOne(data)
          .then(() => {
            if (user.name !== data.name) {
              updateAuthorName(req.body.cuid, data.name).then(() => {
                return res.status(200).json({ success: true });
              });
            } else {
              return res.status(200).json({ success: true });
            }
          })
          .catch(err => res.status(500).send(err));
      });
    }
  });
};

/**
 * Get current user profile
 * @param req
 * @param res
 * @returns void
 */
getUserProfile = async (req, res) => {
  User.findOne({ cuid: req.user.cuid }).exec((err, user) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ user: getUserProfileFields(user) });
  });
};

/**
 * Check to see if an account exists with the specified email address
 * @param req
 * @param res
 * @returns void
 */
checkEmail = async (req, res) => {
  let email = validator.sanitize(req.body.email);

  if (validator.isEmpty(email)) {
    return res.status(403).json({ email: "Please enter email" });
  }

  if (!validator.isEmail(email)) {
    return res.status(403).json({ email: "Email is invalid" });
  }

  User.exists({ email: req.body.email }, (err, exists) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ exists: exists });
  });
};

/**
 * Check to see if an account exists with the specified email address
 * @param req
 * @param res
 * @returns void
 */
login = async (req, res) => {
  let errors = {};

  // Let's sanitize inputs
  let data = {
    email: validator.sanitize(req.body.email),
    password: validator.sanitize(req.body.password)
  };

  // check required fields
  validator.checkRequired(data, ["email", "password"], errors);

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (
    !validator.isLength(data.password, {
      min: 6,
      max: 30
    })
  ) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!validator.isEmpty(errors)) {
    return res.status(403).json(errors);
  }

  User.findOne({ email: data.email }).then(user => {
    const failure = {
      password: "Account not found matching this email and password"
    };
    if (!user) {
      return res.status(400).json(failure);
    } else {
      // Compare supplied password with password on the matching account
      bcrypt.compare(data.password, user.password).then(isMatch => {
        if (isMatch) {
          // create JWT payload
          createJwt(user, (err, token) => {
            res.json({
              user: getUserProfileFields(user),
              token: token
            });
          });
        } else {
          return res.status(400).json(failure);
        }
      });
    }
  });
};

module.exports = {
  registerUser,
  getUserProfile,
  updateUserProfile,
  checkEmail,
  login
};
