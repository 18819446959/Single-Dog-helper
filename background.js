chrome.cookies.onChanged.addListener(function(request)
{
	console.log(request)
	if(request.cause == 'explicit' && 
		request.cookie.domain == 'aaa.wkquan2018.com' &&
		 request.cookie.name == 'WKQuanFinePortalFormsCookieName'
		){
		if(localStorage.WKQuanFinePortalFormsCookieName != request.cookie.value){
			chrome.cookies.set({
				url: 'http://aaa.wkquan2018.com/',
				name: 'WKQuanFinePortalFormsCookieName',
				value: request.cookie.value
			}, function(cookie) {
				console.log(new Date())
				console.log('修改WKQuanFinePortalFormsCookieName');
			});
		}
		localStorage.WKQuanFinePortalFormsCookieName = request.cookie.value;
		sendMessage('cookie', request.cookie.value);
		console.log(request.cookie.value)
	}
	if(request.cause == 'explicit' && 
		request.cookie.domain == 'aaa.wkquan2018.com' &&
		 request.cookie.name == 'MianNv'
		){
			if(request.cookie.expirationDate != localStorage.expirationDate){
				chrome.cookies.set({
					url: 'http://aaa.wkquan2018.com/',
					name: 'MianNv',
					expirationDate: request.cookie.expirationDate,
					value: request.cookie.value
				}, function(cookie) {
					console.log('修改expirationDate');
				});
			}
			localStorage.expirationDate = request.cookie.expirationDate;
	}
	if(request.cause == 'expired_overwrite' && 
		request.cookie.domain == 'aaa.wkquan2018.com' &&
		 request.cookie.name == 'WKQuanFinePortalFormsCookieName'){
		localStorage.WKQuanFinePortalFormsCookieName = '';
		sendMessage('cookie', '');
	}
});

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