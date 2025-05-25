import os
import psycopg2
from dotenv import load_dotenv
load_dotenv()
print(os.getenv('DB_USERNAME'))
print(os.getenv('DB_PASSWORD'))

def db_init():
    conn = psycopg2.connect(
        host="localhost",
        database="op_db",
        user='bettor',
        password='bettorpassword'
    )
    cur = conn.cursor()

    # drop + create
    cur.execute("""
        
    """)

    conn.commit()
    cur.close()
    conn.close()
