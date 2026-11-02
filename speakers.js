
//FETCH THE JSON FILE & CHECK LOCALSTORAGE--------------------------------------------
//Create arrays to hold speaker list and shopping cart:
let allSpeakers = []; //array to store list of speakers to choose
let shoppingCart = []; //create a separate array to store cart items
//Main function loads the tables
async function getData(){ //async declares function will run in the background
  try{
    //check if there is a localStorage list in the user's cache
    const savedList = localStorage.getItem('SummitPointSpeakers');
    const savedCart = localStorage.getItem('SummitPointCart');
    // this loads the current localStorage records for speakers
    if (savedList){ 
      allSpeakers = JSON.parse(savedList); //if the record is already in localStorage, then save to allSpeakers array
    }else{
      const response = await fetch('speakers.json'); //if not, look for the stored json file
      if(!response.ok){ //error response
        throw new Error(`Could not load file: ${response.status}`);//couldn't get from localStorage
      }
      allSpeakers = await response.json(); //await pauses js until it receives the file
      localStorage.setItem('SummitPointSpeakers',JSON.stringify(allSpeakers)); //JSON stringify
    }
      // now load the new shopping cart if one already saved to localStorage
      if(savedCart){
        shoppingCart = JSON.parse(savedCart);
      }
      loadTable(); //call loadTable() to refresh the table
      loadShoppingCart(); //refresh the shopping cart
  }catch(error){ //error call
    console.error('Speakers could not be loaded: ', error);
    }
}
getData();//calls the main function above which loads from other functions below
        

//LOAD THE TABLE FUNCTION------------------------------------------------------------
//this function also refreshes when delete, add, and modify are done
function loadTable(){ 
    let tBody = document.getElementById('speaker-table-body');
    if(!tBody) { return };
    tBody.innerHTML=''; //clears out the entire table. This is required so the table can be refreshed with new items
    //fill table with speakers:
    allSpeakers.forEach(function(item){
      let row = document.createElement('tr');
      let formatId = ("00"+item.id).slice(-3); //this formats the id to only 3 digits beginning in 00
      row.setAttribute('data-id', item.id);
      // is the speaker already in the cart?
      let isAlreadyInCart = false;
      for(let i=0; i < shoppingCart.length; i++){
        if(shoppingCart[i].id === item.id){
          isAlreadyInCart = true;
          break;
      }
    }
    //assigns the text/classes to the button we're toggling
    let buttonText = isAlreadyInCart ? "Added!" : "Add to Cart";
    let buttonClass = isAlreadyInCart ? "btn-success" : "btn-outline-primary";
    let isDisabled = isAlreadyInCart ? "disabled" : "";
    //print contents
    row.innerHTML = `<td>SPK-${formatId}</td>
    <td>${item.firstname}</td>
    <td>${item.lastname}</td>
    <td>${item.specialty}</td>
    <td>$${item.rate}</td>
    <td><button class="btn btn-sm ${buttonClass} add-btn" ${isDisabled} data-id="${item.id}">${buttonText}</button></td>`;
    tBody.appendChild(row);
    });
  };

//LOAD THE SHOPPING CART-----------------------------------------------
function loadShoppingCart(){
  let cart = document.getElementById('cart-table-body'); //target the cart table
  if(!cart) { return; } //if now, leave it
  cart.innerHTML = ''; //grab the innerHTML rows
  shoppingCart.forEach(function(item){ //loop to create the shopping cart rows
    let row = document.createElement('tr'); //create a row
    let formatId = ("00"+item.id).slice(-3); //this formats the id to only 3 digits beginning in 00
    row.setAttribute('data-id', item.id);
    //assign button text and class
    let buttonText = "Delete";
    let buttonClass = "btn-outline-danger";
    //print results
    row.innerHTML = `<td>SPK-${formatId}</td>
    <td>${item.firstname} ${item.lastname}</td>
    <td>${item.rate}</td>
    <td><button class="btn btn-sm ${buttonClass} toggle-cart-delete-btn">${buttonText}</button></td>`;
    cart.appendChild(row);
  });
}

//ADD SPEAKER TO CART---------------------------------------------
function addSpeaker(speakerId){
  let targetId = Number(speakerId);
  let existingCartItem = null;
  //check if the speaker already exists in the cart:
  for (let i=0; i < shoppingCart.length; i++){
    if (shoppingCart[i].id === targetId){ //match found
      existingCartItem = shoppingCart[i]; //add to existing list variable
      break;
    }
  }
  //this blocks duplicate entries by sending an alert if speaker already in the existing cart list
    if(existingCartItem !== null){
        alert("Speaker already added to cart!");
        return;
      }
      let speakerMatch = null;
      //this look loops through the speaker list to get all the data 
      for(let j=0; j < allSpeakers.length; j++){
        if(allSpeakers[j].id === targetId){            
          speakerMatch = allSpeakers[j];
          break;
          }
        }
        if(speakerMatch !== null){ //this if statement adds (push) speaker to shopping cart
        shoppingCart.push(speakerMatch);
      }
      //save the new list in the user's cache
      localStorage.setItem('SummitPointCart', JSON.stringify(shoppingCart));
      //refresh the table and cart
      loadShoppingCart();
      loadTable();
  }
  
//TOGGLE DELETE/UNDO
function toggleDeleteCartItem(speakerId){
  let targetId = Number(speakerId);//convert id to number so it compares ok
  //look for item.id where it matches targetId - look for selected speaker
  shoppingCart = shoppingCart.filter(function(item){
    return item.id !== targetId; //keep all items that do not match the selected speaker
  });
  //save to user's cache
  localStorage.setItem('SummitPointCart', JSON.stringify(shoppingCart));
  //refresh the tables
  loadShoppingCart();
  loadTable();
}

//AJAX TO RESTFUL API -------------------------------------------------------
async function checkout(){
  //if(event) event.preventDefault(); //prevents page from refreshing automatically
  //block it if the cart is empty:
  if (shoppingCart.length === 0){
    alert("Cart is empty");
    return;
  }
  //format cart for JSON backend
  const formatCart = {
    "sendDate": new Date().toISOString(),
    "numItems": shoppingCart.length,
    "items": shoppingCart.map(function(item){
      return{
        "id": item.id,
        "name": `${item.firstname} ${item.lastname}`,
        "rate": Number(item.rate)
      };
    })
  };
  //change checkout button text (KEEP FOR NEXT PART - FINALIZE PAGE)
  const checkoutBtn = document.getElementById('checkout-btn');
  if(checkoutBtn){
    checkoutBtn.innerText = "Sent!"; //change text to sent
    checkoutBtn.className = "btn btn-success"; //bootstrap turns button green
  //create new XMLHttpRequest
  const xhr = new XMLHttpRequest();
  //this is what happens when the request loads (KEEP FOR NEXT PART - FINALIZE PAGE)
  xhr.addEventListener("load", function(){
    //check for successful http codes 200 OK (200-299) - good practice!
    if(xhr.status >= 200 && xhr.status < 300){
      alert("Success! Cart layout processed");
      //clear out the cart, localStorage, and refresh tables:
      shoppingCart =[];
      localStorage.removeItem('SummitPointCart');
      loadShoppingCart();
      loadTable();
      //now, redirect to checkout form
      //window.location.href = "checkout.html"; (KEEP FOR NEXT PART)
    }else{
      console.error("Transmission Error: ", xhr.status); //else print error
    }
  });
  /* (COMMENTED OUT FOR NOW) (NEEDED FOR NEXT PART)
  //contains necessary data to send the form to backend (POST)
  xhr.open("POST", "https://ferncircuit.github.io/checkout");
  //formats the http header:
  xhr.setRequestHeader("Content-Type", "application/json");
  //send the JSON to backend
  xhr.send(JSON.stringify(formatCart));
}
*/
    
//EVENT LISTENERS ----------------------------------------------------------
    //add speaker to cart
document.getElementById('speaker-table-body').addEventListener('click', function(event){
  let row = event.target.closest('tr');
  if(!row) { return; }
  let speakerId = row.getAttribute('data-id');
  if(event.target.closest('.add-btn')){
  addSpeaker(speakerId);
  }
});
    //toggle delete/undo button
document.getElementById('cart-table-body').addEventListener('click', function(event){
  let row = event.target.closest('tr');
  if(!row) { return; }
  let speakerId = row.getAttribute('data-id');
  if(event.target.closest('.toggle-cart-delete-btn')){ //tried .classList.contains here but due to something with bootstrap
     toggleDeleteCartItem(speakerId);
  }
});
  //check out button
document.getElementById('checkout-btn').addEventListener('click', checkout); //when clicked, run checkout() function
  
