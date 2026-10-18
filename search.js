    $(document).ready(function() {
        $("material-search").on("keyup", function()
            var value = $(this).val.toLowerCase();

            $("#material-table-body tr").filter(functiom() {
                $(this).toggle(
                    $(this).text().toLowerCase().indexOf(value) > -1
                );
            });
        });
    });
