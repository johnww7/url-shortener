var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
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

module.exports =  mongoose.model('UrlProfile', UrlProfile);
