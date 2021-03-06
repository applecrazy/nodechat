var NodeChat = {
	nickname: null,
	resp: null,
	offline: false,
	send: function () {
		var mm = $('.chatinput')
			.val()
			.trim();
		if (mm == "") return;
		var badinput = /<(.|\n)*?>/g;
		if (badinput.test(mm)) { alert("Nice one :).\nBut seriously, no HTML injection."); return }
		var newms = {
			username: NodeChat.nickname,
			message: mm
		};
		$.post('/send', newms, function (data) {
			if (data) {
				alert("MALFORMED MESSAGE!");
			}
		});
		NodeChat.getMessages();
		$('.chatinput').val('');
		NodeChat.goBottom();
	},
	randomNickname: function () {
		if (this.nickname) return;
		var nick = "";
		var ltrs = "!abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";

		for (var i = 0; i < 5; i++)
			nick += ltrs.charAt(Math.floor(Math.random() * ltrs.length));

		nick += Math.floor(Math.random());
		this.nickname = nick;
		// alert('Your nickname is "'  + this.nickname + '".');
	},
	goBottom: function () {
		$('.container').animate({ scrollTop: $('.container').height() }, "slow");
	},
	getMessages: function () {
		$.ajaxSetup({ cache: false });
		$.getJSON("/msgs", function (data) {
			// console.log(data);
			NodeChat.resp = data;
			if (NodeChat.offline) {NodeChat.offline = false;$('.chatinput').prop('disabled', false);$('.chatinput').prop('placeholder', 'send message by pressing Enter');}
		})
			.then(function () {
				// console.log("Propagating changes...");
				NodeChat.update();
			})
			.fail(function () {
				if (!NodeChat.offline) {
					$('.container').append(`
					<div class="msg">
						<span class="user">meow <small style=\"font-size: 2vw\">[ADMIN]</small></span>
						&emsp;
						<span class="msgtxt"><small>Hey there! It looks like the NodeChat server is down or you have disconnected from the Internet.</small></span>
						&emsp;
					</div>`);
					NodeChat.offline = true;
					$('.chatinput').prop('disabled', true);
					$('.chatinput').prop('placeholder', 'you\'re offline...');
				}
				NodeChat.goBottom();
			})
			;

	},
	update: function () {
		// // console.log(NodeChat.resp);
		if (!NodeChat.resp) { return }
		if ('messages' in NodeChat.resp) {
			$('.container').html('');
			$.each(NodeChat.resp.messages, function (i, val) {
				var style = "msg";
				if (val.username == NodeChat.nickname) { style += " me"; }
				$('.container').append(`
					<div class="${style}">
						<span class="user">${val.username}</span>
						&emsp;
						<span class="msgtxt">${val.message}</span>
						&emsp;
					</div>`);
			});
		}
		NodeChat.goBottom();
		return;
	}
};



$(function () {
	$.ajaxSetup({ cache: false });
	NodeChat.randomNickname();
	$('.chatinput').change(NodeChat.send);
	$('.chatinput')[0].focus();
	// NodeChat.getMessages();
	// NodeChat.update();
	var checker = setInterval(NodeChat.getMessages, 1000);
});
