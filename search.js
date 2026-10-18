//JQUERY SEARCH FUNCTION
$(document).ready(function(){
    //search filter
    $('#material-search').on('keyup', function(){
        var value=$(this).val().toLowerCase();
        $('table tbody tr').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    //sort ascending
    $('.table-header').on('click', '.icon-button', function(){
        var $button = $(this);
        if($button.find('img[src*="arrow_up"]').length > 0) {
            var rows=$('table tbody tr').get();
            rows.sort(function(a,b){
            var keyA = $(a).text().toLowerCase();
            var keyB = $(b).text().toLowerCase();
            return keyA.localeCompare(keyB);
        });

        $.each(rows,function(index,row){
            $('table tbody').append(row);
        });
        }
    });
    // sort descending
    $('.table-header').on('click', '.sort-down',function(){
        var rows=$('table tbody tr').get();
        rows.sort(function(a,b){
            var keyA = $(a).text().toLowerCase();
            var keyB = $(b).text().toLowerCase();
            return keyB.localeCompare(keyA);
        });
        $.each(rows, function(index,row){
            $('table tbody').append(row);
        });
    });
});

