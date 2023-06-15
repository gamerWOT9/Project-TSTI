// READY 
$('a#defaultOpen1')[0].click();

$(document).ready(function() {
    refreshAllData();
});
function refreshAllData() {
    fetchData();
    callDatacenterHello();
};


$(window).on('load', function() {
setTimeout(function() {
    // Code to run 500ms after the page has completely loaded
    refreshAllData();
    console.log("Good morning");
}, 500);
});


// BUTTON 
$(document).ready(function() {
    $('#runScriptStartDatabase').on('click', function() {
        StartDatabase();
    });
});
function StartDatabase() {
    gofetchData = setInterval(fetchData, 1000);
    $.get('/start_database', function(data) {
    console.log(data);
    });
}
$('#runScriptStopDatabase').on('click', function() {
    clearInterval(gofetchData);
    StopDatabase();
    removeRunning();
});
function StopDatabase() {
$.get('/stop_database', function(data) {
console.log(data);
});
}

$('#refreshAllData').on('click', function() {
    refreshAllData();
});


// DATA 
let gofetchData;
var humidity = 10;
var temperature = 0;
var sound = 10;
// function fetchData() {
//     $.getJSON('/data', function(data) {
//         for (let o = 0; o < data.humidity_data.length; o++) {
//             humidity = data.humidity_data[o][0];
//         }
//         for (let o = 0; o < data.temperature_data.length; o++) {
//             temperature = data.temperature_data[o][0];
//         }
//         for (let o = 0; o < data.sound_data.length; o++) {
//             sound = data.sound_data[o][0];
//         }
//     });
//     Graphs();
// }

var humidityVar1 = "--";
var humidityVar2 = "--";
var humidityVar3 = "--";
var humidityVar4 = "--";
var humidityVar5 = "--";

var humidityDate1 = "----/--/-- --:--:--";
var humidityDate2 = "----/--/-- --:--:--";
var humidityDate3 = "----/--/-- --:--:--";
var humidityDate4 = "----/--/-- --:--:--";
var humidityDate5 = "----/--/-- --:--:--";

var temperatureVar1 = "--";
var temperatureVar2 = "--";
var temperatureVar3 = "--";
var temperatureVar4 = "--";
var temperatureVar5 = "--";

var temperatureDate1 = "----/--/-- --:--:--";
var temperatureDate2 = "----/--/-- --:--:--";
var temperatureDate3 = "----/--/-- --:--:--";
var temperatureDate4 = "----/--/-- --:--:--";
var temperatureDate5 = "----/--/-- --:--:--";

var soundVar1 = "----";
var soundVar2 = "----";
var soundVar3 = "----";
var soundVar4 = "----";
var soundVar5 = "----";

var soundDate1 = "----/--/-- --:--:--";
var soundDate2 = "----/--/-- --:--:--";
var soundDate3 = "----/--/-- --:--:--";
var soundDate4 = "----/--/-- --:--:--";
var soundDate5 = "----/--/-- --:--:--";



function fetchData() {
    $.getJSON('/data', function(data) {
        humidityVar5 = data.humidity_var[0][0];
        humidityVar4 = data.humidity_var[1][0];
        humidityVar3 = data.humidity_var[2][0];
        humidityVar2 = data.humidity_var[3][0];
        humidityVar1 = data.humidity_var[4][0];

        humidityDate5 = data.humidity_date[0][0];
        humidityDate4 = data.humidity_date[1][0];
        humidityDate3 = data.humidity_date[2][0];
        humidityDate2 = data.humidity_date[3][0];
        humidityDate1 = data.humidity_date[4][0];


        temperatureVar5 = data.temperature_var[0][0];
        temperatureVar4 = data.temperature_var[1][0];
        temperatureVar3 = data.temperature_var[2][0];
        temperatureVar2 = data.temperature_var[3][0];
        temperatureVar1 = data.temperature_var[4][0];

        temperatureDate5 = data.temperature_date[0][0];
        temperatureDate4 = data.temperature_date[1][0];
        temperatureDate3 = data.temperature_date[2][0];
        temperatureDate2 = data.temperature_date[3][0];
        temperatureDate1 = data.temperature_date[4][0];


        soundVar5 = data.sound_var[0][0];
        soundVar4 = data.sound_var[1][0];
        soundVar3 = data.sound_var[2][0];
        soundVar2 = data.sound_var[3][0];
        soundVar1 = data.sound_var[4][0];

        soundDate5 = data.sound_date[0][0];
        soundDate4 = data.sound_date[1][0];
        soundDate3 = data.sound_date[2][0];
        soundDate2 = data.sound_date[3][0];
        soundDate1 = data.sound_date[4][0];

    });
    Graphs();
    console.log(`LAST DATA => 
    Humidity: ${humidityVar5}% ${humidityDate5} 
    Temperature: ${temperatureVar5}°C ${temperatureDate5} 
    Sound: ${soundVar5}dB ${soundDate5}`);
    chart_humidity.data.datasets[0].data = [humidityVar1, humidityVar2, humidityVar3, humidityVar4, humidityVar5]
    chart_humidity.data.labels = [humidityDate1, humidityDate2, humidityDate3, humidityDate4, humidityDate5]
    chart_temperature.data.datasets[0].data = [temperatureVar1, temperatureVar2, temperatureVar3, temperatureVar4, temperatureVar5]
    chart_temperature.data.labels = [temperatureDate1, temperatureDate2, temperatureDate3, temperatureDate4, temperatureDate5]
    chart_sound.data.datasets[0].data = [soundVar1, soundVar2, soundVar3, soundVar4, soundVar5]
    chart_sound.data.labels = [soundDate1, soundDate2, soundDate3, soundDate4, soundDate5]
    chart_humidity.update();
    chart_temperature.update();
    chart_sound.update();
}


// COUNT 
function Graphs() {
    // Update elements with new values
    $("#humidity").text(`${humidityVar5}%`);
    $("#temperature").text(`${temperatureVar5}°C`);
    $("#sound").text(`${soundVar5}dB`);
}


// GRAPHS 
// HUMIDITY
const ctx_humidity = document.getElementById('chart_humidity');

const chart_humidity = new Chart(ctx_humidity, {
type: 'line',
data: {
labels: [humidityDate1, humidityDate2, humidityDate3, humidityDate4, humidityDate5],
datasets: [{
label: 'Humidity',
data: [humidityVar1, humidityVar2, humidityVar3, humidityVar4, humidityVar5],
borderWidth: 2,
borderColor: "#007BFF",
}]
},
options: {
  scales: {
    y: {
      max: 100,
      beginAtZero: true
    }
  },
  plugins: {
    legend: {
        labels: {
            font: {
                size: 18,
            },
        },
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          var label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += context.parsed.y + '%';
          return label;
        }
      }
    }
  }
}
});

// TEMPERATURE
const ctx_temperature = document.getElementById('chart_temperature');

const chart_temperature = new Chart(ctx_temperature, {
type: 'line',
data: {
labels: [temperatureDate1, temperatureDate2, temperatureDate3, temperatureDate4, temperatureDate5],
datasets: [{
label: 'Temperature',
data: [temperatureVar1, temperatureVar2, temperatureVar3, temperatureVar4, temperatureVar5],
borderWidth: 2,
borderColor: "#eb4034",
}]
},
options: {
  scales: {
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    legend: {
        labels: {
            font: {
                size: 18,
            },
        },
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          var label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += context.parsed.y + '°C';
          return label;
        }
      }
    }
  }
}
});


// SOUND
const ctx_sound = document.getElementById('chart_sound');

const chart_sound = new Chart(ctx_sound, {
type: 'line',
data: {
labels: [soundDate1, soundDate2, soundDate3, soundDate4, soundDate5],
datasets: [{
label: 'Sound',
data: [soundVar1, soundVar2, soundVar3, soundVar4, soundVar5],
borderWidth: 2,
borderColor: "#008000",
}]
},
options: {
  scales: {
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    legend: {
        labels: {
            font: {
                size: 18,
            },
        },
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          var label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += context.parsed.y + 'dB';
          return label;
        }
      }
    }
  }
}
});


// TABLE 
let tableName = 'humidity_data';
let dataunit = '%';
function callDatacenter(tableName) {
    $.getJSON('/datacenter', {table_name: tableName}, function(data) {
        let table = $('#TableDatacenter');
        table.find('tr:gt(0)').remove(); // Remove all rows except the header

        // Sort the data based on the second column (Time) in ascending order
        data.sort(function(a, b) {
            return a[2] - b[2];
        });

        for (let i = 0; i < data.length; i++) {
            dataTime = data[i][2];
            dataData = data[i][1];
            let newRow = $('<tr></tr>').append('<td>' + dataTime + '</td>').append('<td>' + dataData + dataunit + '</td>');
            table.append(newRow);
        }
    });
}
$('#table-nameselect').on('change', function() {
    tableName = $(this).val();
    callDatacenterHello();
});
function callDatacenterHello() {
    if (tableName === 'humidity_data') {
        dataunit = '%';
    } else if (tableName === 'temperature_data') {
        dataunit = '°C';
    } else if (tableName === 'sound_data') {
        dataunit = ' dB';
    }
    callDatacenter(tableName);
}



// STYLE 
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


// OPTION GRID
// Get the element with id="myMenu"
var elements = $("#menuChart");

// List View
function listView() {
elements.removeClass("grid1");
}

// Grid View
function gridView() {
elements.addClass("grid1");
}

/* Optional: Add active class to the current button (highlight it) */
var container1 = $("#btnContainer1");
var btns1 = container1.find(".btn1");

btns1.each(function() {
$(this).on("click", function() {
    var current = $(".activebt1");
    current.removeClass("activebt1");
    $(this).addClass("activebt1");
});
});
