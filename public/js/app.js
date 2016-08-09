var app = angular.module('SharedTodoApp', ['ngRoute']);


app.controller('UserController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

    this.userLoggedIn = false;
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
          console.log('Response:');
          console.log(response);
            if (response.data.username) {
              console.log('ready to get lists');
                // this.getLists(response.data.username)
            } else {
              controller.loginError = "Username already exists"
            }
        }, function(response) {
            console.log(response);
        });

    }

    //Write getLists() function



}])
