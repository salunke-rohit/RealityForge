import express from 'express';

const app = express();
const port = 5000 ;

app.get ("/" , ( req, res)=>{
    res.send("hello rohit the greate ");
})

app.listen(port , ()=>{
    console.log(`app is listen on port ${port}`)
})