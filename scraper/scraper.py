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
    tables = odds_table.find_all("tr", class_="oddsGameRow")
    games_data = []

    for table in tables:
        away_team = table.find("div", class_='td-cell away-cell')
        if away_team:
            away_team = away_team.find("strong").text
            print(f"Away Team: {away_team}")
        home_team = table.find("div", class_='td-cell home-cell')
        if home_team:
            home_team = home_team.find("strong").text
            print(f"Home Team: {home_team}")

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
            "home_team": home_team,
            "away_team": away_team,
            "odds": game_odds
        })
    return games_data

def scrapenbadata():
    cover_books = ['ProphetX', 'Novig', 'BetMGM', 'Bet365', 'FanDuel', 'DraftKings']
    url = "https://www.covers.com/sport/basketball/nba/odds"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    total_table = soup.find("table", id="spread-total-table")
    odds_table = total_table.find("tbody", class_="odds-tbody")
    tables = odds_table.find_all("tr", class_ ="oddsGameRow")
    games_data = []
    for table in tables:
        dateofgame = table.find("div", class_="td-cell game-time")
        livedate = table.find("div", class_="td-cell game-time live-status")
        if dateofgame:
            dateandtime = dateofgame.find_all("span")
            date_part = dateandtime[0].text.strip()
            time_part = dateandtime[1].text.strip()  
        elif livedate:
            dateandtime = livedate.find_all("span")
            date_part = datetime.now().strftime("%b %d,")  # Format today's date as "Jan 9"
            time_part = dateandtime[1].text.strip()
        curr_year = 2025
        if 'Today' in date_part:
            date_part = datetime.now().strftime("%b %d,")  # Format today's date as "Jan 9"
        date_part = date_part.strip(",")
        datetime_string = f"{curr_year} {date_part}" 
        sql_friendly_datetime = datetime.strptime(datetime_string, "%Y %b %d").strftime("%Y-%m-%d")
        print(f"Date: {sql_friendly_datetime}")
        print(f"Time: {time_part}")
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
        if books:
            count = 0
            for book in books:
                book_name = cover_books[count]
                odds = book.find_all("span", class_="__american")
                lines = book.find_all("a", class_="odds-cta")
                if lines:
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
                    game_odds.append({
                    "game_id": home_team + away_team + date_part,
                    "sportsbook": book_name,
                    "type": "total",
                    "value": float(overline),  # Extract numeric part from 'o 41.5'
                    "odds": int(overodds)
                    })
                    game_odds.append({
                        "game_id": home_team + away_team + date_part,
                        "sportsbook": book_name,
                        "type": "spread",
                        "value": float(spreadline),  # Assuming it's already a numeric string
                        "odds": int(spreadodds)
                    })
                else:
                    print(f"Sportsbook: {book_name}")
                    print("No lines available")
                    game_odds.append({
                    "game_id": home_team + away_team + date_part,
                    "sportsbook": book_name,
                    "type": "total",
                    "value": 0,  # Extract numeric part from 'o 41.5'
                    "odds": 0
                    })
                    game_odds.append({
                        "game_id": home_team + away_team + date_part,
                        "sportsbook": book_name,
                        "type": "spread",
                        "value": 0,  # Assuming it's already a numeric string
                        "odds": 0,
                    })
                count += 1
            games_data.append({
                "id" : home_team + away_team + sql_friendly_datetime, 
                "date": sql_friendly_datetime,
                "time": time_part,
                "league": "NBA",
                "home_team": home_team,
                "away_team": away_team,
                "odds": game_odds,
            })
    return games_data



def insert_data(data):
    for game in data:
        # Insert league (use ON CONFLICT to handle duplicates)
        cursor.execute(
            """
            INSERT INTO leagues (name) 
            VALUES (%s) 
            ON CONFLICT (name) DO NOTHING 
            RETURNING name
            """,
            (game["league"],)
        )
        league_name = cursor.fetchone()[0] if cursor.rowcount else game["league"]

        # Insert game
        cursor.execute(
            """
            INSERT INTO games (id, league_id, date, time, home_team, away_team) 
            VALUES (%s, %s, %s, %s, %s, %s) 
            ON CONFLICT (id) DO NOTHING 
            RETURNING id
            """,
            (
                game["id"],
                league_name,  # Use league name as league_id
                game["date"],
                game["time"],  # Use the provided time as a VARCHAR
                game["home_team"],
                game["away_team"]
            )
        )
        game_id = cursor.fetchone()[0] if cursor.rowcount else game["id"]

        # Insert odds
        for odd in game["odds"]:
            cursor.execute(
                """
                INSERT INTO odds (game_id, sportsbook, type, value, odds) 
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (game_id, sportsbook, type) DO UPDATE 
                SET value = EXCLUDED.value, odds = EXCLUDED.odds
                """,
                (
                    game_id,
                    odd["sportsbook"],
                    odd["type"],
                    odd["value"],
                    odd["odds"]
                )
            )
    # Commit the transaction
    conn.commit()


if __name__ == "__main__":
    try:
        ##scraped_data = scrapenfldata()
        ##nsert_data(scraped_data)
        scraped_nba = scrapenbadata()
        insert_data(scraped_nba)
        print("Data inserted successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")
        conn.rollback()  # Roll back the transaction in case of an error
    finally:
        cursor.close()
        conn.close()  # Always close the connection