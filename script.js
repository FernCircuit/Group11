// FORM VALIDATION
// DEFINE FUNCTIONS:
// 1. Check illegal characters: Look for anything NOT (^) A-Z, a-z, space (\s), or hypen (-)
function validateInput(input, errorMsg){ 
  const invalid = /[^A-Za-z\s-]/;
  let errorMsg = input.nextElementSibling;
  // Test input against invalid
  if (invalid.test(input.value)){
    errorMsg.textContent = "Please enter a valid name";
  }else{
    errorMsg.textContent = "";
  }
}
// 2. Check 
    
// 1. Retrieve inputs in form
let fName = document.getElementById('poc-firstname');
let lName = document.getElementById('poc-lastname');
let email = document.getElementById('poc-email');
let phone = document.getElementById('poc-phone');
let radioBtns = document.getElementsByName('poc-method');
let contactMethod = "email"; //default
// (extract value from the radio buttons if checked):
for(let radio of radioBtns){
  if(radio.checked){
    contactMethod = radio.value;
    break;
  }
}
let numAttendees = document.getE


validateInput(fName);
    

