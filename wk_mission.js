

let $Content = $(".fprw-pg tr").eq(1).find('td');
let len = $Content.eq(4).find('input').length;
let type = $Content.eq(1).find('.fpgl-td-rw b').text();
let price = $Content.eq(2).find('.fpgl-td-rw').eq(1).text();


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
			text: type.substring(1,3) + '-' + price.trim().substring(3)
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
	if(localStorage.isSend == 0 || len == 0) return;
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
	localStorage.isSend = 0;
}

sendMail();
abTitle();
let time;

function clickHelper(){
	let $iframeContent = $('#ow002 iframe');
	if($iframeContent.length > 0){
		let $content = $iframeContent.contents();
		if($content.find('#ulCheck').length > 0){

			$content.find("#ulCheck li input[type=checkbox]").attr('checked', 'checked');
			$content.find('#btnSubmit').removeAttr("disabled");
			$content.find("#btnSubmit").attr("class", "input-butto100-ls");

			if($content.find("#btnSubmit").attr("onclick") != ''){
				$content.find("#btnSubmit").attr("onclick", "Submit()");
			}
			clearInterval(time);
		}
	}
}

time = setInterval(function(){
	clickHelper();
},1000)