var Category=require('../models/category')
var Genre=require('../models/genre')
var _=require('underscore')


exports.new=function(req,res){
	var id=req.params.id
	Genre.findById(id,function(err,genre){
		if(req.params.name!=1){
			var id=req.params.name
			Category.findById(id,function(err,category){
				res.render('category_admin',{
					title:'后台图片分类录入页',
					category:{},
					genre:genre,
					category:category
				})	
			})
		}else{
			res.render('category_admin',{
				title:'后台图片分类录入页',
				category:{},
				genre:genre
			})
		}
	})
}

//admin post example
exports.save=function(req,res){
	var categoryObj=req.body.category
	if(categoryObj._id){
		Category.update({_id:categoryObj._id},{name:categoryObj.name},function(err){
			if(err){console.log(err)}
			Category.findById(categoryObj._id,function(err,category){
				var catid=category.genre
				res.redirect('/admin/category_list/'+catid)
			})
		})
	}else{
		var _category=new Category(categoryObj)
		// console.log(_category._id)
		// var category=new Category(_category)
		_category.genre=req.body.genre._id
		_category.save(function(err,category){
			Genre.findById(_category.genre,function(err,genre){
				genre.categories.push(category._id)
				genre.save(function(err,genre){
					res.redirect('/admin/genre_list')
				})
			})
		})
	}
}

//list page
exports.list=function(req,res){
	var id=req.params.id
	Category
	.find({genre:id})
	.populate({path:'genre'})
	.exec(function(err,categories){
		if(err){console.log(err)}
		var genre=categories[0].genre.name
		var genreId=categories[0].genre._id
		res.render('category_list',{
			title:genre+'图片关键字',
			categories:categories,
			genre:genre,
			genreId:genreId
		})
	})
	
}
// // admin update example
// exports.update=function(req,res){
// 	var id=req.params.id
// 	if(id){
// 		Category.findById(id,function(err,category){
// 			Category.find({},function(err,categories){
// 				res.render('admin',{
// 					title:"后台图片更新页",
// 					example:example,
// 					categories:categories
// 				})
// 			})
// 		})
// 	}
// }

//list delete example

exports.del=function(req,res){
	var id=req.query.id
	if(id){
		Example.find({category:id},function(err,examples){
			var imgPath=path.join(__dirname,'../../','/public/'+example.poster)
			 fs.unlink(imgPath, function (err) {
			    if (err) return console.log(err)
			    Example.remove({_id:id},function(err,example){
					if(err){console.log(err)}
					else{res.json({success:1})}
				})
			})
		})
	}
}

// ajax
exports.getAllCategory=function(req,res){
	scope=req.query.scope
	genre=req.query.genre
	console.log(genre+'上传'+scope)
	Genre
		.find({scope:scope,name:genre})
		.populate({path:'categories'})
		.exec(function(err,genres){
			if(err){console.log(err)}
			console.log(genres)
			var selectNames=[]
			if(genres.length>0){
				for(var i=0;i<genres[0].categories.length;i++){
				var json={
				"name":genres[0].categories[i].name,
				"id":genres[0].categories[i]._id
				}
				selectNames.push(json)
				// selectNames[i]=genres[0].categories[i].name
				}
			}
			console.log('json数组'+selectNames)
			res.json({"selectNames":selectNames})
	})	
}