/**
 * 
 */
var conf = new Object();

var fileConf = new Object();
var bundleConf =new Object();
var exeConf=new Object();

var sizeObj = new Object();
var bundleSizeObj = new Object();
var exeSizeObj = new Object();



var uploadWin = null;
var sCheck=0;
var bCheck=0;
var eCheck=0;
function contentChange(content){
  $.ajax({
    url:'/views/'+content,
    type:'GET',
    crossOrigin: true,
   
    success: function(data) {
    	if(content=="bundleUpload"){
    		$("#bundlePage").html(data);
    		bundleList();
    	}
    	else if(content=="exeUpload"){
    		$("#exePage").html(data);
    		exeList();
    	}
    	else{
    		$("#content").html(data);
    		if(content=="jobCreate"){
    	    	  jobList();
    	      }
    	}
    	//if("#contetn").html(data);
    	
//      $("#content").html(data);
//      if(content=="jobCreate"){
//    	  jobList();
//      }
//      else if(content=="bundleUpload"){
//    	  bundleList();
//      }
        	
    }
 });
}

////////////////websocket//////////////
var websocket=null;
var uri=""
function wsConnect() {
  websocketcallback("ws://"+uri+":9001/websocket");  
}
function websocketcallback(wsUri) {
  
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {
  doSend(conf.uId);
}

function onClose(evt) {

}

function onMessage(evt)
{
	
	 
  var wsJson = JSON.parse(evt.data);
  var data= wsJson.data;
  var image;
  if(wsJson.status=="FileUploading"){
    image="label label-fileupload";    
  }
  else if (wsJson.status=="FileUploadFail"){
    image="label label-fileuploadfail";
  }
  else if (wsJson.status=="Running"){
    image="label label-running";    
    if(data!="null"){
    	$("#acc"+wsJson.jobName+" #script").html(data);
    }
  }
  else if (wsJson.status=="Pending"){
    image="label label-pending";
    if(data!="null"){
    	$("#acc"+wsJson.jobName+" #script").html(data);
    }
  }
  else if (wsJson.status=="Fail"){
    image="label label-fail"
    	if(data!="null"){
    		$("tr[name='"+wsJson.jobName+"']").attr("data-target","#acc"+wsJson.jobName);
        	$("#acc"+wsJson.jobName+" #log").html(data);
    	}
  }
  else if (wsJson.status=="Success"){
    image="label label-success"
    	if(data!="null"){
    		$("tr[name='"+wsJson.jobName+"']").attr("data-target","#acc"+wsJson.jobName);
        	$("#acc"+wsJson.jobName+" #log").html(data);
    	}
  }
  else{ 
      image=""
  }
  $("tr[name='"+wsJson.jobName+"'] #status").html("<span class='"+image+"'>"+wsJson.status+"</span>");  
}

function onError(evt) {
}

function doSend(message) {
  websocket.send(message);
}


$(document).ready(function(){
  //////////////////////////retrieve default db value (ip...)///////////
  $.ajax({
    url:'/getDefault',
    type:'GET',
    crossOrigin: true,   
    success: function(data) {
      conf.uri=data;
      uri=data;
      wsConnect();
    }
  });
  conf.type="File Upload"
  conf.uId=$("#uId").val();
  

  
  
  contentChange("jobCreate");
  
  
  if(window.closed){
	  alert("closed");
	  uploadWin=null;
  }
});