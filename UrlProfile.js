var mongoose = require('mongoose');

//Connection parameters to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 35000,
  socketTimeoutMS: 40000,
  useNewUrlParser: true
});

//Tests for actual connection to mongodb
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function callback() {
  console.log('Connected to Mongo Database');
});

//Schema for Url Profile collection
var UrlProfile = new mongoose.Schema({
  url: {type:String, trim:true, default:''},
  urlId: {type:Number, trim:true, default: 0}
});

//UrlProfile model
var UrlData = mongoose.model('UrlData', UrlProfile);

//Creates and saves a url entry into our model
var createUrl = function(entry, done) {
  var urlProfileEntry = new UrlData(entry);
  urlProfileEntry.save(function(err, urlData) {
    if(err) {
      return console.error(err);
    }
    return done(null, urlData);
  });
};

//Finds an entry by url key.
var findUrlEntry = function(findEntry, done) {
  UrlData.findOne({url: findEntry}, function(err, urlData) {
    if(err) return console.error(err);
    return done(null,urlData);
  });
};

//Finds an entry by urlId and returns whats in url key
var getUrlEntry = function(indexId, done) {
  UrlData.find({urlId: indexId}, 'url', function(err, data) {
    if(err) {
      return console.error(err);
    }
    return done(null, data);
  });
};

exports.UrlData =  UrlData;
exports.createUrl = createUrl;
exports.findUrlEntry = findUrlEntry;
exports.getUrlEntry = getUrlEntry;
