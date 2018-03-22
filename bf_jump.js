
if($('.take .take-b').length <= 0 || $('.take .btn-box .org').length <= 0){
	setTimeout(()=>{
		window.location.href="/wap/index/index.html";
	},500)
}else{
	localStorage.isSend = 1;
	sendMail();
	abTitle();
}