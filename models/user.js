var mongoose = require('mongoose')
var Schema = mongoose.Schema


// 连接数据库
mongoose.connect('mongodb://localhost/itcast', { useNewUrlParser: true })

// 用户数据模型
// 设计集合（collections）架构
var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  create_time: {
    type: Date,
    //这里不能写Date.now(),因为会即刻调用
    //这里直接给了一个方法:Date.now
    default: Date.now
  },
  last_modified_time: {
    type: Date,
    default: Date.now
  },
  // 头像
  avatar: {
    type: String,
    default: '/public/img/avatar-default.png'
  },
  //简介
  bio: {
    type: String,
    default: ''
  },
  gender: {
    type: Number,
    enum: [-1, 0, 1],
    default: -1
  },
  birthday: {
    type: Date
  },
  status: {
    type: Number,
    //0 没有权限限制  1 不可以评论  2 不可以登录
    //是否可以评论
    //是否可以登录使用
    enum: [0, 1, 2],
    default: 0
  }
})

module.exports = mongoose.model('User', userSchema)


