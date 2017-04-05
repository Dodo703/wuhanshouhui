var express=require('express')
var path=require('path')
var mongoose=require('mongoose')
var _=require('underscore')
// var Movie=require('./models/movie')
var User=require('./models/user')
var port=process.env.PORT || 3000
var serveStatic=require('serve-static')
var bodyParser = require('body-parser')
var session = require('cookie-session')
var morgan=require('morgan')
var app=express()
mongoose.Promise = global.Promise;
//数据库的连接
mongoose.connect('mongodb://127.0.0.1:27017/shouhui')

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({ extended: true}))  
app.use(bodyParser.json())
app.use(serveStatic('public'))
app.locals.moment=require('moment')
app.use(session({
	secret:'imooc'
}))
// 开发环境与生产环境
if('development'===app.get('env')){
	app.set('showStackError',true)
	app.use(morgan(':method :url :status'))
	// 查看源代码格式化
	app.locals.pretty=true
	mongoose.set('debug',true)
}
// 入口文件的引入
require("./config/routes")(app)


app.listen(port)


console.log('shouhui start on port'+port)

