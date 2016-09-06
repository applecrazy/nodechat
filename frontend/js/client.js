var NodeChat = {
	nickname: null,
	send: function() {
		var mm = $('.chatinput').val();
		var badinput =/<(.|\n)*?>/g;
		if (badinput.test(mm)) {alert("Nice one :).\nBut seriously, no HTML injection, man."); return}
		$('.container').append(`
			<div class="msg me">
				<span class="user">${NodeChat.nickname}</span>
				&emsp;
				<span class="msgtxt">${mm}</span>
				&emsp;
			</div>`);
		$('.chatinput').val('');
		NodeChat.goBottom();
	},
	randomNickname: function() {
		if (this.nickname) return;
	    var nick = "";
	    var ltrs = "!abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";

	    for(var i = 0; i < 5; i++)
	        nick += ltrs.charAt(Math.floor(Math.random() * ltrs.length));

	    nick += Math.floor(Math.random());
	    this.nickname = nick;
	    // alert('Your nickname is "'  + this.nickname + '".');
	},
	goBottom: function() {
		$('.container').animate({ scrollTop: $('.container').height() }, "slow");
	}
};



$(function() {
	NodeChat.randomNickname();
	$('.chatinput').change(NodeChat.send);
	$('.chatinput')[0].focus();
});