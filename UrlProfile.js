var mongoose = require('mongoose');

const URI_INFO = 'mongodb://john:N1teLockon@ds035787.mlab.com:35787/jwfccmongodb';
//process.env.MONGO_URI
mongoose.Promise = global.Promise;
mongoose.connect(URI_INFO, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 35000,
  socketTimeoutMS: 40000,
  useNewUrlParser: true
});


/*mongoose.connection.openUri(process.env.MONGO_URI)
.once('open', ()=> console.log('Connected!')).on('error', (error) => {
  console.warn('error', error);
});*/


/*var UrlProfile = new mongoose.Schema({
  url: {type:String, trim:true, default:''},
  hostname: {type:String, trim:true, default:''},
  path: {type:String, trim:true, default:''},
  ipAddress: {type:String, trim:true, default:''},
  id: {type:Number, trim:true, default: 0}
});*/
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

/*var createUrl = function(entry) {
  UrlProfile.create(entry).then(url => {

  }).catch(err => {

  });
};*/
/*var createUrl = function(entry, done) {
  UrlData.create(entry, function(err, urlData) {
    if(err) {
      return console.error(err);
    }
    return done(null, urlData);
  });
};

var findUrlEntry = function(index) {
  UrlData.findOne(index, function(err, urlData) {
    if(err) return console.error(err);
    return urlData;
  });
};*/

exports.UrlData =  UrlData;
exports.createUrl = createUrl;
exports.findUrlEntry = findUrlEntry;
exports.getUrlEntry = getUrlEntry;
