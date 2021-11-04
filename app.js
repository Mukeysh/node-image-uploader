const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const File = require("./model/fileSchema");
const multer = require("multer");
//Configuration for Multer

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/admin-${file.originalname}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage: multerStorage });

//API Endpoint for uploading file
app.post("/api/uploadFile", upload.single("myFile"), async (req, res) => {
  try {
    console.log(req);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");

    const newFile = await File.create({
      name: req.file.filename,
    });
    res.status(200).json({
      status: "success",
      message: "File created successfully",
      fileUrl: req.file.filename,
    });
  } catch (error) {
    console.log("error", error);
    res.json({
      error,
    });
  }
});

app.get("/api/getFiles", async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    const files = await File.find();
    res.status(200).json({
      status: "success",
      files,
    });
  } catch (error) {
    res.json({
      status: "Fail",
      error,
    });
  }
});
app.get("/api/download/:id", async (req, res) => {
  try {
    console.log(res);
    const fileName = req.params.id;
    console.log(fileName);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    const file = await File.find({ _id: fileName });
    res.status(200).json({
      status: "success",
      file,
    });
  } catch (error) {
    res.json({
      status: "Fail",
      error,
    });
  }
});
app.use("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).render("index");
});

module.exports = app;
