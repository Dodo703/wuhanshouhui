var Example=require('../models/example')
var Comment=require('../models/comment')
var Category=require('../models/category')
var Genre=require('../models/genre')
var User=require('../models/user')
var _=require('underscore')
var fs=require('fs')
var path=require('path')

exports.detail=function(req,res){
	var id=req.params.id
	var love=0
	Example.update({_id:id},{$inc:{pv:1}},function(err){
		console.log(err)
	})
	Example.findById(id,function(err,example){
		Comment
		.find({example:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.exec(function(err,comments){
			console.log(comments)
			console.log('example:'+example)
			res.render('detail',{
				title:'武汉手绘/'+example.title,
				example:example,
				comments:comments,
				love:love
				})
		})
	})	
}

exports.new=function(req,res){
	Genre.find({},function(err,genres){
		Category.find({},function(err,categories){
			res.render('admin',{
				title:'后台图片录入页',
				categories:categories,
				genres:genres,
				example:{}
			})
		})
	})
}
//admin update example
exports.update=function(req,res){
	var id=req.params.id
	var catId='';
	if(id){
		Example.findById(id,function(err,example){
			Category.findById(example.category,function(err,category){
				Genre.findById(category.genre,function(err,genre){
					console.log('sdsf'+example.category)
					res.render('admin',{
						title:"后台图片更新页",
						example:example,
						category:category,
						genre:genre,
						catId:example.category
					})
				})	
			})
		})
	}
}
//admin poster
exports.savePoster=function(req,res,next){
	var posterData=req.files.inputPoster
	var filePath=posterData.path
	var originalFilename=posterData.originalFilename
	var genreScope=req.body.genreScope
	console.log('hhhh'+genreScope)
	if(req.body.example._id && originalFilename==''){
		console.log('post'+req.body.example.poster)
		req.poster=req.body.example.poster
		next()
	}else{
		if(originalFilename){
			fs.readFile(filePath,function(err,data){
				var timestamp=Date.now()
				var type=posterData.type.split('/')[1]
				var poster=timestamp+'.'+type
				var newPath=path.join(__dirname,'../../','/public/upload/'+genreScope+'/'+poster)
				fs.writeFile(newPath,data,function(err){
					req.poster='/upload/'+genreScope+'/'+poster
					next()
				})
			})
		}
	}

}

//admin post example
exports.save=function(req,res){
	var id=req.body.example._id
	var exampleObj=req.body.example
	var _example
	if(id){
		if(exampleObj.poster!=req.poster){
			var imgPath=path.join(__dirname,'../../','/public/'+exampleObj.poster)
			 fs.unlink(imgPath, function (err) {
			    if (err) return console.log(err)
			    console.log('文件删除成功')
			})
		}
		exampleObj.poster=req.poster
		Example.findById(id,function(err,example){
			if(err){
				console.log(err)
			}
			_example=_.extend(example,exampleObj)
			_example.save(function(err,example){
				if(err){
					console.log(err)
				}
				res.redirect('/admin/list')
			})
		})
	}
	else{
		exampleObj.poster=req.poster
		_example=new Example(exampleObj)
		_example.save(function(err,example){
				if(err){console.log(err)}
					Category.findById(example.category,function(err,category){
					category.examples.push(example._id)
						category.save(function(err,category){
							res.redirect('/admin/list')
						})
					})
			})
	}
}

//list page
exports.list=function(req,res){
	Example
		.find()
		.populate({
			path: 'category',
			select: '_id name genre',
			model:'Category',
			populate: {
			    path: 'genre',
			    select: '_id scope name',
			    model:'Genre'
			}
		}).sort({createTime: -1}).exec(function(err, examples) {
			if(err){console.log(err)}
			if(examples.length>0){
				console.log(examples[0].category.genre.name)
				res.render('list',{
					title:'后台图片列表页',
					examples:examples
				})
			}else{
				res.render('list',{
					title:'后台图片列表页',
					examples:{}
				})
			}
				
	})
}

// selectCatgory
exports.selectCategory=function(req,res){
	var id=req.query.id
	var userId=''
	var love=0
	var favourite=0
	var sessionUser=0
	if(req.session.user){
		sessionUser=1
		userId=req.session.user._id}
	Example.find({category:id},function(err,examples){
		if(err){console.log(err)}
		var selectNames=[]
		for(var i=0;i<examples.length;i++){
			if(examples[i].users){
				favourite=examples[i].users.length
				for(var j=0;j<examples[i].users.length;j++){
						if(userId==examples[i].users[j]){love=1;break;}
					}
				if(j>=examples[i].users.length){love=0}
			}
			var json={
				"title":examples[i].title,
				"id":examples[i]._id,
				"poster":examples[i].poster,
				"pv":examples[i].pv,
				"summary":examples[i].summary,
				"favourite":favourite,
				"love":love,
				"sessionUser":sessionUser
			}
			selectNames.push(json)
			// selectNames[i]=genres[0].categories[i].name
		}
		console.log('json数组'+selectNames)
		res.json(selectNames)
		
	})
	
}
//收藏
exports.favourite=function(req,res){
	var id=req.query.id
	var uId=req.session.user._id
	console.log('userddd'+uId)
	console.log('userddd'+req.session.user.password)
	var cancel=req.query.cancel
	if(cancel==1){
		User.findById(uId,function(err,user){
			// user.examples.push(id)
			user.update({$addToSet:{"examples":id}},function(err){
				if(err){
					console.log(err)
				}else{
					Example.findById(id,function(err,example){
						console.log('example.users'+example.users)
						example.users.push(uId)
						example.save(function(err){
							if(err){console.log(err)}
							else{
								res.json({"success":1,"favourite":example.users.length})}
						})
					})
				}	
			})
		})	
	}else{
		User.findById(uId,function(err,user){
			// user.examples.remove(id)
			user.update({$pull:{"examples":id}},function(err){
				if(err){
					console.log(err)
				}else{
					Example.findById(id,function(err,example){
						console.log('example.users'+example.users)
						example.users.remove(uId)
						example.save(function(err){
							if(err){console.log(err)}
							else{
								res.json({"success":1,"favourite":example.users.length})}
						})
					})
				}	
			})
		})	
	}
}
//list delete example
exports.del=function(req,res){
	var id=req.query.id
	if(id){
		Example.findById(id,function(err,example){
			var imgPath=path.join(__dirname,'../../','/public/'+example.poster)
			 fs.unlink(imgPath, function (err) {
			    if (err) return console.log(err)
			    Example.remove({_id:id},function(err,example){
					if(err){
						console.log(err)
					}else{
						res.json({success:1})
					}
				})
			})
		})
		// Example.remove({_id:id},function(err,example){
		// 	if(err){
		// 		console.log(err)
		// 	}else{
		// 		res.json({success:1})
		// 	}
		// })

	}
}
