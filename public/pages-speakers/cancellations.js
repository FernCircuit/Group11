var app = angular.module("cancellationsApp", [])

app.controller("CancellationsController", function($scope, $http) {

    
    $scope.cancellation = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        speakers: "",
        reason: ""
    };


});