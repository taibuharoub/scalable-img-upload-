const multer = require("multer");

// Multer is required to process file uploads and make them available via
// req.files.
const multerUploads = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
}).single("image");

module.exports = multerUploads;

