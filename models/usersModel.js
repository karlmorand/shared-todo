var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username : String,
  password : String,
  listsCreated : [],
  listsSubscribed : []
});

var User = mongoose.model('User', userSchema);

module.exports = User;
