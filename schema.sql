-- Drop tables if they exist (for reset)
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Shippings;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS sportsbooks;
DROP TABLE IF EXISTS sports;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS players;

-- Create tables
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
email VARCHAR(100) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
last_login TIMESTAMP WITH TIME ZONE
);

CREATE TABLE sports (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE,
display_name VARCHAR(100) NOT NULL,
active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sportsbooks (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE,
display_name VARCHAR(100) NOT NULL,
logo_url VARCHAR(255),
active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
abbreviation VARCHAR(10),
logo_url VARCHAR(255),
sport_id INTEGER REFERENCES sports(id) ON DELETE CASCADE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
UNIQUE(name, sport_id)
);

CREATE TABLE events (
id SERIAL PRIMARY KEY,
start_time TIMESTAMP WITH TIME ZONE NOT NULL,
home_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
away_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
sport_id INTEGER REFERENCES sports(id) ON DELETE CASCADE,
league VARCHAR(100),
status VARCHAR(20) DEFAULT 'scheduled',
score_home INTEGER,
score_away INTEGER,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE markets (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
display_name VARCHAR(100) NOT NULL,
market_type VARCHAR(50) NOT NULL,
description TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE odds (
id SERIAL PRIMARY KEY,
event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
sportsbook_id INTEGER REFERENCES sportsbooks(id) ON DELETE CASCADE,
market_id INTEGER REFERENCES markets(id) ON DELETE CASCADE,
selection VARCHAR(255) NOT NULL,
american_odds INTEGER NOT NULL,
decimal_odds DECIMAL(8,3) NOT NULL,
probability DECIMAL(8,5),
expected_value DECIMAL(8,5),
timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
is_live BOOLEAN DEFAULT FALSE,
-- Composite index for performance
UNIQUE(event_id, sportsbook_id, market_id, selection)
);

CREATE TABLE user_bets (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
odds_id INTEGER REFERENCES odds(id) ON DELETE CASCADE,
stake DECIMAL(12,2) NOT NULL,
place_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
bet_status VARCHAR(20) DEFAULT 'pending',
outcome VARCHAR(20),
-- Calculated at time of resolution
payout DECIMAL(12,2),
profit_loss DECIMAL(12,2),
notes TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sport_id INTEGER REFERENCES sports(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    position VARCHAR(50), -- Optional field
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_odds_event_id ON odds(event_id);
CREATE INDEX idx_odds_sportsbook_id ON odds(sportsbook_id);
CREATE INDEX idx_odds_market_id ON odds(market_id);
CREATE INDEX idx_odds_timestamp ON odds(timestamp);
CREATE INDEX idx_events_sport_id ON events(sport_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_user_bets_user_id ON user_bets(user_id);
CREATE INDEX idx_user_bets_odds_id ON user_bets(odds_id);

-- Seed sports data
INSERT INTO sports (name, display_name) VALUES
('baseball', 'Baseball'),
('basketball', 'Basketball'),
('football', 'Football'),
('hockey', 'Hockey'),
('soccer', 'Soccer');

-- Seed sportsbooks data
INSERT INTO sportsbooks (name, display_name) VALUES
('draftkings', 'DraftKings'),
('fanduel', 'FanDuel'),
('betmgm', 'BetMGM'),
('caesars', 'Caesars Sportsbook'),
('pointsbet', 'PointsBet');

-- Seed markets data
INSERT INTO markets (name, display_name, market_type) VALUES
('moneyline', 'Moneyline', 'game'),
('spread', 'Spread', 'game'),
('total_points', 'Total Points', 'game'),
('player_points', 'Player Points', 'player'),
('player_rebounds', 'Player Rebounds', 'player'),
('player_assists', 'Player Assists', 'player');