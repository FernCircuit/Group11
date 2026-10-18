//JQUERY SEARCH FUNCTION
$(document).ready(function(){
    //SEARCH
    $('#material-search').on('keyup', function(){
        var value=$(this).val().toLowerCase();
        $('table tbody tr').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    //ASC SORT
    $('.table-header').on('click', '.icon-button:has(img[src*="arrow_up"])', function(){
        var rows=$('table tbody tr').get();
        rows.sort(function(a,b){
            var keyA = $(a).text().toLowerCase();
            var keyB = $(b).text().toLowerCase();
            return keyA.localeCompare(keyB);
        });

        $.each(rows,function(index,row){
            $('table tbody').append(row);
        });
    });
});



}
