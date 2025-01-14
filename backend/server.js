const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();
require("dotenv").config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Railway
  },
});



// Middleware
app.use(cors({
  origin: "https://optimum-picks-frontend.vercel.app/", // Replace with your React app's domain
}));
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the API. Available endpoints: /leagues, /games/:league, /odds, /odds/:gameId");
});

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
      `SELECT o.id, o.game_id, g.home_team, g.away_team, o.sportsbook, o.type, o.value, o.odds, g.date, g.time
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

module.exports = app;