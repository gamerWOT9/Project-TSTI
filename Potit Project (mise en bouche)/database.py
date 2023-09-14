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
Data_pattern = re.compile(r'<(\d+)>')

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