const express = require('express');
const Router = express.Router();

const userRouter = require('./module/user');
const goodRouter = require('./module/goods');
const orderRouter = require('./module/order');

Router.use('/user',userRouter);
Router.use('/goods',goodRouter);
Router.use('/order',orderRouter)

module.exports = Router;