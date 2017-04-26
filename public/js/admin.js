$(function(){

// 上传图片
$('#selectScope').change(function(){getAllGenre()})
$('#selectGenre').change(function(){getAllCategory()})
$('#selectCategory').change(function(){rideoCheck()	})
// 管理员列表
$('#addAdUser').click(function(){
	$('#addUserForm').css('display','block')
	$('#adminUserList').css('display','none')	
})



})
//函数
//删除按钮
function del(target,url){
	var id=target.data('id')
	var tr=$('.item-id-'+id)
	$.ajax({
		type:'DELETE',
		url:url+'?id='+id
	})
	.done(function(results){
		if(results.success===1){
			if(tr.length>0){tr.remove()}
			$('#delModal').modal('hide')
		}
	})
}
// 后台个页面的分页
function adminPage(item,currentPage,totalPages,url){
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
                return '/admin/'+url+'?p='+page;  
  
            }  
        }  
  
        $(item).bootstrapPaginator(options);  
}


//rideoCheck
function rideoCheck(){
	if(document.getElementById("catId")){
		var catId=$('#catId').attr('class')
		$("#selectCategory").find("input[type='radio']").each(function () {
                    if ($(this).val() == catId) {
                        $(this).attr("checked",true)
                    }
                })
	}else{
		$("#selectCategory input:first").attr("checked",true);  

	}
}
// getAllGenre
function getAllGenre(){ 
	var scope=$('#selectScope').children('option:selected').val();
	console.log(scope)
	var string=''
	 $.ajax({
             type: "GET",
             url: "/admin/getAllGenre",
             data:{scope:scope},
             dataType: "json",
             success: function(data){
             	console.log(data.selectNames)
				for(var i=0;i<data.selectNames.length;i++){
					string=string+'<option  value='+data.selectNames[i].id+'>'+data.selectNames[i].name+'</option>' 
				}
				$('#selectGenre').html(string)
				getAllCategory()
			}
	})
}
function getAllCategory(){ 
	var scope=$('#selectScope').children('option:selected').val();
	var genre=$('#selectGenre').children('option:selected').val();
	var string=''
	 $.ajax({
             type: "GET",
             url: "/admin/getAllCategory",
             data:{scope:scope,genre:genre},
             dataType: "json",
             success: function(data){
             	console.log(data)
             	if(data.selectNames.length>0){
					for(var i=0;i<data.selectNames.length;i++){
						string=string+'<label class="radio-inline"><input type="radio" name="example[category]" value='+data.selectNames[i].id+' >'+data.selectNames[i].name+'</label>' 
					}
				}else{
					string='<small class="text-info">此列表下还没有关键字<small>'
				}
				$('#selectCategory').html(string)
				rideoCheck()

			}
	})
}

// function adminUser(item){ 
// 	var string=''
// 	 $.ajax({
//              type: "POST",
//              url: "/admin/adminUser",
//              dataType: "json",
//              success: function(data){
//              	console.log(data)
//              	if(data.length>0){
// 					for(var i=0;i<data.length;i++){
// 						string=string+'<table class="table table-hover table-bordered"><thead><tr><th>名字</th> <th>时间</th> <th>删除</th></tr></thead><tbody><tr class="item-id-'+data[i]._id+'"><td>'+data[i].name+'</td><td>'+data[i].time+'</td> <td><button class="btn btn-danger del" type="button" data-id="'+data[i]._id+'">删除</button></td></tr></tbody></table>' 
// 					}
// 				}
// 				$(item).html(string)
// 			}
// 	})
// }
