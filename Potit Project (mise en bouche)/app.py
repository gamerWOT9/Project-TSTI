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
#     global process
#     if process is not None:
#         process.send_signal(signal.SIGINT)
#         process = None
#         return 'Database execution stopped'
#     else:
#         return 'No database execution in progress'

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