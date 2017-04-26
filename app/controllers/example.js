var Example=require('../models/example')
var Comment=require('../models/comment')
var Category=require('../models/category')
var Genre=require('../models/genre')
var User=require('../models/user')
var Note=require('../models/note')
var _=require('underscore')
var fs=require('fs')
var path=require('path')
var formidable = require("formidable")
var url = require('url');

exports.detail=function(req,res){
	var id=req.params.id
	var love=0
	Example.update({_id:id},{$inc:{pv:1}},function(err){
		console.log(err)
	})
	Example
		.findOne({_id:id})
		.populate({
			path: 'category',
			select: '_id name genre',
			model:'Category',
			populate: {
			    path: 'genre',
			    select: '_id scope name',
			    model:'Genre'
			}
		}).sort({createTime: -1}).exec(function(err, example) {
			Comment
			.find({example:id})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.exec(function(err,comments){
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
					console.log('sdsf'+example.content)
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
// //admin poster
// exports.savePoster=function(req,res,next){
// 	var posterData=req.files.inputPoster
// 	var filePath=posterData.path
// 	var originalFilename=posterData.originalFilename
// 	var genreScope=req.body.genreScope
// 	console.log('hhhh'+genreScope)
// 	if(req.body.example._id && originalFilename==''){
// 		console.log('post'+req.body.example.poster)
// 		req.poster=req.body.example.poster
// 		next()
// 	}else{
// 		if(originalFilename){
// 			fs.readFile(filePath,function(err,data){
// 				var timestamp=Date.now()
// 				var type=posterData.type.split('/')[1]
// 				var poster=timestamp+'.'+type
// 				var newPath=path.join(__dirname,'../../','/public/upload/'+genreScope+'/'+poster)
// 				fs.writeFile(newPath,data,function(err){
// 					req.poster='/upload/'+genreScope+'/'+poster
// 					next()
// 				})
// 			})
// 		}
// 	}

// }

//保存新建帖子图片
exports.savePoster=function(req,res){
var form = new formidable.IncomingForm();
form.uploadDir = "./public/upload/example";
form.parse(req, function (err, fields, files) {
	if (err) {console.log(err);}
	var item;
	console.log(fields)
	console.log(files)
	for (item in files) {
		var file = files[item];
		// formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
		var tempfilepath = file.path;
		// 获取文件类型
		var type = file.type;

		// 获取文件名，并根据文件名获取扩展名
		var filename = file.name;
		var extname = filename.lastIndexOf('.') >= 0
						? filename.slice(filename.lastIndexOf('.') - filename.length)
						: '';
		// 文件名没有扩展名时候，则从文件类型中取扩展名
		if (extname === '' && type.indexOf('/') >= 0) {
			extname = '.' + type.split('/')[1];
		}
		// 将文件名重新赋值为一个随机数（避免文件重名）
		filename =Date.now() + extname;

		// 构建将要存储的文件的路径
		var filenewpath = path.join(__dirname,'../../','/public/upload/example/'+filename);

		// 将临时文件保存为正式的文件
		console.log(tempfilepath)
		console.log(filenewpath)
		fs.rename(tempfilepath, filenewpath, function (err) {

			var result = '';		
			if (err) {console.log(err);} else {
				result = '/upload/example/' + filename;
			}
			res.send(result)
			
		}); 
	}
});
}

//admin post example
exports.save=function(req,res){
	var id=req.body.example._id
	var exampleObj=req.body.example
	if(exampleObj.content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)==null){
		exampleObj.poster='/upload/note/fuli.jpg'
	}else{
		exampleObj.poster=exampleObj.content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
	}
	console.log(exampleObj)
	var _example
	if(id){
		Example.findById(id,function(err,example){
			if(err){console.log(err)}
			_example=_.extend(example,exampleObj)
			_example.save(function(err,example){
				if(err){console.log(err)}
				res.redirect('/admin/list')
			})
		})
	}else{
		_example=new Example(exampleObj)
		_example.save(function(err,example){
			Category.findById(example.category,function(err,category){
				if(err){console.log(err)}
				category.examples.push(example._id)
					category.save(function(err,category){
						res.redirect('/admin/list')
					})
				})
		})
	}
	
}

// exports.save=function(req,res){
// 	var id=req.body.example._id
// 	var exampleObj=req.body.example
// 	console.log('ggggggggggg'+exampleObj.title)
// 	console.log('ggggggggggg'+exampleObj.category)
// 	var _example
// 	if(id){
// 		if(exampleObj.poster!=req.poster){
// 			var imgPath=path.join(__dirname,'../../','/public/'+exampleObj.poster)
// 			 fs.unlink(imgPath, function (err) {
// 			    if (err) return console.log(err)
// 			    console.log('文件删除成功')
// 			})
// 		}
// 		exampleObj.poster=req.poster
// 		Example.findById(id,function(err,example){
// 			if(err){
// 				console.log(err)
// 			}
// 			_example=_.extend(example,exampleObj)
// 			_example.save(function(err,example){
// 				if(err){
// 					console.log(err)
// 				}
// 				res.redirect('/admin/list')
// 			})
// 		})
// 	}
// 	else{
// 		exampleObj.poster=req.poster
// 		_example=new Example(exampleObj)
// 		_example.save(function(err,example){
// 				if(err){console.log(err)}
// 					Category.findById(example.category,function(err,category){
// 					category.examples.push(example._id)
// 						category.save(function(err,category){
// 							res.redirect('/admin/list')
// 						})
// 					})
// 			})
// 	}
// }

//list page
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
	Example.count(function(errcount,count){
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
			}).sort({createTime: -1}).limit(limit).skip(index).exec(function(err, examples) {
				if(err){console.log(err)}
				if(examples.length>0){
					console.log(examples[0].category.genre.name)
					res.render('list',{
						title:'后台图片列表页',
						examples:examples,
						totalPages:Math.ceil(count/limit),
						currentPage:page,
						url:'list'
					})
				}else{
					res.render('list',{
						title:'后台图片列表页',
						examples:{}
					})
				}
					
		})
	})
}

// selectCatgory
exports.selectCategory=function(req,res){
	var id=req.query.id
	var limit=12
	var page=req.query.page
	var userId=''
	var love=0
	var favourite=0
	var sessionUser=0
	var scope=req.query.scope
	if(scope=='qianghui'){scope='墙绘'}
	if(scope=='tuku'){scope='图库'}
	if(scope=='gongyi'){scope='工艺'}	
	if(req.session.user){
		sessionUser=1
		userId=req.session.user._id}
	if(scope==0){
		Example
		.find({category:id}).limit(limit).skip(page-1)
		.sort({createTime: -1}).exec(function(err, examples){
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
					"sessionUser":sessionUser,
					"page":page
				}
				selectNames.push(json)
				// selectNames[i]=genres[0].categories[i].name
			}
			console.log('json数组'+selectNames)
			res.json(selectNames)
			
		})
	}else{
		Example
		.find({genre:id}).limit(limit).skip(page-1)
		.sort({createTime: -1}).exec(function(err, examples){
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
					"sessionUser":sessionUser,
					"page":page
				}
				selectNames.push(json)
				// selectNames[i]=genres[0].categories[i].name
			}
			console.log('json数组'+selectNames)
			res.json(selectNames)
			
		})
	}
}
//收藏
exports.favourite=function(req,res){
	var id=req.query.id
	var uId=req.session.user._id
	var cancel=req.query.cancel
	var note=req.query.note
	console.log("note:"+note)
	if(note==0){
		if(cancel==1){
		User.findById(uId,function(err,user){
			// user.examples.push(id)
			user.update({$addToSet:{"examples":id}},function(err){
				if(err){
					console.log(err)
				}else{
					Example.findById(id,function(err,example){
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
	if(note==1){
		console.log(111111111111111110)
		if(cancel==1){
		User.findById(uId,function(err,user){
			// user.notes.push(id)
			user.update({$addToSet:{"notes":id}},function(err){
				if(err){
					console.log(err)
				}else{
					Note.findById(id,function(err,note){
						note.users.push(uId)
						note.save(function(err){
							if(err){console.log(err)}
							else{
								res.json({"success":1,"favourite":note.users.length})}
						})
					})
				}	
			})
		})	
		}else{
			User.findById(uId,function(err,user){
				// user.notes.remove(id)
				user.update({$pull:{"notes":id}},function(err){
					if(err){
						console.log(err)
					}else{
						Note.findById(id,function(err,note){
							note.users.remove(uId)
							note.save(function(err){
								if(err){console.log(err)}
								else{
									res.json({"success":1,"favourite":note.users.length})}
							})
						})
					}	
				})
			})	
		}
	}	
}
//list delete example
exports.del=function(req,res){
	var id=req.query.id
	if(id){
		Example.remove({_id:id},function(err,example){
			if(err){console.log(err)}else{
				Category.update({$pull:{"examples":id}},function(err){
							if(err){console.log(err)}else{res.json({success:1})}
						})
			}
		})
		Comment.remove({example:id},function(err){
			if(err){console.log(err)}
		})
	// 	var id=req.query.id
	// if(id){
	// 	Example.findById(id,function(err,example){
	// 		var imgPath=path.join(__dirname,'../../','/public/'+example.poster)
	// 		 fs.unlink(imgPath, function (err) {
	// 		    if (err) return console.log(err)
	// 		    Example.remove({_id:id},function(err,example){
	// 				if(err){
	// 					console.log(err)
	// 				}else{
	// 					res.json({success:1})
	// 				}
	// 			})
	// 		})
	// 	})
	}
}
