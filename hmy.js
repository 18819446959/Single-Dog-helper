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

	let index = 1;
	 function startMission(){

	 	console.log('开始请求排队...');
	 	console.log('第'+index+'次请求...');
	 	index++;
	 	$.ajax({
	 		type: 'post',
	 		url: 'http://www.hmyhot.com/controller/core',
	        xhrFields: {
	            withCredentials: true
	        },
       		dataType: 'json',
	        crossDomain: true,
	 		data: {
	 			params: "[true,false,true,true,true,2,3000]",
 				server: "buyTaskService",
 				method: "saveTaskByOption",
	 		},
	 		success: function(res){
	 			if(res.code == "success"){
	 				if(res.result.success){
	 					console.log(res);
	 					localStorage.auto == 0;
	 				}else{
	 					console.log(res.result.data);
	 					if(res.result.data == "不要吃着碗里的看着锅里的，您有未完成的任务哦！"){
	 						localStorage.auto == 0;
	 						index = 0;
	 					}

	 					if(localStorage.auto == 1){
	 						console.log("无单,准备重新请求...");
	 						let i = 3;
	 						let waitTime = setInterval(()=>{
	 							console.log("等待"+i+"秒...");
	 							i--;
	 							if(i==0) clearInterval(waitTime);
	 						},1000)
			 				setTimeout(()=>{
			 					startMission();
			 				},4000);
		 				}else{
	 						index = 0;
		 				}
	 				}
	 			}else{
	 				console.log('请求出错...');
	 				location.reload();
	 			}
	 		},
	 		error: function(){
	 			console.log('网络错误，请重试');
	 		}
	 	});
	 }