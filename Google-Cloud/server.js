const express = require("express");
const app = express();
require("dotenv").config();

const connectDB = require("./utils/db");
connectDB();

const Image = require("./models/Image");

const multerUloads = require("./utils/multer");
const uploadFile = require("./utils/google-storage");

app.post("/upload", multerUloads, uploadFile, async(req, res, next) => {
    try {
        /* if (!req.file) {
          const error = new Error("No image provided.");
          error.statusCode = 422;
          throw error;
        } */
        const imageUrl = req.publicUrl;
        console.log(imageUrl);
        const image = new Image({
          imageUrl,
        });
    
        await image.save();
        res.status(200).json({
          success: true,
          imageUrl,
        });
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
})

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

app.listen(3000, () => {
  console.log(`Server at http://localhost:3000`);
});