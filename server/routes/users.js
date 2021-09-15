const router = require("express").Router();
const bcrypt = require("bcrypt");
const { checkFrontendToken } = require("../middlewares/authentication");
const User = require("../models/user");

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json({ message: err });
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({ message: "Account updated!", user });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  } else {
    res.status(401).json({ message: "You can update only your account" });
  }
});
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Account deleted!", user });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  } else {
    res.status(401).json({ message: "You can update only your account" });
  }
});

router.get("/", checkFrontendToken, async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json({ success: true, user: other });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const currentUser = await User.findById(userId);
    const followers = await Promise.all(
      currentUser.followers.map((friendId) => {
        return User.findById(friendId);
      })
    );
    res.status(200).json({ followers });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/findUsers/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const users = await User.find({
      name: { $regex: "^" + name },
    });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId != req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json({ message: "Sucessfully followed the user" });
      } else {
        res.status(403).json({ message: "You already follow the user" });
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  } else {
    res.status(403).json({ message: "You cannot follow yourself" });
  }
});
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId != req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json({ message: "Sucessfully unfollowed the user" });
      } else {
        res.status(403).json({ message: "You don not follow the user" });
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  } else {
    res.status(403).json({ message: "You cannot unfollow yourself" });
  }
});

router.get("/followers/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username: username });
    const followers = await Promise.all(
      user.followers.map((followerId) => {
        return User.findById(followerId);
      })
    );
    res.status(200).json({ followers });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
router.get("/followings/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username: username });
    const followings = await Promise.all(
      user.following.map((followerId) => {
        return User.findById(followerId);
      })
    );
    res.status(200).json({ followings });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
