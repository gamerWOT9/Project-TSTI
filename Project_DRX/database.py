import serial
import sqlite3
import re
import datetime

conn = sqlite3.connect('data/arduino_data.db')
c = conn.cursor()

# Create separate tables for blue and red data
c.execute('''CREATE TABLE IF NOT EXISTS humidity_data (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 humidity_val INTEGER,
                 date INTEGER)''')
c.execute('''CREATE TABLE IF NOT EXISTS temperature_data (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 temperature_val INTEGER,
                 date INTEGER)''')
c.execute('''CREATE TABLE IF NOT EXISTS sound_data (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 sound_val INTEGER,
                 date INTEGER)''')

ser = serial.Serial('/dev/ttyACM0', 9600)

# Regular expressions to extract the time values
humidity_val_pattern = re.compile(r'<humidity=(\d+)>')
temperature_val_pattern = re.compile(r'<temperature=(\d+)>')
sound_val_pattern = re.compile(r'<sound=(\d+)>')
zero = 0

while True:
    data = ser.readline().decode().strip()
    print("Received:", data)

    humidity_val_match = humidity_val_pattern.search(data)
    temperature_val_match = temperature_val_pattern.search(data)
    sound_val_match = sound_val_pattern.search(data)

    if humidity_val_match:
        current_date = datetime.datetime.now().replace(microsecond=0)
        humidity_val = int(humidity_val_match.group(1))
        # Insert blue data into the blue_data table
        c.execute("INSERT INTO humidity_data (humidity_val, date) VALUES (?, ?)", (humidity_val, current_date))
        conn.commit()
    elif temperature_val_match:
        current_date = datetime.datetime.now().replace(microsecond=0)
        temperature_val = int(temperature_val_match.group(1))
        # Insert red data into the red_data table
        c.execute("INSERT INTO temperature_data (temperature_val, date) VALUES (?, ?)", (temperature_val, current_date))
        conn.commit()
    elif sound_val_match:
        current_date = datetime.datetime.now().replace(microsecond=0)
        sound_val = int(sound_val_match.group(1))
        # Insert red data into the red_data table
        c.execute("INSERT INTO sound_data (sound_val, date) VALUES (?, ?)", (sound_val, current_date))
        conn.commit()

conn.close()
