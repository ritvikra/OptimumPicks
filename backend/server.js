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
      `SELECT g.id, g.date, g.time, g.home_team, g.away_team, l.name as league
       FROM games g
       JOIN leagues l ON g.league_id = l.name
       WHERE l.name = $1`,
      [league]
    );
    res.json(games);
  } catch (err) {
    console.error("Error fetching games by league:", err);
    res.status(500).send("Server Error");
  }
});

// Endpoint to fetch all odds
app.get("/odds", async (req, res) => {
  try {
    const odds = await queryDatabase(
      `SELECT o.id, o.game_id, g.home_team, g.away_team, o.sportsbook, o.type, o.value, o.odds
       FROM odds o
       JOIN games g ON o.game_id = g.id`
    );
    res.json(odds);
  } catch (err) {
    console.error("Error fetching odds:", err);
    res.status(500).send("Server Error");
  }
});

// Endpoint to fetch odds by game ID
app.get("/odds/:gameId", async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const odds = await queryDatabase(
      `SELECT o.id, o.game_id, g.home_team, g.away_team, o.sportsbook, o.type, o.value, o.odds
       FROM odds o
       JOIN games g ON o.game_id = g.id
       WHERE o.game_id = $1`,
      [gameId]
    );
    res.json(odds);
  } catch (err) {
    console.error("Error fetching odds by game ID:", err);
    res.status(500).send("Server Error");
  }
});

app.listen(5001, () => console.log(`Server running on http://localhost:${5001}`));