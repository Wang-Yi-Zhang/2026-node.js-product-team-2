// src/routes/images.route.js 的寫法範例
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const validateImage = require('../middlewares/validateImage.middleware');
// 假設你有一個負責處理圖片的 controller
// const imageController = require('../controllers/image.controller'); 

// 流程順序：接收單一檔案(image) -> 基礎格式與大小驗證 -> 參數防呆驗證 -> 實際處理圖片
router.post('/process', upload.single('image'), validateImage, (req, res) => {
    // 這裡呼叫你的 imageProcessor.service.js
    res.json({ message: "驗證成功，準備處理圖片" }); 
});

module.exports = router;