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
  List.find({listCreator: req.params.id}, function(err, listsCreated){
    res.send(listsCreated);
  })
})






//Edit todos on a list
// router.post('/:userId/:listId', function(req, res){
//   List.findOne({listId: req.params.listId}, function(err, foundList){
//     foundList.todos = req.body;
//     foundList.save();
//     res.send();
//   })
// })

//Create new list
router.post('/newList', function(req, res){
  User.findOne({_id: req.body.listCreator}, function(err, foundUser){
    List.create(req.body, function(err, newList){
      if (err) {
        console.log(err);
      } else {
        foundUser.listsCreated.push(newList._id);
        foundUser.save()
        newList.save()
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

router.post('/lists/addtodo', function(req, res){
  List.findOne({_id: req.body.listId}, function(err, foundList){
    var newTodo = req.body.todo
    foundList.todos.push(newTodo);
    foundList.save();
    res.send();
  })
})

module.exports = router;
