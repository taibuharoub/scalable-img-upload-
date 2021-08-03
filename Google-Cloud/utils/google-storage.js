const {format} = require("util");
const { Storage } = require ('@google-cloud/storage')
const { v4 } = require('uuid')

const uploadFile = async (req, res, next) => {
  try {
    const fileUpload = req.file
    if (fileUpload) {
      const fileID = `${v4()}-${req.file.originalname.replace(/\s+/g, '')}`
      const storage = new Storage({
        projectId: process.env.GCLOUD_PROJECT_ID,
        keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
      })
      const bucket = await storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL)
      const blob = await bucket.file(fileID)
      const blobStream = await blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      })
      blobStream.on('error', (err) => next(err))

      blobStream.on('finish', () => {
        // req.publicUrl = encodeURI(blob.name)
        req.publicUrl = encodeURI(`https://storage.cloud.google.com/${bucket.name}/${blob.name}`)
        /* req.publicUrl = format(
            `https://storage.cloud.google.com/${bucket.name}/${blob.name}`
          ); */
        /* const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          ); */
        next()
      })
      blobStream.end(req.file.buffer)
    } else {
      return res.status(400).json({
        error: 'Image file is not present',
      })
    }
  } catch (err) {
    return res.status(400).json({
      error: `Error, could not upload file: ${err}`,
    })
  }
}

module.exports = uploadFile;