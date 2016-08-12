var mongoose = require('mongoose');

var listSchema = mongoose.Schema({
  listName : String,
  listCreator : String,
  todos : [],
});

var List = mongoose.model('List', listSchema);

module.exports = List;
