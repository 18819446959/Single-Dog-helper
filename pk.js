

	
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

	//克隆内容主要窗体
	let socketAll;

	function startMission(){
		if(!checkLogin()){
			console.log('请登录后再试');
			return;
		}
		let settingObj = settingsVal();
		socketAll = comfirmOrder(settingObj);
		setInterval(()=>{
			if(localStorage.auto == 0){
				socketAll.close();
			}
		})
	}

	function settingsVal(){
		let outtime = parseInt(new Date().getTime()/1000);
		let PlatformTypes = 0;
		let TaskType = "无线端";
		let TaskTypelen = 2;
		let TaskPriceEnd = localStorage.TaskPriceEnd || '';

		return {"outtime":outtime,"FGPlatformTypes":PlatformTypes,"FGTaskType":TaskType,"FGTaskTypelen":TaskTypelen
                ,"FGTaskPriceEnd":TaskPriceEnd,"FineTaskClassType":"销量任务"};
	}

	function checkLogin(){
		console.log('检查登录...')
		return window.location.pathname != '/passport/login.html';
	}


	function comfirmOrder(obj){
		console.log('提交订单...')
		$.ajax({
            type:'POST',
            url:"/site/acceptTask01.html",
            data: obj,
			timeout: 0,
            dataType:'json',
            success:function(data){
                if(data.acceptarr.err_code == 2){
                    console.log(data.acceptarr.msg);
                    window.location.href='/site/index.html';
                }
                if( data.length == 1 && data.acceptarr.err_code == 9 ){
                	console.log(data.acceptarr.msg);
                	console.log('准备建立查询连接...')
                	setTimeout(()=>{
                		socketAll = checkNum(localStorage.TaskPriceEnd || '');
                	}, 1000)
                }
            },
            error:function(data){
               console.log('网络错误,重试中...')
                setTimeout(()=>{
                	comfirmOrder(obj);
                }, 3000);
            }
        });
	}

    function checkNum(TaskPrice, DownTaskPoint=0, TaskCategory=0){
    	let checkSocketTime;
    	console.log('建立查询连接...')
    	let id = $('script').eq(7).html().split('UserID=')[1].split('&TaskPrice')[0]
    	let socket = new WebSocket("ws://119.29.115.63:9877/Task?UserID="+id+"&TaskPrice="+TaskPrice+"&DownTaskPoint="+DownTaskPoint+"&TaskCategory="+TaskCategory+" ");
		socket.open = function(event) {
			console.log('建立成功...')
		}
		socket.onmessage = function (event) {
			let obj = JSON.parse(event.data);
			 if(obj.IsOK){
			 	if(obj.RType == 1){
                    console.log('当前可接任务数： '+obj.Data);
                    if(obj.Data == 0){
                    	checkSocketTime = setInterval(()=>{
                    		checkLine(checkSocketTime);
                    	}, 4000);
                    }else{
                    	clearInterval(checkSocketTime);
                    }
                }else if(obj.RType == 100){
                    if(socket){
                        socket.close();
                    }
                    console.log('已成功获取任务!!!');
                    console.log('任务ID：'+ obj.Data.TaskID +'\n店铺名称：'+obj.Data.ShopName+'\n任务说明：'+obj.Data.Task_Remark+'\n佣金：'+obj.Data.UTask_Commission)
                    console.log('http://task/Tasktestone/taskid/'+obj.Data.TaskID+'/shebei/PC.html')
                    sendMail();
                    abTitle();
                }
			}else{
				console.log(obj.Description)
				localStorage.auto = 0;
				socket.close();
				if(obj.Description == '系统断定您接任务的操作过于频繁，请在三分钟后再进行该操作'){
					waitMission();
				}
			}
		}
		socket.onclose = function (event) {
			if(localStorage.auto == 1){
				console.log('失去连接,尝试重新连接....')
				setTimeout(()=>{
					checkNum(localStorage.TaskPrice);
				}, 3000)
			}else{
				console.log('手动终止...')
			}
        }
        return socket;
    }

    function waitMission(){
    	console.log('自动进入等待...')
    	console.log('等待3分钟...');
    	let sTemp = 3 * 60;
    	let waitTime = setInterval(()=>{
    		sTemp--;
    		console.log('剩余' + sTemp)
    		if(sTemp == 0){
    			clearInterval(waitTime)
    			let obj = settingsVal();
				localStorage.auto = 1;
    			socketAll = comfirmOrder(obj);
    		}
    	}, 1000);
    }

    function checkLine(checkSocketTime){
    	console.log(socketAll.readyState)
    	console.log('检查连接状态:' + socketAll.readyState == 1 ? '正常' : '断开');
		if(socketAll.readyState == 0){
			console.log('连接已断开，请重新开始...');
			clearInterval(checkSocketTime);
		}
		if(localStorage.auto){
			clearInterval(checkSocketTime)
		}
    }