
	let email = document.getElementById('email');
	let mailtype = document.getElementById('Mailtype');
	let password = document.getElementById('password');

	document.getElementById('save').onclick = function save(){
		console.log('save');
		chrome.storage.local.set({
				email: email.value,
				type: mailtype.value,
				password: password.value
			}, 
		function() {
		    console.log("保存成功");
		    document.getElementById('text').innerHTML = "保存成功";
		});
	}

	//配置页初始化
	chrome.storage.local.get({
		email: '',
		type: '',
		password: ''
	},function(items) {
		//console.log("Local storage Init!")
	    email.value = items.email;
	    password.value = items.password;
	    mailtype.value = items.type;
	});
