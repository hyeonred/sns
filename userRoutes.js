const express = require('express');
const User = require('../models/User');
const router = express.Router();

// 팔로우, 언팔로우, 알림 및 프로필 조회/수정 등의 API 구현

// 팔로우 API
  app.post('/users/:username/follow', async (req, res) => {
  const { username } = req.params;
  const { followerUsername } = req.body; // 팔로우하는 사용자

  try {
    const userToFollow = await User.findOne({ username });
    const follower = await User.findOne({ username: followerUsername });

    if (!userToFollow || !follower) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 이미 팔로우 중인지 확인
    if (userToFollow.followers.includes(follower._id)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    // 팔로우 처리
    userToFollow.followers.push(follower._id);
    follower.following.push(userToFollow._id);

    // 알림 추가
    userToFollow.notifications.push({ message: `${follower.username} is now following you`, date: new Date() });

    await userToFollow.save();
    await follower.save();

    res.json(userToFollow);
  } catch (err) {
    res.status(500).json({ message: 'Error following user' });
  }
});

// 언팔로우 API
app.post('/users/:username/unfollow', async (req, res) => {
  const { username } = req.params;
  const { followerUsername } = req.body; // 언팔로우하는 사용자

  try {
    const userToUnfollow = await User.findOne({ username });
    const follower = await User.findOne({ username: followerUsername });

    if (!userToUnfollow || !follower) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 팔로워 목록에서 제거
    userToUnfollow.followers.pull(follower._id);
    follower.following.pull(userToUnfollow._id);

    await userToUnfollow.save();
    await follower.save();

    res.json(userToUnfollow);
  } catch (err) {
    res.status(500).json({ message: 'Error unfollowing user' });
  }
});

// 프로필 조회 API
app.get('/users/:username/profile', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).populate('posts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile' });
  }
});

// 프로필 수정 API
app.put('/users/:username/profile', async (req, res) => {
  const { username } = req.params;
  const { bio, profilePicture, email } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 사용자 정보 수정
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;
    user.email = email || user.email;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});


// 알림 조회 API
app.get('/users/:username/notifications', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving notifications' });
  }
});


module.exports = router;
