var mongoose = require('mongoose');

//const URI_INFO = 'mongodb://john:N1teLockon@ds035787.mlab.com:35787/jwfccmongodb';
//process.env.MONGO_URI
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 35000,
  socketTimeoutMS: 40000,
  useNewUrlParser: true
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function callback() {
  console.log('Connected to Mongo Database');
});

var UrlProfile = new mongoose.Schema({
  url: {type:String, trim:true, default:''},
  urlId: {type:Number, trim:true, default: 0}
});

var UrlData = mongoose.model('UrlData', UrlProfile);

var createUrl = function(entry, done) {
  var urlProfileEntry = new UrlData(entry);
  urlProfileEntry.save(function(err, urlData) {
    if(err) {
      return console.error(err);
    }
    return done(null, urlData);
  });
};

var findUrlEntry = function(findEntry, done) {
  UrlData.findOne({url: findEntry}, function(err, urlData) {
    if(err) return console.error(err);
    return done(null,urlData);
  });
};

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
