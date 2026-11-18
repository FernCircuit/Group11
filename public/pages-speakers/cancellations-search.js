// JQUERY SEARCH & SORT FOR CANCELLATIONS (cancellations.html)
$(document).ready(function() {
    var $tableBody = $('#speaker-table-body');
    var $search = $('#speaker-search');

    function updateResults() {
        var value = $search.val().toLowerCase().trim();
        var $rows = $tableBody.find('tr.speaker-row');
        var visibleCount = 0;

        $rows.each(function() {
            var $row = $(this);
            var matches = $row.text().toLowerCase().indexOf(value) !== -1;
            $row.toggle(matches);
            if (matches) {
                visibleCount++;
            }
        });

        $('#cancellation-result-count').text('Results: ' + visibleCount);
        $('#cancellation-no-results').prop('hidden', $rows.length === 0 || visibleCount > 0);
    }

    $search.on('input', updateResults);

    $('.table-header').on('click', '.icon-button', function(event) {
        event.preventDefault();
        var $button = $(this);
        var rows = $tableBody.find('tr.speaker-row').get();
        if (rows.length === 0) return;

        var ascending = $button.find('img[src*="arrow_up"]').length > 0;
        var descending = $button.find('img[src*="arrow_down"]').length > 0;
        if (ascending || descending) {
            rows.sort(function(a, b) {
                var keyA = $(a).find('td:nth-child(2)').text().toLowerCase();
                var keyB = $(b).find('td:nth-child(2)').text().toLowerCase();
                return ascending ? keyA.localeCompare(keyB) : keyB.localeCompare(keyA);
            });
            $.each(rows, function(index, row) {
                $tableBody.append(row);
            });
        }
    });

    updateResults();
});
