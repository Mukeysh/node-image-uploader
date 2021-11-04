const app = require("./app");
const mongoose = require("mongoose");
const db =
  "mongodb+srv://mukeysh:xAJQhgaPfIPQsq2b@image-upload.odjhn.mongodb.net/image-upload?retryWrites=true&w=majority";

const port = 4343;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    autoIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected successfully");
  });

const server = app.listen(port, () => {
  console.log("server is running up:" + port);
});
