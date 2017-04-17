$(function(){

})

// user 收藏图片
function userFavourite(item,limit){
var string=''
 $.ajax({
             type: "GET",
             url: "/userFavourite",
             data:{limit:limit},
             dataType: "json",
             success: function(data){
				for(var i=0;i<data.length;i++){
					string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><img src="'+data[i].poster+'" alt="'+data[i].title+'"></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love loved" data-id="'+data[i].id+'">&#xe614;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
				}
				$(item).html(string)
			}
	})
}
// index 首页加载图片
function showScope(item,scope,limit){
	var string=''
 $.ajax({
             type: "GET",
             url: "/show",
             data:{scope:scope,limit:limit},
             dataType: "json",
             success: function(data){
				for(var i=0;i<data.length;i++){
					if(data[i].sessionUser==0){
						string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><img src="'+data[i].poster+'" alt="'+data[i].title+'"></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love" data-id="'+data[i].id+'"  data-toggle="tooltip" data-placement="bottom" title="登录后可收藏">&#xe62b;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
					}
					if(data[i].sessionUser==1 && data[i].love==0){
							string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><img src="'+data[i].poster+'" alt="'+data[i].title+'"></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love" data-id="'+data[i].id+'">&#xe62b;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
						}
					if(data[i].sessionUser==1 && data[i].love==1){
							string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><img src="'+data[i].poster+'" alt="'+data[i].title+'"></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love loved" data-id="'+data[i].id+'">&#xe614;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
						}
				}
				string=string+'<div class="clearfix"></div><div class="col-md-6 col-md-offset-3"><a href="/genre/'+scope+'/1" class="case_more",title="">查看更多</a></div>'
				$(item).html(string)
				 $('[data-toggle="tooltip"]').tooltip()
			}
	})
}

// 关键字加载图片
function selectCategory(item,id){
	var string=''
 $.ajax({
             type: "GET",
             url: "/selectCategory",
             data:{id:id},
             dataType: "json",
             success: function(data){
				for(var i=0;i<data.length;i++){
					if(data[i].sessionUser==0){
						string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><img src="'+data[i].poster+'" alt="'+data[i].title+'"></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love" data-id="'+data[i].id+'"  data-toggle="tooltip" data-placement="bottom" title="登录后可收藏">&#xe62b;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
					}
					if(data[i].sessionUser==1 && data[i].love==0){
							string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><img src="'+data[i].poster+'" alt="'+data[i].title+'"></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love" data-id="'+data[i].id+'">&#xe62b;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
						}
					if(data[i].sessionUser==1 && data[i].love==1){
							string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><img src="'+data[i].poster+'" alt="'+data[i].title+'"></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love loved" data-id="'+data[i].id+'">&#xe614;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
						}
				}
				$(item).html(string)
				$('[data-toggle="tooltip"]').tooltip()
			}
	})
}

