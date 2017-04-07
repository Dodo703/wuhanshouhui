var Movie=require('../models/movie')
//主页index page
exports.index=function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
			title:'武汉手绘',
			movies:movies
		})
	})
}