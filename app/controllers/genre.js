var Genre=require('../models/genre')
var Category=require('../models/category')
var _=require('underscore')

exports.new=function(req,res){
	if(req.params.id!=1){
		console.log(req.params.id)
		Genre.findById(req.params.id,function(err,genre){
			res.render('genre_admin',{
				title:'后台图片分类录入页',
				genre:genre
			})
		})
	}else{
		res.render('genre_admin',{
			title:'后台图片分类录入页',
			genre:{}
		})
	}
}

//admin post example
exports.save=function(req,res){
	var genreObj=req.body.genre
	if(genreObj._id){
		Genre.update({_id:genreObj._id},{name:genreObj.name,scope:genreObj.scope},function(err){
			if(err){console.log(err)}
			res.redirect('/admin/genre_list/')
		})
	}else{
		var _genre=genreObj
		var genre=new Genre(_genre)
		console.log(genre.scope)
		genre.save(function(err,genre){
				if(err){console.log(err)}
				res.redirect('/admin/genre_list')
			})
	}
}
//list page
exports.list=function(req,res){
	Genre
		.find({})
		.populate({path:'categories'})
		.exec(function(err,genres){
			if(err){console.log(err)}
			res.render('genre_list',{
				title:'后台图片分类列表页',
				genres:genres
			})
	})
	// Category.find({},function(err,categories){
	// 	Genre.fetch(function(err,genres){
	// 		if(err){
	// 			console.log(err)
	// 		}
	// 		res.render('genre_list',{
	// 			title:'后台图片分类列表页',
	// 			genres:genres
	// 		})
	// 	})
	// })
}


// list delete example

exports.del=function(req,res){
	var id=req.query.id
	if(id){
		Genre.remove({_id:id},function(err,genre){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
}
// ajax
exports.getAllGenre=function(req,res){
	scope=req.query.scope
	Genre.find({scope:scope},function(err,genres){
		var genreNames=new Array()
		for(var i=0;i<genres.length;i++){
			genreNames[i]=genres[i].name
		}
		res.json({"selectNames":genreNames})
	})
}
// 查看更多

exports.genreMore=function(req,res){
	scope=req.params.scope
	genre=req.params.id
	var love=0
	if(genre==1){
		Genre.find({scope:scope},function(err,genres){
			genre=genres[0]._id
			console.log(genre)
			Genre
				.find({scope:scope,_id:genre})
				.populate({
					path: 'categories',
					select: '_id name examples',
					populate: {
					    path: 'examples',
					    select: '_id title poster pv summary users'
					}
				}).sort({createTime: -1}).exec(function(err,genre){
					if(err){console.log(err)}
					res.render('qianghui',{
							title:genre[0].name,
							genre:genre[0],
							love:love
						})
			})
		})
	}else{
		Genre
		.find({scope:scope,_id:genre})
		.populate({
			path: 'categories',
			select: '_id name examples',
			populate: {
			    path: 'examples',
			    select: '_id title poster pv summary users'
			}
		}).sort({createTime: -1}).exec(function(err,genre){
			if(err){console.log(err)}
			res.render('qianghui',{
					title:genre[0].name,
					genre:genre[0],
					love:love
				})
	})
	}
	
}