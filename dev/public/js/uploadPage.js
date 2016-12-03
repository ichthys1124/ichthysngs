/**
 * 
 */
$(document).ready(function(){
	contentChange("bundleUpload")
	contentChange("exeUpload")
//	$("#bundlePage").load("/views/bundleUpload")
//	bundleList();
//	$("#exePage").load("/views/exeUpload")
//	exeList();

	$('#uploadTab a').click(function(e){
		e.preventDefault()
		$(this).tab('show')
	})
	$('#uploadTab a:first').tab('show')
})

