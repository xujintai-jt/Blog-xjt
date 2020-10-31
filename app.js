var express = require('express')
var path = require('path');
var router = require('./router')
var bodyParser = require('body-parser')
var session = require('express-session')

var app = express()

// 配置body-parser
// 只要加入这个配置，则在req请求对象上会多出来一个属性：body
// 也就是说可以直接通过req.body来获取表单post请求数据
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
app.use('/public/', express.static(path.join(__dirname, './public/')))


// 配置模板引擎
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')),//默认就是'./views目录'

  //在配置路由之前配置session
  //该插件会为req请求对象添加一个成员:req.session默认是一个对象
  //这是最简单的配置方式
  //Session是基于Cookie实现的
  app.use(session({
    //配置加密字符串，他会在原有的基础上和字符串拼接起来去加密
    //目的是为了增加安全性，防止客户端恶意伪造
    secret: 'itcast',
    resave: false,
    saveUninitialized: true,//无论是否使用Session（无论是否登录），都默认直接分配一把钥匙，默认是true
    // cookie: { secure: true }
  }))


//把路由挂载到app中
app.use(router)


// 配置全局错误处理中间件
app.use(function (err, req, res, next) {
  return res.status(500).json({
    err_code: 500,
    message: err.message
  })
})


app.listen(5000, function () {
  console.log('5000 is running');
})