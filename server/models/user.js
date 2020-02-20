const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: "String", required: true },
  email: { type: "String", required: true },
  password: { type: "String", required: true },
  cuid: { type: "String", required: true },
  dateAdded: { type: "Date", default: Date.now, required: true }
});

module.exports = mongoose.model("User", userSchema);
