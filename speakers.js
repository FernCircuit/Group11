
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
        localStorage.setItem('SummitPointSpeakers', JSON.stringify(allSpeakers);
      }

      // now load the new shopping cart if one already saved to localStorage
      if(savedCart){
        shoppingCart = JSON.parse(savedCart);
      }

      loadSpeakers();
      loadCart();
  }catch(error){
    console.error('Speakers could not be loaded: ', error);
    }
}
getSpeakers();
        

//LOAD THE TABLE FUNCTION------------------------------------------------------------
//this function also refreshes when delete, add, and modify are done
function loadTable(){ 
    let tBodyOptions = document.getElementById('speaker-table-body');
    if(!tBody) { return };
    tBody.innerHTML=''; //clears out the entire table. This is required so the table can be refreshed with new items
    //fill table with speakers:
    allSpeakers.forEach(function(item){
      let row = document.createElement('tr');
      let formatId = ("00"+item.id).slice(-3); //this formats the id to only 3 digits beginning in 00
      row.setAttribute('data-id', item.id);
      row.innerHTML = `<td>SPK-${formatId}</td>
        <td class="isEditable">${item.firstname}</td>
        <td class="isEditable">${item.lastname}</td>
        <td class="isEditable">${item.specialty}</td>
        <td class="isEditable">$${item.rate}</td>
        <td><button class="btn btn-sm btn-outline-primary add-btn" data-id="${item.id}">Add to Cart</button></td>`;
      tBody.appendChild(row);
    });
  };

//LOAD THE SHOPPING CART
function loadShoppingCart(){
  let cart = document.getElementById('cart-table-body');
  if(!cart) { return; }
  cart.innerHTML = '';

  shoppingCart.forEach(function(item){
    let row = document.createElement('tr');
    let formatId = ("00"+item.id).slice(-3); //this formats the id to only 3 digits beginning in 00
    row.setAttribute('data-id', item.id);

    let rowClass = item.deleted ? "row-deleted" : "";
    let buttonText = item.deleted ? "Undo" : "Delete";
    let buttonClass = item.deleted ? "btn-warning" : "btn-outline-danger";

    if(item.deleted){
      row.classList.add('row-deleted');
    }
    row.innerHTML = `<td>SPK-${formatId}</td>
    <td>${item.firstname} ${item.lastname}</td>
    <td>${item.specialty}</td>
    <td>${item.price}</td>
    <td><button class="btn btn-sm ${buttonClass} toggle-cart-delete-btn">${buttonText}</button></td>`;
    cart.appendChild(row);
  });
}

//ADD SPEAKER TO CART
function addSpeaker(speakerId){
  let targetId = Number(speakerId);
  let existingCartItem = null;
  for (let i=0; i < shoppingCart.length; i++){
    if (shoppingCart[i].id ===targetId){
      existingCartItem = shoppingCart[i];
      break;
    }
  }
    if(existingCartItem !== null){
      if(existingCartItem.deleted === true){
        existingCartItem.deleted = false;
      }else{
      alert("Speaker is already in shopping cart!");
      return;
    }
  }else{
    let speakerMatch = null;
      for (let j=0;j<allSpeakers.length; j++){
        if(allSpeakers[j].id ===targetId){
          speakerMatch = allSpeakers[j];
          break;
        }
      }
        
    if(speakerMatch !== null){
      speakerMatch.deleted = false;
      shoppingCart.push(speakerMatch);
      }
    }
      localStorage.setItem('SummitPointCart', JSON.stringify(shoppingCart));
      loadCartTable();
  }
  
      
//DELETE ITEMS FUNCTION----------------------------------------------------
function removeSpeaker(speakerId){
  //took out the verification alert here in favor of toggling UNDO button
  //find the speaker
  let targetItem = Number(speakerId); //built in js function converts the string to a number
  allSpeakers = allSpeakers.map(function(item){ //this function filters out the target item and updates the entire list
    if (item.id === targetItem){
      item.deleted = !item.deleted;
      
    }; //returns every item except the targetItem
  });
  localStorage.setItem('SummitPointSpeakers', JSON.stringify(allSpeakers)); //this line turns the new list back to a string and updates localStorage
  loadTable(); //load table without the item that was deleted
}

//MODIFY ITEMS FUNCTION-----------------------------------------------------
function modifyMaterial(materialId, button){
  let row = document.querySelector(`tr[data-id="${materialId}"]`); //select the row to modify
  if(!row){return;} //if row doesn't exist, end function
  let editableCells = row.querySelectorAll('.isEditable'); //retrieve all the editable fields
  // TOGGLE the buttons between modify and save
  if(button.innerText === "Modify"){
    row.classList.add('editThis'); //if the row is not currently editable, add this class to make it so
    editableCells.forEach(function(cell){
      cell.contentEditable = "true"; // editableCells contained all the editable fields in the row, cycle through them and make them editable
    });
  editableCells[0].focus(); // focus the cursor on the first field so user can see it easily
  button.innerText = "Save"; // now we're in save mode, change button text to save
  button.classList.add('saveThis'); //add new class to item
  }else{
    let targetId = Number(materialId); //if not modify, then do the saving things
    let item = allMaterials.find(function(item){ //find the target material out of the total list
      return item.id === targetId;
    });
    if (item){ //if item is found, save the all the cell data
      item.name = editableCells[0].textContent; //these lines are saving the new text to the JSON variables
      item.category = editableCells[1].textContent;
      item.quantity = Number(editableCells[2].textContent);
      let cleanPrice = editableCells[3].textContent.replace('\$','').trim();
      item.price = Number(cleanPrice);
      localStorage.setItem('SummitPointInventory', JSON.stringify(allMaterials)); //update the list in localStorage
    }
    loadTable(); //reload the table to show changes
    //this is a DOM refresh, not a browser refresh, so the user doesn't notice this update
  }
}

// ADD NEW ITEMS FUNCTION----------------------------------------------------------------
function addMaterial(event){
  event.preventDefault(); //stops the page from completely refreshing
  //get all the inputs from the form
  let nameInput = document.getElementById("material-name");
  let categoryInput = document.getElementById("material-category");
  let quantityInput = document.getElementById("material-quantity");
  let priceInput = document.getElementById("material-price");
  //error check for empty strings
  if(nameInput.value.trim()===""){
    alert("Please enter a material name.");
    return;
  }
  if(categoryInput.value.trim()===""){
    alert("Please enter a category.");
    return;
  }
  if(quantityInput.value.trim()===""){
    alert("Please enter a quantity.");
    return;
  }
  if(priceInput.value.trim()===""){
    alert("Please enter a price.");
    return;
  }
  //need to find the next id in the list
  let newId = 1;
  if(allMaterials.length > 0){
    for(let i=0; i < allMaterials.length; i++){ //loop through all materials array
      if(allMaterials[i].id >= newId){
        newId = allMaterials[i].id + 1; // newId equals the highest id + 1 more
      }
    }
  }
      let newItem = {
        id:newId,
        name: nameInput.value,
        category: categoryInput.value,
        quantity: Number(quantityInput.value),
        price: Number(priceInput.value)
      };
    //send new item to localstorage
      allMaterials.push(newItem);
      localStorage.setItem('SummitPointInventory', JSON.stringify(allMaterials));
      loadTable();
      //set form back to empty
      nameInput.value = "";
      categoryInput.value = "";
      quantityInput.value = "";
      priceInput.value= "";
}



//EVENT LISTENERS ----------------------------------------------------------
    //event listener for the form submit
document.querySelector('form').addEventListener('submit', function(event){
  addSpeakers(event);
});
    //event listener for the table add buttons
document.getElementById('material-table-body').addEventListener('click', function(event){
  let row = event.target.closest('tr');
  if(!row) { return; }
  let SpeakerId = row.getAttribute('data-id');
  if(event.target.closest('.add-btn')){ //tried .classList.contains here but due to something with bootstrap, .closest is better
    modifyMaterial(materialId, event.target.closest('.modify-btn')); //call the modifyMaterial function
  }
  if(event.target.closest('.delete-btn')){
    deleteMaterial(materialId); 
  }
}); 
