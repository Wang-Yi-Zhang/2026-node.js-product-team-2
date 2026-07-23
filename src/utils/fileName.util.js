const crypto = require('crypto')

/**
 * 產生一個不會重複的檔名，避免處理後的圖片互相覆蓋
 * @param {string} format - 檔案的副檔名／格式，例如 'webp'、'jpeg'、'png'
 * @returns {string} - 由亂數 UUID 加上副檔名組成的唯一檔名，例如 '05117ec0-....webp'
 */

function generateFileName(format){

    const fileName =crypto.randomUUID()

    return `${fileName}.${format}`

}

module.exports = generateFileName