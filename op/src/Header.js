
import React from "react";

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>🏆 OptimumPicks</div>
      <nav style={styles.nav}>
        <a href="#" style={styles.navLink}>
          Sportsbook Odds Comparison
        </a>
        <a href="#" style={styles.navLink}>
          Arbitrage Calculator
        </a>
        <a href="#" style={styles.navLink}>
          Arbitrage Opportunities
        </a>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #ddd",
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
};

export default Header;