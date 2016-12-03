/**
 * 
 */
var cnt =0;
function getExeTable(count){
//
  var arr = [];
  $.ajax({
    type: 'GET' ,
    url: "/getExeTable/"+count ,
    crossOrigin: true,
    success: function(e) {
      var a1 = JSON.parse(e);
      var x;
      for( x in a1) {
        var exeobject = new Object();
        exeobject.exeName = a1[x].exeName;
        exeobject.description = a1[x].description;
        exeobject.uId = a1[x].uId;
        arr.push(exeobject);
      }       
      for(y in arr) {
       if(count==0){
    	   exeConf.listNum=arr.length;
    	   $("#exe-list-table").append("<tr id='"+y+"'><td>"+arr[y].exeName+"</td><td>"+arr[y].description+"</td><td>"+arr[y].uId+"</td><td></td>/tr>")
       }
       else {
    	   if(arr.length >0){
    	   $("#exe-list-table").append("<tr id='"+y+"'><td>"+arr[y].exeName+"</td><td>"+arr[y].description+"</td><td>"+arr[y].uId+"</td><td></td></tr>")
    	   }   	       		 
       }
      }
      if(count==0){
    	   for(var i = arr.length; i<10; i++){
    		   $("#exe-list-table").append("<tr id='"+i+"'><td>&nbsp</td><td></td><td></td><td></td>");
    	   }
      }
    }               
  }); 
}
function getExeSearchTable(flag,value){
	sCheck=1;
	var arr = [];
		$.ajax({
			type: 'GET' ,
		    url: "/getExeSearchTable?flag="+flag+"&value="+value ,
		    crossOrigin: true,
		    success:function(e){
		    	var a1 = JSON.parse(e);
		        var x;
		        for( x in a1) {
		          var exeobject = new Object();
		          exeobject.exeName = a1[x].exeName;
		          exeobject.description = a1[x].description;
		          exeobject.uId = a1[x].uId;
		          arr.push(exeobject);
		        } 
		        var y=0;
		        for(y in arr) {
		     	   $("#exe-list-table").append("<tr id='"+y+"'><td>"+arr[y].exeName+"</td><td>"+arr[y].description+"</td><td>"+arr[y].uId+"</td><td></td>/tr>")
		     	}
		        if(y<10){
		        	 for(var i = y; i<10; i++){
		        		   $("#exe-list-table").append("<tr id='"+i+"'><td>&nbsp</td><td></td><td></td><td></td>");		        	    	   
		      	   }
		        }
		    }
		})
}
$(document).ready(function(){
	exeConf.listNum=0;
	cnt=0;
	getExeTable(cnt);

	$("#moreButton").click(function(){
		cnt+=10;
		getExeTable(cnt);	
	})	
	$("#exeSearchBtn").click(function(){
		$("#moreButton").hide();
		var searchSelect= $("#exeSearchSelect").val();
		var inp= $("#exeSearchInp").val();
		cnt=0;
		if(searchSelect=="exeName"){
			$("#exe-list-table").empty();
			getExeSearchTable(1,inp)
		}
		else if(searchSelect=="description"){
			$("#exe-list-table").empty();
			getExeSearchTable(2,inp)
		}
		else{
			$("#exe-list-table").empty();
			getExeSearchTable(3,inp)
		}		
	})
	$("#initExeList").click(function(){
		eCheck=0;
		cnt=0;
		$("#exe-list-table").empty();
		getExeTable(cnt);
		$("#moreButton").show();
	})
});
