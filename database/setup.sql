CREATE TABLE leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    league_id INT REFERENCES leagues(id),
    date DATE,
    home_team VARCHAR(255),
    away_team VARCHAR(255)
);

CREATE TABLE odds (
    id SERIAL PRIMARY KEY,
    game_id INT REFERENCES games(id),
    sportsbook VARCHAR(255),
    type VARCHAR(50), 
    value DECIMAL,
    odds DECIMAL
);

INSERT INTO leagues (id , name) 
VALUES ('nfl', 'nfl');