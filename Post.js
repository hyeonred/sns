const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: String,
  content: String,
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  comments: [{ username: String, content: String, createdAt: { type: Date, default: Date.now } }],
  retweets: { type: Number, default: 0 },
  retweetedBy: [{ type: String }],
  shares: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
