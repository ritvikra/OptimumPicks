import React, { useEffect, useState } from "react";
import "./App.css";
import { teamLogos, sportsbookLogos } from "./data/logos";

const App = () => {
  const [oddsData, setOddsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOddsData = async () => {
      try {
        const response = await fetch("http://localhost:5001/odds");
        const data = await response.json();
        setOddsData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching odds:", error);
        setLoading(false);
      }
    };

    fetchOddsData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Group data by games
  const groupedGames = oddsData.reduce((acc, odd) => {
    const cleanedDate = odd.date.split("T")[0]; // Remove time part from the date
    const gameKey = `${odd.home_team} vs ${odd.away_team}|${cleanedDate} ${odd.time || "TBD"}`;
    if (!acc[gameKey]) {
      acc[gameKey] = {};
    }
    if (!acc[gameKey][odd.sportsbook]) {
      acc[gameKey][odd.sportsbook] = { total: null, spread: null };
    }
    acc[gameKey][odd.sportsbook][odd.type] = `${odd.value} ${odd.odds}`;
    return acc;
  }, {});

  const sportsbooks = [
    "ProphetX",
    "Novig",
    "BetMGM",
    "Bet365",
    "FanDuel",
    "DraftKings",
  ];

  return (
    <div className="App">
      <h1 className="title">Optimum Picks</h1>
      <table className="odds-table">
        <thead>
          <tr>
            <th>Game</th>
            {sportsbooks.map((book) => (
              <th key={book}>
                <div className="sportsbook-header">
                  <img
                    src={sportsbookLogos[book]} // Load sportsbook logos
                    alt={book}
                    className="sportsbook-logo"
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedGames).map(([gameKey, sportsbookData], index) => {
            const [game, gameTime] = gameKey.split("|");
            const [homeTeam, awayTeam] = game.split(" vs ");
            return (
              <tr key={index}>
                <td className="game-cell">
                  <div className="game-logos">
                    <img
                      src={teamLogos[homeTeam.trim()]} // Dynamic home team logo (PNG)
                      alt={homeTeam.trim()}
                      className="team-logo"
                    />
                    <div className="vs-info">
                      vs <br />
                      {gameTime.trim()}
                    </div>
                    <img
                      src={teamLogos[awayTeam.trim()]} // Dynamic away team logo (PNG)
                      alt={awayTeam.trim()}
                      className="team-logo"
                    />
                  </div>
                </td>
                {sportsbooks.map((book) => (
                  <td key={book} className="sportsbook-cell">
                    <div className="odds-row">
                      {sportsbookData[book]?.total && (
                        <div className="odds-value">
                          O{sportsbookData[book].total.split(" ")[0]}{" "}
                          <span className="odds-grey">
                            {sportsbookData[book].total.split(" ")[1]}
                          </span>
                        </div>
                      )}
                      {sportsbookData[book]?.spread && (
                        <div className="odds-value">
                          {sportsbookData[book].spread.split(" ")[0]}{" "}
                          <span className="odds-grey">
                            {sportsbookData[book].spread.split(" ")[1]}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default App;