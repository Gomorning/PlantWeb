// 后端接口
var models = require('../db')
var express = require('express')
var mysql = require('mysql')
var $sql = require('../sqlMap')
var jwt = require('jsonwebtoken')
var router = express.Router()

var fs = require('fs')
var path = require('path')
var multer = require('multer')
var filename = ''

// 3、对上传的文件进行配置
var storage = multer.diskStorage({
  // 存储的位置
  destination: path.join(__dirname, '/../../public/image/uploads'),
  // 文件名字
  filename (req, file, cb) {
    filename = Date.now() + file.originalname // 做些处理，防止文件名重复
    cb(null, filename)
  }
})
var upload = multer({ storage: storage })

// 上传单个图片到unloads
router.post('/upload', upload.single('file'), (req, res) => {
  res.send({ url: '/image/uploads/' + filename })
})

// 删除unloads文件夹的单个图片
router.post('/delete', function (req, res) {
  // console.log('删除图片')
  var url = req.body.url
  var delUrl = path.join(__dirname, '/../../public', url)
  fs.unlink(delUrl, function (err) {
    if (err) {
      console.log(err)
    } else {
      res.json({ status: 2 })
    }
  })
})

// 删除unloads文件夹的多个图片
router.post('/deleteLocalImgs', function (req, res) {
  // console.log('删除多张图片')
  var urls = req.body.urls
  for (let i = 0; i < urls.length; i++) {
    var delUrl = path.join(__dirname, '/../../public', urls[i])
    fs.unlink(delUrl, function (err) {
      if (err) {
        console.log(err)
      }
    })
  }
})

// 插入图片列表到数据库
router.post('/insertImgs', function (req, res) {
  console.log('插入图片')

  var sql = $sql.images.insertImgs
  var imgList = req.body.imgList
  var insertId = req.body.insertId
  var type = req.body.type // 主题类型
  var values = []
  // 把主题的id和图片地址拼成数组
  for (let i = 0; i < imgList.length; i++) {
    var temp = []
    temp.push(imgList[i])
    temp.push(type)
    temp.push(insertId)
    values.push(temp)
  }
  console.log(values)
  conn.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json({ status: 2 })
    }
  })
})

//

// 用户修改头像
router.post('/updateAvatar', function (req, res) {
  var sql = $sql.user.updateAvatar
  var id = req.body.id
  var url = req.body.url
  conn.query(sql, [url, id], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        status: 2
      })
    }
  })
})

// 测试api
router.get('/test', function (req, res) {
  return res.json({
    code: 0,
    data: 'hello'
  })
})

// 连接数据库
var conn = mysql.createConnection(models.mysql)
conn.connect()

// 如果ret[结果集]里有东西就传到前台去
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

// 用户登录
router.post('/getUser', (req, res) => {
  var sql = $sql.user.get
  var params = req.body
  conn.query(sql, params.username, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result.length) {
      const data = JSON.parse(JSON.stringify(result))
      result = data[0]
      // 用户名密码正确就生成token
      if (params.username === result.username && params.password === result.password) {
        res.json({
          id: result.id,
          username: result.username,
          isAdministor: result.isAdministor,
          code: 200,
          token: jwt.sign({ username: result.username }, 'luluear', {
            // 过期时间
            expiresIn: '24h'
            // expiresIn: '60s'  //用于测试
          })
        })
      } else {
        res.json({
          status: '-1',
          msg: '密码错误'
        })
      }
    } else {
      res.json({
        status: '0',
        msg: '用户名不存在'
      })
    }
  })
})

// 普通用户注册
router.post('/addUser', (req, res) => {
  const addSql = $sql.user.add
  const getSql = $sql.user.get
  const username = req.body.username
  const password = req.body.password
  const isAdministor = 0 // 非管理员

  conn.query(getSql, username, function (err, result) {
    if (err) {
      console.log(err)
    }
    // 不存在此用户名表示可以注册
    if (result.length === 0) {
      conn.query(addSql, [username, password, isAdministor], function (err, result) {
        if (err) {
          console.log(err)
        } else {
          res.json({
            status: 200, // 注册成功
            msg: '注册成功！'
          })
        }
      })
    } else {
      console.log(result)
      res.json({
        status: 300, // 账号存在
        msg: '用户已存在！'
      })
    }
  })
})

// 修改密码
router.post('/updatePsd', (req, res) => {
  var sql = $sql.user.updatePsd
  var id = req.body.id
  var password = req.body.password
  conn.query(sql, [password, id], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        status: 2
      })
    }
  })
})

// 查询所有用户动态
router.post('/queryNews', (req, res) => {
  var sql = $sql.user.queryNews
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 根据用户id查询用户动态
router.post('/queryNewsById', (req, res) => {
  var sql = $sql.user.queryNewsById
  var userId = req.body.userId
  conn.query(sql, userId, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 发布动态
router.post('/postNews', (req, res) => {
  var sql = $sql.user.postNews
  var body = req.body
  conn.query(sql, [body.news, body.userId, body.currTime], function (err, result) {
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

// 删除动态
router.post('/deleteNewsById', (req, res) => {
  var sql = $sql.user.deleteNewsById
  var newsId = req.body.newsId
  console.log(newsId)
  // 删除动态（内容，点赞，评论及回复）
  conn.query(sql, newsId, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json({ status: 2 })
    }
  })
})

// ----------------------------------

// 根据(主题id，主题类型)获得相关图片
router.post('/queryImgs', (req, res) => {
  var sql = $sql.images.queryImgs
  var id = req.body.id
  var type = req.body.type // 类型用户动态图片
  console.log(type)

  conn.query(sql, [id, type], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 根据(主题id，主题类型)删除相关图片
router.post('/deleteImgs', (req, res) => {
  var sql = $sql.images.deleteImgs
  var id = req.body.newsId
  var type = req.body.type // 类型用户动态图片
  console.log('图片' + type)

  conn.query(sql, [id, type], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        status: 2
      })
    }
  })
})

// ----------------------------------

// 修改用户个人资料
router.post('/updateInfo', (req, res) => {
  var sql = $sql.user.updateInfo
  var user = req.body.user
  conn.query(sql, [user.gender, user.birthday, user.personalStatus, user.id], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        status: 2
      })
    }
  })
})

// 获取用户个人资料
router.post('/getById', (req, res) => {
  var sql = $sql.user.getById
  var id = req.body.id
  conn.query(sql, id, function (err, result) {
    if (err) { console.log(err) }
    if (result) {
      // jsonWrite(res, result)
      // 把用户封装起来
      var data = JSON.parse(JSON.stringify(result))
      result = data[0]
      console.log(result)

      res.json({
        user: {
          id: result.id,
          username: result.username,
          gender: result.gender,
          birthday: result.birthday,
          personalStatus: result.personalStatus,
          avatar: result.avatar
        }
      })
    }
  })
})

// 更新用户动态点赞数
router.post('/likeNews', (req, res) => {
  var sql = $sql.user.likeNews
  var like = req.body.like
  var id = req.body.id
  conn.query(sql, [like, id], function (err, result) {
    if (err) { console.log(err) }
    if (result) { jsonWrite(res, result) }
  })
})

// 添加点赞记录
router.post('/addLike', (req, res) => {
  var sql = $sql.user.addlike
  var likeInfo = req.body.likeInfo
  conn.query(sql, [likeInfo.fromUId, likeInfo.topicId, likeInfo.time], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        status: 2
      })
    }
  })
})

// 删除点赞记录
router.post('/delLike', (req, res) => {
  var sql = $sql.user.delLike
  var fromUId = req.body.fromUId
  var topicId = req.body.topicId
  conn.query(sql, [fromUId, topicId], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        status: 2
      })
    }
  })
})

// 查找点赞记录(用户id，主题id)
router.post('/queryLikeByUId', (req, res) => {
  var sql = $sql.user.queryLikeByUId
  var fromUId = req.body.fromUId
  var topicId = req.body.topicId
  conn.query(sql, [fromUId, topicId], function (err, result) {
    if (err) {
      console.log()
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 加载用户评论
router.post('/queryCmt', (req, res) => {
  var sql = $sql.user.queryCmt
  var topicId = req.body.topicId
  conn.query(sql, topicId, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 添加评论
router.post('/addCmt', (req, res) => {
  // 校验token
  var token = req.headers.authorization
  // console.log('token' + token)
  jwt.verify(token, 'luluear', (err, decode) => {
    if (err) {
      res.json({
        status: 300,
        msg: '登录已过期，请重新登录！'
      })
    } else {
      // console.log('没过期')
      var sql = $sql.user.addCmt
      var cmt = req.body.cmt
      conn.query(sql, [cmt.topicId, cmt.content, cmt.from_uid, cmt.currTime], function (err, result) {
        if (err) {
          console.log(err)
        } else {
          res.json({ status: 2, msg: '评论成功！' })
        }
      })
    }
  })
})

// 评论下添加回复
router.post('/addReply', (req, res) => {
  var sql = $sql.user.addReply
  var replyObj = req.body.replyObj

  var token = req.headers.authorization
  // console.log('token' + token)
  jwt.verify(token, 'luluear', (err, decode) => {
    if (err) {
      res.json({
        status: 300,
        msg: '登录已过期，请重新登录！'
      })
    } else {
      conn.query(sql, [replyObj.commentId, replyObj.replyUId, replyObj.content, replyObj.fromUId, replyObj.toUId, replyObj.time],
        function (err, result) {
          if (err) {
            console.log(err)
          } else {
            res.json({ status: 2, msg: '回复成功！' })
          }
        })
    }
  })
})

// 根据评论id查看所有回复
router.post('/queryReplyById', (req, res) => {
  var sql = $sql.user.queryReply
  var cmtId = req.body.cmtId
  conn.query(sql, cmtId, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 返回上传图片存放路径
router.post('/Load', (req, res) => {
  res.json({
    route: '/uploads'
  })
})

module.exports = router
