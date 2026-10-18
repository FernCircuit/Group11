//JQUERY SEARCH FUNCTION
$(document).ready(function(){
    //nice transition so it's not so jerky
    $('table tbody').on('mouseenter', 'tr', function(){
        $(this).css('transition','all 0.25s ease-in-out');
    });
    //search filter
    $('#material-search').on('input keyup', function(event){
        event.preventDefault();
        var value=$(this).val().toLowerCase();
        
        $('table tbody tr').each(function(){
            var $row = $(this);
            var nameText = $row.find('td:nth-child(2)').text().toLowerCase();
            var categoryText = $row.find('td:nth-child(3)').text().toLowerCase();
            var matchFound = (nameText.indexOf(value) > -1 || categoryText.indexOf(value) > -1);
            if(matchFound){
                $row.css({
                    'opacity':'1',
                    'display':'table-row'
                });
            }else{
                $row.css({
                    'opacity':'0',
                    'display':'none'
                });
            }
        });
    });
           
    //sort ascending
    $('.table-header').on('click', '.icon-button', function(){
        var $button = $(this);
        if($button.find('img[src*="arrow_up"]').length > 0) {
            var rows=$('table tbody tr').get();
            rows.sort(function(a,b){
                var keyA = $(a).find('td:nth-child(2)').text().toLowerCase();
                var keyB = $(b).find('td:nth-child(2)').text().toLowerCase();
                return keyA.localeCompare(keyB);
            });

        $.each(rows,function(index,row){
            $('table tbody').append(row);
        });
     }
 });
    // sort descending
    $('.table-header').on('click', '.icon-button',function(){
        event.preventDefault();
        var $button = $(this);
        if($button.find('img[src*="arrow_down"]').length > 0){
            var rows=$('table tbody tr').get();
            rows.sort(function(a,b){
                var keyA = $(a).find('td:nth-child(2)').text().toLowerCase();
                var keyB = $(b).find('td:nth-child(2)').text().toLowerCase();
                return keyB.localeCompare(keyA);
            });
            
        $.each(rows, function(index,row){
            $('table tbody').append(row);
            });
        }
    });
});

