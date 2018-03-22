

	
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

	function initStorage(){
		delTC();
		for(let item of initLocalStorage){
			if(localStorage.getItem(item.name) == undefined){
				localStorage.setItem(item.name, item.value);
			}
		}
	}

	function delTC(){
		var $iframeContent = $('#ow002 iframe');
		if($iframeContent.length <= 0) return;
		$iframeContent[0].onload = function(){
			var $content = $iframeContent.contents();
			$content.find('#ok').removeAttr('disabled')[0].click();
		}
	}

	function waitmission(){

		let time;
		time = setInterval(function(){

			if($("#hTask2").html() == "接手失败！"){
				clearInterval(time);
				//关闭弹窗
				$('.sjzc_t a')[0].click();
				//重新接单
				setTimeout(function(){
					$('.btn_fail a').eq(0)[0].click();
				},1000);
			}

			if($("#hTask2").html() == "恭喜你"){
				clearInterval(time);
				localStorage.isSend = 1;
				$('.cpmenulist li').eq(1).find('a')[0].click();
				//bTitle();
				//sendMail();
			}

		},500);

	}

	function startMission(){
		//Start Msiision
		if($('#ban1').length > 0 && !$('#ban1').is(":hidden")){
			var typeFlag = $('#bInTimeType').length > 0;
			setTimeout(function(){
				if(localStorage.auto == 1){
					if(localStorage.tb == 0){
						$('#cbTBPlatformTypess').removeAttr("checked");
						$('#cbTBPlatformTypess').parent().removeClass("selected");
						if(typeFlag){
							$('#bInTimeType')[0].checked = false;
							$('#aInTimeType')[0].checked = false;
						}
					}else{
						$('#cbTBPlatformTypess').attr("checked","checked");
						$('#cbTBPlatformTypess').parent().addClass("selected");
						if(typeFlag){
							$('#bInTimeType')[0].checked = true;
							$('#aInTimeType')[0].checked = true;
						}
					}

					if(localStorage.jd == 0){
						$('#cbJDPlatformTypess').removeAttr("checked");
						$('#cbJDPlatformTypess').parent().removeClass("selected");
					}else{
						$('#cbJDPlatformTypess').attr("checked","checked");
						$('#cbJDPlatformTypess').parent().addClass("selected");
					}

					if(localStorage.TaskPriceEnd){
						$('#TaskPriceEnd').val(localStorage.TaskPriceEnd);
					}
				}
				$(".actionan a").eq(0)[0].click();

				var timeConfirm = setInterval(function(){
					//等待回调弹窗
					if($('#ow_confirm002').length > 0){
						$('#ow_confirm002_fun')[0].click();
					}
				},500);
			},1000)
		}

		if($('#ban2').length > 0 && !$('#ban2').is(":hidden")){
			console.log("waitmission");
			waitmission();
		}
	}

	function sendMail(){
		if(!localStorage.mail && localStorage.isMail == 0) return;
		var mailText = localStorage.mailtype == 0 ? "@126.com" : "@qq.com";
		$.ajax({
			url: 'https://api.77lemon.top/SendMail.htm',
			type: 'post',
			data:{
				mail: localStorage.mail + mailText,
				key: localStorage.ukey,
				password: localStorage.password || '',
				type: localStorage.mailtype
			},
			success:function(res){
				res = JSON.parse(res);
				if(res.status == 0){
					alert("发送通知邮件至" + localStorage.mail + mailText)
				}else{
					alert("发送失败!")
				}
			}
		});
	}

	//localStorage.auto
	//localStorage.tb
	//localStorage.jd

	if(localStorage.auto == 1){
		startMission()
	}

	let handleArray = ["auto", "tb", "jd", "isTitle", "isMail"];

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
	{

	    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
	    if(request.cmd == 'mail'){
	    	if(request.value != ''){
		    	localStorage.mail = request.value.mail;
		    	localStorage.password = request.value.password;
		    	localStorage.mailtype = request.value.mailtype;
		    	localStorage.ukey = request.value.key;
		    	localStorage.TaskPriceEnd = request.value.TaskPriceEnd;
	    	}else{
		    	localStorage.mail = '';
		    	localStorage.ukey = '';
		    	localStorage.mailtype = '';
		    	localStorage.password = '';
		    	localStorage.TaskPriceEnd = '';
    		}
	    	sendResponse('200');
	    	return;
	    }
	    if(request.cmd == 'GET'){
	    	var local = {
	    		auto: localStorage.auto,
	    		tb: localStorage.tb,
	    		jd: localStorage.jd,
	    		mail: localStorage.mail,
	    		key: localStorage.ukey,
	    		isMail: localStorage.isMail,
	    		isTitle: localStorage.isTitle,
	    		mailtype: localStorage.mailtype,
	    		password: localStorage.password,
		    	TaskPriceEnd: localStorage.TaskPriceEnd
	    	}
	    	sendResponse(local);
	    	return;
	    }
	    if(request.cmd == 'SendTest'){
	    	sendMail();
	    	sendResponse("200");
	    	return;
	    }
	    handleMessage(request, sendResponse);
	});

	function handleMessage(request, sendResponse){
		let message = request.cmd;
		if(message == undefined) return;
		if(handleArray.indexOf(message) > -1){
			if(request.value == 1){
				if(handleArray.indexOf(message) == 0){
		    		startMission();
				}
		    	localStorage.setItem(message, 1);
	    	}else{
		    	localStorage.setItem(message, 0);
    		}
	    	sendResponse('200');
	    	return;
		}
	}

	//初始化缓存
	initStorage();