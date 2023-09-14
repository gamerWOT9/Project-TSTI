$(document).ready(function() {
    StartDatabase();
});

function StartDatabase() {
    setInterval(callDatacenter, 5000);
    // $.get('/start_database', function(data) {
    // console.log(data);
    // });
}

function callDatacenter() {
    $.getJSON('/datacenter', {table_name: "myDataTable"}, function(data) {
        let table = $('#TableDatacenter');
        table.find('tr:gt(0)').remove(); // Remove all rows except the header

        // Sort the data based on the second column (Time) in ascending order
        data.sort(function(a, b) {
            return a[2] - b[2];
        });

        for (let i = 0; i < data.length; i++) {
            dataTime = data[i][2];
            dataData = data[i][1];
            let newRow = $('<tr></tr>').append('<td>' + dataTime + '</td>').append('<td>' + dataData + '</td>');
            table.append(newRow);
        }
    });
}
