import psycopg2
import requests
from bs4 import BeautifulSoup
from datetime import datetime


# PostgreSQL connection setup
conn = psycopg2.connect(
    dbname="optimumdb",     # Replace with your database name
    user="ritvikrallapalli",      # Replace with your PostgreSQL username
    password="postgrepass",  # Replace with your PostgreSQL password
    host="localhost",     # Replace with your host
    port="5432"           # Default PostgreSQL port
)
cursor = conn.cursor()

def scrapenfldata():
    cover_books = ['ProphetX', 'BetMGM', 'Bet365', 'FanDuel', 'DraftKings']
    url = "https://www.covers.com/sport/football/nfl/odds"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    total_table = soup.find("table", id="spread-total-table")
    odds_table = total_table.find("tbody", class_="odds-tbody")
    tables = odds_table.find_all("tr", class_ ="oddsGameRow")
    games_data = [] 

    for table in tables:
        dateofgame = table.find("div", class_="td-cell game-time")
        date_part = dateofgame.find_all("span")[0].text.strip()  
        time_part = dateofgame.find_all("span")[1].text.strip() 
        curr_year = 2025
        datetime_string = f"{curr_year} {date_part} {time_part}" 
        sql_friendly_datetime = datetime.strptime(datetime_string, "%Y %b %d, %I:%M %p").strftime("%Y-%m-%d %H:%M:%S")
        print(f"Date and Time: {sql_friendly_datetime}")
        away_team = table.find("div", class_='td-cell away-cell')
        if away_team:
            away_team = away_team.find("strong" ).text
            print(f"Away Team: {away_team} ")
        home_team = table.find("div", class_='td-cell home-cell')
        if home_team:
            home_team = home_team.find("strong" ).text
            print(f"Home Team: {home_team} ")  
        books = table.find_all("td", class_="liveOddsCell")
        game_odds = []
        count = 0
        for book in books:
            book_name = cover_books[count]
            odds = book.find_all("span", class_="__american")
            lines = book.find_all("a", class_="odds-cta")
            overline = lines[0].contents[0].strip()
            spreadline = lines[1].contents[0].strip()
            if overline.split(" ")[0] == 'o':
                overline = overline.split(" ")[1]
            elif spreadline.split(" ")[0] == 'o':
                spreadline = spreadline.split(" ")[1]
            overodds = odds[0].text
            spreadodds = odds[1].text
            print(f"Sportsbook: {book_name}")
            print(f"Total Score Line: {overline}", f"Odds: {overodds}")
            print(f"Spread: {spreadline}", f"Odds: {spreadodds}")
            count += 1
            game_odds.append({
                    "sportsbook": book_name,
                    "type": "total",
                    "value": float(overline),  # Extract numeric part from 'o 41.5'
                    "odds": int(overodds)
            })
            game_odds.append({
                    "sportsbook": book_name,
                    "type": "spread",
                    "value": float(spreadline),  # Assuming it's already a numeric string
                    "odds": int(spreadodds)
            })
        games_data.append({
        "league": "NFL",
        "date": sql_friendly_datetime,
        "home_team": home_team,
        "away_team": away_team,
        "odds": game_odds
        })
    return games_data


def insert_data(data):
    for game in data:
        # Insert league (ignore duplicates using ON CONFLICT or check manually)
        cursor.execute(
            "INSERT INTO leagues (name) VALUES (%s) ON CONFLICT (name) DO NOTHING RETURNING id",
            (game["league"],)
        )
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
                INSERT INTO odds (game_id, sportsbook, type, value, odds)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (game_id, odd["sportsbook"], odd["type"], odd["value"], odd["odds"])
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