const Post = require("../models/post");
const cuid = require("cuid");
const slug = require("limax");
const validator = require("./validator");

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
getPosts = async (req, res) => {
  Post.find()
    .sort("-dateAdded")
    .exec((err, posts) => {
      if (err) {
        res.status(500).send(err);
      }
      res.json({ posts });
    });
};

/**
 * Save a post
 * @param req
 * @param res
 * @returns void
 */
addPost = async (req, res) => {
  let errors = {};

  let data = {};

  // extract sanitized data
  data.title = validator.sanitize(req.body.post.title);
  data.content = validator.sanitize(req.body.post.content);
  data.images = req.body.post.images.map(x => ({
    cuid: x.cuid,
    caption: validator.sanitize(x.caption)
  }));

  // check required fields
  validator.checkRequired(data, ["title", "content"], errors);
  if (
    !validator.isLength(data.title, {
      max: 255
    })
  ) {
    errors.title = "Title cannot exceed 255 characters";
  }

  if (!validator.isEmpty(errors)) {
    return res.status(403).json(errors);
  }

  const newPost = new Post(req.body.post);

  // Let's sanitize inputs

  newPost.name = req.user.name;
  newPost.authorCuid = req.user.cuid;
  newPost.slug = slug(newPost.title.toLowerCase(), { lowercase: true });
  newPost.cuid = cuid();

  newPost.save((err, saved) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ post: saved });
  });
};

/**
 * Get a single post
 * @param req
 * @param res
 * @returns void
 */
getPost = async (req, res) => {
  Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ post });
  });
};

/**
 * Delete a post
 * @param req
 * @param res
 * @returns void
 */
deletePost = async (req, res) => {
  Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (post.authorCuid !== req.user.cuid) {
      return res.status(403).send();
    }

    post.remove(() => {
      return res.status(200).end();
    });
  });
};

module.exports = {
  getPosts,
  addPost,
  getPost,
  deletePost
};
