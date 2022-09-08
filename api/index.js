// attend file is server.

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
dotenv.config();
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const router = express.Router();
const path = require("path");
//middleware
app.use(helmet());
app.use(express.json());
app.use(morgan("common"));
 

try {
  mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected")
  );
} catch (error) {
  console.log("could not connect");
}
app.use("/images", express.static(path.join(__dirname, "public/images")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");// no file floder -> assign wrong
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);// path must string beacause post in postman.
  },
});
const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.get("/", (req, res) => { 
  res.send("home page");
});
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/posts", postsRouter);

app.listen(3001, () => {
  console.log("Run Server");
});
