import sqlite3
from sqlite3 import Error
import time

""" Create database connection to SQLite database
    Read and write access only, doesn't create database if it doesn't already exist """
def create_connection_rw():
    try:
        uri_path = "file:.\database.db"
        query_string = "?mode=rw"
        conn = sqlite3.connect(uri_path + query_string, uri=True)
        return conn
    except Error as e:
        print("Failed to establish a database connection")
        print(e)
        exit()

# Pass in token's identifier
def insert_token(token):
	conn = create_connection_rw()
	sql = ''' INSERT INTO tokens(identifier, timestamp) VALUES(?, time.time()) '''
	cur = conn.cursor()
	cur.execute(sql, token)
	conn.commit()
	cur.close()
	conn.close()
	
# Pass in token's identifier
# Return None if token not in database, otherwise return token
def check_token(token):
    conn = create_connection_rw()
    sql = ''' SELECT * FROM tokens WHERE identifier = ? '''
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    cur.close()
    conn.close()
	if not rows:
		return None
	else:
		return rows[0]

def main():
    print("main in database.py is running")

""" If in main folder(?), call function to access or create local database """
if __name__ == '__main__':
    main()
