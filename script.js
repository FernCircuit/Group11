// FORM VALIDATION
// ----------------------------------------
// 1. DEFINE THE FUNCTIONS
// ----------------------------------------
// a.) Check for illegal characters: Look for anything NOT (^) A-Z, a-z, space (\s), or hypen (-)
function validateInput(input, uniqueMsg){ 
  const invalid = /[^A-Za-z\s-]/;
  let errorMsg = input.nextElementSibling;
  if(input.value === ""){
    errorMsg.textContent = "This field is required.";
  }else if (invalid.test(input.value)){
    errorMsg.textContent = uniqueMsg;
  }else {
    errorMsg.textContent = "";
  }
}
// b.) Verify email is valid
function validateEmail(input, uniqueMsg){
  let errorMsg = input.nextElementSibling;
  if(input.value === ""){
    errorMsg.textContent = "Email is required";
  }else if(!input.value.includes("@")){
    errorMsg.textContent = uniqueMsg;
  }else{
    errorMsg.textContent = "";
  }
}
// c.) Verify phone number is valid
function validatePhone(input, uniqueMsg){
  let errorMsg = input.nextElementSibling;
  if (input.value === ""){
    errorMsg.textContent = "Phone number is required.";
  } else if (input.value.length < 10){
    errorMsg.textContent = uniqueMsg;
  } else{
    errorMsg.textContent = "";
  }
}

// ------------------------------------
// 2. GET ALL INPUTS FROM THE FORM
// ------------------------------------
let fName = document.getElementById('poc-firstname'); //Store POC First Name
let lName = document.getElementById('poc-lastname'); //Store POC Last Name
let email = document.getElementById('poc-email'); //Store POC Email
let phone = document.getElementById('poc-phone'); //Store POC Phone
let radioBtns = document.getElementsByName('poc-method'); //Get radio buttons from form
let dropdown1 = document.getElementById('max-attendees'); // Get the dropdown
let orgName = document.getElementById('org-name'); //Store Organization Name
let dropdown2 = document.getElementById('org-industry'); //Get the dropdown
let startDate = document.getElementById('org-date-start');
let endDate = document.getElementById('org-date-end');
let specReqs = document.getElementById('org-requests');
let signupForm = document.getElementById('sign-up');
//---------------------------------
// 3. VALIDATE THE INPUTS
//---------------------------------
// add event listener to wait for user submits
signupForm.addEventListener("submit", function(event){
  validateInput(fName, "Please enter valid first name.");
  validateInput(lName, "Please enter valid last name.");
  validateEmail(email, "Email address must includ an @ symbol.");
  validatePhone(phone, "Please enter a valid 10-digit phone number.");

  // Get the preferred contact setting
  let contactMethod = "email"; // Set a default contact method
  // (extract value from the radio buttons if checked):
  for(let radio of radioBtns){ // Loop through ratio buttons
    if(radio.checked){ // Find checked radios and store value
      contactMethod = radio.value;
      break;
    }
  }
  // Get dropdown values
  const numAttendees = dropdown1.value; // Store value from dropdown
  const orgIndustry = dropdown2.value; // Store value from dropdown

  // START JSON---------------------

  let userObj = {
    fullname: fName.value + " " + lName.value,
    email: email.value,
    phone: phone.value,
    age: age.value,
    address: address.value,
    preferredContact: contactMethod,
    organization: orgName.value,
    maxAttendeesRequested: dropdown1.value,
    organizationIndustry: dropdown2.value   
  };

  let userJsonStr = JSON.stringify(userObj,null,2);

  let blob = new Blob([userJsonStr],{type:"application/json"});
  let downloadLink = document.createElement("a");

  downloadLink.download = "members.json";
  downloadLink.href = URL.createObjectURL(blob);

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  alert("Form submitted successfully! We'll be in touch soon!");
});





    

