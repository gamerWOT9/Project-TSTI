import serial
import sqlite3
import re

conn = sqlite3.connect('data/arduino_data.db')
c = conn.cursor()

# Create separate tables for blue and red data
c.execute('''CREATE TABLE IF NOT EXISTS blue_data (blue_lap INTEGER, blue_time INTEGER)''')
c.execute('''CREATE TABLE IF NOT EXISTS red_data (red_lap INTEGER, red_time INTEGER)''')

ser = serial.Serial('/dev/ttyACM0', 115200)

# Regular expressions to extract the time values
blue_lap_pattern = re.compile(r'<blue-lap=(\d+)>')
red_lap_pattern = re.compile(r'<red-lap=(\d+)>')
blue_time_pattern = re.compile(r'<blue-time=(\d+)>')
red_time_pattern = re.compile(r'<red-time=(\d+)>')

while True:
    data = ser.readline().decode().strip()
    print("Received:", data)

    blue_lap_match = blue_lap_pattern.search(data)
    red_lap_match = red_lap_pattern.search(data)
    blue_time_match = blue_time_pattern.search(data)
    red_time_match = red_time_pattern.search(data)

    if blue_lap_match and blue_time_match:
        blue_lap = int(blue_lap_match.group(1))
        blue_time = int(blue_time_match.group(1))
        # Insert blue data into the blue_data table
        c.execute("INSERT INTO blue_data (blue_lap, blue_time) VALUES (?, ?)", (blue_lap, blue_time))
        conn.commit()
    elif red_lap_match and red_time_match:
        red_lap = int(red_lap_match.group(1))
        red_time = int(red_time_match.group(1))
        # Insert red data into the red_data table
        c.execute("INSERT INTO red_data (red_lap, red_time) VALUES (?, ?)", (red_lap, red_time))
        conn.commit()

conn.close()
