//----Angular JS For Checkout Submission------
//----used to build dynamic web apps without rewriting the entire html page
//initialize the app: (checkoutApp must match in html file)
var app = angular.module("checkoutApp", []);
//controller & $scope: everything with $scope connects js to html
app.controller("CheckoutController", function($scope, $http) { //added $http to connect to ajax

    //Speaker type - create the form data models
    $scope.speaker = {
        sessions: "",
        type: ""
    };
    //Speaker details
    $scope.contact = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    };
    // Available conference sessions - creates an array
    $scope.sessions = [
        { name: "Introduction to Health Technology", selected: false },
        { name: "Business in IST", selected: false },
        { name: "How Users Interact With UI", selected: false },
        { name: "Database Management", selected: false },
        { name: "Web Development Trends", selected: false }
    ];

    //SUBMIT FUNCTION
    //when form is submitted, toggle form to true
    $scope.submit = function() {
        //build data structure to send:
        var payload = { 
            userData: $scope.contact,
            type: $scope.speaker.type,
            sessions: $scope.sessions
        };
        //for troubleshooting
        console.log("Preparing data for AJAX", payload);
        
        //set up post to send to http
        $http.post("api/checkout", payload)
            .then(function(response){
                alert("Success! Connected to live server.");
                localStorage.removeItem('SummitPointCart');
                $scope.submitted = true;
            })
            .catch(function(error){
                console.log("Ajax transmission test");
                console.error("Destination 'api/checkout' Not Found");
                console.error("HTTP Response Code:", error.status);

                localStorage.removeItem('SummitPointCart');
                $scope.submitted = true;
            });
    };

});
