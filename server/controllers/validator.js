const Validator = require("validator");
const sanitizeHtml = require("sanitize-html");
const isEmpty = require("is-empty");

function sanitize(value) {
  return isEmpty(value) ? "" : sanitizeHtml(value);
}

function capitalize(w) {
  return w[0].toUpperCase() + w.substr(1).toLowerCase();
}

function checkRequired(data, required, errors) {
  for (let field of required) {
    if (Validator.isEmpty(data[field])) {
      errors[field] = capitalize(field) + " is required";
    }
  }
}

// We include all the Validator package functions as well as a few of our own
module.exports = {
  ...Validator,
  isEmpty,
  sanitize,
  capitalize,
  checkRequired
};
