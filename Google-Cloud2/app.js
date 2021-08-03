const express = require("express");
require("dotenv").config();
const connectDB = require("./utils/db");
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

const Image = require("./models/Image");

const multerUloads = require("./utils/multer");
const uploadFile = require("./utils/google-cloud");

app.use(express.json());

app.post("/upload", multerUloads, uploadFile, async(req, res, next) => {
    try {
        if (!req.file) {
          const error = new Error("No image provided.");
          error.statusCode = 422;
          throw error;
        }
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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
