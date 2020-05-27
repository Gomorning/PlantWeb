// SQL映射语句，供给Api调用
var sqlMap = {
  // 用户
  user: {
    // 添加用户
    add: 'INSERT INTO user (username,password,isAdministor) VALUES (?,?,?)',
    // 根据用户名获取用户
    get: 'select * from user where username = ?',
    // 根据用户ID获取用户
    getById: 'SELECT * FROM user WHERE id = ?',
    // 修改基础资料
    updateInfo: 'UPDATE user SET gender=?,birthday=?,personalStatus=? WHERE id=?',
    // 修改密码
    updatePsd: 'UPDATE user SET password=? WHERE id = ?',
    // 修改头像
    updateAvatar: 'UPDATE user SET avatar=? WHERE id = ?',
    // 查询所有用户动态
    queryNews: 'select * from user_news ORDER BY postTime DESC',
    // 根据用户ID查询用户动态
    queryNewsById: 'select * from user_news WHERE user_id=?',
    // 添加用户动态
    postNews: 'INSERT INTO user_news(content,user_id,postTime) VALUES (?,?,?)',
    // 删除用户动态 (删除相关评论,回复,点赞记录)
    deleteNewsById: 'DELETE user_news,comment,reply,user_like' +
      ' FROM user_news' +
      ' LEFT JOIN comment ON user_news.id=comment.topic_id' +
      ' LEFT JOIN reply ON comment.id = reply.comment_id' +
      ' LEFT JOIN user_like ON user_news.id = user_like.topic_id' +
      ' WHERE user_news.id=?',

    // 更新用户动态的点赞
    likeNews: 'UPDATE user_news SET _like = ? WHERE id =?',
    // 添加点赞信息
    addlike: 'INSERT INTO user_like(from_uid,topic_id,time) VALUES(?,?,?)',
    // 删除点赞信息
    delLike: 'DELETE FROM user_like WHERE from_uid=? AND topic_id=?',
    // 查找点赞信息
    queryLikeByUId: 'SELECT * FROM user_like WHERE from_uid=? AND topic_id=?',
    // 根据主题ID获取评论
    queryCmt: 'SELECT comment.id,topic_id,content,from_uid,username,time FROM web_db.comment,web_db.user WHERE topic_id =? AND comment.from_uid=user.id ORDER BY id ASC',
    // 添加评论
    addCmt: 'INSERT INTO web_db.comment(topic_id,content,from_uid,time) Value(?,?,?,?);',
    // 根据评论查询所有回复
    queryReply: 'SELECT a.*,b.username as from_username,aa.username as to_username FROM web_db.reply a ' +
      'INNER JOIN web_db.user b ON b.id=a.from_uid' +
      ' LEFT JOIN (SELECT a.to_uid,b.username,a.id' +
      ' FROM web_db.reply a INNER JOIN web_db.user b ON b.id=a.to_uid) aa ON aa.id=a.id WHERE comment_id=?',
    // 添加评论下的回复
    addReply: 'INSERT INTO reply(comment_id,reply_id,content,from_uid,to_uid,time) VALUES (?,?,?,?,?,?)'
  },

  plant: {
    // 查询植物分类
    querySorts: 'select * from sort',
    // 根据分类查询植物
    queryPlants: 'select * from plant where plant_sort = ?',
    queryPlantsById: 'select * from plant where plant_id = ?'
  },
  search: {
    // 查找匹配的植物
    searchPlant: 'SELECT * FROM plant WHERE plant_name Like CONCAT("%",?,"%")',
    // 查找匹配的用户动态
    searchNews: 'SELECT * FROM user_news WHERE content Like CONCAT("%",?,"%")'
  },
  userPlant: {
    // 用户植物
    addPlant: 'INSERT INTO user_plant(name,cover,birthday,user_id,description) VALUES (?,?,?,?,?)',
    queryPlant: 'SELECT * FROM user_plant WHERE user_id = ?',
    // 删除植物（植物，相关成长记录，相关图片）
    deletePlant: 'DELETE user_plant,user_plant_record,imgs' +
      ' FROM user_plant' +
      ' LEFT JOIN user_plant_record ON user_plant.id=user_plant_record.user_plant_id' +
      ' LEFT JOIN imgs ON user_plant_record.id = imgs.topic_id' +
      ' WHERE user_plant.id=?',
    // 用户植物记录
    addRecord: 'INSERT INTO user_plant_record(content,isWatering,isFertilize,isControlInsect,datetime,user_plant_id) VALUES (?,?,?,?,?,?)',
    queryRecord: 'SELECT * FROM user_plant_record WHERE user_plant_id= ? ORDER BY datetime DESC',
    deleteRecord: 'DELETE FROM user_plant_record WHERE id = ?',
    // 植物记录相关图片
    addRecordImg: 'INSERT INTO user_plant_img(url,record_id) VALUES (?,?)',
    deleteRecordImg: 'DELETE FROM user_plant_img WHERE record_id = ?',
    // 查询用户单个植物下包含的所有图片
    queryImgsByPlantId: 'SELECT imgs.*' +
      ' FROM user_plant,user_plant_record,imgs' +
      ' WHERE user_plant.id=user_plant_record.user_plant_id' +
      ' And user_plant_record.id = imgs.topic_id' +
      ' And user_plant.id=?'
  },
  images: {
    // 添加用户动态下的图片
    insertImgs: 'INSERT INTO imgs(url,type,topic_id) VALUES ?',
    // 根据主题id查找图片
    queryImgs: 'SELECT * FROM imgs WHERE topic_id=? AND type=?',
    // 根据（主题id，主题类型）删除图片
    deleteImgs: 'DELETE FROM imgs WHERE topic_id=? AND type=?'
  }
}

module.exports = sqlMap
