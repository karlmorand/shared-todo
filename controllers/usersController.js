var express = require('express');
var router = express.Router();
var User = require('../models/usersModel.js');
var List = require('../models/listsModel.js');
var bcrypt = require('bcrypt');


router.post('/signup', function(req, res){
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  User.findOne({username: req.body.username}, function(err, foundUser){
    if (foundUser === null) {
      User.create(req.body, function(err, newUser){
        req.session.loggedInUserId = newUser._id
        newUser.save();
        res.send(newUser);
      })
    } else {
      res.send();
    }
  })
})

router.get('/:id/lists', function(req, res){
  lists = {'listsCreated': [], 'listsSubscribed': []};

  if (req.session.loggedInUserId === req.params.id) {
    User.findOne({_id: req.params.id}, function(err, foundUser){
      console.log('getlists route sending back:');
      console.log(foundUser);
      // foundUser.listsCreated.forEach(function(listIdNum){
      //   List.findOne({listId:listIdNum}, function(err, foundList){
      //     lists.listsCreated.push(foundList)
      //   })
      // })
      // foundUser.listsSubscribed.forEach(function(listIdNum){
      //   List.findOne({listId:listIdNum}, function(err, foundList){
      //     lists.listsSubscribed.push(foundList)
      //   })
      // })
      res.send(foundUser)
    })

  }
})

//Edit todos on a list
router.post('/:userId/:listId', function(req, res){
  List.findOne({listId: req.params.listId}, function(err, foundList){
    foundList.todos = req.body;
    foundList.save();
    res.send();
  })
})

//Create new list
router.post('/newList', function(req, res){
  User.findOne({_id: req.body.listCreator}, function(err, foundUser){
    List.create(req.body, function(err, newList){
      if (err) {
        console.log(err);
      } else {
        foundUser.listsCreated.push(newList);
        foundUser.save()
        res.send();
      }
    })
})
})

router.post('/login', function(req, res){

  User.findOne({username: req.body.username}, function(err, foundUser){
    if (foundUser === null) {
      res.send('no user');
    } else if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
      res.send('password')
    } else {
      req.session.loggedInUserId = foundUser._id;
      res.send(foundUser);
    }
  })
})


module.exports = router;
