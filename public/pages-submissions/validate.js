//-----------JS VALIDITY CHECKS FUNCTION---------------------
//--------------------------------------------------
function validateSessionForm(submissionData, chosenSpeaker){
    //get all of the fields
    let titleError = document.getElementById("titleError");
    let timeError = document.getElementById("timeError");
    let durationError = document.getElementById("durationError");
    let categoryError = document.getElementById("categoryError");
    let speakerError = document.getElementById("speakerError");
    let abstractError = document.getElementById("abstractError");
   
    //clear out the inner html text so any existing errors dissapear
    titleError.innerText = "";
    timeError.innerText = "";
    durationError.innerText = "";
    categoryError.innerText = "";
    speakerError.innerText="";
    abstractError.innerText="";

    //variables needed for error checking
    var isFormValid = true; //reset form to true
    const invalidChars = /[^A-Za-z\s-]/; //set invalid char: letters, spaces, hyphens

    //ERROR CHECKS START:
    //check for missing/invalid data
    var title = (submissionData.title || "").trim();
    var time = submissionData.time || "";
    var duration = submissionData.duration;
    var category = (submissionData.category || "").trim();
    var speaker = (chosenSpeaker || "").trim();
    var abstract = (submissionData.abstract || "").trim();

    //check title:
    if(title == ""){
        titleError.innerText = "This field is required.";
        isFormValid = false; //set to false, ie dont send
    }
    //check time:
    if(time == ""){
        timeError.innerText = "This field is required.";
        isFormValid = false;
    }
    //check duration:
    if(!duration || duration < 15){
        durationError.innerText = "Please enter valid duration (15+ minutes).";
        isFormValid = false;
    }

    //check category
    if(category == ""){
        categoryError.innerText = "This field is required.";
        isFormValid = false;
    }
    //check speaker:
    if(speaker == ""){
        speakerError.innerText = "This field is required.";
        isFormValid = false;
    } else if (invalidChars.test(speaker)){
        speakerError.innerText = "Please enter a valid speaker name.";
        isFormValid = false;
    }
    //check abstract
    if(abstract === ""){
        abstractError.innerText = "This field is required.";
        isFormValid = false;
    }
    return isFormValid;
}

//validate contact details
function validateContactForm(contactData){
    let emailError = document.getElementById("emailError");
    let phoneError = document.getElementById("phoneError");

    //clear existing errors
    emailError.innerText = "";
    phoneError.innerText = "";
    
    var isFormValid = true; //set true by default
    var email = (contactData.email || "").trim();
    var phone = (contactData.phoneNumber || "").trim();
    var digits = phone.replace(/\D/g, "");//get digits only

    if(email === ""){
        emailError.innerText = "This field is required.";
        isFormValid = false;
    }
    if(phone ===""){
        phoneError.innerText = "This field is required.";
        isFormValid = false;
    }else if(digits.length<10){
        phoneError.innerText = "Please enter a valid 10-digit phone number.";
        isFormValid = false;
    }
    return isFormValid;
}
