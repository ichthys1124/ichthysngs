/**flag
 * 
 */
var cnt =0;
function getImageTable(count){

  var arr = [];
  $.ajax({
    type: 'GET' ,
    url: "/getImageTable/"+count ,
    crossOrigin: true,
    success: function(e) {
      var a1 = JSON.parse(e);
      var x;
      for( x in a1) {
        var imageobject = new Object();
        imageobject.pIndex = a1[x].pIndex;
        imageobject.jobName = a1[x].jobName;
        imageobject.jobType = a1[x].jobType;
        imageobject.parentInfo = a1[x].parentInfo;
        imageobject.status = a1[x].status;
        imageobject.date = a1[x].date;
        imageobject.uId = a1[x].uId;
        imageobject.log = a1[x].log;
        imageobject.script=a1[x].script;
        arr.push(imageobject);
      }       
      for(y in arr) {
    	 var image;
    	 var log="";
    	 var datatarget="''";
    	 var script ="";
    	 
        if(arr[y].status=="FileUploading")
          image="label label-fileupload"
        else if (arr[y].status=="FileUploadFail")
          image="label label-fileuploadfail"
        else if (arr[y].status=="Running"){
          image="label label-running"
        }
        else if (arr[y].status=="Pending"){
          image="label label-pending"
        }
        else if (arr[y].status=="Fail"){
          image="label label-fail";
          log=arr[y].log;
          script=arr[y].script;
//          if(count==0)
        	  datatarget="#acc"+arr[y].jobName;
//          else datatarget="#acc"+(count+y);
        }
        else if (arr[y].status=="Success"){ 
          image="label label-success"
        	log=arr[y].log;
          script=arr[y].script;
//          if(count==0)
        	  datatarget="#acc"+arr[y].jobName;
//          else datatarget="#acc"+(count+y);
        }
       else image=""
       if(count==0){
    	   conf.listNum=arr.length;
    	   $('.job-list-table').append("<tr id='"+y+"' data-toggle='collapse' data-target='"+datatarget+"' class='accordion-toggle' name='"+arr[y].jobName+"'><td id='user-id'>"+arr[y].uId+"</td><td>"+arr[y].jobName+"</td><td id='job-type'>"+arr[y].jobType+"</td><td id='status'><span class='"+image+"'>"+arr[y].status+"</span></td><td id='date'>"+arr[y].date+"</td></tr>")
  	   $('.job-list-table').append("<tr><td colspan='5' class='hiddenRow'><div><div class='col-sm-12'><div  name='acc"+y+"' id='acc"+arr[y].jobName+"' class='accodian-body collapse' class='padding'><h3>Shell Script</h3><p id='script'>"+script+"</p><hr><h3>Log Information</h3><p id='log'>"+log+"</p><hr></div></div></div></td></tr>");
       }
       else {
    	   if(arr.length >0){
        	   $('.job-list-table').append("<tr id='"+y+"' data-toggle='collapse' data-target='"+datatarget+"' class='accordion-toggle' name='"+arr[y].jobName+"'><td id='user-id'>"+arr[y].uId+"</td><td>"+arr[y].jobName+"</td><td id='job-type'>"+arr[y].jobType+"</td><td id='status'><span class='"+image+"'>"+arr[y].status+"</span></td><td id='date'>"+arr[y].date+"</td></tr>")
    	   $('.job-list-table').append("<tr><td colspan='5' class='hiddenRow'><div><div class='col-sm-12'><div  name='acc"+(count+y)+"' id='acc"+arr[y].jobName+"' class='accodian-body collapse' class='padding'  ><h3>Shell Script</h3><p id='script'>"+script+"</p><hr><h3>Log Information</h3><p id='log'>"+log+"</p><hr></div></div></div></td></tr>")
    	   }   	       		 
       }
      }
      if(count==0){
    	   for(var i = arr.length; i<10; i++){
    		   $('.job-list-table').append("<tr id='"+i+"' data-toggle='collapse' data-target='' class='accordion-toggle'><td id='user-id'>&nbsp</td><td></td>"
    			         + "<td id='job-type'></td><td id='status'><span></span></td><td id='date'></td></tr>");
        	   $('.job-list-table').append("<tr><td colspan='5' class='hiddenRow'><div><div class='col-sm-12'><div name='acc"+i+"' class='accodian-body collapse' class='padding'><h3>Shell Script</h3><p id='script'>insert shell</p><hr><h3>Log Information</h3><p id='log'>log</p><hr></div></div></div></td></tr>")
    	   }
      }
    }               
  }); 
}
function getSearchTable(flag,value){
	sCheck=1;
	var arr = [];
		$.ajax({
			type: 'GET' ,
		    url: "/getSearchTable?flag="+flag+"&value="+value ,
		    crossOrigin: true,
		    success:function(e){
		    	var a1 = JSON.parse(e);
		        var x;
		        for( x in a1) {
		          var imageobject = new Object();
		          imageobject.pIndex = a1[x].pIndex;
		          imageobject.jobName = a1[x].jobName;
		          imageobject.jobType = a1[x].jobType;
		          imageobject.parentInfo = a1[x].parentInfo;
		          imageobject.status = a1[x].status;
		          imageobject.date = a1[x].date;
		          imageobject.uId = a1[x].uId;
		          imageobject.log = a1[x].log;
		          imageobject.script=a1[x].script;
		          arr.push(imageobject);
		        } 
		        var y=0;
		        for(y in arr) {
		        	 var image;
		        	 var log="";
		        	 var datatarget="''";
		        	 var script ="";
		        	 
		            if(arr[y].status=="FileUploading")
		              image="label label-fileupload"
		            else if (arr[y].status=="FileUploadFail")
		              image="label label-fileuploadfail"
		            else if (arr[y].status=="Running"){
		              image="label label-running"
		            }
		            else if (arr[y].status=="Pending"){
		              image="label label-pending"
		            }
		            else if (arr[y].status=="Fail"){
		              image="label label-fail";
		              log=arr[y].log;
		              script=arr[y].script;
//		              if(count==0)
		            	  datatarget="#acc"+y;
//		              else datatarget="#acc"+(count+y);
		            }
		            else if (arr[y].status=="Success"){ 
		              image="label label-success"
		            	log=arr[y].log;
		              script=arr[y].script;
//		              if(count==0)
		            	  datatarget="#acc"+y;
//		              else datatarget="#acc"+(count+y);
		            }
		           else image=""
		        	   
		       	$('.job-list-table').append("<tr id='"+y+"' name='"+arr[y].jobName+"' data-toggle='collapse' data-target='"+datatarget+"' class='accordion-toggle'><td id='user-id'>"+arr[y].uId+"</td><td>"+arr[y].jobName+"</td>"
		           + "<td id='job-type'>"+arr[y].jobType+"</td><td id='status'><span class='"+image+"'>"+arr[y].status+"</span>"+"</td><td id='date'>"+arr[y].date+"</td></tr>");
		          $('.job-list-table').append("<tr><td colspan='5' class='hiddenRow'><div id='acc"+y+"' class='accodian-body collapse'><div class='col-sm-12'><div class='padding'><h3>Shell Script</h3><p id='script'>"+script+"</p><hr><h3>Log Information</h3><p id='log'>"+log+"</p><hr></div></div></div></td></tr>")
		     	     		      
		         }
		        if(y<10){
		        	 for(var i = y; i<10; i++){
		      		   $('.job-list-table').append("<tr id='"+i+"'><td id='user-id'>&nbsp</td><td></td>"
		      			         + "<td id='job-type'></td><td id='status'><span></span></td><td id='date'></td></tr>");
		      		 $('.job-list-table').append("<tr><td colspan='5' class='hiddenRow'><div id='acc"+i+"' class='accodian-body collapse'><div class='col-sm-12'><div class='padding'><h3>Shell Script</h3><p id='script'></p><hr><h3>Log Information</h3><p id='log'></p><hr></div></div></div></td></tr>")
			     	   
		      	   }
		        }
		    }
		})
}
$(document).ready(function(){
	conf.listNum=0;
	cnt=0;
	getImageTable(cnt);

	$("#searchSelect").change(function(){
		var val= $("#searchSelect").val();
		if(val=="JobName"){
			$("#searchInput").html("<input type='text' id='searchInp' class='form-control' placeholder='Insert jobName...'>");
			
		}

		else if(val=="Status"){
			$("#searchInput").html("<select class='form-control selectpicker' id='searchInp' >"+
                                                      "<option>FileUploading</option>"+
                                                      "<option>FileUploadFail</option>"+
                                                      "<option>Running</option>"+
                                                      		"<option>Pending</option>"+
                                                      		"<option>Success</option>"+
                                                      		"<option>Fail</option></select>");
		}
	});
	$("#moreButton").click(function(){
		cnt+=10;
		getImageTable(cnt);	
	})	
	$("#searchBtn").click(function(){
		$("#moreButton").hide();
		var searchSelect= $("#searchSelect").val();
		var inp= $("#searchInp").val();
		cnt=0;
		if(searchSelect=="JobName"){
			$('.job-list-table').empty();
			getSearchTable(1,inp)
		}
		else{
			$('.job-list-table').empty();
			getSearchTable(2,inp)
		}
	})
	$("#initList").click(function(){
		sCheck=0;
		cnt=0;
		$('.job-list-table').empty();
		getImageTable(cnt);
		$("#moreButton").show();
	})
});
