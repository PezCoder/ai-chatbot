var express = require('express');
var app = express();

require('dotenv').config()

// set middleware to serve static assets
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

var server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Express running on ${server.address().port} in ${app.settings.env}`);
});

const apiai = require('apiai')(process.env.APIAI_TOKEN);

const io = require('socket.io')(server);
io.on('connection', socket => {
  socket.on('voice message', message => {
    console.log(`**** Processing: '${message}' ****`);
    const request = apiai.textRequest(message, {
      sessionId: process.env.APIAI_SESSION_ID
    });

    request.on('response', res => {
      socket.emit('bot response', res.result.fulfillment.speech);
    });

    request.on('error', error => {
      console.log(error);
    });

    request.end();
  });
});
