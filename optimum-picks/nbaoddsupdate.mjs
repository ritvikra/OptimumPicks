import fs from "node:fs/promises";

// Helper function to retry failed requests
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(15000) // 15 second timeout per attempt
      });
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s exponential backoff
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// ============================================
// PART 1: Fetch NBA Team Stats
// ============================================

console.log("Fetching NBA team stats...");

const url = 'https://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&Height=&ISTRound=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2025-26&SeasonSegment=&SeasonType=Regular%20Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=';

const cheaders = {
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Origin': 'https://www.nba.com',
  'Pragma': 'no-cache',
  'Referer': 'https://www.nba.com/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Chromium";v="143", "Not A(Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"'
};

const opps = 'https://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&Height=&ISTRound=&LastNGames=0&LeagueID=00&Location=&MeasureType=Opponent&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2025-26&SeasonSegment=&SeasonType=Regular%20Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=';

const oheaders = {
  'Accept': '*/*',
  'Sec-Fetch-Site': 'same-site',
  'Origin': 'https://www.nba.com',
  'Referer': 'https://www.nba.com/',
  'Sec-Fetch-Dest': 'empty',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Fetch-Mode': 'cors',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Safari/605.1.15',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Priority': 'u=3, i',
};

try {
  const res = await fetchWithRetry(url, { headers: cheaders, method: 'GET' });
  const res2 = await fetchWithRetry(opps, { headers: oheaders, method: 'GET' });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upstream failed: HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  if (!res2.ok) {
    const text = await res2.text();
    throw new Error(`Upstream failed: HTTP ${res2.status}: ${text.slice(0, 200)}`);
  }

  const json = await res.json();
  const json2 = await res2.json();

  // Create public directory
  await fs.mkdir("public", { recursive: true });

  // Save JSON files
  await fs.writeFile("public/nbateamstats.json", JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log("✓ Wrote public/nbateamstats.json");

  await fs.writeFile("public/nbaoppteamstats.json", JSON.stringify(json2, null, 2) + "\n", "utf8");
  console.log("✓ Wrote public/nbaoppteamstats.json");

  // Parse and convert to CSV
  const { headers, rowSet } = json.resultSets[0];
  const { headers: headers2, rowSet: rowSet2 } = json2.resultSets[0];

  const csvLines = [];
  csvLines.push(headers.join(','));
  for (const row of rowSet) {
    csvLines.push(row.map(v => (v == null ? '' : v)).join(','));
  }

  const csvLines2 = [];
  csvLines2.push(headers2.join(','));
  for (const row of rowSet2) {
    csvLines2.push(row.map(v => (v == null ? '' : v)).join(','));
  }

  // Write CSV files
  await fs.writeFile('public/nbateamstats.csv', csvLines.join('\n'));
  await fs.writeFile('public/nbaoppteamstats.csv', csvLines2.join('\n'));
  console.log("✓ Wrote CSV files");

  // ============================================
  // PART 2: Fetch NBA Odds/Games
  // ============================================

  console.log("\nFetching NBA games/odds...");

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  const oddsURL = `https://api.actionnetwork.com/web/v2/scoreboard/nba?bookIds=15,30,647,510,68,3151,645,1867,1901,841,1904,79&date=${dateStr}&periods=event`;

  const oddsRes = await fetchWithRetry(oddsURL, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });

  if (!oddsRes.ok) {
    const text = await oddsRes.text();
    throw new Error(`Upstream failed: HTTP ${oddsRes.status}: ${text.slice(0, 200)}`);
  }

  const oddsJson = await oddsRes.json();
  const games = Array.isArray(oddsJson?.games) ? oddsJson.games : [];
  const game_ids = games.map(g => g.id);

  // Save JSON files
  await fs.writeFile("public/nbaodds.json", JSON.stringify(oddsJson, null, 2) + "\n", "utf8");
  console.log("✓ Wrote public/nbaodds.json");

  await fs.writeFile("public/nba_game_ids.json", JSON.stringify(game_ids) + "\n", "utf8");
  console.log("✓ Wrote public/nba_game_ids.json");

  console.log("\n✓ All data fetched and saved successfully!");
} catch (error) {
  console.error("Fatal error:", error.message);
  process.exit(1);
}
