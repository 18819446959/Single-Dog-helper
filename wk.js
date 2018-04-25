

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
					let $confirmDialog = $('#ow_confirm002');
					if($confirmDialog.length > 0){
						/*if($confirmDialog.find('.sjzc_5_t:first div:first').text() == '当前排队人数大于100,你是否确认接单？'){
							$confirmDialog.find('#ow_confirm002_fun2')[0].click();
							clearInterval(timeConfirm);
							startMission();
						}*/
						$confirmDialog.find('#ow_confirm002_fun')[0].click();
					}
				},500);
			},1000)
		}

		if($('#ban2').length > 0 && !$('#ban2').is(":hidden")){
			console.log("waitmission");
			waitmission();
		}
	}
