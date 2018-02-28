

	//初始化状态列表
	//type： 1-> Checkbox
    //		 2-> Input
    //		 3-> Button
	let localStorageList = [
		{
			name: "auto",
			dom: "btn",
			type: 3,
			status: 0
		},
		{
			name: "tb",
			dom: "tb",
			type: 1,
			status: 1
		},
		{
			name: "jd",
			dom: "jd",
			type: 1,
			status: 1
		},
		{
			name: "mail",
			dom: "Mail",
			type: 2,
			status: ''
		},
		{
			name: "password",
			dom: "Password",
			type: 2,
			status: ''
		},
		{
			name: "isMail",
			dom: "isMail",
			type: 1,
			status: 0
		},
		{
			name: "isTitle",
			dom: "isTitle",
			type: 1,
			status: 1
		},
		{
			name: "mailtype",
			dom: "Mailtype",
			type: 2,
			status: 1
		}
	];

	function handleInputChange(){
		localStorage.mail = $('#Mail').val();
		localStorage.ukey = $('#key').val();
		localStorage.password = $("#Password").val();
		localStorage.mailtype = $("#Mailtype").val();
		sendMessage('mail', {
			mail: localStorage.mail,
			password: localStorage.password,
			mailtype: localStorage.mailtype,
			key: localStorage.ukey
		});
	}

	function handleChange(name, flag){
		sendMessage(name, flag? 1 : 0);
	}

	//通信方法
	function sendMessageToContentScript(message, callback){
	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	    {
	        chrome.tabs.sendMessage(tabs[0].id, message, function(response)
	        {
	            if(callback) callback(response);
	        });
	    });
	}

	function sendMessage(cmd, flag){
		sendMessageToContentScript({cmd:cmd, value:flag}, function(response){
		    console.log(response);
		});
	}

	function initSetting(){
		sendMessageToContentScript({cmd: 'GET'}, function(response){

			console.log(response)
			if(response == undefined) return;

			for(let item of localStorageList){

				//设置状态
				localStorage.setItem(item.name, response[item.name] || item.status);
				//处理事件
				handleEven(item.name, item.type, item.dom);
			}
		});
	}

	function handleEven(name, type, dom){
		
		switch(type){
			case 1:
				$("#" + dom)[0].checked = localStorage.getItem(name) == 1;
				break;
			case 2: 
				$('#' + dom).val(localStorage.getItem(name) || "");
				break;
			case 3: 
				$("#" + dom).val(localStorage.getItem(name) == 1 ? "停止":'开始')
				break;
		}

	}

	//获取页面缓存
	initSetting();

	$('.container').on('click', 'input[type=checkbox]', function(){
		var name = $(this).attr("name");
		var flag = $(this)[0].checked;
		handleChange(name, flag);
	});

	$('.container').on('input propertychange', 'input[type=text]',{handleInputChange: handleInputChange} ,function(event){
		event.data.handleInputChange();
	});

	$('.container').on('input propertychange', 'input[type=password]',{handleInputChange: handleInputChange} ,function(event){
		event.data.handleInputChange();
	});

	$('.container').on('change', 'select',{handleInputChange: handleInputChange} ,function(event){
		event.data.handleInputChange();
	});

	$('#btn').click(function(){
		var flag = localStorage.auto;
		localStorage.auto = flag == 1 ? 0 : 1;
		$(this).val(localStorage.auto == 1 ? "停止":'开始');
		sendMessage('auto', flag == 1 ? 0 : 1);
		//缓存Mail
	});

	$("#Send").click(function(){
		sendMessageToContentScript({cmd:'SendTest', value:''}, function(response){
		    console.log(response);
		});
	});