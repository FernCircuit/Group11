//-----------JS VALIDITY CHECKS FUNCTION---------------------
//--------------------------------------------------
function validateForm(formData){ //formData gives access to the angular file which I had to split up after much frustration
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
    var fname = formData.firstName || "";
    var lname = formData.lastName || "";
    var phone = formData.phoneNumber || "";
    var email = formData.email || "";
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
