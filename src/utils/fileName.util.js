const crypto = require('crypto')

function generateFileName(format){
    const fileName =crypto.randomUUID()
    return `${fileName}.${format}`
}

module.exports = generateFileName