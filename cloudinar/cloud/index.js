const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
      folder: "ty",
      allowedFormats: ["jpeg", "png", "jpg"]
  }
});

const upload = multer({ storage, limits: {fileSize: 1 * 1024 * 1024} }).single("image");
// const upload = multer({ storage }).single("image");

module.exports = {
  upload
};
