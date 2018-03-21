
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

	function abTitle(){
		if(localStorage.isTitle == 0) return;
		//获取现有标题
		let title = document.title;

		let hasNew = "【有单啦】";
		let noNew = "【   ---   】";

		let flag = true;

		setInterval(function(){
			if(flag){
				document.title = hasNew + title;
				flag = false;
			}else{
				document.title = noNew + title;
				flag = true;
			}
		},1000)
	}