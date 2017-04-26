$(function(){ 
	// header
	headGenre('#gHead','工艺')
	headGenre('#qHead','墙绘')
	headGenre('#tHead','图库')
	//首页加载福利帖子
 $.ajax({
             type: "GET",
             url: "/noteIndex",
             dataType: "json",
             success: function(data){
             	var string1=''
				for(var i=0;i<data.length;i++){
					string1=string1+'<a href="../note/'+data[i].id+'" class="home_weal"><div class="col-xs-3 col-sm-3 col-md-3 col-lg-2 footer_weal"><div class="div-bgimg" style="background-image:url('+data[i].poster+')"></div></div><div class="col-xs-9 col-sm-9 col-md-9 col-lg-10"><h4>'+data[i].title+'</h4><p>'+data[i].summary+'</p><span> 发布：<small>'+data[i].time+'</small></span></div><span class="clearfix"></span></a>'
				}
				$('.indexFuli').html(string1)
				var string2=''
				for(var i=0;i<data.length&&i<2;i++){
					string2=string2+'<a href="../note/'+data[i].id+'" class="home_weal"><div class="col-xs-3 col-sm-3 col-md-3 col-lg-2 footer_weal"><div class="div-bgimg" style="background-image:url('+data[i].poster+')"></div></div><div class="col-xs-9 col-sm-9 col-md-9 col-lg-10"><h4>'+data[i].title+'</h4><p>'+data[i].summary+'</p></div><span class="clearfix"></span></a>'
				}
				$('.indexFulifooter').html(string2)
				$(".indexFuli .div-bgimg").height($(".indexFuli .div-bgimg").width());
				$(".indexFulifooter .div-bgimg").height($(".indexFulifooter .div-bgimg").width());
			}
	})
//头部下拉
// $('.dropdown').click(function(){
// 		if($(this).hasClass('open')){
// 			$('.dropdown').removeClass('open');
// 		}else{
// 			$('.dropdown').removeClass('open');
// 			$(this).addClass('open');
// 		}
// 	});
	$('.dropdown').hover(function(){
		console.log('hover')
		$('.dropdown').removeClass('open');
		$(this).addClass('open');
	},function(){
		console.log('hoszdsdsaaver')
		$(this).removeClass('open');
	});
	
	console.log(document.documentElement.clientHeight/3+'px');
	$('.modal_open .mutiview-dialog-bg').width(document.documentElement.clientWidth).height(document.documentElement.clientHeight);
$(window).resize(function(){
	console.log(document.documentElement.clientHeight/3);
	$('.modal_open .mutiview-dialog-bg').width(document.documentElement.clientWidth).height(document.documentElement.clientHeight);
})

// 个人中心
$('.user_nav li').click(function(){
	$('.user_nav li').removeClass('active');
	$(this).addClass('active');
	$('.user_content .content').hide();
	$('.user_content .content').eq($(this).index()).show();
	if($(this).index()==2){
		userNote('#userNote','#notePage','note')
	}
})


//swpier
var swiper = new Swiper('.swiper-container1', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        paginationClickable: true,
        centeredSlides: true,
        autoplay: 2500,
        // autoplay: false,
        autoplayDisableOnInteraction: false,
        effect: 'fade',
        loop: true
    });
 var swiper = new Swiper('.swiper-container2', {
        paginationClickable: true,
        slidesPerView:4,
        spaceBetween: 40,
        breakpoints: {
            1024: {
                slidesPerView: 4,
                spaceBetween: 40
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 40
            },
            640: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            }
        }
    });
// 点赞收藏
 $('[data-toggle="tooltip"]').tooltip()
$(document).on('click','.icon_love',function(e){  
	if($(e.target).hasClass('loved')){
		// 取消收藏
		favourite(e,'/favourite?id=','0',0)
	}else{
		//收藏
		favourite(e,'/favourite?id=','1',0)
	}
})
$(document).on('click','.fuli_love',function(e){  
	if($(e.target).hasClass('loved')){
		// 取消收藏
		favourite(e,'/favourite?id=','0',1)
	}else{
		//收藏
		favourite(e,'/favourite?id=','1',1)
	}
	return false;
})
// 分类详情页的分页
$(document).on('click',".category",function(){  
	$('.category').removeClass('actived')
	$(this).addClass('actived')
	var id=$(this).attr('data-id')
	var item='#selsctCategory'
	selectCategoryPage(id,'#selsctCategory','#pageU1',0)
})
$(document).on('click',"#qActive",function(){  
	var id=$(this).attr('data-id')
	var scope=$(this).attr('data-scope')
	var item='#selsctCategory'
	selectCategoryPage(id,'#selsctCategory','#pageU1',scope)
})
// 帖子和图片的评论
// 评论图片详情页
$(document).on('click','.comment',function(){  
	var target=$(this)
	var toId=target.data('tid')
	console.log('toId'+toId)
	var commentId=target.data('cid')
	if($('#toId').length>0){
		$('#toId').val(toId)
	}else{
		$('<input>').attr({
			type:'hidden',
			id:'toId',
			name:'tid',
			value:toId
		}).appendTo('#commentForm')
	}
	if($('#commentId').length>0){
		$('#commentId').val(commentId)
	}else{
	$('<input>').attr({
		type:'hidden',
		id:'commentId',
		name:'cid',
		value:commentId
	}).appendTo('#commentForm')
}
// 评论a链接平滑
	$('html, body').animate({
		scrollTop: $($.attr(this, 'href')).offset().top-400+'px'
		}, 1000);
	document.getElementById("comContent").focus();
	return false;
})
//评论提交
$('#commentSubmit').click(function(){
	if($('#comContent').val()==''){
		$('#comContent').attr('placeholder','没有内容不能提交的呢，请输入内容')
	}else{
		$.ajax({
	         type: "GET",
	         url: "/user/comment",
	         data:$('#commentForm').serialize(),
	         dataType: "json",
	         success: function(data){
				if(data.success===1){
					$('#comContent').val('')
					if(data.cate=='example'){
						getComment('#example_id','#momment-list',data.cate)
					}else{
						getComment('#note_id','#momment-list',data.cate)
					}
					
				}
			}
		})
	}	
})

// 登录注册
// $('body').removeClass('modal_open');
$('.mutiview-dialog-bg').width(0).height(0);
// $('.modal_wrapper').css('display','none');
$('#userLogin , .title_login , #user_icon').click(function(){
	userLogin('.login','.title_login');})
$('#userRegister  , .title_register').click(function(){
	userLogin('.register','.title_register');})
$('.mutiview-dialog  .close_btn').click(function(){
	$('body').removeClass('modal_open');
	$('.mutiview-dialog-bg').width(0).height(0);
	$('.modal_wrapper').css('display','none');
})
// 登录注册ajax验证
$('#upSubmit').click(function(){
	var name=$('#upName').val()
	var password=$('#upPass').val()
	signup(name,password)
})
$('#inSubmit').click(function(){
	var name=$('#inName').val()
	var password=$('#inPass').val()
	signin(name,password)
})
//修改密码
$('#updateSubmit').click(function(){
	console.log(000000)
	var name=$('input[name="name"]').val()
	var oldpassword=$('input[name="oldpassword"]').val()
	var newpassword=$('input[name="newpassword"]').val()
	var confirmpassword=$('input[name="confirmpassword"]').val()
	console.log(oldpassword)
		console.log(newpassword)
			console.log(confirmpassword)
	updateUser(name,oldpassword,newpassword,confirmpassword)
})


// imgLoad('', function() {
//     p1.innerHTML('加载完毕')
// })
})
//函数

// function imgLoad(img, callback) {
//     var timer = setInterval(function() {
//         if (img.complete) {
//             callback(img)
//             clearInterval(timer)
//         }
//     }, 50)
// }

// 登录注册ajax验证
function updateUser(name,oldpassword,newpassword,confirmpassword){
	if(oldpassword.length<6 || newpassword.length<6){$('.usertip').html('密码位数不能小于6位数')}
	else if(confirmpassword!=newpassword){$('.usertip').html('两次输入的密码不一样')}
	else{
		$.ajax({
	         type: "POST",
	         url: "/user/update",
	         data:{name:name,oldpassword:oldpassword,newpassword:newpassword},
	         dataType: "json",
	         success: function(data){
	         	if(data.success===1){
	         		$('#userInfo').html('<div style="text-align:center;">重置密码成功，需重新登录</div>')
	         		setTimeout(function(){
						window.location.href='/'
						},3000)
	         	}else{
	         		$('.usertip').html('原始密码输入错误')
	         	}
			}
		})
	}	
}
// 登录注册ajax验证
function signin(name,password){
	if(password.length<6){$('.usertip').html('密码位数不能小于6位数')}
	if(name.length==0){$('.usertip').html('用户名不能为空')}
	if(name.length!=0 && password.length>=6){
		$.ajax({
	         type: "POST",
	         url: "/user/signin",
	         data:{name:name,password:password},
	         dataType: "json",
	         success: function(data){
	         	if(data.success===2){
					window.location.href='../admin/userlist'
				}
				if(data.success===1){
					console.log(data.success)
					window.location.reload();
				}
				if(data.success===0){
					$('.usertip').html(data.text)
				}
			}
		})
	}	
}
function signup(name,password){
	if(password.length<6){$('.upusertip').html('密码位数不能小于6位数')}
	if(name.length==0){$('.upusertip').html('用户名不能为空')}
	if(name.length!=0 && password.length>=6){
		$.ajax({
	         type: "POST",
	         url: "/user/signup",
	         data:{name:name,password:password},
	         dataType: "json",
	         success: function(data){
				if(data.success===1){
					signin(name,password)
				}else{
					$('.upusertip').html(data.text)
				}
			}
		})
	}	
}
// 登录注册前台页面显示
function  userLogin(item1,item2){
	$('body').addClass('modal_open');
	$('.modal_wrapper').css('display','block');
	$('.mutiview-dialog').css('margin-top',document.documentElement.clientHeight/4+'px');
	$('.modal_open .mutiview-dialog-bg').width(document.documentElement.clientWidth).height(document.documentElement.clientHeight);
	$(window).resize(function(){
	$('.mutiview-dialog').css('margin-top',document.documentElement.clientHeight/4+'px');
	$('.modal_open .mutiview-dialog-bg').width(document.documentElement.clientWidth).height(document.documentElement.clientHeight);
})
	$('.modal_wrapper').find('.mutiview-dialog-content').css('display','none');
	$('.modal_wrapper').find(item1).css('display','block');
	$('.modal_wrapper').find('.title').removeClass('active');
	$('.modal_wrapper').find(item2).addClass('active');
	}

// 帖子和图片的评论
function getComment(item,item2,cate){
	var id=$(item).val()
	var strcomment=''
	var string=''
 $.ajax({
             type: "GET",
             url: "/getCommont",
             data:{cate:cate,id:id},
             dataType: "json",
             success: function(data){
             		for(var i=0;i<data.length;i++){
						var strreply=''
						strcomment='<li class="media"><div class="pull-left"><a class="comment" href="#comments" data-cid="'+data[i]._id+'" data-tid="'+data[i].from._id+'"><img src="/images/userIcon.jpg" alt="" class="media-object"></a></div><div class="media-body"><h4 class="media-heading">'+data[i].from.name+'</h4><p>'+data[i].content+'</p>'
						for(var j=0;j<data[i].reply.length;j++){
							strreply=strreply+'<div class="media"><div class="pull-left"><a class="comment" href="#comments" data-cid="'+data[i]._id+'" data-tid="'+data[i].reply[j].from._id+'"><img src="/images/userIcon.jpg" alt="" class="media-object"></a></div><div class="media-body"><h4 class="media-heading">'+data[i].reply[j].from.name+'<span class="text-info">&nbsp;回复&nbsp;</span>'+data[i].reply[j].to.name+' :</h4><p>'+data[i].reply[j].content+'</p></div></div>' 
						}
						strcomment=strcomment+strreply+'</div><div class="com-line"></div></li>' 
						string=string+strcomment
					}
				$(item2).html(string)
			}
	})
}

// user 收藏帖子和图片列表
function userNote(item,item2,cate){
 $.ajax({
		    url: "/userNote",
		    data:{
		      	cate:cate,
		      	page:1
		    },
		    type: "GET",
		    success: function (data) {
		    	var string=''
		    	console.log('data.results.length'+data.results.length)
		    	if(cate=='note'){
			        for(var i=0;i<data.results.length;i++){
						string=string+'<a href="../note/'+data.results[i].id+'" class="home_weal"><div class="col-xs-3 col-sm-3 col-md-3 col-lg-2"><div class="div-bgimg" style="background-image:url('+data.results[i].poster+')"></div></div><div class="col-xs-9 col-sm-9 col-md-9 col-lg-10"><h4>'+data.results[i].title+'</h4><p>'+data.results[i].summary+'}</p></div><div class="case_status fuli_absolute"><p><i class="iconfont">&#xe637;</i><span>'+data.results[i].pv+'</span><small class="small_line"></small><i class="iconfont fuli_love loved" data-id="'+data.results[i]._id+'" >&#xe614;</i> <span>'+data.results[i].favourite+'</span></p></div><div class="clearfix"></div></a>' 
					}
					if(data.results.length==0){
						string="<p class='center'>您还没有收藏人家呢。。<a href='/fuli'>哎哟喂..我现在就去收藏</a></p>"
					}
				}else{
					for(var i=0;i<data.results.length;i++){
					string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data.results[i].id+'" title=""><div class="div-bgimg" style="background-image:url('+data.results[i].poster+')"></div></a><div class="case-info"><strong>'+data.results[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data.results[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love loved" data-id="'+data.results[i].id+'">&#xe614;</i><span>'+data.results[i].favourite+'</span></div></div></div></div>' 
					}
					if(data.results.length==0){
						string="<p class='center'>您还没有收藏人家呢。。<a href='/'>哎哟喂..我现在就去收藏</a></p>"
					}
				}
				$(item).html(string)
				$(item).find('.div-bgimg').height($(item).find('.div-bgimg').width());
				$('[data-toggle="tooltip"]').tooltip()
				console.log(data.currentPage+'qqqq'+data.totalPages)
		        var options = {
		          	bootstrapMajorVersion: 3, //版本
		            currentPage:data.currentPage, //当前页数
		            numberOfPages: 3,
		            totalPages:data.totalPages, //总页数
		            tooltipTitles: function (type, page, current) {
		              switch (type) {
		                case "first":
		                  return "首页";
		                case "prev":
		                  return "上一页";
		                case "next":
		                  return "下一页";
		                case "last":
		                  return "末页";
		                case "page":
		                  return page;
		              }
		            },
		            itemTexts: function (type, page, current) {
		              switch (type) {
		                case "first":
		                  return "首页";
		                case "prev":
		                  return "上一页";
		                case "next":
		                  return "下一页";
		                case "last":
		                  return "末页";
		                case "page":
		                  return page;
		              }
		            },//点击事件，用于通过Ajax来刷新整个list列表
		            onPageClicked: function (event, originalEvent, type, page) {
		              $.ajax({
		                url: "/userNote",
		                type: "GET",
		                data: {
		                	cate:cate,
					        page:page
		                },
		                success: function (data) {
		                	var string=''
		               if(cate=='note'){
					        for(var i=0;i<data.results.length;i++){
								string=string+'<a href="../note/'+data.results[i].id+'" class="home_weal"><div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><div class="div-bgimg" style="background-image:url('+data.results[i].poster+')"></div></div><div class="col-xs-9 col-sm-9 col-md-9 col-lg-10"><h4>'+data.results[i].title+'</h4><p>'+data.results[i].summary+'}</p></div><div class="case_status fuli_absolute"><p><i class="iconfont">&#xe637;</i><span>'+data.results[i].pv+'</span><small class="small_line"></small><i class="iconfont fuli_love loved" data-id="'+data.results[i]._id+'" >&#xe614;</i> <span>'+data.results[i].favourite+'</span></p></div><div class="clearfix"></div></a>' 
							}
							if(data.results.length==0){
								string="<p class='center'>您还没有收藏人家呢。。<a href='/fuli'>哎哟喂..我现在就去收藏</a></p>"
							}
						}else{
							for(var i=0;i<data.results.length;i++){
							string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data.results[i].id+'" title=""><div class="div-bgimg" style="background-image:url('+data.results[i].poster+')"></div></a><div class="case-info"><strong>'+data.results[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data.results[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love loved" data-id="'+data.results[i].id+'">&#xe614;</i><span>'+data.results[i].favourite+'</span></div></div></div></div>' 
							}
							if(data.length==0){
								string="<p class='center'>您还没有收藏人家呢。。<a href='/'>哎哟喂..我现在就去收藏</a></p>"
							}
						}
						$(item).html(string)
						$(item).find('.div-bgimg').height($(item).find('.div-bgimg').width());
						$('[data-toggle="tooltip"]').tooltip()
		                }
		              });
		            }
		          };
		          $(item2).bootstrapPaginator(options);

			}
		})
}
// 福利帖子的分页
function fuliPage(item,currentPage,totalPages){
	var options = {  
			bootstrapMajorVersion: 3, //版本
            currentPage: currentPage,
            numberOfPages: 3,  
            totalPages: totalPages,
            tooltipTitles: function (type, page, current) {
		              switch (type) {
		                case "first":
		                  return "首页";
		                case "prev":
		                  return "上一页";
		                case "next":
		                  return "下一页";
		                case "last":
		                  return "末页";
		                case "page":
		                  return page;
		              }
		            },
		            itemTexts: function (type, page, current) {
		              switch (type) {
		                case "first":
		                  return "首页";
		                case "prev":
		                  return "上一页";
		                case "next":
		                  return "下一页";
		                case "last":
		                  return "末页";
		                case "page":
		                  return page;
		              }
		            },
            pageUrl: function(type, page, current){
                return "/fuli?p="+page;  
  
            }  
        }  
  
        $(item).bootstrapPaginator(options);  
}
//分页
function selectCategoryPage(id,item,item2,scope){
	if(scope=='墙绘'){scope='qianghui'}
	if(scope=='图库'){scope='tuku'}
	if(scope=='工艺'){scope='gongyi'}
	$.get("/category/getAmount",{id:id,scope:scope},function(result){
	   	var amount=parseInt(result)
	   	var pageamount=Math.ceil(amount/12)
		$.ajax({
		    url: "/selectCategory",
		    data:{
		      	id:id,
		      	limit:12,
		        page:1,
		        scope:scope
		    },
		    type: "GET",
		    success: function (data) {
		    	var string=''
		    	console.log('data.length'+data.length)
		    	if(data.length==0){
		    		$(item2).css('display','none')
		    		var currentPage=0
		    	}else{
		    		$(item2).css('display','block')
		    		var currentPage=data[0].page
		    	}
		        for(var i=0;i<data.length;i++){
					if(data[i].sessionUser==0){
						string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><div class="div-bgimg" style="background-image:url('+data[i].poster+')"></div></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love" data-id="'+data[i].id+'"  data-toggle="tooltip" data-placement="bottom" title="登录后可收藏">&#xe62b;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
					}
					if(data[i].sessionUser==1 && data[i].love==0){
							string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><div class="div-bgimg" style="background-image:url('+data[i].poster+')"></div></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love" data-id="'+data[i].id+'" >&#xe62b;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
						}
					if(data[i].sessionUser==1 && data[i].love==1){
							string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><div class="div-bgimg" style="background-image:url('+data[i].poster+')"></div></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love loved" data-id="'+data[i].id+'">&#xe614;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
						}
				}
				$(item).html(string)
				$(item).find('.div-bgimg').height($(item).find('.div-bgimg').width());
				$('[data-toggle="tooltip"]').tooltip()
		        var options = {
		          	bootstrapMajorVersion: 3, //版本
		            currentPage:currentPage, //当前页数
		            numberOfPages: 3,
		            totalPages: pageamount, //总页数
		            tooltipTitles: function (type, page, current) {
		              switch (type) {
		                case "first":
		                  return "首页";
		                case "prev":
		                  return "上一页";
		                case "next":
		                  return "下一页";
		                case "last":
		                  return "末页";
		                case "page":
		                  return page;
		              }
		            },
		            itemTexts: function (type, page, current) {
		              switch (type) {
		                case "first":
		                  return "首页";
		                case "prev":
		                  return "上一页";
		                case "next":
		                  return "下一页";
		                case "last":
		                  return "末页";
		                case "page":
		                  return page;
		              }
		            },//点击事件，用于通过Ajax来刷新整个list列表
		            onPageClicked: function (event, originalEvent, type, page) {
		              $.ajax({
		                url: "/selectCategory",
		                type: "GET",
		                data: {
		                 	id:id,
		                 	limit:12,
					        page:page,
					        scope:scope
		                },
		                success: function (data) {
		                	var string=''
		                 for(var i=0;i<data.length;i++){
							if(data[i].sessionUser==0){
								string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><div class="div-bgimg" style="background-image:url('+data[i].poster+')"></div></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love" data-id="'+data[i].id+'"  data-toggle="tooltip" data-placement="bottom" title="登录后可收藏">&#xe62b;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
							}
							if(data[i].sessionUser==1 && data[i].love==0){
									string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><div class="div-bgimg" style="background-image:url('+data[i].poster+')"></div></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love" data-id="'+data[i].id+'">&#xe62b;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
								}
							if(data[i].sessionUser==1 && data[i].love==1){
									string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><div class="div-bgimg" style="background-image:url('+data[i].poster+')"></div></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love loved" data-id="'+data[i].id+'">&#xe614;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
								}
						}
						$(item).html('')
						$(item).html(string)
						$(item).find('.div-bgimg').height($(item).find('.div-bgimg').width());
						$('[data-toggle="tooltip"]').tooltip()
		                }
		              });
		            }
		          };
		          $(item2).bootstrapPaginator(options);
			}
		})
	})
}

//收藏按钮
function favourite(e,url,cancel,note){
	var target=$(e.target)
	var id=target.data('id')
	$.ajax({
		type:'GET',
		url:url+id+'&cancel='+cancel+'&note='+note
	})
	.done(function(results){
		if(results.success===1&&cancel==1){
			target.addClass('loved').html('&#xe614;');
			target.next('span').html(results.favourite)
		}else{
			target.removeClass('loved').html('&#xe62b;');
			target.next('span').html(results.favourite)
		}

	})
}


// header
function headGenre(item,scope){
	var string=''
 $.ajax({
             type: "GET",
             url: "/headGenre",
             data:{scope:scope},
             dataType: "json",
             success: function(data){
				for(var i=0;i<data.length;i++){
					string=string+'<li data-id="'+data[i].id+'"><a href="/genre/'+scope+'/'+data[i].id+'" title="" >'+data[i].name+'</a></li>' 
				}
				$(item).html(string)
			}
	})
}

// index 首页加载图片
function showScope(item,scope,limit){
	var string=''
	if(scope=='墙绘'){scope='qianghui'}
	if(scope=='图库'){scope='tuku'}
	if(scope=='工艺'){scope='gongyi'}
 $.ajax({
             type: "GET",
             url: "/show",
             data:{scope:scope,limit:limit},
             dataType: "json",
             success: function(data){
				for(var i=0;i<data.length;i++){
					if(data[i].sessionUser==0){
						string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><div class="div-bgimg" style="background-image:url('+data[i].poster+')"></div></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love" data-id="'+data[i].id+'"  data-toggle="tooltip" data-placement="bottom" title="登录后可收藏">&#xe62b;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
					}
					if(data[i].sessionUser==1 && data[i].love==0){
						string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><div class="div-bgimg" style="background-image:url('+data[i].poster+')"></div></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love" data-id="'+data[i].id+'">&#xe62b;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
							
						}
					if(data[i].sessionUser==1 && data[i].love==1){
							string=string+'<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 case"><div class="user_case"><a href="/example/'+data[i].id+'" title=""><div class="div-bgimg" style="background-image:url('+data[i].poster+')"></div></a><div class="case-info"><strong>'+data[i].title+'</strong><div class="case_status"><i class="iconfont">&#xe637;</i><span>'+data[i].pv+'</span><small class="small_line"></small><i class="iconfont icon_love loved" data-id="'+data[i].id+'">&#xe614;</i><span>'+data[i].favourite+'</span></div></div></div></div>' 
						}
				}
				string=string+'<div class="clearfix"></div><div class="col-md-6 col-md-offset-3"><a href="/genre/'+scope+'/1" class="case_more",title="">查看更多</a></div>'
				$(item).html(string)
				$('[data-toggle="tooltip"]').tooltip()
				$(".case a .div-bgimg").height($(".case a .div-bgimg").width());
			}
	})
}
