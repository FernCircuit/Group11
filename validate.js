//-----------JS VALIDITY CHECKS FUNCTION---------------------
//--------------------------------------------------
function validateForm(){
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
