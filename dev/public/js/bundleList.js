/**
 * 
 */
var cnt =0;
function getBundleTable(count){
//
  var arr = [];
  $.ajax({
    type: 'GET' ,
    url: "/getBundleTable/"+count ,
    crossOrigin: true,
    success: function(e) {
      var a1 = JSON.parse(e);
      var x;
      for( x in a1) {
        var bundleobject = new Object();
        bundleobject.bundleName = a1[x].bundleName;
        bundleobject.description = a1[x].description;
        bundleobject.uId = a1[x].uId;
        arr.push(bundleobject);
      }       
      for(y in arr) {
       if(count==0){
    	   bundleConf.listNum=arr.length;
    	   $("#bundle-list-table").append("<tr id='"+y+"'><td>"+arr[y].bundleName+"</td><td>"+arr[y].description+"</td><td>"+arr[y].uId+"</td><td></td></tr>")
       }
       else {
    	   if(arr.length >0){
    	   $("#bundle-list-table").append("<tr id='"+y+"'><td>"+arr[y].bundleName+"</td><td>"+arr[y].description+"</td><td>"+arr[y].uId+"</td><td></td></tr>")
    	   }   	       		 
       }
      }
      if(count==0){
    	   for(var i = arr.length; i<10; i++){
    		   $("#bundle-list-table").append("<tr id='"+i+"'><td>&nbsp</td><td></td><td></td><td></td>");
    	   }
      }
    }               
  }); 
}
function getBundleSearchTable(flag,value){
	sCheck=1;
	var arr = [];
		$.ajax({
			type: 'GET' ,
		    url: "/getBundleSearchTable?flag="+flag+"&value="+value ,
		    crossOrigin: true,
		    success:function(e){
		    	var a1 = JSON.parse(e);
		        var x;
		        for( x in a1) {
		          var bundleobject = new Object();
		          bundleobject.bundleName = a1[x].bundleName;
		          bundleobject.description = a1[x].description;
		          bundleobject.uId = a1[x].uId;
		          arr.push(bundleobject);
		        } 
		        var y=0;
		        for(y in arr) {
		     	   $("#bundle-list-table").append("<tr id='"+y+"'><td>"+arr[y].bundleName+"</td><td>"+arr[y].description+"</td><td>"+arr[y].uId+"</td><td></td>/tr>")
		     	}
		        if(y<10){
		        	 for(var i = y; i<10; i++){
		        		   $("#bundle-list-table").append("<tr id='"+i+"'><td>&nbsp</td><td></td><td></td><td></td>");		        	    	   
		      	   }
		        }
		    }
		})
}
$(document).ready(function(){
	bundleConf.listNum=0;
	cnt=0;
	getBundleTable(cnt);

	$("#moreButton").click(function(){
		cnt+=10;
		getBundleTable(cnt);	
	})	
	$("#bundleSearchBtn").click(function(){
		$("#moreButton").hide();
		var searchSelect= $("#bundleSearchSelect").val();
		var inp= $("#bundleSearchInp").val();
		cnt=0;
		if(searchSelect=="bundleName"){
			$("#bundle-list-table").empty();
			getBundleSearchTable(1,inp)
		}
		else if(searchSelect=="description"){
			$("#bundle-list-table").empty();
			getBundleSearchTable(2,inp)
		}
		else{
			$("#bundle-list-table").empty();
			getBundleSearchTable(3,inp)
		}		
	})
	$("#initBundleList").click(function(){
		bCheck=0;
		cnt=0;
		$("#bundle-list-table").empty();
		getBundleTable(cnt);
		$("#moreButton").show();
	})
});
