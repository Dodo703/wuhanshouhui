$(function(){
	$('.dropdown').hover(function(){
		$('.dropdown').removeClass('open');
		$(this).addClass('open');
	},function(){
		$(this).removeClass('open');
	});
	
	console.log(document.documentElement.clientHeight/3+'px');
	$('.modal_open .mutiview-dialog-bg').width(document.documentElement.clientWidth).height(document.documentElement.clientHeight);
$(window).resize(function(){
	console.log(document.documentElement.clientHeight/3);
	$('.modal_open .mutiview-dialog-bg').width(document.documentElement.clientWidth).height(document.documentElement.clientHeight);
})


// 登录注册
$('body').removeClass('modal_open');
$('.mutiview-dialog-bg').width(0).height(0);
$('.modal_wrapper').css('display','none');
$('#userLogin , .title_login , .user_icon').click(function(){userLogin('.login','.title_login');})
$('#userRegister  , .title_register').click(function(){userLogin('.register','.title_register');})
$('.mutiview-dialog  .close_btn').click(function(){
	$('body').removeClass('modal_open');
	$('.mutiview-dialog-bg').width(0).height(0);
	$('.modal_wrapper').css('display','none');
})



})
// 登录注册
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