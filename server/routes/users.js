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
  var regex = new RegExp(name, "i");
  try {
    const users = await User.find({
      name: regex,
    })
      .populate("requests")
      .populate("notifications.user")
      .populate("notifications.post");
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put("/:id/request", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      console.log(user);
      if (!user.requests.includes(req.body.userId)) {
        await user.updateOne({ $push: { requests: req.body.userId } });
        const updatedNotification = {
          messageType: 1,
          user: req.body.userId,
          status: 0,
          creationTime: Date.now(),
          otherLikes: 0,
          otherComments: 0,
        };
        const index = user.notifications.findIndex(
          (notification) =>
            notification.user.toString() === req.body.userId.toString() &&
            notification.messageType === 1
        );
        console.log(index);
        if (index === -1) {
          await user.updateOne({
            $push: { notifications: updatedNotification },
          });
        } else {
          user.notifications[index].status = 0;
          user.notifications[index].creationTime = Date.now();
          await user.save();
        }
        res
          .status(200)
          .json({ success: true, message: "Request send successfully" });
      } else {
        res
          .status(403)
          .json({ success: false, message: "You have already send a request" });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  } else {
    res
      .status(403)
      .json({ success: false, message: "You cannot send request to yourself" });
  }
});

router.put("/:id/acceptRequest", async (req, res) => {
  if (req.body.userId != req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!currentUser.followers.includes(req.params.id)) {
        await currentUser.updateOne({ $push: { followers: req.params.id } });
        await user.updateOne({ $push: { following: req.body.userId } });
        await currentUser.updateOne({ $pull: { requests: req.params.id } });
        const updatedNotification = {
          messageType: 0,
          user: req.body.userId,
          status: 0,
          creationTime: Date.now(),
          otherLikes: 0,
          otherComments: 0,
        };
        const index = user.notifications.findIndex(
          (notification) =>
            notification.user.toString() === req.body.userId.toString() &&
            notification.messageType === 0
        );
        console.log("The Index is ", index);
        if (index === -1) {
          await user.updateOne({
            $push: { notifications: updatedNotification },
          });
        } else {
          user.notifications[index].status = 0;
          user.notifications[index].creationTime = Date.now();
          await user.save();
        }
        res
          .status(200)
          .json({ success: true, message: "Sucessfully accepted the request" });
      } else {
        res
          .status(403)
          .json({ success: false, message: "You already follow the user" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err });
    }
  } else {
    res.status(403).json({ message: "You cannot follow yourself" });
  }
});

router.put("/:id/cancelRequest", async (req, res) => {
  if (req.body.userId != req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (user.requests.includes(req.body.userId)) {
        await user.updateOne({ $pull: { requests: req.body.userId } });
        res.status(200).json({
          success: true,
          message: "The Request has been cancelled succesfully",
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Cancel Request was unsuccessful" });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  } else {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

router.put("/:id/rejectRequest", async (req, res) => {
  if (req.params.id != req.body.userId) {
    try {
      const currentUser = await User.findById(req.body.userId);
      if (currentUser.requests.includes(req.params.id)) {
        await currentUser.updateOne({ $pull: { requests: req.params.id } });
        res.status(200).json({
          success: true,
          message: "The user has been sucessfully rejected!",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Reject Request was unsuccessful!",
        });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  } else {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (currentUser.followers.includes(req.params.id)) {
        await user.updateOne({ $pull: { following: req.body.userId } });
        await currentUser.updateOne({ $pull: { followers: req.params.id } });
        res.status(200).json({ message: "Sucessfully removed the user" });
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

router.put("/:id/stopFollowing", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (currentUser.following.includes(req.params.id)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json({
          success: true,
          message: "Successfully stopped following the user",
        });
      } else {
        res
          .status(403)
          .json({ success: false, message: "You are not following this user" });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  } else {
    res
      .status(403)
      .json({ success: false, message: "You cannot follow yourself" });
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

router.get("/:id/getRequests", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id).populate("requests");
    res
      .status(200)
      .json({ success: true, requests: currentUser.requests.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

router.get("/:id/fetchUserNotifications", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate("requests")
      .populate("notifications.user")
      .populate("notifications.post");
    let seenNotificationsCounter = 0;
    let seenNotifications = [];
    let notSeenNotificationsCounter = 0;
    let notSeenNotifications = [];
    user.notifications.forEach(async (notification) => {
      if (notification.status === 1) {
        seenNotificationsCounter += 1;
        seenNotifications.push(notification);
      } else {
        notSeenNotificationsCounter += 1;
        notSeenNotifications.push(notification);
        await User.findOneAndUpdate(
          { _id: userId, "notifications._id": notification._id },
          { $set: { "notifications.$.status": 1 } }
        );
      }
    });

    res.status(200).json({
      success: true,
      seenNotificationsCounter,
      seenNotifications: seenNotifications.sort(function (a, b) {
        var c = a.creationTime;
        var d = b.creationTime;
        return d - c;
      }),
      notSeenNotificationsCounter,
      notSeenNotifications: notSeenNotifications.sort(function (a, b) {
        var c = a.creationTime;
        var d = b.creationTime;
        return d - c;
      }),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ sucess: false, message: "Something went wrong" });
  }
});

module.exports = router;
