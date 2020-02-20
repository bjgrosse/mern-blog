const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const imageSchema = new Schema({
  cuid: { type: "String", required: true },
  caption: { type: "String", required: false }
});

const postSchema = new Schema({
  name: { type: "String", required: true },
  authorCuid: { type: "String", required: true },
  title: { type: "String", required: true },
  content: { type: "String", required: true },
  slug: { type: "String", required: true },
  cuid: { type: "String", required: true },
  dateAdded: { type: "Date", default: Date.now, required: true },
  images: [imageSchema]
});

module.exports = mongoose.model("Post", postSchema);
