var User=require('../models/user')

exports.info=function(req,res){
	res.render('user',{
		title:'个人中心'
	})
}
///signup
exports.signup=function(req,res){
	var _user=req.body.user
	User.findOne({name: _user.name},function(err,user){
		if(err){console.log(err)}
		console.log(user)
		if(user){
			console.log('已经注册')
			res.redirect('back');
		}else{
			console.log('注册')
			var user=new User(_user)
			user.save(function(err,user){
				if(err){console.log(err)} 
				res.redirect('back');
			})
		}
	})	
}

//userlist page
exports.list=function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		// console.log(users)
		// req.session.user=users
		// res.redirect('/')
		res.render('userlist',{
			title:'用户列表页',
			users:users
		})
	})
	
}
// signin
exports.signin=function(req,res){
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
				res.redirect('back');
			}else{console.log('password is not matched')}
		})
	})
}
// logout
exports.logout=function(req,res){
	delete req.session.user
	//delete app.locals.user
	res.redirect('/')

}

// 后台用户登录
exports.adminSignin=function(req,res){
	res.render('signin',{
		title:'后台用户登录'
	})
}

//判断普通用户是否已登录
exports.signinRequired=function(req,res,next){
	var user=req.session.user
	if(!user){
		console.log('没有登录')
		return res.redirect('/')
	}
	next()
}

//判断后台权限用户是否已登录
exports.adminRequired=function(req,res,next){
	var user=req.session.user
	if(!user || user.role!=10){
		console.log('没有权限')
		return res.redirect('./signin')
	}
	next()
}