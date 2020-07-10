//子路由：商品信息

const express = require('express');
const Router = express.Router();//Router==app

let query = require('../../db/mysql');
let tokenFn = require('./token');

//写接口 
// 商品信息列表：分页
Router.get('/goodlist',async(req,res) =>{
    let { page, pagesize } = req.query;
    let index = (page - 1) * pagesize;
    console.log(index)
    let inf ={};
    try{
        let sql = `SELECT * FROM goods LIMIT ${index},${pagesize}`;
        let data = await query(sql);
        // console.log(sql)
        let sql2 = `SELECT * FROM goods`;
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



//查询gid为xx的商品
Router.get('/getgood/:id',async(req,res) =>{
    let inf ={}
    let {id} = req.params;
    try{
        let sql = `SELECT * FROM goods WHERE good_id=${id}`;
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

// 修改gid为xx的商品信息
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
        let sql = `UPDATE goods SET ${str} WHERE good_id=${id}`;
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

// 删除gid的商品
Router.delete('/del/:id',async(req,res)=>{
    let {id} = req.params;
    let inf={};
    try{
        let sql = `DELETE FROM goods WHERE good_id=${id}`;
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


// 删除多个商品
Router.delete('/delmore',async(req,res) =>{
    let {ids} = req.body;
    let inf = {};
    try {
        let sql = `DELETE FROM goods WHERE good_id in(${ids})`;
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



// 新增商品
Router.post('/addshop',async(req,res) =>{
    let inf = {};
    try{
        let {title,info,price} =req.body;
        // INSERT INTO `sephora`.`goods`(`title`, `info`, `src`, `price`) VALUES ('DrJart', '蒂佳婷修复新生精华露', 'https://ssl4.sephorastatic.cn/products/3/9/8/0/5/2/1_n_07551_350x350.jpg', 298.00);
        let sql = `INSERT INTO goods(title,info,price) VALUES ('${title}','${info}',${price})`;
        let data = await query(sql);
        if (data.affectedRows){
            console.log(data)
            inf={
                code:2000,
                flag:true,
                message:'add shop success'
            }
        }else{
            inf = {
                code:3000,
                flag:false,
                message:'add shop failure'
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


module.exports = Router;//导出路由对象