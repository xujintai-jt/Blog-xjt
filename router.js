var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')

var router = express.Router()


router.get('/', function (req, res) {
  //默认寻找views文件夹下
  // console.log(req.session.user);
  res.render('index.html',
    {
      user: req.session.user
    })
})


router.get('/login', function (req, res) {
  res.render('login.html')
})


router.post('/login', function (req, res, next) {
  var body = req.body
  User.findOne({
    email: body.email,
    password: md5(md5(md5(body.password)))
  }, function (err, user) {
    if (err) {
      // return res.status(500).json({
      //   err_code: 500,
      //   message: err.message
      // })
      next(err)
    }

    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or password is invalid'
      })
    }

    //用户存在，登陆成功，通过Session记录登录状态
    req.session.user = user
    console.log(req);
    return res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  })
})

// 注册
router.get('/register', function (req, res) {
  res.render('register.html')
})


// 注册
router.post('/register', function (req, res, next) {
  var body = req.body
  User.findOne({
    $or: [
      {
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  }, function (err, data) {
    if (err) {
      // return res.status(500).json({
      //   success: false,
      //   message: '服务端错误'
      // })
      next(err)
    }

    if (data) {
      return res.status(200).json({
        err_code: 1,
        message: '邮箱或者用户名已存在'
      })
      console.log('邮箱或者用户名已存在');
      // 默认提交方式：表单同步提交之后，无论服务器响应的是什么，浏览器都直接填充(123,或者一个页面)到浏览器页面
      // return res.render('register.html', {
      //   message: '邮箱或者用户名已存在',
      //   form: body
      // })
    }
    //使用md5进行密码加密
    body.password = md5(md5(md5(body.password)))
    new User(body).save(function (err, user, next) {
      if (err) {
        // return res.status(500).json({
        //   err_code: 500,
        //   message: '服务端错误'
        // })
        next(err)
      }

      else {
        //注册成功 使用session记录用户的登陆状态
        req.session.user = user
        // Express提供了一个响应方法: json
        //该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发给浏览器
        return res.status(200).json(
          {
            err_code: 0,
            messgae: 'ok'
          }
        )
      }
    })
  });
})

router.get('/logout', function (req, res) {
  req.session.user = null
  res.redirect('/login')
})

module.exports = router

