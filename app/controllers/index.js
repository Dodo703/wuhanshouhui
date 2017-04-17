var Example=require('../models/example')
var Category=require('../models/category')
var Genre=require('../models/genre')

//主页index page
exports.index=function(req,res){
	Category
		.find({})
		.populate({path:'examples',options:{limit:12}})
		.exec(function(err,categories){
			if(err){console.log(err)}
			res.render('index',{
				title:'武汉手绘',
				categories:categories
			})
	})
}

//search page
exports.search=function(req,res){
	var catId=req.query.cat
	var page=parseInt(req.query.p,10)
	var limit=2
	var index=page*limit
	var count=0
	Category
		.find({_id:catId})
		.populate({path:'examples'})
		.exec(function(err,categories){
			if(err){console.log(err)}
			count=categories[0].examples.length
			Category
				.find({_id:catId})
				.populate({path:'examples',options:{limit:limit,skip:index}})
				.exec(function(err,categories){
					if(err){console.log(err)}
					var category=categories[0] || {}
					res.render('results',{
						title:'结果列表页面',
						keyword:category.name,
						currentPage:page+1,
						catId:catId,
						totalPage:Math.ceil(count/limit),
						// totalPage:totalPage,
						category:category
					})
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
				// console.log('hhhhhh'+examples[0].category.genre.scope)
				// console.log('hhhhhh'+scopeName)
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