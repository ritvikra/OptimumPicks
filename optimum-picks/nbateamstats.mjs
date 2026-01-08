import fs from "node:fs/promises";
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

const res = await fetch(url, { headers: cheaders, method: 'GET' });

if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upstream failed: HTTP ${res.status}: ${text.slice(0, 200)}`);
}

const json = await res.json();

await fs.mkdir("public", { recursive: true });
await fs.writeFile("public/nbateamstats.json", JSON.stringify(json, null, 2) + "\n", "utf8");
console.log("Wrote public/nbateamstats.json");

import fsys from 'fs';

const raw = fsys.readFileSync('public/nbateamstats.json', 'utf8');
const data = JSON.parse(raw);

const { headers, rowSet } = data.resultSets[0];

const csvLines = [];
csvLines.push(headers.join(','));

for (const row of rowSet) {
  csvLines.push(row.map(v => (v == null ? '' : v)).join(','));
}

fsys.writeFileSync('public/nbateamstats.csv', csvLines.join('\n'));
