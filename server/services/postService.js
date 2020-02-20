const Post = require("../models/post");

function updateAuthorName(cuid, name) {
  return Post.updateMany({ authorCuid: cuid }, { name });
}

module.exports = { updateAuthorName };
