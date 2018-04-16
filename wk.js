

	
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

	let Check = {
		isCheck: false,
		getCheck: ()=>{
			if(!this.isCheck){
				console.log('检查登录...')
				this.isCheck = localStorage.WKQuanFinePortalFormsCookieName != '' && document.cookie.indexOf('MianNv') >= 0;
			}
			return this.isCheck;
		}
	}

	function startMission(){
		if(!Check.getCheck()){
			console.log('请登录后再试');
			return;
		}
		settingsVal();
		console.log('提交排队中...');
		$win.find('form').submit();
		let checkTime = setTimeout(()=>{
			console.log('开始检查队列...')
			resetBody();
		},1000);
		setTimeout(()=>{
			checkNum();
		},4000)
	}

	function settingsVal(){
		console.log('配置参数...');
		let typeFlag = $win.find('#bInTimeType').length > 0;

		$win.find("#FineTaskClassType").val('销量任务');
		
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
	 				let checkTime = setTimeout(()=>{
	 					checkNum();
	 				}, 4000);
	 			}else{
	 				if(res.AcceptResult == 2){
	 					console.log(res.remark);
	 					console.log('接手失败...');
	 					if(localStorage.auto == 0){
	 						console.log('设置终止');
	 						return;
	 					}
	 					console.log('准备重新接单...')
	 					clearList();
	 					let reTime = setTimeout(()=>{
	 						startMission();
	 					},3000)
	 				}else if(res.AcceptResult ==  1){
	 					console.log('已成功获取任务!!!');
	 					console.log(window.location.origin + "/Task/BrushFTask/BrushAcceptManage");
	 					sendMail();
	 					abTitle();
	 					localStorage.auto = 0;
	 				}else{
	 					console.log('查询失败,重试中...')
	 					let reTime = setTimeout(()=>{
	 						startMission();
	 					},1000)
	 				}
	 			}
	 		},
	 		error: function(){
	 			console.log('网络错误，重试中...');
	 			let reTime = setTimeout(()=>{
					startMission();
				},1000)
	 		}
		})
	}

	function clearList(){
		console.log('假装访问首页...');
		let $indexiframe = $('<iframe src="/"/>').appendTo('body');
		$indexiframe.css("visibility", "hidden");
		setTimeout(()=>{
			$indexiframe.remove();
		}, 500);
	}