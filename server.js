// server.js
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('frontend'));

app.use(bodyParser.urlencoded({extended : true}));

const $SETTINGS = {
	MESSAGE_CACHE_LIMIT: 10,
	RUNNING_PORT: 8080,
	WELCOME_MESSAGE: {username: "meow <small style=\"font-size: 2vw\">[ADMIN]</small>", message: "<small>Welcome!</small>"},
	MOD_MESSAGE: {username: "meow <small style=\"font-size: 2vw\">[ADMIN]</small>", message: "<small>This is moderated by cats + humans.</small>"}
};


var CurrentMsgs = {
	status: "OK",
	timestamp: null,
	messages: [$SETTINGS.WELCOME_MESSAGE, $SETTINGS.MOD_MESSAGE]
};
function preventOverflow() {
	if (CurrentMsgs.messages.length >= $SETTINGS.MESSAGE_CACHE_LIMIT) {
		CurrentMsgs.messages = CurrentMsgs.messages.slice(Math.max(CurrentMsgs.messages.length - $SETTINGS.MESSAGE_CACHE_LIMIT, 1));
	}
}
function logOutput(msg) {
	console.log(`[${new Date(new Date().getTime()).toLocaleString()}] ${msg}`);
}

app.get("/msgs", function (req, res) {
	// var resp = "{";
	// for (var i = 0; i < CurrentMsgs.length; i++) {
	// 	resp += JSON.stringify(CurrentMsgs[i]);
	// }
	// resp += "}";
	logOutput("GET /msgs");
	preventOverflow();
	CurrentMsgs.timestamp = Math.floor(Date.now() / 1000);
	res.header("Content-Type", "application/json");
	res.json(CurrentMsgs);
});

app.post("/send", function(req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	logOutput('POST /send ' + ip);
	preventOverflow();
	if ('username' in req.body && 'message' in req.body) {
		CurrentMsgs.messages.push(req.body);
		// logOutput(CurrentMsgs.messages);
	} else {
		res.send("MALFORMED_MESSAGE");
	}
	res.end();
}); 
// listen for connections
var server = app.listen($SETTINGS.RUNNING_PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`Server is running on ${host}:${port}...`);
});