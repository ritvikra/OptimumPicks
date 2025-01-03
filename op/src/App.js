import React from "react";

// Header Component
const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>🏆 OptimumPicks</div>
      <nav style={styles.nav}>
        <a href="#" style={styles.navLink}>Sportsbook Odds Comparison</a>
        <a href="#" style={styles.navLink}>Arbitrage Calculator</a>
        <a href="#" style={styles.navLink}>Arbitrage Opportunities</a>
      </nav>
    </header>
  );
};

// OddsTable Component
const OddsTable = () => {
  const oddsData = [
    { sportsbook: "Bet365", odds: 1.95, league: "Premier League", date: "Dec 5, 2023" },
    { sportsbook: "Pinnacle", odds: 2.00, league: "NBA", date: "Dec 6, 2023" },
  ];

  return (
    <div style={styles.oddsTable}>
      <div style={styles.filters}>
        <select style={styles.dropdown}>
          <option>Football</option>
          <option>Basketball</option>
        </select>
        <select style={styles.dropdown}>
          <option>Premier League</option>
          <option>NBA</option>
        </select>
        <button style={styles.compareButton}>Compare</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Sportsbook</th>
            <th>Odds</th>
            <th>League</th>
            <th>Date</th>
            <th>More Info</th>
          </tr>
        </thead>
        <tbody>
          {oddsData.map((row, index) => (
            <tr key={index} style={styles.centeredRow}>
              <td>{row.sportsbook}</td>
              <td>{row.odds}</td>
              <td>{row.league}</td>
              <td>{row.date}</td>
              <td>
                <button style={styles.detailsButton}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ValueBets Component
const ValueBets = () => {
  const bets = [
    {
      match: "Manchester United vs Chelsea",
      odds: 3.5,
      return: "$350 on $100 bet",
    },
    {
      match: "Lakers vs Warriors",
      odds: 2.8,
      return: "$280 on $100 bet",
    },
  ];

  return (
    <div style={styles.valueBets}>
      <h3>Top Plus Expected Value Bets</h3>
      <ul>
        {bets.map((bet, index) => (
          <li key={index} style={styles.betItem}>
            <strong>{bet.match}</strong>
            <p>
              Bet on {bet.match.split(" vs ")[0]} to win. Odds: {bet.odds}. Potential return: {bet.return}.
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.mainContent}>
        <OddsTable />
        <ValueBets />
      </div>
    </div>
  );
};

// Styles
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #ddd",
  },
  centeredRow: {
    textAlign : "center",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
  },
  nav: {
    display: "flex",
    gap: "1rem",
  },
  navLink: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "500",
  },
  container: {
    fontFamily: "Arial, sans-serif",
    color: "#333",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    padding: "1rem",
  },
  mainContent: {
    display: "flex",
    justifyContent: "space-between",
    padding: "2rem",
  },
  oddsTable: {
    flex: 2,
    marginRight: "1rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  filters: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },
  dropdown: {
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  compareButton: {
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  detailsButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
  valueBets: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  betItem: {
    marginBottom: "1rem",
  },
};

export default App;