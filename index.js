// Set environment variables from .env file
require('dotenv').config();

var express = require('express');
var app = express();

// set middleware to serve static assets
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

var server = app.listen(3000);

const apiai = require('apiai')(process.env.APIAI_TOKEN);

