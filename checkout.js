//----Angular JS For Checkout Submission------
//----used to build dynamic web apps without rewriting the entire html page
//initialize the app: (checkoutApp must match in html file)
var app = angular.module("checkoutApp", []);
//controller & $scope: everything with $scope connects js to html
app.controller("CheckoutController", function($scope, $http) { //added $http to connect to ajax

    //Contact details
    $scope.contact = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    };
    //error tracking
    $scope.errors = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    };
    // Create an array to hold the saved speakers
    $scope.savedSpeakers = [];
    $scope.submitted = false;

    // Load the shopping cart from localStorage
    var storedSpeakers = localStorage.getItem("SummitPointCart");

    if(storedSpeakers){
        var origCart = JSON.parse(storedSpeakers);
        $scope.savedSpeakers = origCart.map(function(speaker){
            var topics = speaker.availableTopics || [];
            speaker.topicSelections = topics.map(function(topicName){
                return{
                    name:topicName,
                    selected:false,
                    type: "In-Person", //in-person default
                    duration:1.0 //1hr default
                };
            });
            return speaker;
        });
    }else{
        $scope.savedSpeakers = [];
    }
  
    //call the calculation function
    $scope.orderTotal = function(){
        return calculateOrderTotal();
    };
    //set to false initially
    $scope.submitted = false;
    
    //SUBMIT FUNCTION
    //when form is submitted, toggle form to true
    $scope.submit = function() {
        //validity function call
        if(validateForm() == false){
            return;
        }
        //build data structure to send:
        var payload = { 
            userData: $scope.contact,
            selectedSpeakers: $scope.savedSpeakers,
            totalCost: $scope.orderTotal()
        };
        //for troubleshooting in dev tools
        console.log("Preparing data for AJAX", payload);
        
        //set up post to send to http
        $http.post("api/checkout", payload) //just ends in 404 for now until backend done
            .then(function(response){
                alert("Server connection was successful.");
                localStorage.removeItem('SummitPointCart');
                $scope.submitted = true;
            })
            .catch(function(error){
                //errors for troubleshooting
                console.log("Ajax transmission test");
                console.error("Destination 'api/checkout' Not Found");
                console.error("HTTP Response Code:", error.status);
                //clear the cart
                localStorage.removeItem('SummitPointCart');
                $scope.submitted = true;
            });
    };

//-----------Calculate the Cart Total-----------------
function calculateOrderTotal(){
    var totalCost = 0;
    $scope.savedSpeakers.forEach(function(speaker){
        speaker.topicSelections.forEach(function(topic){
            if(topic.selected){
                //rate x duration 
                totalCost += (Number(speaker.rate) * Number(topic.duration));
            }
        });
    });
    return totalCost.toFixed(2); //formats to 2 decimal places
}


