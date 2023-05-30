import sqlite3

# Connect to the database or create a new one if it doesn't exist
conn = sqlite3.connect("data/datacenter.db")

# Create a cursor object to interact with the database
cursor = conn.cursor()

# Create a table with Nickname and Time columns
cursor.execute("""CREATE TABLE IF NOT EXISTS user_data
                  (Color, Nickname TEXT, Time TEXT)
               """)

# Commit the changes and close the connection
conn.commit()
conn.close()
