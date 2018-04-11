

	
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

	let startTime = 0;

	function delTC(){
		var $iframeContent = $('#ow002 iframe');
		if($iframeContent.length <= 0) return;
		$iframeContent[0].onload = function(){
			var $content = $iframeContent.contents();
			$content.find('#ok').removeAttr('disabled')[0].click();
		}
	}

	delTC();


	//克隆内容主要窗体
	let $win;
	let $clone_iframe;
	
	function init(){
		let fm = $('#fm').clone();
		$clone_iframe = $('<iframe/>').appendTo('body');
		$clone_iframe.css("visibility", "hidden");
		$win = $clone_iframe.contents();
		$win.find('body').append(fm);
	}

	init();

	function resetBody(){
		$clone_iframe.remove();
		init();
	}

	function startMission(){
		if(!checkLogin()){
			console.log('请登录后再试');
			return;
		}
		settingsVal();
		queryNum(()=>{
			console.log('提交排队中...');
			$win.find('form').submit();
			resetBody();
			setTimeout(()=>{
				console.log('开始检查队列...')
				checkNum();
			},1000);
		});
	
	}

	function settingsVal(){
		console.log('配置参数...');
		let typeFlag = $win.find('#bInTimeType').length > 0;
		if(localStorage.tb == 0){
			$win.find('#cbTBPlatformTypess').removeAttr("checked");
			if(typeFlag){
				$win.find('#bInTimeType')[0].checked = false;
				$win.find('#aInTimeType')[0].checked = false;
			}
		}else{
			$win.find('#cbTBPlatformTypess').attr("checked","checked");
			if(typeFlag){
				$win.find('#bInTimeType')[0].checked = true;
				$win.find('#aInTimeType')[0].checked = true;
			}
		}

		if(localStorage.jd == 0){
			$win.find('#cbJDPlatformTypess').removeAttr("checked");
		}else{
			$win.find('#cbJDPlatformTypess').attr("checked","checked");
		}

		if(localStorage.TaskPriceEnd){
			$win.find('#TaskPriceEnd').val(localStorage.TaskPriceEnd);
		}
	}

	function checkLogin(){
		console.log('检查登录...')
		return window.location.pathname != '/passport/login.html';
	}

	function queryNum(fn){
		console.log('假装检查下人数...')
		$.ajax({
			type: 'post',
	 		url: '/site/queuenum.html',
	 		data: {
	 		},
	 		timeout: 5500,
	 		success: function(res){
	 			res =eval('('+res+')');
	 			console.log('哇！还有这么人: '+res.quenum);
	 			fn();
	 		},
	 		error: function(){
	 			console.log('接口又TM抽风了...');
	 			console.log('重试中...');
	 			setTimeout(()=>{
 					queryNum(fn);
 				}, 6000);
	 		}
	 	});
	}

	function checkNum(){
		$.ajax({
			type: 'post',
	 		url: '/site/GetQueAcceptRes.html',
	 		timeout: 5500,
	 		success: function(res){
	 			res =eval('('+res+')');
	 			if(res.queueCount > 0){
	 				console.log('需要排队人数: ' + res.queueCount);
	 				setTimeout(()=>{
	 					checkNum();
	 				}, 8000);
	 			}else{
	 				if(res.taskAcceptRes == 'FAILED'){
	 					console.log('接手失败...');
	 					if(localStorage.auto == 0){
	 						console.log('设置终止');
	 						return;
	 					}
	 					console.log('准备重新接单...')
	 					setTimeout(()=>{
	 						startMission();
	 					},1000)
	 				}else if(res.taskAcceptRes ==  'SUCCESS'){
	 					console.log('已成功获取任务!!!');
	 					console.log(window.location.origin + "/Task/BrushFTask/BrushAcceptManage");
	 				}
	 			}
	 		},
	 		error: function(){
	 			console.log('接口又TM抽风了...');
	 			console.log('重试中...');
	 			setTimeout(()=>{
 					checkNum();
 				}, 8000);
	 		}
		})
	}
