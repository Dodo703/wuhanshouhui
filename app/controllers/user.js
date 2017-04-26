var User=require('../models/user')
var Example=require('../models/example')
var Note=require('../models/note')
var _=require('underscore')
exports.info=function(req,res){
	res.render('user',{
		title:'个人中心'
	})
}

//userlist page
exports.list=function(req,res){
	if(req.query.p){
		var page=parseInt(req.query.p,10)
	}else{
		var page=1
	}
	var limit=12
	var index=(page-1)*limit
	var count=0
	var url=''
	User.count({role:0},function(errcount,count){
		User.find({role:0}).sort({createTime: -1}).limit(limit).skip(index)
		.exec(function(err,users){
			if(err){
			console.log(err)
			}
			res.render('userlist',{
				title:'用户列表页',
				users:users,
				totalPages:Math.ceil(count/limit),
				currentPage:page,
				url:'userlist'
			})
		})
	})
	
}
// update
exports.update=function(req,res){
	var name=req.body.name
	var oldpassword=req.body.oldpassword
	var newpassword=req.body.newpassword
	console.log('fdgfg'+req.body.oldpassword)
	User.findOne({name:name},function(err,user){
		if(err){console.log(err)}
		user.comparaPassword(oldpassword,function(err,isMatch){
			if(err){console.log(err)}
			if(isMatch){
				if(req.session.user){delete req.session.user}
				user.password=newpassword
				user.save(function(err,user){
					if(err){console.log(err)} 
					res.json({success:1})
				})
			}else{
				res.json({success:0})}
		})
	})
}
///signup
exports.signup=function(req,res){
	var text=''
	_user=new User()
	_user.name=req.body.name
	_user.password=req.body.password
	if(req.body.role){
		_user.role=req.body.role
	}
	User.findOne({name: _user.name},function(err,user){
		if(err){console.log(err)}
		if(user){
			res.json({
					success:0,
					text:'该用户名已经注册过'
				})
		}else{
			var user=new User(_user)
			user.save(function(err,user){
				if(err){console.log(err)} 
				res.json({
					success:1
				})
			})
		}
	})	
}

// signin
exports.signin=function(req,res){
	var text=''
	var name=req.body.name
	var password=req.body.password
	User.findOne({name:name},function(err,user){
		if(err){console.log(err)}
		if(!user){
			return res.json({
					success:0,
					text:'该用户名不存在'
				})}
		user.comparaPassword(password,function(err,isMatch){
			if(err){console.log(err)}
			if(isMatch){
				req.session.user=user
				if(user.role>0){
					res.json({
						success:2
					})
				}else{
					console.log('00000')
					res.json({
						success:1
					})
				}
			}else{
				res.json({
					success:0,
					text:'输入密码不正确'
				})}
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
//判断后台超级管理员是否已登录
exports.superAdminRequired=function(req,res,next){
	var user=req.session.user
	if(!user || user.role<40){
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

// 用户收藏帖子和图片
exports.userNote=function(req,res){
	var id=req.session.user._id
	var cate=req.query.cate
	if(req.query.page){
		var page=parseInt(req.query.page,10)
	}else{
		var page=1
	}
	console.log('page'+page)
	var limit=12
	var index=(page-1)*limit
	var results=[]
	if(cate=='note'){	
		User
			.findOne({_id:id})
			.populate({path:'notes'})
			.exec(function(err,user){
				var totalPages=Math.ceil(user.notes.length/limit)
				for(var i=page-1,j=0;i<user.notes.length&&j<limit;i++,j++){
					if(user.notes[i].content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)==null){
						user.notes[i].poster='/upload/note/fuli.jpg'
					}else{
						user.notes[i].poster=user.notes[i].content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
					}	
					var json={
						"title":user.notes[i].title,
						"id":user.notes[i]._id,
						"poster":user.notes[i].poster,
						"pv":user.notes[i].pv,
						"summary":user.notes[i].summary,
						"favourite":user.notes[i].users.length
					}
					results.push(json)
				}
					console.log('results'+results)
					res.json({'results':results,'currentPage':page,'totalPages':totalPages})
		})
	}else{
		User
			.findOne({_id:id})
			.populate({path:'examples'})
			.exec(function(err,user){
				var totalPages=Math.ceil(user.examples.length/limit)
				// if(totalPages==0){totalPages=1}
				for(var i=page-1,j=0;i<user.examples.length&&j<limit;i++,j++){
					if(user.examples[i].content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)==null){
						user.examples[i].poster='/upload/note/fuli.jpg'
					}else{
						user.examples[i].poster=user.examples[i].content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
					}	
					var json={
						"title":user.examples[i].title,
						"id":user.examples[i]._id,
						"poster":user.examples[i].poster,
						"pv":user.examples[i].pv,
						"summary":user.examples[i].summary,
						"favourite":user.examples[i].users.length
					}
					results.push(json)
				}
					console.log('results'+results)
					res.json({'results':results,'currentPage':page,'totalPages':totalPages})
		})
	}
}
