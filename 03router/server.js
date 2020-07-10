let express = require('express');
var bodyParser = require('body-parser');

const {json} = require('body-parser');
const allRouter = require('./routers/index');
let app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(allRouter);  

app.use(express.static('./'));

app.listen(8861,()=>{
    console.log('success,post is 8861');
})
