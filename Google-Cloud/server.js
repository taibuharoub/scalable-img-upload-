const express = require("express");
const app = express();
require("dotenv").config();

const connectDB = require("./utils/db")
connectDB();

app.post("/upload", (req, res, next) => {
    //
})

app.listen(3000, () => {
  console.log(`Server at http://localhost:3000`);
});