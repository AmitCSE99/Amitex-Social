const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");
const Report = require("../models/report");
const cloudinary = require("../cloudinary");
const {
  authenticateToken,
  checkFrontendToken,
} = require("../middlewares/authentication");
router.post("/", async (req, res) => {
  // const newPost = new Post(req.body);

  let public_url = "";
  let secure_url = "";

  if (req.body.img) {
    const image_uploaded = req.body.img;
    try {
      const response = await cloudinary.uploader.upload(image_uploaded);
      console.log(response);
      secure_url = response.secure_url;
      public_url = response.public_id;
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Image cannot be uploaded" });
    }
  }

  const newPost = new Post({
    user: req.body.user,
    desc: req.body.desc,
    img: secure_url,
    public_url: public_url,
  });

  try {
    const post = await newPost.save();
    res.status(200).json({ message: post });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

router.post("/editPost", async (req, res) => {
  const postId = req.body.postId;
  const img = req.body.img;
  const desc = req.body.desc;
  const public_url = req.body.public_url;
  try {
    await cloudinary.uploader.destroy(public_url);
    const imageResponse = await cloudinary.uploader.upload(img);
    const updateObject = {
      desc,
      img: imageResponse.secure_url,
      public_url: imageResponse.public_id,
    };
    const response = await Post.findByIdAndUpdate(postId, updateObject);

    res.status(200).json({ success: true, message: response });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

router.delete("/deletePost", async (req, res) => {
  const postId = req.body.postId;
  const public_url = req.body.public_url;
  try {
    await cloudinary.uploader.destroy(public_url);
    const post = await Post.findByIdAndDelete(postId);
    res.status(200).json({ success: false, post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

router.post("/bookmarkPost", async (req, res) => {
  const postId = req.body.postId;
  const userId = req.body.userId;
  try {
    const post = await Post.findById(postId);
    if (!post.bookMarkedBy.includes(userId)) {
      await post.updateOne({ $push: { bookMarkedBy: userId } });
      return res.status(200).json({ success: true, message: "Bookmarked" });
    } else {
      await post.updateOne({ $pull: { bookMarkedBy: userId } });
      return res.status(200).json({ success: true, message: "Unbookmarked" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({ message: "Your post is updated" });
    } else {
      res.status(403).json({ message: "You can edit only your post" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json({ message: "Your post is deleted" });
    } else {
      res.status(403).json({ message: "You can delete only your post" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({ message: "The Post has been liked" });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({ message: "The post has been disliked" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    console.log(currentUser);
    const userPosts = await Post.find({ user: currentUser._id })
      .populate("user")
      .populate("comments.user");
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ user: friendId })
          .populate("user")
          .populate("comments.user");
      })
    );
    res
      .status(200)
      .json({ success: true, posts: userPosts.concat(...friendPosts) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
});
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    console.log(user._id);
    const posts = await Post.find({ user: user._id })
      .populate("user")
      .populate("comments.user");
    res.status(200).json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put("/:id/postComment", async (req, res) => {
  const comment = req.body.comment;
  const user = req.body.user;
  const creationTime = Date.now();
  const commentObj = {
    comment,
    user,
    creationTime,
  };
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    await post.updateOne({ $push: { comments: commentObj } });
    res.status(200).json({ commentObj });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/:id/reportPost", async (req, res) => {
  const reportedPost = req.params.id;
  const reportedUser = req.body.reportedUser;
  const reportingUser = req.body.reportingUser;
  const reportMessage = req.body.reportMessage;
  try {
    const post = await Report.findOne({ reportedPost: reportedPost });
    console.log(post);
    if (!post) {
      const firstReportingUser = {
        user: reportingUser,
        reportMessage,
      };
      const newReport = new Report({
        reportedPost,
        reportedUser,
        reportingUsers: firstReportingUser,
      });
      await newReport.save();
      return res.status(200).json({
        success: true,
        message: "The post has been reported successfully",
      });
    } else {
      const appendReportUser = {
        user: reportingUser,
        reportMessage,
      };
      // if (post.reportingUsers.includes(appendReportUser.user)) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "You have already reported this post!",
      //   });
      // }
      const index = post.reportingUsers.findIndex((u) => {
        return u.user.toString() === reportingUser.toString();
      });
      if (index !== -1) {
        return res.status(200).json({
          success: false,
          message: "you have already reported this post!",
        });
      }
      await post.updateOne({ $push: { reportingUsers: appendReportUser } });
      return res.status(200).json({
        success: true,
        message: "The Post has been reported sucessfully",
      });
    }
    // console.log(post);
    // const newReport = new Report({
    //   reportedPost,
    //   reportedUser,
    //   reportingUser,
    //   reportMessage,
    // });
    // await newReport.save();
    // res.status(200).json({
    //   success: true,
    //   message: "The Post Has been reported successfully",
    // });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/reportedPosts/fetch", async (req, res) => {
  try {
    const reportedPosts = await Report.find()
      .populate("reportedUser")
      .populate("reportingUsers.user");
    res.status(200).json({ success: true, reportedPosts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

module.exports = router;
