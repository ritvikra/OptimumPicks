import React, { useState, useEffect } from "react";
import styles from "./styles";

const OddsTable = () => {
  const [oddsData, setOddsData] = useState([]);

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await fetch("http://localhost:5001/odds");
        const data = await response.json();
        setOddsData(data);
      } catch (error) {
        console.error("Error fetching odds data:", error);
      }
    };

    fetchOdds();
  }, []);

  const groupedOdds = oddsData.reduce((acc, curr) => {
    const { game_id, home_team, away_team, sportsbook, type, value, odds } = curr;
    if (!acc[game_id]) {
      acc[game_id] = { 
        game_id, 
        home_team, 
        away_team, 
        sportsbooks: {} 
      };
    }
  
    if (!acc[game_id].sportsbooks[sportsbook]) {
      acc[game_id].sportsbooks[sportsbook] = { spreads: null, totals: null };
    }
  
    if (type === "spread") {
      acc[game_id].sportsbooks[sportsbook].spreads = { value, odds };
    } else if (type === "total") {
      acc[game_id].sportsbooks[sportsbook].totals = { value, odds };
    }
  
    return acc;
  }, {});

  const groupedOddsArray = Object.values(groupedOdds);

  return (
    <div style={styles.container}>
      <div style={styles.filters}>
        <select style={styles.dropdown}>
          <option>NFL</option>
          <option>NBA</option>
        </select>
        <select style={styles.dropdown}>
          <option>Spread/Total</option>
          <option>Moneyline</option>
        </select>
        <select style={styles.dropdown}>
          <option>Full Game</option>
          <option>First Half</option>
        </select>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Game</th>
            <th>ProphetX</th>
            <th>BetMGM</th>
            <th>Bet365</th>
            <th>FanDuel</th>
            <th>DraftKings</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedOdds).map((game, index) => (
            <tr key={index}>
              <td style={styles.gameCell}>
                {game.away_team} vs {game.home_team}
              </td>
              {["ProphetX", "BetMGM", "Bet365", "FanDuel", "DraftKings"].map((book, idx) => {
                const sportsbookData = game.sportsbooks[book] || {};
                return (
                  <td key={idx} style={styles.oddsCell}>
                    {sportsbookData.totals ? (
                      <div>
                        Total: {sportsbookData.totals.value} ({sportsbookData.totals.odds})
                      </div>
                    ) : (
                      <div>Total: -</div>
                    )}
                    {sportsbookData.spreads ? (
                      <div>
                        Spread: {sportsbookData.spreads.value} ({sportsbookData.spreads.odds})
                      </div>
                    ) : (
                      <div>Spread: -</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OddsTable;