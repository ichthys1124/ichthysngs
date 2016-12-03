/**
 * 
 */

$(document).ready(function(){
  var check =0;
  var filename=[];
  $("#file2").hide()
  $("#inputdata2").hide()
  
  $("#mode").change(function(){
     if($("#mode").val()=="Pair"){
       check=1;
       $("#file2").show()
       $("#inputdata2").show()              
     }
     else{
       check=0;
       $("#file2").hide()
       $("#inputdata2").hide()
     }
  });
  
  $("#file").change(function(){
//	conf.fileName[0] =$("#file").val().replace(/C:\\fakepath\\/i, '');
	  filename[0] =$("#file").val().replace(/C:\\fakepath\\/i, '');
//	alert(conf.fileName[0]);
    sizeObj[$("#file").val().replace(/C:\\fakepath\\/i, '')]=document.getElementById("file").files[0].size;
  })
  $("#file2").change(function(){
//	conf.fileName[1] =$("#file2").val().replace(/C:\\fakepath\\/i, '');
	  filename[1] =$("#file2").val().replace(/C:\\fakepath\\/i, '');
    sizeObj[$("#file2").val().replace(/C:\\fakepath\\/i, '')]=document.getElementById("file2").files[0].size;
  })
  
  
  $("#finish-button").click(function(){
	  var listNum=conf.listNum;
	  fileConf.pipeline=$("#textbox").val();
	  //
	  fileConf.fileName=filename;
	  //
	  
	  if(sCheck==0){
//      $("#pipeline").attr("value",$("#textbox").val())
		  if(conf.listNum<10){
    	  var td= "<td id='user-id'>"+fileConf.uId+"</td><td>"+fileConf.jobName+"</td><td id='job-type'>"+"Normal"+"</td><td id='status'><span class='label label-fileupload'>FileUploading</span></td><td id='date'>"+"??"+"</td></tr></tr>"; 	  
    	 	$('.job-list-table'+" #"+(listNum)).attr("name",fileConf.jobName);
    	 	$("div[name=acc"+conf.listNum+"]").attr("id","acc"+fileConf.jobName);
    	 	$("#"+listNum).html(td);
        	conf.listNum+=1;
      	}
      	else if (conf.listNum>=10){
     	 	$('.job-list-table').append("<tr id='"+conf.listNum+"' name='"+fileConf.jobName+"' data-toggle='collapse' data-target='' class='accordion-toggle'><td id='user-id'>"+conf.uId+"</td><td id='job-name'>"+conf.jobName+"</td>"
     			+ "<td id='job-type'>"+"Normal"+"</td><td id='status'><span class='label label-fileupload'>FileUploading</span></td><td id='date'>"+"??"+"</td></tr>");
     	 	$('.job-list-table').append("<tr><td colspan='5' class='hiddenRow'><div><div class='col-sm-12'><div id='acc"+fileConf.jobName+"' name='acc"+conf.listNum+"' class='accodian-body collapse' class='padding'><h3>Shell Script</h3><p id='script'>insert shell</p><hr><h3>Log Information</h3><p id='log'>log</p><hr></div></div></div></td></tr>")
     	 	conf.listNum+=1;     	 
      	}
	  }
    if(check==0){
      $("#file2").remove();
      delete fileConf.fileName[1];
      //conf.fileName2 =null;
    }
    var formData = new FormData($("#fileForm")[0]);
    var size=sizeObj;
    var obj = fileConf;
    
    dialogInstance1.close();
    dialogInstance1=null;
    
    if(uploadWin==null){
		uploadWin = window.open("views/uploadWindow","Upload Window");				
		uploadWin.onload= function(){				
			uploadWin.receiveFromParent(formData,size,obj);
    	}
	}
	else{
		uploadWin.focus();
		alert("Check upload window!")
		uploadWin.receiveFromParent(formData,sizeObj,obj);				
	}
    sizeObj=new Object;
    fileConf=new Object;
//    $.ajax({
//      type:"post",
//      crossOrigin: true,     
//      url: "/fileupload"+"?size="+JSON.stringify(sizeObj)+"&conf="+JSON.stringify(conf),
//      processData: false,
//      contentType:false,
//      data: formData,
//      success : function(data) {
//      },
//      error : function(err) {
//      }    
//    })
  })

});