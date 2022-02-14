const express = require('express');
const app = express();
app.use(express.json());
const db = require('./db/index')
require('dotenv').config();

const authRouter = require('./auth/index');
const formdataRouter = require('./formdata/index');

const PORT = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.json({
        message: 'Hello World'   
    })
})

app.use('/auth',authRouter);
app.use('/formdata',formdataRouter);


app.listen(PORT,(req,res) => {
    console.log(`Listening index.js on Port ${PORT}`);
})