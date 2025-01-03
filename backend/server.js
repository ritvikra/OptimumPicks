const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const pool = new Pool({
  user: "ritvikrallapalli",
  host: "localhost",
  database: "optimumdb",
  password: "postgrepass",
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Utility function to query the database
const queryDatabase = async (query, params) => {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
};

// Endpoint to fetch all leagues
app.get("/leagues", async (req, res) => {
  try {
    const leagues = await queryDatabase("SELECT * FROM leagues");
    res.json(leagues);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Endpoint to fetch games by league
app.get("/games/:league", async (req, res) => {
  try {
    const league = req.params.league;
    const games = await queryDatabase(
      `SELECT g.id, g.date, g.home_team, g.away_team, l.name as league
       FROM games g
       JOIN leagues l ON g.league_id = l.id
       WHERE l.name = $1`,
      [league]
    );
    res.json(games);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Endpoint to fetch all odds
app.get("/odds", async (req, res) => {
  try {
    const odds = await queryDatabase("SELECT id, game_id, sportsbook, type, value, odds FROM odds");
    res.json(odds);
  } catch (err) {
    console.error("Error fetching odds:", err);
    res.status(500).send("Server Error");
  }
});

// Endpoint to fetch odds by game ID
app.get("/odds", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        games.id AS game_id,
        games.home_team,
        games.away_team,
        odds.sportsbook,
        odds.type,
        odds.value,
        odds.odds
      FROM odds
      JOIN games ON odds.game_id = games.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching odds:", err);
    res.status(500).send("Server Error");
  }
});

// Endpoint to insert scraped data
app.post("/insert-scraped-data", async (req, res) => {
  const data = req.body; // Expecting the same format as Python script
  try {
    for (const game of data) {
      const leagueResult = await queryDatabase(
        `INSERT INTO leagues (name) VALUES ($1) 
         ON CONFLICT (name) DO NOTHING RETURNING id`,
        [game.league]
      );
      const leagueId = leagueResult.length ? leagueResult[0].id : null;

      const gameResult = await queryDatabase(
        `INSERT INTO games (league_id, date, home_team, away_team) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [leagueId, game.date, game.home_team, game.away_team]
      );
      const gameId = gameResult[0].id;

      for (const odd of game.odds) {
        await queryDatabase(
          `INSERT INTO odds (game_id, sportsbook, type, value, odds)
           VALUES ($1, $2, $3, $4, $5)`,
          [gameId, odd.sportsbook, odd.type, odd.value, odd.odds]
        );
      }
    }
    res.status(201).send("Data inserted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).send("Error inserting data");
  }
});

// Server setup
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});