/**
 * 
 */

var bundleList = function(){
  $.ajax({
    url:'/views/bundleList',
    type:'GET',
    success: function(data) {
      $("#bundlelist").html(data);    
    }
 });
  $('#bundleName').focusout(function() {
	    var bundleName = $('#bundleName').val();
	    if(bundleName.length <= 1){
	    	alert("bundle name should two or more word")
	    	$("#bundleName").val("")
	    }
	    else{
	    	$.ajax({
	    	crossOrigin: true,    
	      	type: 'POST' ,
	      	url: "/bundledupcheck" ,
	      	data: {"bundleName" : bundleName} ,
	      	success: function(e) {          
	    	  if(e === "0") {
	    	  }else {
	        	alert("duplicated bundle name");
	          	$("#bundleName").val("")
	        	}
	      	}               
	    	});
	    }
	  });
//  $("#bundle").change(function(){
//	    
//	})
  $('#upload-button').click(function(){
	  	bundleSizeObj[$("#bundle").val().replace(/C:\\fakepath\\/i, '')]=document.getElementById("bundle").files[0].size;
	    bundleConf.type="Bundle Upload";
	    bundleConf.uId=conf.uId;
	  	bundleConf.bundleName=$("#bundleName").val();
		bundleConf.description=$("#description").val();
		var formData = new FormData($("#bundleForm")[0]);
		var sizeObj=bundleSizeObj;
		var obj=bundleConf;
		
		if($("#bundleName").val().length!=0){
			if(uploadWin==null){
				uploadWin = window.open("views/uploadWindow","Upload Window");				
				uploadWin.onload= function(){				
					uploadWin.receiveFromParent(formData,sizeObj,obj);
		    	}
			}
			else{
				uploadWin.focus();
				alert("Check upload window!")
				uploadWin.receiveFromParent(formData,sizeObj,obj);				
			}
	    	
		}
		else{
			alert("Insert Bundle Name!");
		}
		bundleConf=new Object();
		bundleSizeObj=new Object();
	  });
}
