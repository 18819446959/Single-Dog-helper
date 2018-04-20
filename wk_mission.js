

let $Content = $(".fprw-pg tr").eq(1).find('td');
let len = $Content.eq(4).find('input').length;
let type = $Content.eq(1).find('.fpgl-td-rw b').text();
let price = $Content.eq(2).find('.fpgl-td-rw').eq(1).text();
var host = '';
switch(window.location.host){
	case 'aaa.wkquan.com':
		host = 'wk';
		break;
	case 'aaa.pk1172.com':
		host = 'pk';
		break;
	case 'aaa.befoon.com':
		host = 'bf';
		break;
}


function sendMail(){
	if(localStorage.mail == '' || localStorage.mail == undefined || localStorage.isMail == 0 || localStorage.isSend == 0 || len == 0) return;
	let mailText = localStorage.mailtype == 0 ? "@126.com" : "@qq.com";
	$.ajax({
		url: 'https://api.77lemon.top/SendMail.htm',
		type: 'post',
		data:{
			mail: localStorage.mail + mailText,
			key: localStorage.ukey,
			password: localStorage.password,
			type: localStorage.mailtype,
			text: type.substring(1,3) + '-' + price.trim().substring(3) + ' ' + (host == 0 ? '' : ('[' + host + ']')) 
		},
		success:function(res){
			res = JSON.parse(res);
			if(res.status == 0){
				alert("发送通知邮件至" + localStorage.mail + mailText);
			}else{
				alert("发送失败!")
			}
		}
	});
	localStorage.isSend = 0;
}

function abTitle(){
	if(localStorage.isTitle == 0) return;
	if(len == 0) return;
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
	},1000);

	window.open('https://api.77lemon.top/Moblie/title.html','text','height=0, width=100, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');

	let video = document.createElement("VIDEO");
	video.src = 'http://file.52lishi.com/file/yinxiao/f-18-3-21-07.wav';
	video.play();
}

sendMail();
abTitle();
let time;

function clickHelper(){
	/*let $iframeContent = $('#ow002 iframe');
	if($iframeContent.length > 0){
		let $content = $iframeContent.contents();
		if($content.find('#ulCheck').length > 0){

			$content.find("#ulCheck li input[type=checkbox]").attr('checked', 'checked');
			$content.find('#btnSubmit').removeAttr("disabled");
			$content.find("#btnSubmit").attr("class", "input-butto100-ls");

			if($content.find("#btnSubmit").attr("onclick") == ''){
				$content.find("#btnSubmit").attr("onclick", "Submit()");
			}
			clearInterval(time);
		}
	}*/

	let findLayer = function(iframe, layer, btn){
		let obj = {'$layer': undefined, '$btn': undefined};
		let find = function(iframe, layer, btn){
			let $layer = iframe.contents().find(layer);
			let $btn = iframe.contents().find(btn);
			let $iframe = iframe.contents().find('iframe');
			if(iframe.length > 0 && $layer.length <= 0 && $iframe.length > 0){ 
				find($iframe, layer, btn);
			}else if(iframe.length > 0 && $layer.length > 0 && $iframe.length <= 0){
				obj =  {'$layer': $layer, '$btn': $btn};
			}
		}
		find(iframe, layer, btn);
		return obj;
	}

	let $iframeContent = $('#ow002 iframe');
	let {$layer, $btn} = findLayer($iframeContent, '#ulCheck', '#btnSubmit');

	if($layer){
		$layer.find("li input[type=checkbox]").attr('checked', 'checked');
		
		$btn.removeAttr("disabled");
		$btn.attr("class", "input-butto100-ls");

		if($btn.attr("onclick") == ''){
			$btn.attr("onclick", "Submit()");
		}
		clearInterval(time);
	}
}


time = setInterval(function(){
	clickHelper();
},1000)