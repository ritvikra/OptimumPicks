# OptimumPicks

A comprehensive sports betting analysis platform that identifies profitable betting opportunities through real-time odds analysis, arbitrage detection, and machine learning predictions.

## Overview

OptimumPicks aggregates betting odds from multiple sportsbooks, calculates expected value (EV) opportunities, identifies arbitrage situations, and uses machine learning models to predict game outcomes. The platform currently supports NBA and NFL betting markets.

## Features

### **Plus EV Bets**
Identifies betting opportunities where the odds are significantly better than the market average, indicating positive expected value.

### **Arbitrage Opportunities**
Detects arbitrage situations across multiple sportsbooks where you can guarantee a profit regardless of the outcome.

### **Optimum Predictions**
Uses a trained XGBoost machine learning model to predict NBA game totals, comparing model predictions against market lines to find value bets.

### **Live Odds Tables**
Real-time odds comparison tables for NBA and NFL games across multiple sportsbooks:
- DraftKings
- FanDuel
- BetMGM
- Caesars
- BetRivers
- ESPN BET
- bet365
- Fanatics
- And more...

## Technology Stack

### Frontend
- **React 19**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Create React App**: Build tool and development server
- **Material-UI (MUI)**: Component library and styling
- **Recharts**: Data visualization

### Backend & Data Processing
- **Node.js**: Server-side scripts for data fetching
- **Python 3.11**: Machine learning predictions
- **XGBoost**: Gradient boosting model for game total predictions
- **scikit-learn**: Machine learning utilities
- **pandas**: Data manipulation and analysis

### Data Sources
- **Action Network API**: Real-time sports betting odds
- **NBA Stats API**: Team statistics and performance metrics

### Deployment
- **GitHub Actions**: Automated CI/CD pipeline
- **GitHub Pages**: Static site hosting
- Automated updates every 20 minutes

## Project Structure

```
optimum-picks/
├── src/
│   ├── components/
│   │   ├── BettingTable.tsx      # Plus EV and Arbitrage tables
│   │   ├── OptimumTable.tsx      # ML prediction recommendations
│   │   ├── NBAOdds.tsx           # NBA odds comparison table
│   │   ├── NFLOdds.tsx           # NFL odds comparison table
│   │   └── Dashboard.tsx         # Analytics dashboard
│   ├── utils/
│   │   └── oddsAnalysis.ts       # EV and arbitrage calculations
│   └── App.tsx                    # Main application
├── models/
│   └── xgb.joblib                # Trained XGBoost model
├── public/
│   ├── nbaodds.json              # NBA odds data
│   ├── nflodds.json              # NFL odds data
│   ├── nba_predicted_totals.json # ML predictions
│   └── nbateamstats.csv          # Team statistics
├── nbaoddsupdate.mjs             # NBA odds fetcher
├── nfloddsupdate.mjs             # NFL odds fetcher
├── predict_nba_totals.py         # ML prediction script
└── .github/workflows/
    └── deploy.yml                # CI/CD pipeline
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd OptimumPicks/optimum-picks
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
pip install -r ../requirements.txt
```

### Running Locally

1. Start the development server:
```bash
npm start
```

2. The app will open at `http://localhost:3000`

### Generating Predictions

To manually generate NBA game total predictions:

```bash
python3 predict_nba_totals.py
```

This will:
- Load the trained XGBoost model
- Read current NBA games from `public/nbaodds.json`
- Generate predictions and save to `public/nba_predicted_totals.json`

### Updating Odds

To manually update odds data:

```bash
# Update NBA odds
node nbaoddsupdate.mjs

# Update NFL odds
node nfloddsupdate.mjs
```

## Automated Updates

The project uses GitHub Actions to automatically:
- Update NBA and NFL odds every 20 minutes
- Generate new ML predictions
- Commit and deploy changes to GitHub Pages

See `.github/workflows/deploy.yml` for the complete workflow.

## Key Algorithms

### Plus EV Calculation
Identifies bets where:
- Expected value > 5%
- Odds are at least 10 points better than market average

### Arbitrage Detection
Finds opportunities where:
- Sum of implied probabilities < 100%
- Profit margin > 0.5%

### ML Predictions
- Uses team performance metrics and opponent defensive stats
- Predicts game totals with RMSE ~4.3 points
- Recommends bets when model differs significantly from market line

## Acknowledgments

- Action Network for odds data
- NBA Stats API for team statistics
- Material-UI for the component library
