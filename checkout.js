//----Angular JS For Checkout Submission------
//----used to build dynamic web apps without rewriting the entire html page
//initialize the app: (checkoutApp must match in html file)
var app = angular.module("checkoutApp", []);
//controller & $scope: everything with $scope connects js to html
app.controller("CheckoutController", function($scope, $http) { //added $http to connect to ajax

    //Speaker type - create the form data models
    $scope.speaker = {
        type: ""
    };
    //Speaker details
    $scope.contact = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    };
    // Create an array to hold the saved speakers
    $scope.savedSpeakers = [];

    // Load the shopping cart from localStorage
    var storedSpeakers = localStorage.getItem("SummitPointCart");

    if(storedSpeakers){
        var origCart = JSON.parse(storedSpeakers);
        $scope.savedSpeakers = origCart.map(function(speaker){
            var topics = speaker.availableTopics [];
            speaker.topicSelections = topics.map(function(topicName){
                return{
                    name:topicName,
                    selected:false,
                    duration:1
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

//-----------JS VALIDITY CHECKS FUNCTION---------------------
//--------------------------------------------------
function validateForm(){
    //get all of the fields
    let firstNameError = document.getElementById("firstNameError");
    let lastNameError = document.getElementById("lastNameError");
    let typeError = document.getElementById("typeError");
    let phoneError = document.getElementById("phoneError");
    let emailError = document.getElementById("emailError");
    //clear out the inner html text so any existing errors dissapear
    firstNameError.innerText = "";
    lastNameError.innerText = "";
    typeError.innerText = "";
    phoneError.innerText = "";
    emailError.innerText = "";
    //variables needed for error checking
    var isFormValid = true; //reset form to true
    const invalidChars = /[^A-Za-z\s-]/; //set invalid char: letters, spaces, hyphens
    //ERROR CHECKS START:
    //check for missing/invalid data
    //check firstname:
    if($scope.contact.firstName == ""){
        firstNameError.innerText = "This field is required.";
        isFormValid = false; //set to false, ie dont send
    }else if (invalidChars.test($scope.contact.firstName)){
        firstNameError.innerText = "* Please enter valid first name.";
        isFormValid = false;
    }
    //check lastname:
    if($scope.contact.lastName == ""){
        lastNameError.innerText = "This field is required.";
        isFormValid = false;
    } else if (invalidChars.test($scope.contact.lastName)){
        lastNameError.innerText = "Please enter valid last name.";
        isFormValid = false;
    }
    //check speaker type:
    if($scope.speaker.type == ""){
        typeError.innerText = "This field is required.";
        isFormValid = false;
    } 
    //check phone number:
    if($scope.contact.phoneNumber == ""){
        phoneError.innerText = "This field is required.";
        isFormValid = false;
    } else if($scope.contact.phoneNumber.length < 10){
        phoneError.innerText = "Please enter a valid 10-digit phone number.";
        isFormValid = false;
    }
    //check email:
    if($scope.contact.email == ""){
        emailError.innerText = "This field is required.";
        isFormValid = false;
    } else if (!$scope.contact.email.includes("@")){
        emailError.innerText = "Please enter valid email address.";
        isFormValid = false;
    }
    return isFormValid;
    }
});
