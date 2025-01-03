import psycopg2
import requests
from bs4 import BeautifulSoup

# PostgreSQL connection setup
conn = psycopg2.connect(
    dbname="betting",     # Replace with your database name
    user="postgres",      # Replace with your PostgreSQL username
    password="yourpassword",  # Replace with your PostgreSQL password
    host="localhost",     # Replace with your host
    port="5432"           # Default PostgreSQL port
)
cursor = conn.cursor()

def scrapenfldata():
    url = "https://www.covers.com/sport/football/nfl/odds"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    
    tables = soup.find_all("tr", class_ ="oddsGameRow")
    for table in tables:
        away_team = table.find("div", class_='td-cell away-cell').text
        if away_team:
            away_team = away_team.find("strong").text

    

def insert_data(data):
    for game in data:
        # Insert league (ignore duplicates using ON CONFLICT or check manually)
        cursor.execute("INSERT INTO leagues (name) VALUES (%s) ON CONFLICT (name) DO NOTHING RETURNING id", (game["league"],))
        league_id = cursor.fetchone()[0] if cursor.rowcount else None

        # Insert game
        cursor.execute(
            """
            INSERT INTO games (league_id, date, home_team, away_team) 
            VALUES (%s, %s, %s, %s) 
            RETURNING id
            """,
            (league_id, game["date"], game["home_team"], game["away_team"])
        )
        game_id = cursor.fetchone()[0]

        # Insert odds
        for odd in game["odds"]:
            cursor.execute(
                """
                INSERT INTO odds (game_id, team, type, value, odds)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (game_id, odd["team"], odd["type"], odd["value"], odd["odds"])
            )

    # Commit the transaction
    conn.commit()



if __name__ == "__main__":
    try:
        scraped_data = scrapenfldata()
        insert_data(scraped_data)
        print("Data inserted successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")
        conn.rollback()  # Roll back the transaction in case of an error
    finally:
        cursor.close()
        conn.close()  # Always close the connection`