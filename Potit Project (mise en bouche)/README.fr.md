# 🚀 Créer votre propre projet TSTI avec Flask et Raspberry Pi 🌐

README disponible en plusieurs langues :
- [`English`](README.md)
- [`Français`](README.fr.md)

Bienvenue dans ce guide pour créer votre propre projet TSTI en utilisant Flask et un Raspberry Pi. Ce projet vous permettra de créer un site web capable de récupérer des données d'un Arduino via un port série, les stocker dans une base de données SQLite, et les afficher en temps réel grâce à JavaScript. Prêt à plonger dans le monde de la programmation IoT ? Alors, commençons ! 🚀

## Introduction 💡

Dans ce tutoriel, nous allons vous guider à travers les étapes clés pour mettre en place votre projet TSTI. Vous apprendrez à créer un environnement Flask, à interagir avec une base de données SQLite, et à afficher des données en temps réel sur votre site web. N'hésitez pas à consulter des ressources en ligne si vous rencontrez des difficultés, Google, man, ou même ChatGPT sont vos meilleurs alliés ! 🙂

## Étape 1: Préparation de l'environnement Flask 🛠️

Pour commencer, il faut configurer votre environnement Flask. Suivez ce tutoriel pour installer Flask et créer votre premier projet : [Install Flask](https://phoenixnap.com/kb/install-flask). Une fois l'environnement Flask prêt, nous allons supprimer le fichier `hello.py` et créer `app.py`, qui sera le cœur de notre application.

## Étape 2: Création de `app.py` 📝

Dans `app.py`, nous allons commencer par importer les modules nécessaires, initialiser l'application Flask, et écrire le code pour récupérer les données de l'Arduino. Le code est joint à ce tutoriel, mais je vous encourage à le comprendre étape par étape. N'hésitez pas à faire des recherches pour approfondir votre compréhension.

```
from flask import Flask, jsonify, render_template, request, redirect, url_for, g
import sqlite3, os, time
import subprocess
import signal
import serial
# POUR LE PATH CELA DEPEND DE VOTRE APPAREIL (SI VOUS ETES SUR RASPBERRY PAS BESOIN DE FAIRE CELA)
# os.environ["PATH"] += os.pathsep + '/home/panache/.local/lib/python3.10'

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
	return render_template('index.html')

# START LE FICHIER PYTHON database.py
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
# SI UNE ENVIE DE FAIRE UN BOUTON QUI STOP LE PROCESSUS
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

## Étape 3: Création de `database.py` 🗄️

Pour rendre notre code plus propre et modulaire, nous allons séparer la logique de la base de données SQLite dans un fichier `database.py`. Ce fichier contiendra tout le code nécessaire pour interagir avec notre base de données `database.db`. Vous pouvez personnaliser ce code selon vos besoins.

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

## Étape 4: Création de `index.html` 📄

Créez un dossier `templates` et ajoutez un fichier `index.html` simple. Ce fichier sera le template de base de notre site web.

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

## Étape 5: Création de `script.js` 📂

Enfin, créez un dossier `static` et ajoutez un fichier `script.js`. Ce script sera utilisé pour envoyer des requêtes à `app.py` et afficher les données de notre base de données en temps réel.

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

## Étape 6: Script Arduino 🤖

Pour tester notre projet, nous avons besoin d'un script Arduino. Ce script permettra de simuler l'envoi de données à notre application Flask.

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

## Étape 7: Dépannage 🔧

Si vous rencontrez des problèmes, n'hésitez pas à consulter le dépôt Git du projet complet que j'ai créé pour ce tutoriel. Si cela ne fonctionne toujours pas, il est probable que le problème vienne de votre côté, notamment des dépendances. Utilisez les outils de débogage disponibles pour identifier et résoudre le problème.

## Conclusion 🎉

Félicitations ! Vous avez réussi à créer un site web hébergé sur un Raspberry Pi avec Flask, capable de récupérer des données d'un Arduino, de les stocker dans une base de données SQLite, et de les afficher en temps réel. Vous êtes maintenant prêt à personnaliser votre site web et à ajouter plus de fonctionnalités selon vos besoins. Bonne continuation dans votre aventure de programmation IoT ! 
