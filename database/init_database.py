import sqlite3
from sqlite3 import Error

""" Create database connection to SQLite database
    Creates database if doesn't exist """
def create_connection(db_file):
    try:
        conn = sqlite3.connect(db_file)
        print("Database connection created")
        return conn
    except Error as e:
        print(e)
    return None

def create_table(conn, create_table_sql):
    try:
        cur = conn.cursor()
        cur.execute(create_table_sql)
    except Error as e:
        print(e)

""" Everything to be run to initialise database """
def main():
    database = ".\database.db"

    sql_create_table_tokens = ''' CREATE TABLE IF NOT EXISTS tokens (
    identifier text NOT NULL,
    timestamp text NOT NULL,
    PRIMARY KEY (identifier, timestamp)
    ); '''

    conn = create_connection(database)
    if conn is not None:
        create_table(conn, sql_create_table_tokens)
        conn.close()
    else:
        print("Error: cannot establish database connection")

if __name__ == '__main__':
    main()
