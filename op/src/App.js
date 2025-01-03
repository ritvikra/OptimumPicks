import React, { useState, useEffect } from "react";
import OddsTable from "./OddsTable";
import ValueBets from "./ValueBets";

const App = () => {
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

  // Group odds by game for ValueBets
  const groupedOdds = oddsData.reduce((acc, curr) => {
    const { game_id, home_team, away_team, sportsbook, type, value, odds } = curr;
    if (!acc[game_id]) {
      acc[game_id] = { game_id, home_team, away_team, sportsbooks: [] };
    }
    acc[game_id].sportsbooks.push({ sportsbook, type, value, odds });
    return acc;
  }, {});

  const groupedOddsArray = Object.values(groupedOdds);

  return (
    <div style={styles.container}>
      <div style={styles.oddsTable}>
        <OddsTable oddsData={groupedOddsArray} />
      </div>
      <div style={styles.valueBets}>
        <ValueBets games={groupedOddsArray} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
    padding: "1rem",
  },
  oddsTable: {
    flex: 3,
  },
  valueBets: {
    flex: 1,
    maxWidth: "300px",
  },
};

export default App;