var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize }
  }).single('file');
   