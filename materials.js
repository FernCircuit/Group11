//FETCH THE JSON FILE & CHECK LOCALSTORAGE--------------------------------------------
let allMaterials = []; //array to store list of materials
let savedList = localStorage.getItem('SummitPointInventory');
if (savedList){
  allMaterials = JSON.parse(savedList);
  loadTable();
}else{
fetch('materials.json') //this sends request to grab the json file
  .then(function(incomingFile) { //implements function once the file arrives
    return incomingFile.json(); //this returns the ready to use data. json() parses the data to readable format
  })
//PREPARE THE DATA METHOD------------------------------------------------------------
  .then(function(cleanData){ //now take the data and format it for entry
    allMaterials = cleanData; //fill array with clean json data
    localStorage.setItem('SummitPointInventory', JSON.stringify(allMaterials));
    loadTable();
  })
.catch(function(error){ //report error if something didn't load properly
  console.error('Inventory could not be loaded: ', error);
});
}

//LOAD THE TABLE FUNCTION------------------------------------------------------------
//this function also refreshes when delete, add, and modify are done
function loadTable(){ 
    let tBody = document.getElementById('material-table-body');
    tBody.innerHTML=''; //clears out the entire table. This is required so the table can be refreshed with new items
    allMaterials.forEach(function(item){
      let row = document.createElement('tr');
      let formatId = ("00"+item.id).slice(-3); //this formats the id to only 3 digits beginning in 00
      row.setAttribute('data-id', item.id);
      row.innerHTML = '<td>MAT-'+item.id+'</td>'
        +'<td class="isEditable">'+item.name+'</td>'
        +'<td class="isEditable">'+item.category+'</td>'
        +'<td class="isEditable">'+item.quantity+'</td>'
        +'<td class="isEditable">$'+item.price+'</td>'
        +'<td><button class="btn btn-sm btn-outline-primary modify-btn" id="modify-btn" data-id="'+item.id+'">Modify</button>'
        +'<button class="btn btn-sm btn-outline-danger delete-btn" id="delete-btn" data-id="'+item.id+'">Delete</button></td>';
      tBody.appendChild(row);
    });
  };

//DELETE ITEMS FUNCTION----------------------------------------------------
function deleteMaterial(materialId){
  // ask the user if they're sure about deleting... very important
  //confirm() - built in browser engine command. triggers small popup and freezes execution
  //let confirmDelete - OK saves the user's preference to true; CANCEL assigns false
  let confirmDelete = confirm(`You are deleting item MAT-${materialId}? Are you sure? This cannot be undone.`); //trying backticks ` vs +
  if(!confirmDelete){ //looks for FALSE
    return; //stops the function from continuing
  }
  let targetItem = Number(materialId); //built in js function converts the string to a number
  allMaterials = allMaterials.filter(function(item){ //this function filters out the target item and updates the entire list
    return item.id !== targetItem; //returns every item except the targetItem
  });
  localStorage.setItem('SummitPointInventory', JSON.stringify(allMaterials)); //this line turns the new list back to a string and updates localStorage
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
      item.price = Number(editableCells[3].textContent);
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
  addMaterial(event);
});
    //event listener for the table modify/delete buttons
document.getElementById('material-table-body').addEventListener('click', function(event){
  let row = event.target.closest('tr');
  if(!row) { return; }
  let materialId = row.getAttribute('data-id');
  if(event.target.closest('.modify-btn')){ //tried .classList.contains here but due to something with bootstrap, .closest is better
    modifyMaterial(materialId, event.target.closest('.modify-btn')); //call the modifyMaterial function
  }
  if(event.target.closest('.delete-btn')){
    deleteMaterial(materialId); 
  }
}); 


/*
dev notes - fetch is a built-in function provided by the web browser
but it doesn't automatically give back the data so it can load properly.
It hands back a Promise. The .then() is a method that runs once the file comes back.
.then() methods are sequential, happening in the order they appear

FORM COPY FROM MATERIALS.HTML, FOR REFERENCE
<form>
      <fieldset>
            <div class="form-item mb-3">
              <label class="visually-hidden" for="material-name">Material name</label>
              <input class="material-name" type="text" name="material-name" id="material-name" placeholder="Material Name">
            </div>
            <div class="form-item mb-3">
              <label class="visually-hidden" for="material-category">Material category</label>
              <input class="material-category" type="text" name="material-category" id="material-category" placeholder="Category">
            </div>
            <div class="form-item mb-3">
              <label class="visually-hidden" for="material-quantity">Material quantity</label>
              <input class="material-quantity" type="text" name="material-quantity" id="material-quantity" placeholder="Quantity">
            </div>
            <div class="form-item mb-3">
              <label class="visually-hidden" for="material-price">Material price</label>
              <input class="material-price" type="text" name="material-price" id="material-price" placeholder="Price">
            </div>
        </fieldset>
            <input type="submit" name="add-material" value="Add material">
      </form> 
      */
