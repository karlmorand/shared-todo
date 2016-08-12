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
    var newTodo = {'todoName':req.body.todo, 'todoId': req.body.todoId, 'done': false}
    foundList.todos.push(newTodo);
    foundList.save();
    res.send();
  })
})

//Edit a todo
router.post('/lists/edittodo', function(req, res){
  var newTodos = [];
  List.findOne({_id: req.body.listId}, function(err, foundList){
    for (var i = 0; i < foundList.todos.length; i++) {
      if (foundList.todos[i].todoId === req.body.todo.todoId) {
        foundList.todos[i] = req.body.todo;
      }
    }
    newTodos = foundList.todos
    List.findOneAndUpdate({_id: req.body.listId}, {$set:{todos:newTodos}}, function(err, doc){
          res.send()
    })
  })
})

//Delete a todo
router.delete('/lists/deletetodo/:todoId/:listId', function(req, res){
  List.findOne({_id: req.params.listId}, function(err, foundList){
    var todoIndex = foundList.todos.findIndex(function(todo){
      if (todo.todoId == req.params.todoId) {
        return true;
      }
    })
    foundList.todos.splice(todoIndex, 1);
    foundList.save();
    res.send()
  })
})


router.post('/lists/toggledone/:todoId/:listId', function(req, res){
  List.findOne({_id: req.params.listId}, function(err, foundList){
    var newTodos = []
    console.log('found list:');
    console.log(foundList);
    var todoIndex = foundList.todos.findIndex(function(todo){
      if (todo.todoId == req.params.todoId) {
        return true;
      }
    })
    console.log(foundList.todos[todoIndex].done);
    foundList.todos[todoIndex].done = !foundList.todos[todoIndex].done
    var newTodos = foundList.todos
    List.findOneAndUpdate({_id:req.params.listId}, {$set:{todos:newTodos}}, function(){
      res.send();
    })
  })
})

module.exports = router;
