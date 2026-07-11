// src/middlewares/upload.middleware.js
const multer = require('multer');

// 設定記憶體儲存，這樣檔案不會存進硬碟，可以直接把 Buffer 交給後面的 sharp 處理，效能更好
const storage = multer.memoryStorage(); 

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制檔案大小為 5MB (FR-04)
  },
  fileFilter: (req, file, cb) => {
    // 定義允許的格式 (FR-03)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // 格式正確，允許通過
    } else {
      cb(new Error('INVALID_FORMAT')); // 格式錯誤，拋出特定錯誤給 errorHandler
    }
  }
});

module.exports = upload;