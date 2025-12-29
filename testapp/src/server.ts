import express from "express";
// Use the built-in fetch in Node.js v18+ instead of node-fetch
const app = express();

const URL =
  "https://api.actionnetwork.com/web/v2/scoreboard/nba" +
  "?bookIds=15,30,647,510,68,3151,645,1867,1901,841,1904,79" +
  "&date=20251229" +
  "&periods=event";

app.get("/api/scoreboard", async (req, res) => {
  try {
    const upstream = await fetch(URL, {
      headers: {
        // same idea as your curl; this is server-side so it’s allowed
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", "application/json");
    res.send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.listen(5174, () => {
  console.log("Proxy running on http://localhost:5174/api/scoreboard");
});
export {};
