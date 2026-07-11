// src/middlewares/validateImage.middleware.js
const validateImage = (req, res, next) => {
  // 1. 防呆檢查：確認使用者是否有上傳圖片
  if (!req.file) {
    return res.status(400).json({ error: '請上傳圖片檔案' });
  }

  // 2. 參數檢查：如果有傳入 quality 參數，確認是否在 1-100 之間 (FR-05)
  const { quality } = req.body;
  if (quality) {
    const qualityNum = parseInt(quality, 10);
    if (isNaN(qualityNum) || qualityNum < 1 || qualityNum > 100) {
      return res.status(400).json({ error: '品質請輸入 1 到 100 的數字' });
    }
  }

  // 檢查通過，將請求交棒給下一個流程 (通常是 controller 或 service)
  next();
};

module.exports = validateImage;