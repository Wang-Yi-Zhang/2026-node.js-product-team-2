/**
 * 計算壓縮前後節省的值
 * @param {number} originalSize - 原始檔案大小（bytes）
 * @param {number} outputSize - 處理後檔案大小（bytes）
 * @returns {number} - 節省的百分比，四捨五入到小數點後一位，例如 93.3
 */
function calculateSaved(originalSize, outputSize){

    // 計算壓縮後百分比
    return Math.round((1 - (outputSize / originalSize)) * 1000) / 10

}

module.exports = calculateSaved