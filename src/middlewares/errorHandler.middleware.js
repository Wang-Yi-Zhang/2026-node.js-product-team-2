// src/middlewares/errorHandler.middleware.js
const errorHandler = (err, req, res, next) => {
  // 處理 multer 檔案過大的預設錯誤碼
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ 
      error: '圖片太大，請上傳較小的檔案' 
    });
  }

  // 處理我們在 upload.middleware 自訂的格式錯誤
  if (err.message === 'INVALID_FORMAT') {
    return res.status(400).json({ 
      error: '只支援 JPG, PNG, WebP 圖片檔案' 
    });
  }

  // 處理其他未知的伺服器錯誤
  console.error(err);
  res.status(500).json({ 
    error: '圖片處理失敗，請稍後再試' 
  });
};

module.exports = errorHandler;