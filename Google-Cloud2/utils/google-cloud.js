const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const { v4 } = require("uuid");

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No image provided.");
      error.statusCode = 422;
      throw error;
    }
    const fileName = `${v4()}-${req.file.originalname.replace(/\s+/g, "")}`;
    // Instantiate a storage client
    const storage = new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID,
      keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
    });

    const bucket = await storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

    // Create a new blob in the bucket and upload the file data.
    const blob = await bucket.file(fileName);
    const blobStream = await blob.createWriteStream();

    blobStream.on("error", (err) => {
      next(err);
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      req.publicUrl = format(
        `https://storage.cloud.google.com/${bucket.name}/${blob.name}`
      );
      //   req.publicUrl = encodeURI(`https://storage.cloud.google.com/${bucket.name}/${blob.name}`)
      next();
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = uploadFile;
