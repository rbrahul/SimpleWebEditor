(function($){

//////////////GLOBAL SCOPE STARTS//////
var edititem;
var projectDump;
//////////////GLOBAL SCOPE ENDS////////

	$(document).ready(function(){

	$(".rb-show-js-pan").click(function(e){
		$("#rb-css-pan").hide();
		$("#rb-js-pan").show();
		$(".rb-show-css-pan").removeClass('active');
		$(this).addClass('active');
	});

	$(".rb-show-css-pan").click(function(e){
		$("#rb-js-pan").hide();
		$("#rb-css-pan").slideDown(400);
		$(".rb-show-js-pan").removeClass('active');
		$(this).addClass('active');
	});

	
	$(".rb-editor-group-navigation-btn").click(function(){
		$(".rb-editor-group-navigation").fadeToggle(200);
	});
	$(".rb-editor-menu").click(function(event){
		event.preventDefault();
	});
	$(".rb-editor-group-navigation ul li a").click(function(event) {
		/* Act on the event */
		event.preventDefault();
		$(".rb-editor-group-navigation").hide();
	});

	////////// RUN PROGRAM//////////
	$(document).on("click",".rb-editor-code-run",function(e){
		e.preventDefault();
		//alert(55);
			var css=$("#rb-css-pan").val();
			var js=$("#rb-js-pan").val();
			var html=$("#rb-editor-html-field").val();
			$("#rb-editor-style").html(css);
			$("#rb-editor-scripts").remove();
			$('body').append('<script id="rb-editor-scripts">'+js+'</script>');
			$("#rb-editor-output-area").html(html);
		});

	$(window).on("load resize",function(){
rbloadAllProjects();

		var width=$(window).innerWidth();
		var height=$(document).innerHeight();
		var winheight=$(window).innerHeight();
		var modalWidth=$(".rb-editor-modal").innerWidth();
		var modalHeight=$(".rb-editor-modal").innerHeight();
		var alertWidth=$("#rb-editor-alert").innerWidth();
		var leftOfset=(width/2)-(modalWidth/2);
		var alertLeftOfset=(width/2)-(alertWidth/2);
		var topOfset=(winheight/2)-(modalHeight/2)-100;
		//console.log(width+"  "+height);
		$(".rb-editor-modal-holder").css({"height":height+"px"});
		$(".rb-editor-modal").css({"left":leftOfset+"px","top":topOfset+"px"});
		$("#rb-editor-alert").css({"left":alertLeftOfset+"px"});
	});

	///////////modal close/////////////
	$(".rb-modal-closer").click(function(){
		$(".rb-editor-modal-holder").hide();
	});
	/////// show snippet modal/////////
	$(".rb-editor-save-snipset").click(function(){
		$("#save-snipet-modal").show();
	});
	/////// show snippet modal/////////
	$(".rb-editor-all-snipset").click(function(){
		rbloadAllProjects();
		$("#rb-project-snipet-modal").show();
	});
	/////////////show setting///////
	$(".rb-editor-setting").click(function(){
		generateJSON();
		$("#rb-setting-modal").show();
	});

	//////////////// save snippet//////
	$("#save-snippet-btn").click(function(){
		var projectName=$.trim($("#rb-editor-project-name").val());
		var project={};
		var pat=/[a-zA-Z0-9]/;
		if(projectName==""||pat.test(projectName)==false){
			$("#rb-editor-project-name").next('.rb-error-msg').show();
		}else{
			$("#rb-editor-project-name").next('.rb-error-msg').hide();
			project.name=projectName;
			project.css=$("#rb-css-pan").val();
			project.js=$("#rb-js-pan").val();
			project.html=$("#rb-editor-html-field").val();
			project.date=new Date().toString();
			if(localStorage.getItem('rb-editor')!=null){
				var oldData=localStorage.getItem('rb-editor').toString();
				var dataLength=localStorage.getItem('rb-editor').toString().length;
				var newdata=oldData.substring(0,dataLength-1);
				localStorage.setItem('rb-editor',newdata+","+JSON.stringify(project)+']');
			}else{
				localStorage.setItem('rb-editor','['+JSON.stringify(project)+']');
			}
			$("#rb-editor-project-name").val('');
			$(".rb-editor-modal-holder").hide();
		rbShowAlert('Your project has been saved successfully.');

		}
	});
	
	/////////////////USE PROJECT//////////
	$(document).on("click",".rb-project-description",function(e){
		rbGetSpecificProject($(this).parent().data('rbitem'));
		edititem=$(this).parent().data('rbitem');
		$(".rb-editor-code-update").show();
	});	

	/////////////////DELETE PROJECT//////////
	$(document).on("click",".rb-delete-project",function(e){
		var projectStr=localStorage.getItem('rb-editor');
		var projectObj=JSON.parse(projectStr);
		delete projectObj[$(this).data('rbitem')];
		localStorage.removeItem('rb-editor');
		localStorage.setItem('rb-editor',JSON.stringify(projectObj));
		//alert(JSON.stringify(projectObj));
		rbloadAllProjects();
		resetingAllField();
		rbShowAlert('Your project has been deleted successfully.');
		//$(".rb-editor-modal-holder").hide();
	});

	/////////////////EDIT PROJECT//////////
	
	$(document).on("click",".rb-edit-project",function(e){
		rbGetSpecificProject($(this).data('rbitem'));
		$(".rb-editor-code-update").show();
		$(".rb-editor-modal-holder").hide();
		edititem=$(this).data('rbitem');
	});

	/////////////////UPDATE PROJECT//////////
	$(document).on("click",".rb-editor-code-update",function(e){
		//$(".rb-editor-code-update").hide();
		var projectStr=localStorage.getItem('rb-editor');
		var projectObj=JSON.parse(projectStr);
		projectObj[edititem].css=$("#rb-css-pan").val();
		projectObj[edititem].js=$("#rb-js-pan").val();
		projectObj[edititem].html=$("#rb-editor-html-field").val();
		localStorage.removeItem('rb-editor');
		localStorage.setItem('rb-editor',JSON.stringify(projectObj));
		//$(".rb-editor-code-update").hide();
		rbloadAllProjects();
		rbShowAlert('Your project has been updated successfully.');
	});
/////////////////////RB TAB SECTION//////////////
	$(".rb-tab-menu-item").click(function(e){
		e.preventDefault();
		$(".rb-tab-menu-item").removeClass('active');
		$(this).addClass('active');
		var tabPanId=$(this).data('panid');
		$(".rb-tab-pan").removeClass('active');
		$(tabPanId).addClass('active');
	});
///////////////EXPORTING FILE BUTTON////////////
$("#rb-editor-export-btn").click(function(e){
	e.preventDefault();
	var data=localStorage.getItem('rb-editor');
	alert(data);

	$("#rb-setting-modal").hide();
	rbShowAlert('Your projects has been exported successfully.');
});
///////////////IMPORTING FILE BUTTON////////////
$("#rb-editor-import-btn").click(function(){

	var readers=new FileReader();
	readers.onload=function(e){
	var texts=e.target.result;
	localStorage.removeItem('rb-editor');
	localStorage.setItem('rb-editor',texts);
	//alert(texts);
	//document.getElementById("file-output").innerHTML=texts;
	};
	rbloadAllProjects();
	readers.readAsText(document.getElementById('rb-editor-import-file').files[0]);
	$(".rb-editor-modal-holder").hide();
	rbShowAlert('All projects have been imported successfully.');
	});
});//jquery ends here

///////////////////functions//////////

///////////////load all project of history////////////
function rbloadAllProjects(){
	var projectStr=localStorage.getItem('rb-editor');
	var projectObj=JSON.parse(projectStr);
	var nodeStr="";
var months=['January','February','March','April','May','June','July','August','September','October','November','December'];	
var numberOfProject=0;
	for(var index in projectObj){
		if(projectObj[index]!=null){
	//console.log(projectObj[index]);
		var date=new Date(projectObj[index].date);
	nodeStr+='<div class="rb-project-item rb-col-12" data-rbitem="'+index+'" >'+
		'<div class=" rb-col8 rb-project-description">'+
		'<p class="rb-project-title">'+projectObj[index].name+'</p>'+
		'<span class="rb-project-date">'+date.getDate()+' '+months[date.getMonth()]+', '+date.getFullYear()+'</span></div><!-- rb-project-description -->'+
		'<div class=" rb-col4 rb-project-action-area"><div class="rb-right"><a class="rb-sm-btn rb-edit-project" data-rbitem="'+index+'">Edit</a>'+
			'<a class="rb-sm-btn rb-delete-project" data-rbitem="'+index+'">Delete</a></div></div><!-- rb-project-action-area --><div class="rb-clear"></div></div><!-- rb-project-item -->';
numberOfProject++;
}//not null

}//end for
if(numberOfProject==0)
nodeStr="<p class='rb-error-msg' style='display:block;float:none;text-align:center;font-size:13px;'>Sorry, you don't have any project.</p>"
$("#snipset-total").html(numberOfProject);
$("#rb-project-list").html(nodeStr);
}

//////////////////////get Specifig project///////////////
function rbGetSpecificProject(id){
	var projectStr=localStorage.getItem('rb-editor');
	var projectObj=JSON.parse(projectStr);
	$("#rb-css-pan").val(projectObj[id].css);
	$("#rb-js-pan").val(projectObj[id].js);
	$("#rb-editor-html-field").val(projectObj[id].html);
	$(".rb-editor-modal-holder").hide();
}
/////////////////SHOW ALERT//////////////
function rbShowAlert(message){
	$(".rb-alert-title").text(message);
	$("#rb-editor-alert").fadeIn(200).delay(3000).fadeOut(300);
}
//////////////RESESTING ALL FIELD//////////

function resetingAllField(){
	$("#rb-css-pan").val('');
	$("#rb-js-pan").val('');
	$("#rb-editor-html-field").val('');
	edititem="";
	$(".rb-editor-code-update").hide();
}

////////////////// EXPORT ALL PROJECT AS TEXT FILE////

function generateJSON(){
	var data="text/json;charset=utf-8,"+encodeURIComponent(localStorage.getItem('rb-editor'));
 var dom='<a class="rb-btn-success rb-right" href="data:'+data+'" download="projects.json" id="rb-editor-export-btn">Export</a>';
		$("#export-container").find("a").remove("a");
		$("#export-container").append(dom);

}

})(jQuery);