const express = require("express");
const Router = express.Router(); //Router==app

let query = require("../../db/mysql");
// let tokenFn = require('./token');

//写接口
// 新增订单(购物车新增商品)
Router.post("/addcart", async (req, res) => {
  let inf = {};
  try {
    let { user_id, good_id, num } = req.body;
    // INSERT INTO `sephora`.`goods`(`title`, `info`, `src`, `price`) VALUES ('DrJart', '蒂佳婷修复新生精华露', 'https://ssl4.sephorastatic.cn/products/3/9/8/0/5/2/1_n_07551_350x350.jpg', 298.00);
    let sql = `INSERT INTO cart(user_id,good_id,num) VALUES ('${user_id}','${good_id}',${num})`;
    let data = await query(sql);
    if (data.affectedRows) {
      // 如果添加成功     //返回goods相同goods_id的商品  //后面再个接口
      console.log(data, "jjkjlll");
      inf = {
        code: 2000,
        flag: true,
        message: "add cart success",
      };
    } else {
      //klk
      inf = {
        code: 3000,
        flag: false,
        message: "add cart failure",
      };
    }
    // res.send(inf);
  } catch (err) {
    inf = {
      code: err.sqlState,
      flag: false,
      message: "查询失败",
    };
    // res.send(inf);
  }
  res.send(inf);
});

// 删除订单(购物车删除商品)
Router.delete("/del/:id", async (req, res) => {
  let { id } = req.params;
  let inf = {};
  try {
    let sql = `DELETE FROM cart WHERE good_id=${id}`;
    let data = await query(sql);
    if (data.affectedRows) {
      inf = {
        code: 2000,
        flag: true,
        message: "删除成功",
      };
    } else {
      inf = {
        code: 3000,
        flag: false,
        message: "删除失败",
      };
    }
  } catch (err) {
    inf = {
      code: 5000,
      flag: false,
      message: "查询失败",
    };
  }
  res.send(inf);
});

// 批量删除
Router.delete("/delmore", async (req, res) => {
  let { ids } = req.body;
  let inf = {};
  try {
    let sql = `DELETE FROM cart WHERE good_id in(${ids})`;
    let data = await query(sql);
    if (data.affectedRows) {
      inf = {
        code: 2000,
        flag: true,
        message: "删除成功",
      };
    } else {
      inf = {
        code: 3000,
        flag: false,
        message: "删除失败",
      };
    }
  } catch (err) {
    inf = {
      code: 5000,
      flag: false,
      message: "查询失败",
    };
  }
  res.send(inf);
});

// 修改订单  一般是该规格 数量  num22
Router.put("/edit/:id", async (req, res) => {
  let { id } = req.params;
  let opt = req.body; // let name = req.query.name;
  console.log(opt);
  let str = "";
  let inf = {};
  for (let key in opt) {
    str += key + "=" + `'${opt[key]}'` + ",";
  }
  str = str.slice(0, -1);
  console.log(str);
  try {
    let sql = `UPDATE user SET ${str} WHERE cart_id=${id}`;
    let data = await query(sql);
    console.log(data);
    if (data.affectedRows) {
      inf = {
        code: 2000,
        flag: true,
        message: "edit success",
      };
    } else {
      inf = {
        code: 3000,
        flag: false,
        message: "edit failure",
      };
    }
  } catch (err) {
    inf = {
      code: err.sqlState,
      flag: false,
      message: "select failure",
    };
  }
  res.send(inf);
});

// 查询订单列表(购物车多商铺数据查询)

// 查询某个订单
Router.get("/getcart/:id", async (req, res) => {
  let inf = {};
  let { id } = req.params;
  try {
    let sql = `SELECT * FROM user WHERE cart_id=${id}`;
    let data = await query(sql);
    if (data.length) {
      inf = {
        code: 2000,
        flag: true,
        message: "select success",
        data,
      };
    } else {
      inf = {
        code: 3000,
        flag: false,
        message: "select failure",
      };
    }
  } catch (err) {
    inf = {
      code: 5000,
      flag: false,
      message: "select failure",
    };
  }
  res.send(inf);
});

module.exports = Router; //导出路由对象
