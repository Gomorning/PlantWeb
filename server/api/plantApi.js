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

// 查找所有植物分类
router.post('/querySorts', (req, res) => {
  console.log('分类查询')
  var sql = $sql.plant.querySorts
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 查询植物信息[通过分类]
router.post('/queryPlantsBySort', (req, res) => {
  console.log('植物查询')

  var sql = $sql.plant.queryPlants
  var params = req.body
  conn.query(sql, [params.id], function (err, result) {
    if (err) {
      console.log(err)
    } if (result) {
      jsonWrite(res, result)
    }
  })
})

// 查询植物信息[通过id]
router.post('/queryPlantsById', (req, res) => {
  var sql = $sql.plant.queryPlantsById
  var id = req.body.id
  conn.query(sql, id, function (err, result) {
    if (err) {
      console.log(err)
    } if (result) {
      jsonWrite(res, result)
    }
  })
})

// 用户植物管理部分代码

// 添加用户的植物
router.post('/addUserPlant', (req, res) => {
  var sql = $sql.userPlant.addPlant
  var plant = req.body.plant
  console.log(plant)

  conn.query(sql, [plant.name, plant.cover, plant.birthday, plant.userId, plant.desc], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        status: 2
      })
    }
  })
})

// 查询用户的植物
router.get('/queryPlant', function (req, res) {
  var id = req.query.id // 用户id
  var sql = $sql.userPlant.queryPlant

  conn.query(sql, [id], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 删除用户管理的植物
router.post('/deletePlant', function (req, res) {
  console.log('删除植物')

  var id = req.body.id // 植物id
  var sql = $sql.userPlant.deletePlant
  conn.query(sql, [id], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json({ status: 2 })
    }
  })
})

// 添加植物记录
router.post('/addPlantRecord', function (req, res) {
  var record = req.body.record
  console.log(record)
  var sql = $sql.userPlant.addRecord
  conn.query(sql, [
    record.content,
    record.isWatering,
    record.isFertilize,
    record.isControlInsect,
    record.datetime,
    record.plantId
  ], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      var insertId = result.insertId// 获取该记录的自增id
      res.json({
        status: 2,
        insertId: insertId
      })
    }
  })
})

// 查询植物记录（通过用户植物id）
router.get('/queryRecord', function (req, res) {
  var plantId = req.query.plantId
  var sql = $sql.userPlant.queryRecord
  console.log('查询植物记录:' + plantId)

  conn.query(sql, [plantId], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 删除植物记录（通过记录id）
router.post('/deleteRecord', function (req, res) {
  var recordId = req.body.recordId
  var sql = $sql.userPlant.deleteRecord
  console.log('删除记录:' + recordId)
  conn.query(sql, [recordId], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        status: 2
      })
    }
  })
})

// 查询单个植物的植物记录相关图片
router.get('/queryImgsByPlantId', function (req, res) {
  var plantId = req.query.plantId
  var sql = $sql.userPlant.queryImgsByPlantId

  conn.query(sql, [plantId], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

module.exports = router
