const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const cors=require('cors');
const multer = require("multer");
const path = require("path");
const { v1: uuidv1 } = require("uuid");
dotenv.config();
const app = express();
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) console.log(err);
    console.log("Connected to database");
  }
);
const MIME_TYPE_MAP = {
  "image/jpg": "jpg",
  "image/png": "png",
  "image/jpeg": "jpeg",
};

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  express.json({
    limit: "200mb",
  })
);
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
// var name;
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     name = uuidv1() + "." + ext;
//     cb(null, name);
//   },
// });

// const uploadImage = multer({ storage });
// app.post("/api/upload", uploadImage.single("file"), (req, res) => {
//   try {
//     console.log(storage);
//     return res.status(200).json({ name });
//   } catch (err) {
//     console.log(err);
//   }
// });

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(5000, () => {
  console.log("server is running");
});
