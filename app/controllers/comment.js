var Comment=require('../models/comment')
var _=require('underscore')


//comment
exports.save=function(req,res){
	var cate= req.query.cate
	_comment=new Comment()
	if(cate=='example'){
		_comment.example = req.query.example
	}else{
		_comment.note = req.query.note
	}
	_comment.from = req.query.from
	_comment.content = req.query.content
	if(req.query.cid){_comment.cid = req.query.cid
	_comment.tid = req.query.tid}
	if(_comment.cid){
		Comment.findById(_comment.cid,function(err,comment){
			if(err){console.log(err)}
			var reply={
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content
			}
			console.log('reply'+reply)
			comment.reply.push(reply)
			comment.save(function(err,comment){
				if(err){console.log(err)}
				res.json({
					success:1,
					cate:cate
				})
			})
		})
	}else{
		var comment=new Comment(_comment)
		comment.save(function(err,comment){
			if(err){console.log(err)}
			res.json({
				success:1,
				cate:cate
			})
		})	
	}
}

exports.getCommont=function(req,res){
	var cate=req.query.cate
	var id=req.query.id
	if(cate=='example'){
		Comment
		.find({example:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.sort({createTime: -1}).exec(function(err,comments){
			console.log('ggggggggggg'+comments)
			if(err){console.log(err)}
			res.json(comments)
		})
	}else{
		Comment
		.find({note:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.sort({createTime: -1}).exec(function(err,comments){
			console.log('ggggggggggg'+comments)
			if(err){console.log(err)}
			res.json(comments)
		})
	}
	
}	