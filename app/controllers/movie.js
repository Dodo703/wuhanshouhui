var Movie=require('../models/movie')
var Comment=require('../models/comment')
var _=require('underscore')

exports.detail=function(req,res){
	var id=req.params.id
	Movie.findById(id,function(err,movie){
		Comment
		.find({movie:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.exec(function(err,comments){
			console.log(comments)
			res.render('detail',{
			title:'武汉手绘/'+movie.title,
			movie:movie,
			comments:comments
			})
		})
	})	
}
exports.new=function(req,res){
	res.render('admin',{
		title:'后台图片录入页',
		movie:{
			title:'',
			poster:'',
			summary:''
		}
	})
}
//admin update movie
exports.update=function(req,res){
	var id=req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:"后台图片更新页",
				movie:movie
			})
		})
	}
}

//admin post movie
exports.save=function(req,res){
	var id=req.body.movie._id
	var movieObj=req.body.movie
	var _movie
	console.log(111)
	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			_movie=_.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/admin/list')
			})
		})
	}
	else{
		_movie=new Movie({
			title:movieObj.title,
			poster:movieObj.poster,
			summary:movieObj.summary
		})
		_movie.save(function(err,movie){
				if(err){console.log(err)}
				res.redirect('/admin/list')
			})
	}
}

//list page
exports.list=function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'后台图片列表页',
			movies:movies
		})
	})
	
}


//list delete movie

exports.del=function(req,res){
	var id=req.query.id
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
}
