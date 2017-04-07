var Index=require('../app/controllers/index')
var User=require('../app/controllers/user')
var Movie=require('../app/controllers/movie')
var Comment=require('../app/controllers/comment')

module.exports=function(app){

// 预处理一下
app.use(function(req,res,next){
	var _user=req.session.user
		app.locals.user=_user
		next()
})

//主页index page
app.get('/',Index.index)
//movie
app.get('/movie/:id',Movie.detail)  //图片详情
app.get('/admin/movie',User.adminRequired,Movie.new)   //新建录入图片
app.get('/admin/update/:id',User.adminRequired,Movie.update)  //更新图片
app.post('/admin/movie/new',User.adminRequired,Movie.save)  //图片保存到数据库
app.get('/admin/list',User.adminRequired,Movie.list)  //后台图片列表
app.delete('/admin/list',User.adminRequired,Movie.del)  //图片删除

//user
app.get('/user',User.signinRequired,User.info)  //用户个人中心
app.post('/user/signup',User.signup)  //用户注册
app.post('/user/signin',User.signin)  //用户登录
app.get('/user/logout',User.logout)  //注销用户
app.get('/admin/userlist',User.adminRequired,User.list)  //后台用户列表
app.get('/admin/signin',User.adminSignin)  //后台用户登录

// comment
app.post('/user/comment',User.signinRequired,Comment.save)  //用户注册


// //墙绘 qianghui page
// app.get('/qianghui',function(req,res){
// })
// //工艺 gongyi page
// app.get('/gongyi',function(req,res){
// })
//图库 tuku page
app.get('/tuku',function(req,res){
	res.render('tuku',{
		title:'imooc 首页'
	})
})
//福利 fuli page
app.get('/fuli',function(req,res){
	res.render('fuli',{
		title:'imooc 首页'
	})
})
//我们 aboutus page
app.get('/aboutus',function(req,res){
	res.render('aboutus',{
		title:'imooc 首页'
	})
})
}
