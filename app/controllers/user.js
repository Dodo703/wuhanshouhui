var User=require('../models/user')
var Example=require('../models/example')
var _=require('underscore')
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
	User.find({role:0},function(err,users){
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
		if(!user){return res.redirect('back')}
		user.comparaPassword(password,function(err,isMatch){
			if(err){console.log(err)}
			if(isMatch){
				req.session.user=user
				if(user.role>0){
					res.redirect('../admin/userlist');
				}else{
					res.redirect('back');
				}
			}else{console.log('password is not matched')}
		})
	})
}
// logout
exports.logout=function(req,res){
	if(req.session.user)
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
		return res.redirect('back')
	}
	next()
}

//判断后台权限用户是否已登录
exports.adminRequired=function(req,res,next){
	var user=req.session.user
	if(!user || user.role<10){
		console.log('没有权限')
		return res.redirect('../admin/signin')
	}
	next()
}


//userlist page
exports.useradmin=function(req,res){
	User.find({role:10},['_id','name','meta'],function(err,users){
		res.render('useradmin',{
			title:'管理员列表页',
			users:users
		})
	})
}
//删除用户
exports.del=function(req,res){
	var id=req.query.id
	User.remove({_id:id},function(err,user){
				if(err){
					console.log(err)
				}else{
					res.json({success:1})
				}
			})
}


// 用户收藏列表
exports.userFavourite=function(req,res){
	var id=req.session.user._id
	var limit=req.query.limit
	var results=[]
	User
		.find({_id:id})
		.populate({path:'examples'})
		.exec(function(err,user){
			for(var i=0,j=0;i<user[0].examples.length&&j<limit;i++,j++){
				var json={
					"title":user[0].examples[i].title,
					"id":user[0].examples[i]._id,
					"poster":user[0].examples[i].poster,
					"pv":user[0].examples[i].pv,
					"summary":user[0].examples[i].summary,
					"favourite":user[0].examples[i].users.length
				}
				results.push(json)
			}
				console.log('results'+results)
				res.json(results)
	})
}