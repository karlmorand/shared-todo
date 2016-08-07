var express = require('express');
var app = express();
var mongoose = require
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.send('hello');
})


app.listen(port, function(){
  console.log('Server up, listening on 3000');
})
