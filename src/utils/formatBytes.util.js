function calculateSavedPercent(originalSize, outputSize){

    // 計算壓縮後百分比
    return Math.round((1 - (outputSize / originalSize)) * 1000) / 10

}

module.exports = calculateSavedPercent