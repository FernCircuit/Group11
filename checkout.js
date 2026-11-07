var app = angular.module("checkoutApp", []);

app.controller("CheckoutController", function($scope) {

    //Speaker type
    $scope.speaker = {
        sessions: "",
        type: ""
    };

    $scope.contact = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    };

    // Available conference sessions
    $scope.sessions = [
        { name: "Introduction to Health Technology", selected: false },
        { name: "Business in IST", selected: false },
        { name: "How Users Interact With UI", selected: false },
        { name: "Database Management", selected: false },
        { name: "Web Development Trends", selected: false }
    ];

    $scope.submit = function() {
        $scope.submitted = true;
    };

});