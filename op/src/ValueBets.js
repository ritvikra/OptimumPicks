import React from "react";

const ValueBets = ({ games = [] }) => {
  const calculateValueBets = () => {
    if (!games || games.length === 0) return [];
    return games.slice(0, 2).map((game) => {
      const bestOdds = game.sportsbooks.reduce((best, current) =>
        best.odds > current.odds ? best : current
      );
      return {
        game: `${game.away_team} vs ${game.home_team}`,
        odds: bestOdds.odds,
        potentialReturn: (100 * bestOdds.odds).toFixed(2),
      };
    });
  };

  const valueBets = calculateValueBets();

  return (
    <div style={styles.container}>
      <h3>Top Plus Expected Value Bets</h3>
      {valueBets.length > 0 ? (
        <ul>
          {valueBets.map((bet, index) => (
            <li key={index}>
              <strong>{bet.game}</strong>
              <p>
                Bet on {bet.game.split(" vs ")[0]}. Odds: {bet.odds}. Potential return: $
                {bet.potentialReturn} on $100 bet.
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No value bets available.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontSize: "0.9rem",
  },
};

export default ValueBets;