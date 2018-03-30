	
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
			value: 0
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

	//检测区间
	let time = 20;

	function startMission(){
		//Start Msiision
		//任务
		if($("#get-queue").length > 0){
			if(localStorage.auto == 1){
				if(localStorage.tb == 0){
					$('#plat_tb').removeAttr("checked");
					$('#plat_tb').parent().removeClass("on");
				}else{
					$('#plat_tb').attr("checked","checked");
					$('#plat_tb').parent().addClass("selected");
				}

				if(localStorage.jd == 0){
					$('#plat_jd').removeAttr("checked");
					$('#plat_jd').parent().removeClass("on");
				}else{
					$('#plat_jd').attr("checked","checked");
					$('#plat_jd').parent().addClass("selected");
				}

				//设置金额
				if(localStorage.TaskPriceEnd || localStorage.TaskPriceEnd != '' || localStorage.TaskPriceEnd != 0){
					$('input[name=money]').val('￥ ' + localStorage.TaskPriceEnd);
				}


				if($("#get-queue span").text() == '开始接单'){
					$("#get-queue").eq(0)[0].click();
					waitmission();
				}
			}
		}

		if($("#shopname").length > 0){
			let name = $('script').eq(8).html().split('"')[23];
			$("#shopname").val(name || '');
		}
		
	}

	function waitFirstLayer(){
		setTimeout(function(){
			if($('.bfs').length > 0){
				$('.bfs .btn1').eq(0)[0].click();
			}
		},500);
	}


	function checkmission(fn){
		let childWin = document.createElement('iframe'); 
		childWin.src = '/wap/task/index/status/2.html';
		/*childWin.onload = function(){
			let flag = true;

			if($(childWin).contents().find('.take .take-b').length <= 0){
				childWin.remove();
				flag = false;
			}
			fn(flag);
		}*/
		setTimeout( ()=>{
			let flag = true;
			let $content = $(childWin).contents();
			if($content.find('.take .take-b').length <= 0 || $content.find('.take .btn-box .org').length <= 0){
				childWin.remove();
				flag = false;
			}
			fn(flag);
		},1000)
		document.body.appendChild(childWin);
	}

	function waitSy(fn){
		let sytime = setInterval(()=>{
			let str = $('#get-queue span').html();
			if(str){
				fn(str);
				clearInterval(sytime);
			}
		},500)
	}

	function waitmission(){
		waitSy((str) => {
			console.log(str)
			let second = Math.floor(str.match(/\d+/g)[1] / time);
			let timeLength = str.match(/\d+/g)[1];

			console.log('解析时间 second: '+ second);
			let i = 0;
			let waitTIme = setInterval( () => {
				if(i == second){
					clearInterval(waitTIme);
					return;
				}
				i++;

				checkmission((res) => {
					console.log('检查订单 次数: '+ i);
					if(res){
						//点击跳转
						window.location.href = '/wap/task/index/status/2.html'
						clearInterval(waitTIme);
					}
				});
			},time * 1000);

			let checkTime = setInterval( ()=>{
				let flag = false;
				if($('#get-queue label').html() == '匹配结果'){
					flag = true;
					checkmission((res) => {
						if(res){
							//点击跳转
							window.location.href = '/wap/task/index/status/2.html'
						}else{
							window.location.href = '/wap/takeover/index/take/1.html'
							//window.location.reload();
						}
					});
					clearInterval(checkTime)
				}
				console.log('匹配结果: '+ flag);
			}, timeLength * 1000)
		})
	}

	//过滤弹窗
	waitFirstLayer();