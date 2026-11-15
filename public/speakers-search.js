//JQUERY SEARCH FUNCTION
$(document).ready(function(){
    //SEARCH FILTER------------------------------------------------------
    $('#speaker-search').on('input keyup', function(event){ //listens for user typing (keyup)
        //event.preventDefault();
        var value=$(this).val().toLowerCase(); //makes the search case-insensitive
        $('#speaker-table-body tr').each(function(){ //target the speaker table - loop through
            var $row = $(this); //the current row
            //Look in the 2nd, 3rd, 4th columns (which match firstname, lastname, and specialty)
            var firstName = $row.find('td:nth-child(2)').text().toLowerCase();   //get firstname column
            var lastName = $row.find('td:nth-child(3)').text().toLowerCase();    //get lastname column
            var specialty = $row.find('td:nth-child(4)').text().toLowerCase();   //get specialty column
            //the search returns match if greater than -1 (-1 means not found in js)
            var matchFound = (firstName.indexOf(value) > -1 || 
                              lastName.indexOf(value) > -1 ||
                              specialty.indexOf(value) > -1);
            //test matchFound 
            if(matchFound){ 
                $row.show(); //show rows that match
            }else{
                $row.hide(); //hide rows that don't
            }
        });
    });
           
    //SORT ASCENDING--------------------------------------------------
    //on click listening event for the header buttons
    $('.table-header').on('click', '.icon-button', function(event){
        var $button = $(this);
        //filter buttons are arrow_up for ascending. This if checks the img src to determine:
        if($button.find('img[src*="arrow_up"]').length > 0) { //check img src
            var rows=$('#speaker-table-body tr').get(); //get all the table rows
            rows.sort(function(a,b){ //uses js sort function to sort the rows
                //a and b are the rows js is comparing in the moment
                var keyA = $(a).find('td:nth-child(2)').text().toLowerCase();
                var keyB = $(b).find('td:nth-child(2)').text().toLowerCase();
                return keyA.localeCompare(keyB); //js compares the values to sort
        });
        $.each(rows,function(index,row){
            $('#speaker-table-body').append(row);//appends the rows into the correct order
        });
     }
 });
    //SORT DESCENDING-------------------------------------------------
    //on click listening event for the header buttons
    $('.table-header').on('click', '.icon-button',function(event){
        event.preventDefault();
        var $button = $(this);
        //filter buttons are arrow_down for descending. Checks the img src to determine:
        if($button.find('img[src*="arrow_down"]').length > 0){ //check img src
            var rows=$('#speaker-table-body tr').get(); //grab all the rows
            rows.sort(function(a,b){ //js sort by comparing a to b
                var keyA = $(a).find('td:nth-child(2)').text().toLowerCase();
                var keyB = $(b).find('td:nth-child(2)').text().toLowerCase();
                return keyB.localeCompare(keyA); //js compare
        });
        $.each(rows, function(index,row){
            $('#speaker-table-body').append(row); //re-order the rows using append
            });
        }
    });
});

