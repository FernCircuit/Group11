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
            if(speaker.topicSelections && speaker.topicSelections.length > 0){
                return speaker;
            }
            var topics = speaker.availableTopics || [];
            speaker.topicSelections = topics.map(function(topicName){
                return{
                    name:topicName,
                    selected:false,
                    type: "In-Person", //in-person default
                    duration:"1.0" //1hr default
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
                var rate = parseFloat(speaker.rate) || 0;
                var duration = parseFloat(topic.duration) || 0;
                totalCost += (rate * duration);
            }
        });
    });
    return totalCost.toFixed(2); //formats to 2 decimal places
}

//-----------JS VALIDITY CHECKS FUNCTION---------------------
//--------------------------------------------------
function validateForm(){ //formData gives access to the angular file which I had to split up after much frustration
    //get all of the fields
    let firstNameError = document.getElementById("firstNameError");
    let lastNameError = document.getElementById("lastNameError");
    let phoneError = document.getElementById("phoneError");
    let emailError = document.getElementById("emailError");
    //clear out the inner html text so any existing errors dissapear
    firstNameError.innerText = "";
    lastNameError.innerText = "";
    phoneError.innerText = "";
    emailError.innerText = "";
    //variables needed for error checking
    var isFormValid = true; //reset form to true
    const invalidChars = /[^A-Za-z\s-]/; //set invalid char: letters, spaces, hyphens
    //Validate the cart
    var selectedCount = 0;
    var cartValidationSuccess = true;
    $scope.savedSpeakers.forEach(function(speaker) {
        if (speaker.topicSelections) {
            speaker.topicSelections.forEach(function(topic) {
                if (topic.selected === true) {
                    selectedCount++;
                    // Verify Method is selected
                    if (!topic.type || topic.type.trim() === "") {
                        alert("Please select a Format (In-Person, Virtual, or VIP) for the session: " + topic.name);
                        cartValidationPassed = false;
                    }
                    // Verify duration added
                    if (!topic.duration || topic.duration.trim() === "") {
                        alert("Please select a Presentation Duration for the session: " + topic.name);
                        cartValidationPassed = false;
                    }
                }
            });
        }
    });
        
    //ERROR CHECKS START:
    //check for missing/invalid data
    var fname = $scope.contact.firstName || "";
    var lname = $scope.contact.lastName || "";
    var phone = $scope.contact.phoneNumber || "";
    var email = $scope.contact.email || "";
    //check firstname:
    if(fname == ""){
        firstNameError.innerText = "This field is required.";
        isFormValid = false; //set to false, ie dont send
    }else if (invalidChars.test(fname)){
        firstNameError.innerText = "* Please enter valid first name.";
        isFormValid = false;
    }
    //check lastname:
    if(lname == ""){
        lastNameError.innerText = "This field is required.";
        isFormValid = false;
    } else if (invalidChars.test(lname)){
        lastNameError.innerText = "Please enter valid last name.";
        isFormValid = false;
    }
    //check phone number:
    if(phone == ""){
        phoneError.innerText = "This field is required.";
        isFormValid = false;
    } else if(phone.length < 10){
        phoneError.innerText = "Please enter a valid 10-digit phone number.";
        isFormValid = false;
    }
    //check email:
    if(email == ""){
        emailError.innerText = "This field is required.";
        isFormValid = false;
    } else if (!email.includes("@")){
        emailError.innerText = "Please enter valid email address.";
        isFormValid = false;
    }
    return isFormValid;
    }
});
