const multer = require ('multer');

const storage = multer.memoryStorage()
const multerUploads = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // keep images size < 1 MB
  },
}).single('image')

module.exports = multerUploads