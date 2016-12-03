/**
 * 
 */
var dialogInstance1 =null;

var jobList = function(){
  var validation;
  var cnt =0;
  
  $.ajax({
    url:'/views/jobList',
    type:'GET',
    success: function(data) {
      $("#list").html(data);    
    }
 });
//  $('#parentInfodiv').hide();
  $('#jobName').focusout(function() {
    var jobname = $('#jobName').val();
    if(jobname.length <= 1){
    	alert("job name should two or more word")
    	$("#jobName").val("")
    }
    else{
    	$.ajax({
    	crossOrigin: true,    
      	type: 'POST' ,
      	url: "/jobnamedupcheck" ,
      	data: {"jobName" : jobname} ,
      	success: function(e) {          
    	  if(e === "0") {
        	} else {
        	alert("duplicated job name");
          	$("#jobName").val("")
        	}
      	}               
    	});
    }
  });
//  $('#jobType').change(function(){
//    var jobproperty = $('#jobType').val();
//    if(jobproperty=='Child'){
//      $('#parentInfodiv').show();
//    }
//    else{$('#parentInfodiv').hide();}
//  });
  $("#jobName").bind("keyup",function(){
	  re = /[~!@\#$%^&*\()\=+;'":?><']/gi; 
	  var temp=$("#jobName").val();
	  if(re.test(temp)){ //특수문자가 포함되면 삭제하여 값으로 다시셋팅
	  $("#jobName").val(temp.replace(re,"")); } });
  
 $('#create-button').click(function(){
	if($("#jobName").val().length!=0){
		fileConf.type="File Upload"
		fileConf.uId=conf.uId;
		fileConf.uri=conf.uri;
		fileConf.jobName=$("#jobName").val();
   		fileConf.jobType=$("#jobType").val();
   		fileConf.parentInfo=$("#parentInfo").val();
   		fileConf.cpu=$("#cpu").val();
   		fileConf.mem=$("#mem").val();
   
    	dialogInstance1 = new BootstrapDialog({
    	modal : false,
    	draggable : true,
    	animate : false,
    //	message : $('<div></div>').load('views/pipeline'),
    	message : $('<div></div>').load('views/message')
    	});
    	$("#jobName").val("");
    	//$("#parentInfo").val("")
    	
    	///////////////////////
//    	win = window.open("views/message","fileupload");
    	dialogInstance1.open();
	}
	else{
		alert("Insert Job Name!");
	}
  });
}

//$(document).ready(jobNameValidation);