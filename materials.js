//FETCH THE FILE
fetch('materials.json') //this sends request to grab the json file
  .then(function(incomingFile) { //implements function once the file arrives
    return incomingFile.json(); //this returns the ready to use data. json() parses the data to readable format
  })
//PREPARE THE DATA
  .then(function(cleanData){ //now take the data and format it for entry
    
    console.log(cleanData); //this prints to console to view first - optional
    let table = document.getElementById('tablename');
    table.innerHTML=''; //clears out the entire table. This is required so the table can be refreshed with new items
    let id = 1;
    cleanData.forEach(function(material){
      let row = document.createElement('tr');
      row.innerHTML = '<td>'+material.id+'</td>'+'<td>'
        +'<td>'+material.name+'</td>'
        +'<td>'+material.category+'</td>'
        +'<td>'+material.quantity+'</td>'
        +'<td>'+material.price+'</td>'
        +'<td><button class="modify-btn">Modify</button></td>'
        +'<td><button class="delete-btn">Delete</button></td>';
      tableBody.appendChild(row);

let name = document.getElementById("material-name");
let category = document.getElementById("material-category");
let quantity = document.getELementById("material-quantity");
let price = document.getElementById("material-price");






/* FORM COPY FROM MATERIALS.HTML, FOR REFERENCE
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
