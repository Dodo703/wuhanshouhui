var Example=require('../models/example')
var Category=require('../models/category')
var Genre=require('../models/genre')

//index
exports.show=function(req,res){
	// var scopeName=req.query.scope
	var results=[]
	var limit=req.query.limit
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
				console.log(examples[0].category.genre.name)
				for(var i=0,j=0;i<examples.length&&j<limit;i++){
					if(example[i].category.genre.scope=scopeName)
						results[j++]=example[i]
				}
				res.render('list',{
					title:'后台图片列表页',
					results:results
				})
});

}
