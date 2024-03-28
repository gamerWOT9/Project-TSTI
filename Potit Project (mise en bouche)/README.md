# 🚀 Create Your Own TSTI Project with Flask and Raspberry Pi 🌐

README available in several languages:
- [`English`](README.md)
- [`Français`](README.fr.md)

Welcome to this guide to create your own TSTI project using Flask and a Raspberry Pi. This project will enable you to create a web site capable of retrieving data from an Arduino via a serial port, storing it in an SQLite database, and displaying it in real-time using JavaScript. Ready to dive into the world of IoT programming? Then, let's get started! 🚀

## Introduction 💡

In this tutorial, we will guide you through the key steps to set up your TSTI project. You will learn to create a Flask environment, interact with an SQLite database, and display data in real-time on your web site. Don't hesitate to consult online resources if you encounter difficulties; Google, man, or even ChatGPT are your best allies! 🙂

## Step 1: Setting Up the Flask Environment 🛠️

First, you need to configure your Flask environment. Follow this tutorial to install Flask and create your first project: [Install Flask](https://phoenixnap.com/kb/install-flask). Once the Flask environment is ready, we will remove the `hello.py` file and create `app.py`, which will be the heart of our application.

## Step 2: Creating `app.py` 📝

In `app.py`, we will start by importing the necessary modules, initializing the Flask application, and writing the code to retrieve data from the Arduino. The code is included in this tutorial, but I encourage you to understand it step by step. Don't hesitate to do research to deepen your understanding.

```
from flask import Flask, jsonify, render_template, request, redirect, url_for, g
import sqlite3, os, time
import subprocess
import signal
import serial
# FOR THE PATH IT DEPENDS ON YOUR DEVICE (IF YOU ARE ON RASPBERRY NO NEED TO DO THIS)
# os.environ["PATH"] += os.pathsep + '/home/panache/.local/lib/python3.10'

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
	return render_template('index.html')

# START FILE PYTHON database.py
process = None
@app.route('/start_database', methods=['GET'])
def start_database():
	global process
	if process is None:
		process = subprocess.Popen(['python', 'database.py'])
		# process = subprocess.Popen(['python3.10', 'database.py'])
		return 'Database execution started'
	else:
		return 'Database execution already in progress'
# IF YOU WANT TO MAKE A BUTTON THAT STOP THE PROCESS
# @app.route('/stop_database', methods=['GET'])
# def stop_database():
# global process
# if process is not None:
# process.send_signal(signal.SIGINT)
# process = None
# return 'Database execution stopped'
# else:
# return 'No database execution in progress'

DATABASE = 'data/arduino_data.db'
def get_db():
	db = getattr(g, '_database', None)
	if db is None:
		db = g._database = sqlite3.connect(DATABASE)
	return db
@app.route('/datacenter', methods=['GET'])
def datacenter():
	table_name = 'myDataTable'
	db = get_db()
	cursor = db.cursor()
	cursor.execute(f"SELECT * FROM {table_name}")
	data = cursor.fetchall()
	return jsonify(data)

if __name__ == '__main__':
	app.run(debug=True)
```

## Step 3: Creating `database.py` 🗄️

To make our code cleaner and more modular, we will separate the SQLite database logic into a `database.py` file. This file will contain all the necessary code to interact with our `database.db` database. You can customize this code according to your needs.

```
import serial
import sqlite3
import re
import datetime

conn = sqlite3.connect('data/arduino_data.db')
c = conn.cursor()

c.execute('''CREATE TABLE IF NOT EXISTS myDataTable (
				 id INTEGER PRIMARY KEY AUTOINCREMENT,
				 myData INTEGER,
				 Date INTEGER)''')

ser = serial.Serial('/dev/ttyACM0', 9600)

# Regular expressions to extract the time values
Data_pattern = re.compile(r'<(d+)>')

while True:
	data = ser.readline().decode().strip()
	print("Received:", data)

	Data_pattern_match = Data_pattern.search(data)

	if Data_pattern_match:
		current_date = datetime.datetime.now().replace(microsecond=0)
		Data_val = int(Data_pattern_match.group(1))
		c.execute("INSERT INTO myDataTable (myData, Date) VALUES (?, ?)", (Data_val, current_date))
		conn.commit()

conn.close()
```

## Step 4: Creating `index.html` 📄

Create a `templates` folder and add a simple `index.html` file. This file will be the base template of our web site.

```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Hello world!</title>
	<script src="https://code.jquery.com/jquery-3.6.0.min.js" defer></script>
	<script src="{{ url_for('static', filename='script.js') }}" defer></script>
</head>

<body>
	<section>
		<div>
			<h2>Table</h2>
			<div>
				<table id="TableDatacenter">
					<tr>
						<th>Time</th>
						<th>Data</th>
					</tr>
				</table>
			</div>
		</div>
	</section>
</body>
</html>
```

## Step 5: Creating `script.js` 📂

Finally, create a `static` folder and add a `script.js` file. This script will be used to send requests to `app.py` and display our database data in real-time.

```
$(document).ready(function()
{
	StartDatabase();
});

function StartDatabase()
{
	setInterval(callDatacenter, 5000);
	// $.get('/start_database', function(data) {
	// console.log(data);
	// });
}

function callDatacenter()
{
	$.getJSON('/datacenter', {table_name: "myDataTable"}, function(data)
    {
		let table = $('#TableDatacenter');
		table.find('tr:gt(0)').remove(); // Remove all rows except the header

		// Sort the data based on the second column (Time) in ascending order
		data.sort(function(a, b) {
			return a[2] - b[2];
		});

		for (let i = 0; i < data.length; i++)
        {
			dataTime = data[i][2];
			dataData = data[i][1];
			let newRow = $('<tr></tr>').append('<td>' + dataTime + '</td>').append('<td>' + dataData + '</td>');
			table.append(newRow);
		}
	});
}
```

## Step 6: Arduino Script 🤖

To test our project, we need an Arduino script. This script will simulate sending data to our Flask application.

```
void setup() 
	{
		Serial.begin(9600);
		randomSeed(analogRead(0));
	}

	void loop() 
	{
		int randNumber = random(0, 100);
		Serial.print("<");
		Serial.print(randNumber);
		Serial.println(">");
		delay(5000);
	}
```

## Step 7: Troubleshooting 🔧

If you encounter problems, don't hesitate to consult the complete Git repository of the project I created for this tutorial. If it still doesn't work, the problem likely lies with you, especially with dependencies. Use the available debugging tools to identify and solve the issue.

## Conclusion 🎉

Congratulations! You have successfully created a web site hosted on a Raspberry Pi with Flask, capable of retrieving data from an Arduino, storing it in an SQLite database, and displaying it in real-time. You are now ready to customize your web site and add more features as needed. Best of luck on your IoT programming adventure!
