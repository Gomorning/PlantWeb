const userApi = require('./api/userApi')
const plantApi = require('./api/plantApi')
const searchApi = require('./api/searchApi')
const bodyParser = require('body-parser')
const express = require('express')

const app = express()

// body-parser HTTP请求体解析中间件（该模块可解析JSON，文本，url-encode等）
app.use(bodyParser.urlencoded({ extended: true })) // url-encode解析
app.use(bodyParser.json()) // json解析

// 后端api路由  每次修改完记得重启
// app.use('/api/user', userApi)
app.use('/api/user', userApi)
app.use('/api/plant', plantApi)
app.use('/api/search', searchApi)

// 监听端口
app.listen(3000)
console.log('success listen at port:3000.....')
