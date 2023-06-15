function msToFormattedTime(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let milliseconds = ms % 1000;
    return `${minutes}m ${seconds}s ${milliseconds}ms`;
}

let playerOneName = 'Blue';
let playerTwoName = 'Red';

$(document).ready(function() {
    $('#settingsNicknameSubmit').on('click', function() {
    playerOneName = $('#playerOneInput').val();
    playerTwoName = $('#playerTwoInput').val();
    $('span[for="playerOneInput"]').text(playerOneName);
    $('span[for="playerTwoInput"]').text(playerTwoName);
    fetchData();
});

$('#resetNames').on('click', function() {
    $('div#settingsNickname input').val('');
    playerOneName = 'Blue';
    playerTwoName = 'Red';
    $('span[for="playerOneInput"]').text(playerOneName);
    $('span[for="playerTwoInput"]').text(playerTwoName);
    fetchData();
});
$('#resetNamesTable').on('click', function() {
    $('input#table-name').val('');
});
});

let gofetchData;
let blueLap = 0;
let redLap = 0;
let blueTime = 0;
let redTime = 0;
let blueTotal = 0;
let redTotal = 0;
function fetchData() {
    if (redLap == numberLap) {
            clearInterval(gofetchData);
            StopDatabase();
            console.log(`Cannot start process :'(       blueTotal: ${blueTotal} + redTotal: ${redTotal} != 0 or/and blueLap: ${blueLap} and redLap: ${redLap} = ${numberLap}`);
        }
    $.getJSON('/data', function(data) {

        const blueIds = new Set();
        const redIds = new Set();

        $('#blue-time-list').children().each(function() {
            const id = $(this).data('id');
            if (id) {
                blueIds.add(id);
            }
        });

        $('#red-time-list').children().each(function() {
            const id = $(this).data('id');
            if (id) {
                redIds.add(id);
            }
        });

        for (let i = 0; i < data.blue_data.length; i++) {
            const blueLap = data.blue_data[i][0];
            const blueTime = msToFormattedTime(data.blue_data[i][1]);
            const blueId = `blue-${blueLap}`;

            if (!blueIds.has(blueId)) {
                $('#blue-time-list').append('<li data-id="' + blueId + '">' + blueLap + "/" + numberLap + " : " + blueTime + '</li>');
            }
        }

        for (let i = 0; i < data.red_data.length; i++) {
            const redLap = data.red_data[i][0];
            const redTime = msToFormattedTime(data.red_data[i][1]);
            const redId = `red-${redLap}`;

            if (!redIds.has(redId)) {
                $('#red-time-list').append('<li data-id="' + redId + '">' + redLap + "/" + numberLap + " : " + redTime + '</li>');
            }
        }


        blueLap = 0;
        redLap = 0;
        const uniqueCombinations = new Set();

        for (let o = 0; o < data.red_data.length; o++) {
            redLap = data.red_data[o][0];
            redTotal = data.red_data[o][1];
        }

        for (let o = 0; o < data.blue_data.length; o++) {
            blueLap = data.blue_data[o][0];
            blueTotal = data.blue_data[o][1];
        }

        const currentCombination = `${redLap}-${blueLap}`;

        if (!uniqueCombinations.has(currentCombination)) {
            uniqueCombinations.add(currentCombination);

            if (blueLap === redLap) {
                if (blueTotal < redTotal) {
                    $('#ranking1st').text(playerOneName).css('color', 'cornflowerblue');
                    $('#ranking2nd').text(playerTwoName).css('color', 'red');
                } else if (blueTotal > redTotal) {
                    $('#ranking1st').text(playerTwoName).css('color', 'red');
                    $('#ranking2nd').text(playerOneName).css('color', 'cornflowerblue');
                } else {
                    $('#ranking1st').text(`${playerOneName} and ${playerTwoName}`);
                    $('#ranking2nd').text('');
                }
            } else if (blueLap > redLap) {
                $('#ranking1st').text(playerOneName).css('color', 'cornflowerblue');
                $('#ranking2nd').text(playerTwoName).css('color', 'red');
            } else if (blueLap < redLap) {
                $('#ranking1st').text(playerTwoName).css('color', 'red');
                $('#ranking2nd').text(playerOneName).css('color', 'cornflowerblue');
            }
        }
    });
}

$(document).ready(function() {
    gofetchData;
});

$('#saveTimeButton').on('click', function() {
const tableName = $('#table-name').val(); // Get the table name from the input field
$.ajax({
    url: '/save_data',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
        table_name: tableName,
        number_lap: numberLap,
        blue_total: blueTotal,
        player_one_name: playerOneName,
        red_total: redTotal,
        player_two_name: playerTwoName
    }),
    success: function(response) {
        // Redirect or update the UI as needed
        console.log('Data saved successfully');
    },
    error: function() {
        console.error('Error saving data');
    }
});
callDatacenterHello();
});
function loadTableNames() {
$.ajax({
    url: '/get_table_names',
    method: 'GET',
    success: function(response) {
        const dataList = document.createElement('datalist');
        dataList.id = 'table-names';
        response.forEach(tableName => {
            const option = document.createElement('option');
            option.value = tableName;
            dataList.appendChild(option);
        });
        document.body.appendChild(dataList);
        $('#table-name').attr('list', 'table-names');
    },
    error: function() {
        console.error('Error fetching table names');
    }
});
}
function loadTableNameSelect() {
$('#table-nameselect').html('');
$.ajax({
    url: '/get_table_names',
    method: 'GET',
    success: function(response) {
        response.forEach(tableName => {
            $('#table-nameselect')
            .append($("<option></option>")
            .attr("value", tableName)
            .text(tableName));
        });
    },
    error: function() {
        console.error('Error fetching table names');
    }
});
}


        function sendNumberToArduino() {
            $.ajax({
                url: "/send_number",
                method: "POST",
                data: {number: numberLap},
                success: function() {
                    console.log("Number sent to Arduino");
                },
                error: function() {
                    console.log("Failed to send number");
                }
            });
        }



        let dataColor = 'white';
        function callDatacenter(tableName) {
            $.getJSON('/datacenter', {table_name: tableName}, function(data) {
                let table = $('#TableDatacenter');
                table.find('tr:gt(0)').remove(); // Remove all rows except the header
        
                // Sort the data based on the second column (Time) in ascending order
                data.sort(function(a, b) {
                    return a[2] - b[2];
                });
        
                for (let i = 0; i < data.length; i++) {
                    dataColor = data[i][0];
                    dataNickname = data[i][1];
                    dataTime = msToFormattedTime(data[i][2]);
                    let newRow = $('<tr></tr>').addClass(dataColor).append('<td>' + dataNickname + '</td>').append('<td>' + dataTime + '</td>');
                    table.append(newRow);
                }
            });
        }
        let tableName = 'circuit_num1';
        $('#table-name').on('change', function() {
            tableName = $(this).val();
            callDatacenterHello();
        });
        $('#table-nameselect').on('change', function() {
            tableName = $(this).val();
            callDatacenterHello();
        });
        let numberLap = '3';
        $('#INnumberLap').on('change', function() {
            numberLap = $(this).val();
            callDatacenterHello();
        });
        function callDatacenterHello() {
            callDatacenter(tableName);
            $('#hiDatacenter h3 span').text(tableName)
        }
        
        
        
        function DeleteDatabase() {
                $('#blue-time-list').empty();
                $('#red-time-list').empty();
                $('#ranking1st').empty();
                $('#ranking2nd').empty();
                StopDatabase();
                $.ajax({
                url: '/delete_database',
                type: 'DELETE',
                success: function(data) {
                    console.log(data);
                }
                });
                blueTotal = 0;
                blueLap = 0;
                redTotal = 0;
                redLap = 0;
            }
        
        $(document).ready(function() {
            refreshAllData();
        });

        
        $('#refreshAllData').on('click', function() {
            refreshAllData();
        });
        function refreshAllData() {
            fetchData();
            callDatacenterHello();
            loadTableNames();
            loadTableNameSelect();
        };
    
        function StartDatabase() {
            $.get('/start_database', function(data) {
            console.log(data);
            });
        }
        function StopDatabase() {
            removeRunning();
            $.get('/stop_database', function(data) {
            console.log(data);
            });
        }
    
        $(document).ready(function() {
            $('#runScriptStartDatabase').on('click', function() {
                if (redLap != numberLap && blueTotal + redTotal == 0) {
                    // sendNumberToArduino();
                    StartDatabase();
                    gofetchData = setInterval(fetchData, 1000);
                } else {
                    clearInterval(gofetchData);
                    removeRunning();
                    console.log(`Cannot start process :'(       blueTotal: ${blueTotal} + redTotal: ${redTotal} != 0 or/and blueLap: ${blueLap} and redLap: ${redLap} = ${numberLap}`);
                }
            });
    
            $('#runScriptStopDatabase').on('click', function() {
                clearInterval(gofetchData);
                StopDatabase();
            });
        });
        
        $('#runScriptDeleteDatabase').on('click', function() {
        if (confirm('Are you sure you want to delete the database?')) {
            clearInterval(gofetchData);
            StopDatabase();
            DeleteDatabase();
        }
        });
    
        $('#runScriptStopServer').on('click', function() {
            if (confirm('Are you sure you want to stop server?')) {
                $.get('/stop_server', function(data) {
                console.log(data);
                location.reload();
                });
            }
        });
    
    
    
        $("#runScriptStartDatabase").on("click", function() {
            var button = $(this);
            if (!button.hasClass("running")) {
            button.addClass("running");
            }
        });
        function removeRunning() {
            var button = $("#runScriptStartDatabase");
            if (button.hasClass("running")) {
                button.removeClass("running");
            }
        }
