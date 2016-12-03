/**
 * 
 */

function receiveFromParent(formData, sizeConf, conf){
	var url;
	var html=[];
	var name=[];
	var progress;
	if(conf.type=="File Upload"){
		url="/fileupload"+"?size="+JSON.stringify(sizeConf)+"&conf="+JSON.stringify(conf);
		for(var i=0 ; i<Object.keys(sizeConf).length ;i++){
			
			html[i]="<div class='form-group'><div class='col-sm-4'><label class='control-label col-sm-4' for='bundleName'>"+conf.type +" : " + conf.fileName[i]+"</label></div><div div class='col-sm-8'><div class = 'progress'><div id='"+conf.fileName[i]+"-"+conf.jobName+"' class = 'progress-bar' role = 'progressbar' aria-valuenow = '60' aria-valuemin = '0' aria-valuemax = '100' style = 'width: 0%;'><span class = 'sr-only'>40% Complete</span></div></div></div></div>";
			name[i]=conf.fileName[i]+"-"+conf.jobName;
		}
	}
	else if(conf.type=="Bundle Upload"){
		url="/bundleupload"+"?size="+JSON.stringify(sizeConf)+"&conf="+JSON.stringify(conf);
		for(var i=0 ; i<Object.keys(sizeConf).length ;i++){
			
			html[i]="<div class='form-group'><div class='col-sm-4'><label class='control-label col-sm-4' for='bundleName'>"+conf.type +" : "+ conf.bundleName+"</label></div><div div class='col-sm-8'><div class = 'progress'><div id='"+conf.bundleName+"' class = 'progress-bar' role = 'progressbar' aria-valuenow = '60' aria-valuemin = '0' aria-valuemax = '100' style = 'width: 0%;'><span class = 'sr-only'>40% Complete</span></div></div></div></div>";
			name[i]=conf.bundleName
		}
		
	}
	else{
		url="/exeupload"+"?size="+JSON.stringify(sizeConf)+"&conf="+JSON.stringify(conf);
		for(var i=0 ; i<Object.keys(sizeConf).length ;i++){
			
			html[i]="<div class='form-group'><div class='col-sm-4'><label class='control-label col-sm-4' for='exeName'>"+conf.type +" : "+ conf.exeName+"</label></div><div div class='col-sm-8'><div class = 'progress'><div id='"+conf.exeName+"' class = 'progress-bar' role = 'progressbar' aria-valuenow = '60' aria-valuemin = '0' aria-valuemax = '100' style = 'width: 0%;'><span class = 'sr-only'>40% Complete</span></div></div></div></div>";
			name[i]=conf.exeName
		}
	}
	for(var i=0 ; i<Object.keys(sizeConf).length ;i++){		
	document.getElementById("uploadWin").innerHTML += html[i];
	}
	
	$.ajax({
	    crossOrigin: true,     
	    url: url,
	    type: "POST",
	    processData: false,
	    contentType:false,
	    data: formData,
	    xhr: function() {
	        var xhr = $.ajaxSettings.xhr();
	        xhr.upload.onprogress = function(e) {
	        	progress=document.getElementById(name[0]);
	        	progress.style.width = Math.ceil(e.loaded/e.total*100)  + '%';
	        };
	        return xhr;
	    },
	    success: function(response) {
	        
	    }
	});
}




