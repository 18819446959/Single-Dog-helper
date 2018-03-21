
function login(){
	document.getElementById("txtLoginName").value = "18819446959";
	document.getElementById("txtPwd").value = "aa123456";
	setTimeout(function(){
		$(".yhdl_2 a").eq(0)[0].click();
	},1000);
}

$(function(){
	login();
});