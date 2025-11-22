const express= require('express');
const cors=require('cors');
const app=express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use('/api',router);

app.get('/',(req,res)=>{
    res.send('Hello World');

});

app.listen(port,()=>{
    console.log(`example app is listening at http://localhost:${port}`);
});