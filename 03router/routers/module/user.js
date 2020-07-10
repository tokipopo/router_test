const express = require('express');
const Router = express.Router();

let query = require('../../db/mysql');
let tokenFn = require('./token');
// 查询用户名 then catch方式

Router.get('/checkname',(req,res)=>{
    let {name} = req.query;
    let sql = `SELECT * FROM user WHERE username = '${name}'`;
    let p = query(sql);
    let inf = {};
    p.then(data =>{
        
        console.log(data)
        if(data.length){
            inf = {
                code:3000,
                flag:false,
                message:'用户名已存在'
            }
        }else{
            inf={
                code:2000,
                flag:true,
                message:'用户名可！'
            }
        }
        res.send(inf);
    }).catch(err =>{
        console.log(err);
        let inf = {
            code:err.sqlState,
            flag:false,
            message:'check wrong'
        }
        res.send(inf);
    })
    console.log(p);
})


// 注册功能 try catch方法  (无验证用户名)

Router.post('/reg',async(req,res) =>{
    let inf = {};
    try{
        let {name ,psw ,phone} =req.body;
        // let selectname = `SELECT * FROM user WHERE username = '${name}'`;
        // let nametof = await query(selectname);
        // if(nametof==[]){
        //     console.log("ooo");
        // }else{
        //     console.log('no')
        // }
        
        let sql = `INSERT INTO user(username,password,phone) VALUES ('${name}','${psw}','${phone}')`;
        let data = await query(sql);
        if (data.affectedRows){
            console.log(data)
            inf={
                code:2000,
                flag:true,
                message:'register success'
            }
        }else{
            inf = {
                code:3000,
                flag:false,
                message:'register failure'
            }
        }
        // res.send(inf);
    }catch(err){
        inf = {
            code:err.sqlState,
            flag:false,
            message:'查询失败'
        }
        // res.send(inf);
    }
    res.send(inf);
})

// 注册 验证用户是否存在：存在就不给注册  

Router.post('/register',async(req,res) =>{
    let inf = {};
    try{
        let {name ,psw ,phone} =req.body;
        let selectname = `SELECT * FROM user WHERE username = '${name}'`;
        let nametof = await query(selectname);
        // console.log(nametof.length)
        if(nametof.length===0){
            // console.log("ooo");
            let sql = `INSERT INTO user(username,password,phone) VALUES ('${name}','${psw}','${phone}')`;
            let data = await query(sql);
            if (data.affectedRows){
                console.log(data)
                inf={
                    code:2000,
                    flag:true,
                    message:'register success'
                }
            }else{
                inf = {
                    code:3000,
                    flag:false,
                    message:'register failure'
                }
            }
       }else{
            inf = {
                code:3000,
                flag:false,
                message:'username already exists'
            }
        }

    }catch(err){
        inf = {
            code:5000,
            flag:false,
            message:'select failure'
        }
    }
    res.send(inf);
    
})


// 登录  (get)
Router.get('/login',async(req,res) =>{
    let inf = {};
    try{
        let {name,psw}=req.query;
        let sql = `SELECT * FROM user WHERE username='${name}' AND password='${psw}'`;
        let data = await query(sql);
        let token = tokenFn.create(psw);  //tokenFn要在前面导入
        if(data.length){
            inf= {
                code:2000,
                flag:true,
                message:'login success',
                token
            }
        }else{
            inf ={
                code:3000,
                flag:false,
                message:'username or password is wrong'
            }
        }
    }catch(err){
        inf = {
            code:5000,
            flag:false,
            message:'select failure'
        }
    }
    res.send(inf);
});

Router.get('/verify',async(req,res)=>{
    let inf = {};
    try{
        let {token} = req.query;
        let res = tokenFn.verify(token);
        if(res){
            inf = {
                code:2000,
                flag:true,
                message:'verify pass'
            }
        }else{
            inf = {
                code:3000,
                flag:false,
                message:'verify failure'
            }
        }
    }catch(err){
        inf = {
            code:5000,
            flag:false,
            message:'wrong by any'
        }
    }
    res.send(inf);
})

// 通过id查询用户
Router.get('/getuser/:id',async(req,res) =>{
    let inf ={}
    let {id} = req.params;
    try{
        let sql = `SELECT * FROM user WHERE id=${id}`;
        let data =await query(sql);
        if(data.length){
            inf = {
                code:2000,
                flag:true,
                message:'select success',
                data
            }
        }else{
            inf = {
                code:3000,
                flag:false,
                message:'select failure'
            }
        }
    }catch(err){
        inf = {
            code:5000,
            flag:false,
            message:'select failure'
        }
    }
    res.send(inf);
});


// 修改密码 put
Router.put('/edit/:id',async(req,res) => {
    let{id}=req.params;
    let opt = req.body;  // let name = req.query.name;
    console.log(opt)
    let str ='';
    let inf={};
    for(let key in opt){
        str += key + '=' + `'${opt[key]}'` + ','
    }
    str = str.slice(0,-1);
    console.log(str)
    try{
        let sql = `UPDATE user SET ${str} WHERE id=${id}`;
        let data = await query(sql);
        console.log(data);
        if(data.affectedRows){
            inf = {
                code:2000,
                flag:true,
                message:'edit success'
            }
        }else{
            inf = {
                code:3000,
                flag:false,
                message:'edit failure'
            }
        }
    }catch(err){
        inf = {
            code:err.sqlState,
            flag:false,
            message:'select failure'
        }
    }
    res.send(inf);
})


// 删除id为xx 的用户

Router.delete('/del/:id',async(req,res)=>{
    let {id} = req.params;
    let inf={};
    try{
        let sql = `DELETE FROM user WHERE id=${id}`;
        let data = await query(sql);
        if (data.affectedRows) {
            inf = {
                code: 2000,
                flag: true,
                message: '删除成功'

            }
        } else {
            inf = {
                code: 3000,
                flag: false,
                message: '删除失败'
            }
        }
    }catch(err){
        inf = {
            code: 5000,
            flag: false,
            message: '查询失败'
        }
    }
    res.send(inf);
})


// 批量删除
Router.delete('/delmore',async(req,res) =>{
    let {ids} = req.body;
    let inf = {};
    try {
        let sql = `DELETE FROM user WHERE id in(${ids})`;
        let data = await query(sql);
        if (data.affectedRows) {
            inf = {
                code: 2000,
                flag: true,
                message: '删除成功'

            }
        } else {
            inf = {
                code: 3000,
                flag: false,
                message: '删除失败'
            }
        }
    }catch(err){
        inf = {
            code: 5000,
            flag: false,
            message: '查询失败'
        }
    }
    res.send(inf);
});

// 查询所有用户
Router.get('/userlist',async(req,res) =>{
    let { page, pagesize } = req.query;
    let index = (page - 1) * pagesize;
    console.log(index)
    let inf ={};
    try{
        let sql = `SELECT * FROM user LIMIT ${index},${pagesize}`;
        let data = await query(sql);
        let sql2 = `SELECT * FROM user`;
        let allArr = await query(sql2);
        if(data.length){
            inf={
                code: 2000,
                flag: true,
                message: '查询成功',
                total:allArr.length,
                page,
                pagesize,
                pages:Math.ceil(allArr.length / pagesize),
                data
            }
        }else{
            inf = {
                code: 3000,
                flag: false,
                message: '查询失败'
            }
        }
    }catch(err){
        inf = {
            code: 5000,
            flag: false,
            message: '查询失败'
        }
    }
    res.send(inf);
})








module.exports = Router;