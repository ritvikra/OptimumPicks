import fs from "node:fs/promises";

const URL =
  "https://api.actionnetwork.com/web/v2/scoreboard/nba" +
  "?bookIds=15,30,647,510,68,3151,645,1867,1901,841,1904,79" +
  "&date=20251229" +
  "&periods=event";

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

// Save into CRA public/ so it’s served at /scoreboard.json in production
await fs.mkdir("public", { recursive: true });
await fs.writeFile("public/scoreboard.json", JSON.stringify(json, null, 2) + "\n", "utf8");

console.log("Wrote public/scoreboard.json");
