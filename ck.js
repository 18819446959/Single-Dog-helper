	

	const initLocalStorage = [
		{
			name: 'auto',
			value: 0
		},
		{
			name: 'tb',
			value: 1
		},
		{
			name: 'jd',
			value: 1
		},
		{
			name: 'isMail',
			value: 0
		},
		{
			name: 'isTitle',
			value: 1
		},
		{
			name: 'mailtype',
			value: 0
		},
		{
			name: 'isSend',
			value: 0
		},
		{
			name: 'TaskPriceEnd',
			value: ''
		}
	];

	let token = sessionStorage.getItem('rootscope-token');
	let user = sessionStorage.getItem('rootscope-user');

	user = JSON.parse(user);

	let time;

	 function startMission(){
	 	if(checkToken()){
	 		console.log('请登录');
	 		return;
	 	}
	 	console.log('开始请求排队...');
	 	$.ajax({
	 		type: 'post',
	 		url: 'http://api.chuangkquan.com/api/brushuser/matchMask',
	        xhrFields: {
	            withCredentials: true
	        },
       		dataType: 'json',
	        crossDomain: true,
	 		data: {
	 			type: 1,
 				masktype: 0,
 				userid: user.userid,
 				token: user.token
	 		},
	 		success: function(res){
	 			console.log('需要排队人数: ' + res.resultObj.queueOrder);
	 			console.log('开始检查队列...');
	 			time = setInterval(()=>{
	 				queryMission(res.resultObj.applyid);
	 			},3000);
	 		},
	 		error: function(){
	 			console.log('网络错误，请重试');
	 			clearInterval(time);
	 		}
	 	})
	 }

	 function queryMission(applyid){
	 	$.ajax({
	 		type: 'post',
	 		url: 'http://api.chuangkquan.com/api/brushuser/queyrMatchResult',
	        xhrFields: {
	            withCredentials: true
	        },
       		dataType: 'json',
	        crossDomain: true,
	 		data: {
	 			applyid: applyid,
 				userid: user.userid,
 				token: user.token
	 		},
	 		success: function(res){
	 			if(res.resultObj.applystatus == 2){
	 				clearInterval(time);
	 				console.log('暂时无单: ' + res.resultObj.applymsg);
	 				console.log('准备重新请求排队...');
	 				if(localStorage.auto == 1){
		 				setTimeout(()=>{
		 					startMission();
		 				},1500);
	 				}else{
	 					console.log("设置: 停止接单...");
	 				}
	 			}else if(res.resultObj.applystatus == 0){
	 				console.log('剩余排队人数: ' + res.resultObj.queueOrder);
	 			}else if(res.resultObj.applystatus == 1){
	 				clearInterval(time);
	 				console.log('获得订单: ' + res.resultObj.taskid);
	 				console.log('完成订单后，请重新点击开始!');
	 				localStorage.auto == 0;
	 				sendMail();
	 				abTitle();
	 			}
	 		},
	 		error: function(){
	 			console.log('网络错误，请重试');
	 			clearInterval(time);
	 		}
	 	})
	 }

	 function checkToken(){
	 	console.log('检查登录...')
	 	return token == null || user == null;
	 }
