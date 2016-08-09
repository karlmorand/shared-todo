var mongoose = require('mongoose');

var listSchema = mongoose.Schema({
  listId : Number,
  listCreator : String,
  todos : [],
  done : []
});

var List = mongoose.model('List', listSchema);

module.exports = List;
