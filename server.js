'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');

var cors = require('cors');
var UrlProfile = require('./UrlProfile.js');

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

var createUrlEntry = require('./UrlProfile.js').createUrl;
var findUrlEntry = require('./UrlProfile.js').findUrlEntry;

app.post("/api/shorturl/new", urlEncodedParser, function(req, res) {
    //res.send('Posting a request: ' + JSON.stringify(req.params));
    console.log('url type: ' + typeof(req.body.url));
    var urlToBeShortened = req.body.url;
    var shortUrl = getHostName(urlToBeShortened);
    console.log('Test url: ' + shortUrl.host + " : " + shortUrl.path);
    if(shortUrl.host !== "invalid url") {
      var urlIpAddress = "";
      var urlId = Math.floor((Math.random()*3000) +1);
      dns.lookup(shortUrl.host, options, (err, address, family) => {
        if(err) {
          console.log('Error: ' + err.code);
          return;
        }
        urlIpAddress= address;
        console.log('address: %j family: IPv%s', address, family);
      });
      var urlDataToSend = {
        url: urlToBeShortened,
        hostname: shortUrl.host,
        path: shortUrl.path,
        ipAddress: urlIpAddress,
        id: 'urlId'
      };
      res.send({original_url: urlToBeShortened, short_url:'test'});
    }
    else {
      res.send({error: "invalid url"});
    }

    //res.send({request: urlToBeShortened});
});

function getHostName(url) {
  //var urlRegExp = /[^.]+/;
  //var urlRegExp = /^(https|http):(\/){2}(www\.)([\w]+\.)+(com|org)(\/[\w-]+)*/;
  var urlRegExp = /^(https|http):(\/){2}(www\.)([\w]+\.)(com|org)([\/])?([\w-]+[\/]?)*/;
  var testedUrl = urlRegExp.exec(url);
  if(testedUrl !== null) {
    //var startingPoint = (testedUrl[0].search(/[.]/)) + 1;
    var shortenedPath = testedUrl[0].substring((testedUrl[0].search(/[.]/))+1);
    var hostNameEndingPoint = shortenedPath.search(/[\/]/);

    var hostName = "";
    var filePath = "";

    if(hostNameEndingPoint == -1) {
      hostName = shortenedPath;
      filePath = "/";
    }
    else {
      hostName = shortenedPath.substring(0, hostNameEndingPoint);
      filePath = shortenedPath.substring(hostNameEndingPoint);
    }

    console.log("host name: " + hostName + " routes: " + filePath);
    return {host: hostName, path: filePath};
    //return shortenedPath;
  }
  else {
    return {host: "invalid url"};
  }

}

app.listen(port, function () {
  console.log('Node.js listening ...');
});
