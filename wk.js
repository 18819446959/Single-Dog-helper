

	
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
		console.log('提交排队中...');
		$win.find('form').submit();
		setTimeout(()=>{
			console.log('开始检查队列...')
			checkNum();
		},1000);
	}

	function settingsVal(){
		console.log('配置参数...');
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
		return document.cookie.indexOf('WKQuanFinePortalFormsCookieName') >= 0
	}

	function checkNum(){
		$.ajax({
			type: 'post',
	 		url: '/Home/GetQueueAcceptResult',
	 		data: {
	 			t:new Date().getTime()
	 		},
	 		success: function(res){
	 			res =eval('('+res+')');
	 			if(res.QueueCount > 0){
	 				console.log('需要排队人数: ' + res.QueueCount);
	 				setTimeout(()=>{
	 					checkNum();
	 				}, 4000);
	 			}else{
	 				if(res.AcceptResult == 2){
	 					console.log('接手失败...');
	 					if(localStorage.auto == 0){
	 						console.log('设置终止');
	 						return;
	 					}
	 					console.log('准备重新接单...')
	 					setTimeout(()=>{
	 						resetBody();
	 						startMission();
	 					},1000)
	 				}else if(res.AcceptResult ==  1){
	 					console.log('已成功获取任务!!!');
	 					console.log(window.location.origin + "/Task/BrushFTask/BrushAcceptManage");
	 				}
	 			}
	 		},
	 		error: function(){
	 			console.log('网络错误，请重试');
	 		}
		})
	}




	