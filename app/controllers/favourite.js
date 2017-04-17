var Example=require('../models/example')
var Comment=require('../models/comment')
var Category=require('../models/category')
var Genre=require('../models/genre')
var _=require('underscore')
var fs=require('fs')
var path=require('path')

exports.detail=function(req,res){
	var id=req.params.id
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
				comments:comments
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
	// Category
	// 	.find({})
	// 	.populate({path:'examples'})
	// 	.populate({path:'genre'})
	// 	.exec(function(err,categories){
	// 		if(err){console.log(err)}
	// 		res.render('list',{
	// 			title:'后台图片列表页',
	// 			categories:categories
	// 		})
	// 	})
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
				console.log(examples)
				res.render('list',{
					title:'后台图片列表页',
					examples:examples
				})
});


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
