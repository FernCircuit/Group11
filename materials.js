//FETCH THE FILE
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
//PREPARE THE DATA
  .then(function(cleanData){ //now take the data and format it for entry
    localStorage.setItem('SummitPointInventory', JSON.stringify(allMaterials));
    loadTable();
  })
.catch(function(error){ //report error if something didn't load properly
  console.error('Inventory could not be loaded: ', error);
});

//LOAD THE TABLE - this function also refreshes when delete, add, and modify are done
function loadTable(){ 
    let tBody = document.getElementById('');
    tBody.innerHTML=''; //clears out the entire table. This is required so the table can be refreshed with new items
    let id = 1;
    allMaterials.forEach(function(item){
      let row = document.createElement('tr');
      row.innerHTML = '<td>'+item.id+'</td>'+'<td>'
        +'<td>'+item.name+'</td>'
        +'<td>'+item.category+'</td>'
        +'<td>'+item.quantity+'</td>'
        +'<td>'+item.price+'</td>'
        +'<td><button class="modify-btn">Modify</button><button class="delete-btn">Delete</button></td>';
      tBody.appendChild(row);
    });
  };


/*//DELETE ITEMS
function deleteMaterial(materialId){
  allMaterials = allMaterials.filter(function(item){
    return item.id !== materialId;
    
//MODIFY
function modifyMaterial(materialId){
  let targetItem = allMaterials.find(function(item){
    return item.id === materialId;
  });

let nameInput = document.getElementById("material-name");
let categoryInput = document.getElementById("material-category");
let quantityInput = document.getElementById("material-quantity");
let priceInput = document.getElementById("material-price");


/* dev notes - fetch is a built-in function provided by the web browser
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
      </form> */
