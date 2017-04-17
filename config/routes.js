var Index=require('../app/controllers/index')
var User=require('../app/controllers/user')
var Example=require('../app/controllers/example')
var Comment=require('../app/controllers/comment')
var Category=require('../app/controllers/category')
var Genre=require('../app/controllers/genre')
var multipart = require('connect-multiparty')
var multipartMiddleware=multipart()

module.exports=function(app){

// 预处理一下
app.use(function(req,res,next){
	var _user=req.session.user
		app.locals.user=_user
		next()
})

//主页index page
app.get('/',Index.index)
//example
app.get('/example/:id',Example.detail)  //图片详情
app.get('/admin/example',User.adminRequired,Example.new)   //新建录入图片
app.get('/admin/update/:id',User.adminRequired,Example.update)  //更新图片
app.post('/admin/example_new',multipartMiddleware,User.adminRequired,Example.savePoster,Example.save)  //图片保存到数据库
app.get('/admin/list',User.adminRequired,Example.list)  //后台图片列表
app.delete('/admin/list',User.adminRequired,Example.del)  //图片删除

//user
app.get('/user',User.signinRequired,User.info)  //用户个人中心
app.post('/user/signup',User.signup)  //用户注册
app.post('/user/signin',User.signin)  //用户登录
app.get('/user/logout',User.logout)  //注销用户
app.get('/admin/userlist',User.adminRequired,User.list)  //后台用户列表
app.get('/admin/useradmin',User.adminRequired,User.useradmin)  //后台管理员列表
app.get('/admin/signin',User.adminSignin)  //后台用户登录
app.get('/admin',User.adminRequired,User.list)
app.delete('/admin/userlist',User.adminRequired,User.del)  //用户删除
// comment
app.post('/user/comment',User.signinRequired,Comment.save)  //用户注册

//genre
app.get('/admin/genre_new/:id',User.adminRequired,Genre.new)  //新建录入分类
app.post('/admin/genre',User.adminRequired,Genre.save)   //分类保存到数据库
app.get('/admin/genre_list',User.adminRequired,Genre.list)  //图片分类列表
app.delete('/admin/genre_list',User.adminRequired,Genre.del)  //图片删除
app.get('/admin/getAllGenre',User.adminRequired,Genre.getAllGenre)

//category
app.get('/admin/category/:id/:name',User.adminRequired,Category.new)  //新建录入关键字
app.post('/admin/category',User.adminRequired,Category.save)   //关键字保存到数据库
app.get('/admin/category_list/:id',User.adminRequired,Category.list)  //关键字分类列表
app.get('/admin/getAllCategory',User.adminRequired,Category.getAllCategory)


//results
// app.get('/results',Index.search)  //新建录入分类

//墙绘 qianghui page
app.get('/genre/:scope/:id',Genre.genreMore)
//工艺 gongyi page
app.get('/gongyi',function(req,res){
	res.render('tuku',{
		title:'图库'
	})
})
// 图库 tuku page
app.get('/tuku',function(req,res){
	res.render('tuku',{
		title:'图库'
	})
})
//福利 fuli page
app.get('/fuli',function(req,res){
	res.render('fuli',{
		title:'福利'
	})
})
//我们 aboutus page
app.get('/aboutus',function(req,res){
	res.render('aboutus',{
		title:'我们'
	})
})
// // API json接口
// index
app.get('/show',Index.show) 
//头部下拉
app.get('/headGenre',Index.headGenre) 
//根据关键字搜出图片
app.get('/selectCategory',Example.selectCategory) 
//收藏
app.get('/favourite',User.signinRequired,Example.favourite) 
// 用户收藏列表
app.get('/userFavourite',User.signinRequired,User.userFavourite) 

}
