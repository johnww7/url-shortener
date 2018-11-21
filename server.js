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
    var shortUrl = GetHostName(urlToBeShortened);
    console.log('Test url: ' + shortUrl.host + " : " + shortUrl.path);
    dns.lookup(shortUrl.host, options, (err, address, family) => {
      console.log('address: %j family: IPv%s', address, family);
    });

    res.send({request: urlToBeShortened});
});

function GetHostName(url) {
  //var urlRegExp = /[^.]+/;
  //var urlRegExp = /^(https|http):(\/){2}(www\.)([\w]+\.)+(com|org)(\/[\w-]+)*/;
  var urlRegExp = /^(https|http):(\/){2}(www\.)([\w]+\.)(com|org)([\/])?([\w-]+[\/]?)*/;
  var testedUrl = urlRegExp.exec(url);
  if(testedUrl !== null) {
    //var startingPoint = (testedUrl[0].search(/[.]/)) + 1;
    var shortenedPath = testedUrl[0].substring((testedUrl[0].search(/[.]/))+1);
    var hostNameEndingPoint = shortenedPath.search(/[\/]/);
    //var hostName = shortenedPath.substring(0, hostNameEndingPoint);
    var hostName = hostNameEndingPoint == -1 ? shortenedPath : shortenedPath.substring(0, hostNameEndingPoint);
    var urlRoutes = hostNameEndingPoint == -1 ? "/" : shortenedPath.substring(hostNameEndingPoint);
    console.log("host name: " + hostName + " routes: " + urlRoutes);
    return {host: hostName, path: urlRoutes};
    //return shortenedPath;
  }
  else {
    return {host: "invalid url"};
  }

  /*console.log('Positon: ' + getShortenedPath);
  for(var i = 0; i < resultArray.length; i++) {
    console.log('pos' + i + ': ' + resultArray[i]);
  }
  return urlRegExp.test(url);*/
}

app.listen(port, function () {
  console.log('Node.js listening ...');
});
