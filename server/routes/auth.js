const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenModel = require("../models/tokenModel");
const { checkFrontendToken } = require("../middlewares/authentication");

const router = require("express").Router();

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (e) {
    let message;
    if (e.keyPattern.email) {
      message = "email is already taken";
    } else {
      message = "username is already taken";
    }
    res.status(200).json({ message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(200)
        .json({ success: false, message: "user not found" });
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res
        .status(200)
        .json({ success: false, message: "Invalid Password" });

    console.log(user);

    const user_payload = {
      username: user.username,
      email: user.email,
      password: user.password,
      _id: user._id,
    };

    const accessToken = jwt.sign(
      user_payload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "6000s",
      }
    );
    // const refreshToken = jwt.sign(
    //   user_payload,
    //   process.env.REFRESH_TOKEN_SECRET
    // );

    // const token = new tokenModel({
    //   refresh_token: refreshToken,
    // });
    // const data = await token.save();

    res.status(200).json({ success: true, accessToken, user_payload });
  } catch (err) {
    console.log(err);
  }
});

router.post("/token", async (req, res) => {
  // if (req.user)
  //   return res.status(200).json({
  //     success: true,
  //     user: req.user,
  //     accessToken: req.accessToken,
  //     refreshToken: req.body.refreshToken,
  //   });
  const refreshToken = req.body.refreshToken;
  console.log(refreshToken);
  if (refreshToken === null) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication Failed" });
  }
  const verifyRefreshToken = await tokenModel.findOne({
    refresh_token: refreshToken,
  });
  if (verifyRefreshToken === null) {
    return res
      .status(403)
      .json({ success: false, message: "The refresh token does not exists" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "The refresh token is invalid!!" });
    }
    const user_payload = {
      username: user.username,
      email: user.email,
      password: user.password,
      _id: user._id,
    };
    const accessToken = jwt.sign(
      user_payload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3600s",
      }
    );
    res
      .status(200)
      .json({ success: true, user: user_payload, accessToken, refreshToken });
  });
});

router.get("/validateToken", async (req, res) => {
  const accessToken = req.query.token;
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, tokenUser) => {
      if (err) {
        return res
          .status(200)
          .json({ success: false, msg: "The token has expired" });
      }
      try {
        console.log(tokenUser._id);
        const user = await User.findById(tokenUser._id)
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
          }
        });

        res.status(200).json({
          success: true,
          user,
          newNotifications: notSeenNotificationsCounter,
        });
      } catch (err) {
        res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      }
    }
  );
});

module.exports = router;
