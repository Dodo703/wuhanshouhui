var Example=require('../models/example')
var Category=require('../models/category')
var Genre=require('../models/genre')

//主页index page
exports.index=function(req,res){
	Category
		.find({})
		.populate({path:'examples',options:{limit:12}})
		.sort({createTime: -1}).exec(function(err,categories){
			if(err){console.log(err)}
			res.render('index',{
				title:'武汉手绘',
				categories:categories
			})
	})
}


exports.show=function(req,res){
	var scopeName=req.query.scope
	var results=[]
	var limit=req.query.limit
	var userId=''
	var love=0
	var favourite=0
	var sessionUser=0
	if(scopeName=='qianghui'){scopeName='墙绘'}
	if(scopeName=='tuku'){scopeName='图库'}
	if(scopeName=='gongyi'){scopeName='工艺'}
	if(req.session.user){
		sessionUser=1
		userId=req.session.user._id}
	Example
		.find()
		.populate({
			path: 'category',
			select: '_id name genre',
			model:'Category',
			populate: {
			    path: 'genre',
			    select: '_id scope name',
			    model:'Genre',
			}
		}).sort({createTime: -1}).exec(function(err, examples) {
				for(var i=0,j=0;i<examples.length&&j<limit;i++){
					if(examples[i].category.genre.scope==scopeName){
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
						results.push(json)
						j++
					}
				}
				console.log('results'+results)
				res.json(results)
	})
}

exports.headGenre=function(req,res){
	var scope=req.query.scope
	var genreNames=[]
	Genre.find({scope:scope},function(err,genres){
			if(err){console.log(err)}
			if(genres.length){
				for(var i=0;i<genres.length;i++){
					var json={
						"name":genres[i].name,
						"id":genres[i]._id
					}
					genreNames.push(json)
				}
			}
			res.json(genreNames)
		})
}