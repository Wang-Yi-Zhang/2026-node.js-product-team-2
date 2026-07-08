const express = require('express');
const route = express.Router();


route.get('/',(req,res)=>{
    res.status(200).json({
        "status": "ok",
        "service": "image-optimizer"
    });
})

module.exports = route;