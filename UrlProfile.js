var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

var UrlProfile = new mongoose.Schema({
  url: {type:String, trim:true, default:''},
  hostname: {type:String, trim:true, default:''},
  path: {type:String, trim:true, default:''},
  ipAddress: {type:String, trim:true, default:''},
  id: {type:Number, trim:true, default: 0}
});

module.exports =  mongoose.model('UrlProfile', urlProfile);
