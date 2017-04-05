var _=require('underscore')
// var Movie=require('./models/movie')
var User=require('../models/user')
module.exports=function(app){

// 预处理一下
app.use(function(req,res,next){
	var _user=req.session.user
	if(_user){
		app.locals.user=_user
	}
	return next()
})

//主页index page
app.get('/',function(req,res){
	res.render('index',{
		title:'imooc 首页'
	})
})
///signup
app.post('/user/signup',function(req,res){
	var _user=req.body.user
	User.findOne({name: _user.name},function(err,user){
		if(err){console.log(err)}
		console.log(user)
		if(user){
			console.log('已经注册')
			return res.redirect('/admin/userlist')
		}else{
			console.log('注册')
			var user=new User(_user)
			user.save(function(err,user){
				if(err){console.log(err)} 
				res.redirect('/admin/userlist')
			})
		}
	})
	
})

//userlist page
app.get('/admin/userlist',function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		// console.log(users)
		// req.session.user=users
		// res.redirect('/')
		res.render('userlist',{
			title:'imooc 用户列表页',
			users:users
		})
	})
	
})
// signin
app.post('/user/signin',function(req,res){
	var _user=req.body.user
	var name=_user.name
	var password=_user.password
	User.findOne({name:name},function(err,user){
		if(err){console.log(err)}
		if(!user){return res.redirect('/')}
		user.comparaPassword(password,function(err,isMatch){
			if(err){console.log(err)}
			if(isMatch){
				req.session.user=user
				return res.redirect('/')
			}else{console.log('password is not matched')}
		})
	})
})
// logout
app.get('/user/logout',function(req,res){
	delete req.session.user
	delete app.locals.user
	res.redirect('/')

})


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
//个人中心 user page
app.get('/user',function(req,res){
	res.render('user',{
		title:'imooc 首页'
	})
})


}
