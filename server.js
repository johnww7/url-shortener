'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({extended: false});

const options = {
  family: 4,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", urlEncodedParser, function(req, res) {
    //res.send('Posting a request: ' + JSON.stringify(req.params));
    console.log('url type: ' + typeof(req.body.url));
    var urlToBeShortened = req.body.url;
    var testUrl = GetHostName(urlToBeShortened);
    console.log('Test url: ' + testUrl);
    dns.lookup('freecodecamp.com', options, (err, address, family) => {
      console.log('address: %j family: IPv%s', address, family);
    });

    res.send({request: urlToBeShortened});
});

function GetHostName(url) {
  //var urlRegExp = /[^.]+/;
  //var urlRegExp = /^(https|http):(\/){2}(www\.)([\w]+\.)+(com|org)(\/[\w-]+)*/;
  var urlRegExp = /^(https|http):(\/){2}(www\.)([\w]+\.)+/;
  return urlRegExp.test(url);
}

app.listen(port, function () {
  console.log('Node.js listening ...');
});
