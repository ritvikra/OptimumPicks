import fs from "node:fs/promises";
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const dateStr = `${year}${month}${day}`;

const URL = `https://api.actionnetwork.com/web/v2/scoreboard/nfl` +
  `?bookIds=15,30,270,282,68,1797,279,79,2988,75,123,71` +
  `&periods=event`;

const res = await fetch(URL, {
  headers: {
    "User-Agent": "Mozilla/5.0",
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate, br",
  },
});

if (!res.ok) {
  const text = await res.text();
  throw new Error(`Upstream failed: HTTP ${res.status}: ${text.slice(0, 200)}`);
}

const json = await res.json();
const games = Array.isArray(json?.games) ? json.games : [];
const game_ids = [];
for (const g of games) {
  game_ids.push(g.id);
}
const nba_game_ids = JSON.stringify(game_ids);
// Save into CRA public/ so it’s served at /scoreboard.json in production
await fs.mkdir("public", { recursive: true });
await fs.writeFile("public/nflodds.json", JSON.stringify(json, null, 2) + "\n", "utf8");
await fs.writeFile("public/nfl_game_ids.json", nba_game_ids + "\n", "utf8");
console.log("Wrote public/nflodds.json");
console.log("wrote nfl_game_ids too")