var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')

// 连接数据库
var conn = mysql.createConnection(models.mysql)

conn.connect()
var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    })
  } else {
    res.json(ret)
  }
}
// 搜索植物
router.get('/searchPlant', function (req, res) {
  var keywords = req.query.keywords
  var sql = $sql.search.searchPlant
  conn.query(sql, keywords, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      console.log(result)
      jsonWrite(res, result)
    }
  })
})

// 搜索用户动态
router.get('/searchNews', function (req, res) {
  var keywords = req.query.keywords
  var sql = $sql.search.searchNews
  conn.query(sql, keywords, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

module.exports = router
