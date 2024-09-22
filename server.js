const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Express 앱 설정
const app = express();
app.use(cors());
app.use(express.json()); // JSON 데이터 처리

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/twitter_clone', { useNewUrlParser: true, useUnifiedTopology: true });

// 게시물 스키마 정의
const postSchema = new mongoose.Schema({
  username: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// 게시물 가져오기 (GET 요청)
app.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// 게시물 작성 (POST 요청)
app.post('/posts', async (req, res) => {
  const { username, content } = req.body;
  const post = new Post({ username, content });
  await post.save();
  res.status(201).json(post);
});

// 서버 시작
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
