var Note=require('../models/note')
var Comment=require('../models/comment')
var _=require('underscore')
var fs=require('fs')
var path=require('path')
var formidable = require("formidable")
var url = require('url');
var moment=require('moment')
//新建帖子
exports.new=function(req,res){
	res.render('addNote',{
		title:'上传帖子',
		note:{}
	})
}


//保存新建帖子图片
exports.savePoster=function(req,res){
var form = new formidable.IncomingForm();
form.uploadDir = "./public/upload/note";
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
		var filenewpath = path.join(__dirname,'../../','/public/upload/note/'+filename);

		// 将临时文件保存为正式的文件
		console.log(tempfilepath)
		console.log(filenewpath)
		fs.rename(tempfilepath, filenewpath, function (err) {

			var result = '';		
			if (err) {console.log(err);} else {
				result = '/upload/note/' + filename;
			}
			res.send(result)
			
		}); 
	}
});
}
//admin update note
exports.update=function(req,res){
	var id=req.params.id
	var catId='';
	if(id){
		Note.findById(id,function(err,note){
			res.render('addNote',{
				title:"后台帖子更新页",
				note:note
			})
		})
	}
}
//保存新建帖子
exports.save=function(req,res){
	var id=req.body.note._id
	var noteObj=req.body.note
	var _note
	if(id){
		Note.findById(id,function(err,note){
			if(err){console.log(err)}
			note=_.extend(note,noteObj)
			note.save(function(err,note){
				if(err){console.log(err)}
				res.redirect('/admin/note_list')
			})
		})

	}else{
		_note=new Note(noteObj)
		_note.save(function(err,note){
			if(err){console.log(err)}
			res.redirect('/admin/note_list')
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
	Note.count(function(errcount,count){
		Note.find().sort({createTime: -1}).limit(limit).skip(index)
		.exec(function(err,notes){
			if(err){
			console.log(err)
			}
			res.render('note_list',{
				title:'福利帖子列表页',
				notes:notes,
				totalPages:Math.ceil(count/limit),
				currentPage:page,
				url:'note_list'
			})
		})
	})
	
}

//福利详情页
exports.detail=function(req,res){
	var id=req.params.id
	var love=0
	Note.update({_id:id},{$inc:{pv:1}},function(err){
		console.log(err)
	})
	Note.findById(id,function(err,note){
		Comment
		.find({note:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.exec(function(err,comments){
			if(note.content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)==null){
				note.poster='/upload/note/fuli.jpg'
			}else{
				note.poster=note.content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
			}
			res.render('note_info',{
				title:'武汉手绘/'+note.title,
				note:note,
				comments:comments,
				love:love
				})
		})
	})	
}

//list page
exports.index=function(req,res){
	if(req.query.p){
		var page=parseInt(req.query.p,10)
	}else{
		var page=1
	}
	var limit=12
	var index=(page-1)*limit
	var count=0
	var love=0
	Note.count({},function(errcount,count){
		Note.find().sort({createTime: -1}).limit(limit).skip(index)
		.exec(function(err,notes){
			for(var i=0;i<notes.length;i++){
				if(notes[i].content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)==null){
					notes[i].poster='/upload/note/fuli.jpg'
				}else{
					notes[i].poster=notes[i].content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
				}		
			}
			console.log(love)
				res.render('fuli',{
				title:'福利',
				notes:notes,
				love:love,
				totalPages:Math.ceil(count/limit),
				currentPage:page
			})
		})
	})
}

//list delete note
exports.del=function(req,res){
	var id=req.query.id
	if(id){
		Note.remove({_id:id},function(err,note){
			if(err){console.log(err)}else{
				Comment.remove({note:id},function(err){
					if(err){console.log(err)}else{res.json({success:1})}
				})
			}
		})
	}
}


// 首页加载3条福利贴
exports.noteIndex=function(req,res){
	Note.find({}).sort({createTime: -1}).limit(3)
	.exec(function(err, notes){
		if(err){console.log(err)}
			var results=[]
			for(var i=0;i<notes.length;i++){
				notes[i].time=moment(notes[i].meta.updateAt).format('YYYY/DD/MM')
				if(notes[i].content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)==null){
					notes[i].poster='/upload/note/fuli.jpg'
				}else{
					notes[i].poster=notes[i].content.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
				}	
				var json={
					"title":notes[i].title,
					"id":notes[i]._id,
					"poster":notes[i].poster,
					"time":notes[i].time,
					"summary":notes[i].summary
				}
				results.push(json)
			}
		// console.log('000'+notes[1].poster)	
		res.json(results)
	})
}
