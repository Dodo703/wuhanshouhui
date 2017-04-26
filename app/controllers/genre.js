var Genre=require('../models/genre')
var Category=require('../models/category')
var Example=require('../models/example')
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
	if(req.query.p){
		var page=parseInt(req.query.p,10)
	}else{
		var page=1
	}
	var limit=12
	var index=(page-1)*limit
	var count=0
	var url=''
	Genre.count(function(errcount,count){
		Genre
			.find({})
			.populate({path:'categories'})
			.sort({createTime: -1}).limit(limit).skip(index).exec(function(err,genres){
				if(err){console.log(err)}
				res.render('genre_list',{
					title:'后台图片分类列表页',
					genres:genres,
					totalPages:Math.ceil(count/limit),
					currentPage:page,
					url:'genre_list'
				})
		})
	})
}


// list delete example

exports.del=function(req,res){
	var id=req.query.id
	if(id){
		Example.remove({genre:id},function(err){
			if(err){console.log(err)}
			else{
				Category.remove({genre:id},function(err){
					if(err){console.log(err)}else{
						Genre.remove({_id:id},function(err){
							if(err){console.log(err)}else{res.json({success:1})}
						})
					}
				})
			}
		})
	}
}
// ajax
exports.getAllGenre=function(req,res){
	scope=req.query.scope
	Genre.find({scope:scope},function(err,genres){
		var genreNames=[]
		if(genres.length>0){
			for(var i=0;i<genres.length;i++){
			var json={
				"name":genres[i].name,
				"id":genres[i]._id
				}
				genreNames.push(json)
			
			}
		}
		res.json({"selectNames":genreNames})
	})
}
// 查看更多

exports.genreMore=function(req,res){
	scope=req.params.scope
	genre=req.params.id
	if(scope=='qianghui'){scope='墙绘'}
	if(scope=='tuku'){scope='图库'}
	if(scope=='gongyi'){scope='工艺'}
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
		.findOne({scope:scope,_id:genre})
		.populate({
			path: 'categories',
			select: '_id name examples',
			populate: {
			    path: 'examples',
			    select: '_id title poster pv summary users'
			}
		}).sort({createTime: -1}).exec(function(err,genre){
			console.log('genre'+genre)
			if(err){console.log(err)}
			res.render('qianghui',{
					title:genre.name,
					genre:genre,
					love:love
				})
	})
	}
	
}