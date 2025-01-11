CREATE TABLE leagues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);
CREATE TABLE games (
  id VARCHAR(255) PRIMARY KEY UNIQUE,
  league_id VARCHAR(255) REFERENCES leagues(name),
  date DATE,
  time VARCHAR(255),
  home_team VARCHAR(255),
  away_team VARCHAR(255)
);

CREATE TABLE odds (
  id SERIAL PRIMARY KEY,
  game_id  VARCHAR(255) REFERENCES games(id),
  sportsbook VARCHAR(255),
  type VARCHAR(50),
  value DECIMAL, 
  odds DECIMAL,
  UNIQUE (game_id, sportsbook, type),
);