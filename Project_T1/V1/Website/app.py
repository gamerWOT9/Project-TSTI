from flask import Flask, jsonify, render_template, request, redirect, url_for, g
import sqlite3, os, time
import subprocess
import signal
import serial

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

def send_number_to_arduino(number):
    laps_string = f"<start-laps={number}>"
    with serial.Serial('/dev/ttyACM0', 115200) as arduino:
        arduino.write(laps_string.encode())
        time.sleep(3)
        arduino.write(laps_string.encode())
@app.route("/send_number", methods=["POST"])
def send_number():
    number = request.form["number"]
    send_number_to_arduino(number)
    return "OK"


@app.route('/data', methods=['GET'])
def get_data():
    conn = sqlite3.connect('data/arduino_data.db')
    c = conn.cursor()

    c.execute('SELECT * FROM blue_data')
    blue_data = c.fetchall()

    c.execute('SELECT * FROM red_data')
    red_data = c.fetchall()

    conn.close()

    return jsonify({
        'blue_data': blue_data,
        'red_data': red_data
    })

@app.route('/datacenter', methods=['GET'])
def datacenter():
    table_name = request.args.get('table_name', 'default_table') # Default to 'default_table' if no table name is specified
    db = get_db()
    cursor = db.cursor()
    cursor.execute(f"SELECT Color, Nickname, Time FROM {table_name}")
    data = cursor.fetchall()
    return jsonify(data)



process = None
@app.route('/start_database', methods=['GET'])
def start_database():
    global process
    if process is None:
        process = subprocess.Popen(['python', 'py-database.py'])
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



@app.route('/delete_database', methods=['DELETE'])
def delete_file():
    file_path = os.path.join(app.root_path, 'data/arduino_data.db')
    try:
        os.remove(file_path)
        return 'Database file deleted successfully'
    except Exception as e:
        return str(e)

@app.route('/stop_server', methods=['GET'])
def stop_server():
    os.kill(os.getpid(), signal.SIGINT)
    return 'Server stopped'



DATABASE = 'data/datacenter.db'
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
@app.route('/get_table_names', methods=['GET'])
def get_table_names():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT name FROM table_names")
    table_names = [row[0] for row in cursor.fetchall()]

    return jsonify(table_names)
def save_to_database(color, player_name, total):
    db = get_db()
    cursor = db.cursor()
    table_name = request.json['table_name']
    number_lap = request.json['number_lap']

    cursor.execute("CREATE TABLE IF NOT EXISTS table_names (name TEXT UNIQUE, lap TEXT)")
    cursor.execute("INSERT OR IGNORE INTO table_names (name, lap) VALUES (?, ?)", (table_name, number_lap))
    cursor.execute(f"CREATE TABLE IF NOT EXISTS {table_name} (Color TEXT, Nickname TEXT, Time TEXT)")
    cursor.execute(f"INSERT INTO {table_name} (Color, Nickname, Time) VALUES (?, ?, ?)", (color, player_name, total))
    db.commit()
@app.route('/save_data', methods=['POST'])
def save_data():
    data = request.get_json()
    color_blue = 'blue'
    color_red = 'red'
    blue_total = data['blue_total']
    red_total = data['red_total']
    player_one_name = data['player_one_name']
    player_two_name = data['player_two_name']

    save_to_database(color_blue, player_one_name, blue_total)
    save_to_database(color_red, player_two_name, red_total)

    return jsonify({'message': 'Data saved successfully'})



if __name__ == '__main__':
    app.run(debug=True)
