var express = require('express');
var app = express();
var mongoose = require('mongoose');
var User = require('./models/usersModel.js');
var usersController = require('./controllers/usersController.js');
var port = process.env.PORT || 3000;
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shared-todo';

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('public/index.html');
});


mongoose.connect(mongoDBURI);
mongoose.connection.once('open', function(){
  console.log('Connected to mongod');
})


app.listen(port, function(){
  console.log('Server up, listening on 3000');
})
