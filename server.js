// server.js
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('frontend'));





/* 

BOILERPLATE BELOW...

*/

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/frontend/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
  ];

// listen for requests :)
var listener = app.listen(8080, function () {
  console.log('Server is running on port ' + listener.address().port);
});