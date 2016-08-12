var app = angular.module('SharedTodoApp', ['ngRoute']);


app.controller('UserController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

    this.userLoggedIn = null;
    var controller = this;
    controller.editTodo = null;

    this.createNewAccount = function() {
        controller.loginError = null;
        var newUser = {
            'username': controller.username,
            'password': controller.password
        }
        console.log(newUser);
        $http({
            method: "POST",
            url: '/users/signup',
            data: newUser
        }).then(function(response) {
          controller.username = null;
          controller.password = null;
            if (response.data.username) {
              controller.userLoggedIn = response.data
              controller.getLists()
            } else {
              controller.loginError = "Username already exists"
            }
        }, function(response) {
            console.log(response);
        });
    }

    this.getLists = function() {

      $http({
        method: "GET",
        url: '/users/' + controller.userLoggedIn._id + '/lists'
      }).then(function(response){
        controller.listsCreated = response.data
        // controller.listsSubscribed = response.data.listsSubscribedToSend;
      }, function(response){
        console.log('error getting lists');
      })
    }

    this.createList = function(newListName){
      var newList = {'listName': newListName, 'listCreator': controller.userLoggedIn._id}
      $http({
        method: "POST",
        url: '/users/newList',
        data: newList
      }).then(function(response){
        controller.newListName = "";
        console.log('new list created');
        controller.getLists();
      })
    }

    this.login = function(){
      controller.loginError = null;
      $http({
        method: "POST",
        url: '/users/login',
        data: {'username': controller.usernameLogin, 'password': controller.passwordLogin}
      }).then(function(response){
        if (response.data === 'no user') {
          controller.loginError = "Username doesn't exist"
        } else if (response.data === 'password') {
          controller.loginError = "Incorrect password"
        } else {
          controller.userLoggedIn = response.data
          controller.getLists();
        }
        controller.usernameLogin = null;
        controller.passwordLogin = null;
      })
    }

    this.logout = function(){
      controller.userLoggedIn = null;
    }

    this.addTodo = function(listId){
      var todoId = Math.floor(Math.random()*1000000000000);
      $http({
        method: "POST",
        url: '/users/lists/addtodo',
        data: {'listId': listId, 'todo': controller.newTodo, 'todoId': todoId}
      }).then(function(response){
        controller.newTodo = null;
        controller.getLists();
      })
    }

    this.toggleTodoEdit = function(todo){
      // if (controller.editTodo === null) {
      //   controller.editTodo = todo;
      // } else if (controller.editTodo === todo){
      //   controller.editTodo = null;
      // } else {
      //   controller.editTodo = todo;
      // }
      controller.editTodo = todo;
    }
    this.submitTodoEdits = function(todo, listId){
      console.log('submit edit button clicked');
      $http({
        method: "POST",
        url: '/users/lists/edittodo',
        data: {'todo': todo, 'listId': listId}
      }).then(function(response){
        controller.editTodo = null;
        controller.getLists();
      }, function(response){
        console.log(response);
      })
    }

    this.deleteTodo = function(todo, listId){
      $http({
        method: 'DELETE',
        url: '/users/lists/deletetodo/' + todo.todoId + '/' + listId
      }).then(function(response){
        controller.editTodo = null;
        controller.getLists();
      })
    }

    this.toggleDone = function(todo, listId){
    $http({
      method: 'POST',
      url: '/users/lists/toggledone/' + todo.todoId + '/' + listId
    }).then(function(response){
      controller.editTodo = null;
      controller.getLists();
    })
}


}])
