const mysql = require('mysql');

var pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    port:3306,
    database:'sephora',
    multipleStatements:true
});

function query(sql){
    return new Promise((resolve,reject) => {
        pool.query(sql,(err,data) =>{
            if(err)reject(err);
            resolve(data);
        })
    })
}

// let sql= "SELECT * FROM `user` WHERE username = 'tomato'";
// let p = query(sql);
// console.log(p)
// p.then(data =>{
//     console.log(data);
// }).catch(err =>{
//     console.log(err)
// })

module.exports = query;