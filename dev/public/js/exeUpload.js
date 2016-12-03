/**
 * 
 */

var exeList = function(){
  $.ajax({
    url:'/views/exeList',
    type:'GET',
    success: function(data) {
      $("#exelist").html(data);    
    }
 });
  $('#exeName').focusout(function() {
	    var exeName = $('#exeName').val();
	    if(exeName.length <= 1){
	    	alert("exe name should two or more word")
	    	$("#exeName").val("")
	    }
	    else{
	    	$.ajax({
	    	crossOrigin: true,    
	      	type: 'POST' ,
	      	url: "/exedupcheck" ,
	      	data: {"exeName" : exeName} ,
	      	success: function(e) {          
	    	  if(e === "0") {
	        	} else {
	        	alert("duplicated exe name");
	          	$("#exeName").val("")
	        	}
	      	}               
	    	});
	    }
	  });
//  $("#bundle").change(function(){
//	    
//	})
  $('#upload-exeButton').click(function(){
	  	exeSizeObj[$("#exe").val().replace(/C:\\fakepath\\/i, '')]=document.getElementById("exe").files[0].size;
	    exeConf.type="Exe Upload"
	    exeConf.uId=conf.uId;
	    exeConf.exeName=$("#exeName").val();
		exeConf.description=$("#description").val();
		var formData = new FormData($("#exeForm")[0]);
		var sizeObj=exeSizeObj;
		var obj=exeConf;
		
		if($("#exeName").val().length!=0){
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
			alert("Insert Exe Name!");
		}
		exeConf=new Object();
		exeSizeObj= new Object();
	  });
}
/**
 * 
 */