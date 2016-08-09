var express = require('express');
var router = express.Router();
var User = require('../models/usersModel.js');
var List = require('../models/listsModel.js');
var bcrypt = require('bcrypt');


router.post('/signup', function(req, res){
  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  User.findOne({username: req.body.username}, function(err, foundUser){
    if (foundUser === null) {
      console.log('creating new user');
      User.create(req.body, function(err, newUser){
        req.session.loggedInUsername = req.body.username
        newUser.save();
        res.send(newUser);
      })
    } else {
      res.send();
    }
  })
})


module.exports = router;
