from flask import Flask, jsonify, render_template, request, redirect, url_for, g
import sqlite3, os, time
import subprocess
import signal
import serial

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/dsqdqs', methods=['GET'])
def sdqdqs():
    conn = sqlite3.connect('data/arduino_data.db')
    c = conn.cursor()

    c.execute('SELECT * FROM humidity_data')
    humidity_data = c.fetchall()

    c.execute('SELECT * FROM temperature_data')
    temperature_data = c.fetchall()

    c.execute('SELECT * FROM sound_data')
    sound_data = c.fetchall()

    conn.close()

    return jsonify({
        'humidity_data': humidity_data,
        'temperature_data': temperature_data,
        'sound_data': sound_data
    })

@app.route('/data')
def get_data():
    conn = sqlite3.connect('data/arduino_data.db')
    cursor = conn.cursor()

    cursor.execute('SELECT humidity_val FROM humidity_data ORDER BY id DESC LIMIT 5')
    humidity_var = cursor.fetchall()

    cursor.execute('SELECT date FROM humidity_data ORDER BY id DESC LIMIT 5')
    humidity_date = cursor.fetchall()

    conn.close()

    return jsonify({
        'humidity_var': humidity_var,
        'humidity_date': humidity_date,
    })

process = None
@app.route('/start_database', methods=['GET'])
def start_database():
    global process
    if process is None:
        process = subprocess.Popen(['python', 'database.py'])
        return 'Database execution started'
    else:
        return 'Database execution already in progress'
@app.route('/stop_database', methods=['GET'])
def stop_database():
    global process
    if process is not None:
        process.send_signal(signal.SIGINT)
        process = None
        return 'Database execution stopped'
    else:
        return 'No database execution in progress'


if __name__ == '__main__':
    app.run(debug=True)
