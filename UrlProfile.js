var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  useMongoClient: true,
  connectTimeoutMS: 35000,
  socketTimeoutMS: 40000
});

/*mongoose.connection.openUri(process.env.MONGO_URI)
.once('open', ()=> console.log('Connected!')).on('error', (error) => {
  console.warn('error', error);
});*/


var UrlProfile = new mongoose.Schema({
  url: {type:String, trim:true, default:''},
  hostname: {type:String, trim:true, default:''},
  path: {type:String, trim:true, default:''},
  ipAddress: {type:String, trim:true, default:''},
  id: {type:Number, trim:true, default: 0}
});

var UrlData = mongoose.model('UrlData', UrlProfile);

/*var createUrl = function(entry) {
  UrlProfile.create(entry).then(url => {

  }).catch(err => {

  });
};*/
var createUrl = function(entry, done) {
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
};

exports.UrlData =  UrlData;
exports.createUrl = createUrl;
exports.findUrlEntry = findUrlEntry;
