
//FETCH THE JSON FILE & CHECK LOCALSTORAGE--------------------------------------------
let allSpeakers = []; //array to store list of speakers to choose
let shoppingCart = []; //create a separate array to store cart items

//this function loads the tables
async function getData(){
  try{
    const savedList = localStorage.getItem('SummitPointSpeakers');
    const savedCart = localStorage.getItem('SummitPointCart');

    // this loads the current localStorage records for speakers
    if (savedList){
      allSpeakers = JSON.parse(savedList); //if the record is already in localStorage, then save to allSpeakers array
    }else{
      const response = await fetch('speakers.json');
      if(!response.ok){
        throw new Error(`Could not load file: ${response.status}`);//couldn't get from localStorage
      }
      allSpeakers = await response.json();
      localStorage.setItem('SummitPointSpeakers',JSON.stringify(allSpeakers));
    }
      // now load the new shopping cart if one already saved to localStorage
      if(savedCart){
        shoppingCart = JSON.parse(savedCart);
      }

      loadTable();
      loadShoppingCart();
  }catch(error){
    console.error('Speakers could not be loaded: ', error);
    }
}
getData();
        

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

      // is the speaker already in the cart:
      let isAlreadyInCart = false;
      for(let i=0; i < shoppingCart.length; i++){
        if(shoppingCart[i].id === item.id){
          isAlreadyInCart = true;
          break;
      }
    }
    let buttonText = isAlreadyInCart ? "Added!" : "Add to Cart";
    let buttonClass = isAlreadyInCart ? "btn-success" : "btn-outline-primary";
    let isDisabled = isAlreadyInCart ? "disabled" : "";
  
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
  let cart = document.getElementById('cart-table-body');
  if(!cart) { return; }
  cart.innerHTML = '';

  shoppingCart.forEach(function(item){
    let row = document.createElement('tr');
    let formatId = ("00"+item.id).slice(-3); //this formats the id to only 3 digits beginning in 00
    row.setAttribute('data-id', item.id);

    let buttonText = "Delete";
    let buttonClass = "btn-outline-danger";
    
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
  for (let i=0; i < shoppingCart.length; i++){
    if (shoppingCart[i].id ===targetId){
      existingCartItem = shoppingCart[i];
      break;
    }
  }
  //blocks duplicate entries
    if(existingCartItem !== null){
        alert("Speaker already added to cart!");
        return;
      }
      let speakerMatch = null;
      for(let j=0; j < allSpeakers.length; j++){
        if(allSpeakers[j].id === targetId){            
          speakerMatch = allSpeakers[j];
          break;
          }
        }
        if(speakerMatch !== null){
        shoppingCart.push(speakerMatch);
      }
      localStorage.setItem('SummitPointCart', JSON.stringify(shoppingCart));
      loadShoppingCart();
      loadTable();
  }
  
//TOGGLE DELETE/UNDO
function toggleDeleteCartItem(speakerId){
  let targetId = Number(speakerId);
  shoppingCart = shoppingCart.filter(function(item){
    return item.id !== targetId;
  });
  localStorage.setItem('SummitPointCart', JSON.stringify(shoppingCart));
  loadShoppingCart();
  loadTable();
}

//AJAX TO RESTFUL API -------------------------------------------------------
async function checkout(){
  if (shoppingCart.length === 0){
    alert("Cart is empty");
    return;
  }

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

  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function(){
    if(xhr.status >= 200 && xhr.status < 300){
      alert("Success! Cart layout processed");
    }else{
      console.error("Transmission Error: ", xhr.status);
    }
  });
  xhr.open("POST", "https://ferncircuit.github.io/");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(formatCart));
}
    

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
  if(event.target.closest('.toggle-cart-delete-btn')){ //tried .classList.contains here but due to something with bootstrap, .closest is better
     toggleDeleteCartItem(speakerId);
  }
}); 
