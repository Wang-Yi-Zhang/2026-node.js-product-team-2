const express = require('express');
const cors = require('cors');
const app = express();
const healthRoute = require('./routes/health.route');

app.use(cors());
app.use(express.json());

app.use('/health',healthRoute);



const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`伺服器已啟動: http://localhost:${PORT}`);
});