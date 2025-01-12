import React, { useEffect, useState } from "react";
import "./App.css";
import { teamLogos, sportsbookLogos } from "./data/logos";
import Button from "@mui/material/Button";

const App = () => {
  const [oddsData, setOddsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    const fetchOddsData = async () => {
      try {
        const response = await fetch("http://localhost:5002/odds");
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

  useEffect(() => {
    // Wait for the animation to finish before setting the state
    const timer = setTimeout(() => {
      setAnimationCompleted(true);
    }, 1000); // Match this duration to the animation in CSS

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // This will run after the component mounts
    const letters = document.querySelectorAll("#animated-title span");
    letters.forEach((letter) => {
      // Generate a random delay for each letter
      const randomDelay = (1+Math.random()) * 1; // Between 0 and 2 seconds
      letter.style.animationDelay = `${randomDelay}s`;
    });
  }, []);

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

const gameEntries = Object.entries(groupedGames);

const bestValues = gameEntries.map(([gameKey, sportsbookData]) => {
  let bestTotalBook = null;
  let bestTotalValue = -Infinity;

  let bestSpreadBook = null;
  let bestSpreadValue = Infinity; 

  for (const [book, lines] of Object.entries(sportsbookData)) {
    if (lines.total) {
      const [totalStr] = lines.total.split(" "); 
      const totalNumber = parseFloat(totalStr);
      if (totalNumber > bestTotalValue) {
        bestTotalValue = totalNumber;
        bestTotalBook = book;
      }
    }

    if (lines.spread) {
      const [spreadStr] = lines.spread.split(" ");
      const spreadNumber = parseFloat(spreadStr);

      if (Math.abs(spreadNumber) < Math.abs(bestSpreadValue)) {
        bestSpreadValue = spreadNumber;
        bestSpreadBook = book;
      }
    }
  }

  return { 
    gameKey, 
    bestTotalBook, 
    bestSpreadBook 
  };
});

const bestLookup = bestValues.reduce((acc, { gameKey, bestTotalBook, bestSpreadBook }) => {
  acc[gameKey] = { bestTotalBook, bestSpreadBook };
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
    <>
      {!animationCompleted && <div className="animated-header"></div>}
  
      <div className="App">
        <div className="header">
          <h1 className="title" id="animated-title" onClick={() => window.location.reload()}>
            <span>O</span><span>p</span><span>t</span><span>i</span><span>m</span><span>u</span><span>m</span>
            <span>&nbsp;</span> 
            <span>P</span><span>i</span><span>c</span><span>k</span><span>s</span>
          </h1>
        </div>
        <div className="content">
          <table className="odds-table">
            <thead>
              <tr>
                <th>Game</th>
                {sportsbooks.map((book) => (
                  <th key={book}>
                    <img
                      src={sportsbookLogos[book]} 
                      alt={book}
                      className="header-logo"
                    />
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
                          src={teamLogos[homeTeam.trim()]} 
                          alt={homeTeam.trim()}
                          className="team-logo"
                        />
                        <div className="vs-info">
                          vs <br />
                          {gameTime.trim()}
                        </div>
                        <img
                          src={teamLogos[awayTeam.trim()]}
                          alt={awayTeam.trim()}
                          className="team-logo"
                        />
                      </div>
                    </td>
                    {sportsbooks.map((book) => (
                      <td key={book} className="sportsbook-cell">
                        <div className="odds-row">
                          {sportsbookData[book]?.total && (
                            <Button
                            variant="outlined"
                            color="primary"
                            style={{ marginBottom: "10px", width: "100%" }}
                            sx={{
                            }}>
                              <div className="odds-value">
                                O{sportsbookData[book].total.split(" ")[0]}{" "}
                                <span className="odds-grey">
                                  {sportsbookData[book].total.split(" ")[1]}
                                </span>
                              </div>
                            </Button>
                          )}
                          {sportsbookData[book]?.spread && (
                            <Button
                            variant="outlined"
                            color="primary"
                            style={{ marginBottom: "10px", width: "100%" }}>
                              <div className="odds-value">
                                {sportsbookData[book].spread.split(" ")[0]}{" "}
                                <span className="odds-grey">
                                  {sportsbookData[book].spread.split(" ")[1]}
                                </span>
                              </div>
                            </Button>
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
      </div>
    </>
  );      
};

export default App;