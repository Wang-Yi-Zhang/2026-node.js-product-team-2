const sharp = require('sharp')
const fs = require('fs/promises')
const path = require('path')

/**
 * 用 sharp 壓縮／轉檔圖片，處理後存進 downloads/ 資料夾
 * @param {string} inputPath - 原始圖片的暫存檔路徑（由 upload middleware 存進硬碟後給的路徑）
 * @param {Object} options
 * @param {string} options.format - 目標輸出格式，例如 'webp'、'jpeg'、'png'
 * @param {number} options.quality - 壓縮品質，範圍 1-100
 * @param {number} [options.maxWidth] - 選填，輸出圖片的最大寬度，超過才等比縮小，不會放大
 * @returns {Promise<Object>} - 處理結果，包含 filename、originalSize（bytes）、outputSize（bytes）、savedPercent（%）、format
 */

async function processImage(inputPath, { format, quality, maxWidth }) {
    
    // 取得檔案
    let pipeline = sharp(inputPath)
    // 計算原始檔案大小
    const originalSize = (await fs.stat(inputPath)).size
    
    if(maxWidth){
        pipeline = pipeline.resize({
            width: maxWidth,
            withoutEnlargement: true
        })
    }

    // 壓縮檔案
    pipeline = pipeline.toFormat(format, {quality})

    // 將檔案放到downloads資料夾
    const info = await pipeline.toFile(path.join(__dirname, '..', '..', 'downloads', 'test-output.') + format)

    // 計算壓縮後百分比
    const savedPercent = Math.round((1 - (info.size / originalSize)) * 1000) / 10

    return {
        filename:'output.webp',
        originalSize: originalSize,
        outputSize: info.size,
        savedPercent: savedPercent,
        format: info.format
    }
    
}

module.exports = {processImage}