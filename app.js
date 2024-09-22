const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads')); // 정적 파일 제공

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/twitter-clone', { useNewUrlParser: true, useUnifiedTopology: true });

// 라우팅 설정
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// 서버 실행
app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
