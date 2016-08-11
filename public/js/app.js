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
            if (response.data.username) {
              controller.userLoggedIn = response.data._id
              controller.getLists()
            } else {
              controller.loginError = "Username already exists"
            }
        }, function(response) {
            console.log(response);
        });
    }

    this.getLists = function() {
      console.log('now in the getlists funciton');
      $http({
        method: "GET",
        url: '/users/' + controller.userLoggedIn + '/lists'
      }).then(function(response){
        console.log('getLists function returned with:');
        console.log(response.data);
        controller.listsCreated = response.data.listsCreated;
        controller.listsSubscribed = response.data.listsSubscribed;
      })
    }

    this.createList = function(newListName){
      var newListId = Math.floor(Math.random()*1000000000000);

      var newList = {'listId': newListId, 'listName': newListName, 'listCreator': controller.userLoggedIn}
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

}])
