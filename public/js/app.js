var app = angular.module('SharedTodoApp', ['ngRoute']);


app.controller('UserController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

    this.userLoggedIn = null;
    var controller = this;

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
        console.log('getLists function returned with:');
        console.log(response.data);
        controller.listsCreated = response.data.listsCreated;
        controller.listsSubscribed = response.data.listsSubscribed;
      }, function(response){
        console.log('error getting lists');
      })
    }

    this.createList = function(newListName){
      var newListId = Math.floor(Math.random()*1000000000000);

      var newList = {'listId': newListId, 'listName': newListName, 'listCreator': controller.userLoggedIn._id}
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
        }
        controller.usernameLogin = null;
        controller.passwordLogin = null;
      })
    }

    this.logout = function(){
      controller.userLoggedIn = null;
    }
}])
