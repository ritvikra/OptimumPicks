#!/usr/bin/env python3
"""
Predict NBA game totals using trained XGBoost model.
Loads xgb.joblib, reads nbaodds.json, and writes predictions to nba_predicted_totals.json
"""

import json
import pandas as pd
import joblib
from pathlib import Path
from datetime import datetime

# Paths
BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "models" / "xgb.joblib"
ODDS_PATH = BASE_DIR / "public" / "nbaodds.json"
TEAM_STATS_PATH = BASE_DIR / "public" / "nbateamstats.csv"
OPP_STATS_PATH = BASE_DIR / "public" / "nbaoppteamstats.csv"
OUTPUT_PATH = BASE_DIR / "public" / "nba_predicted_totals.json"

# Features used in training (must match training order)
FEATURES = [
    'W_PCT', 'MIN', 'FG_PCT', 'FG3_PCT', 'FT_PCT', 'FGA', 'FG3A', 'FTA',
    'OREB', 'DREB', 'REB', 'AST', 'TOV', 'STL', 'BLK', 'PLUS_MINUS',
    'OPP_PTS', 'OPP_FG_PCT', 'OPP_FG3_PCT', 'OPP_FT_PCT', 'OPP_REB', 'OPP_AST', 'OPP_TOV'
]

# Book name mapping
BOOK_NAMES = {
    "15": "DraftKings",
    "30": "FanDuel",
    "647": "BetMGM",
    "510": "Caesars",
    "68": "BetRivers",
    "3151": "ESPN BET",
    "645": "bet365",
    "1867": "Fanatics",
    "1901": "Hard Rock",
    "841": "Bally Bet",
    "1904": "Desert Diamond",
    "79": "Unibet",
}

def load_model():
    """Load the trained XGBoost model."""
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    return joblib.load(MODEL_PATH)

def load_team_stats():
    """Load and merge team stats with opponent stats."""
    df = pd.read_csv(TEAM_STATS_PATH)
    dfOpp = pd.read_csv(OPP_STATS_PATH)
    
    # Merge opponent stats
    non_overlapping_cols = dfOpp.columns.difference(df.columns).union(['TEAM_NAME'])
    dfOpp_unique = dfOpp[non_overlapping_cols]
    merged_df = pd.merge(df, dfOpp_unique, on='TEAM_NAME', how='left')
    
    return merged_df

def find_best_total_line(game):
    """Find the best total line from all books for a game."""
    markets = game.get('markets', {})
    best_over_odds = None
    best_under_odds = None
    best_line = None
    best_book_id = None
    
    for book_id, book_markets in markets.items():
        event = book_markets.get('event', {})
        totals = event.get('total', [])
        
        for total in totals:
            if total.get('period') != 'event':
                continue
            
            line = total.get('value')
            side = total.get('side')
            odds = total.get('odds')
            
            if line is None or odds is None:
                continue
            
            if best_line is None:
                best_line = line
                best_book_id = book_id
            
            if side == 'over' and (best_over_odds is None or odds > best_over_odds):
                best_over_odds = odds
                if best_line is None:
                    best_line = line
                    best_book_id = book_id
            
            if side == 'under' and (best_under_odds is None or odds > best_under_odds):
                best_under_odds = odds
                if best_line is None:
                    best_line = line
                    best_book_id = book_id
    
    return best_line, best_over_odds, best_under_odds, best_book_id

def format_odds(odds):
    """Format odds as American odds string."""
    if odds is None:
        return None
    if odds > 0:
        return f"+{int(odds)}"
    return str(int(odds))

def main():
    print("Loading model...")
    model = load_model()
    
    print("Loading team stats...")
    merged_df = load_team_stats()
    
    print("Loading NBA odds...")
    with open(ODDS_PATH, 'r') as f:
        odds_data = json.load(f)
    
    games = odds_data.get('games', [])
    predictions = []
    
    print(f"Processing {len(games)} games...\n")
    
    for game in games:
        game_id = game.get('id')
        teams = game.get('teams', [])
        away_team_id = game.get('away_team_id')
        home_team_id = game.get('home_team_id')
        start_time = game.get('start_time')
        
        # Find team names
        away_team = next((t for t in teams if t.get('id') == away_team_id), None)
        home_team = next((t for t in teams if t.get('id') == home_team_id), None)
        
        if not away_team or not home_team:
            print(f"Game {game_id}: Missing team data, skipping")
            continue
        
        away_team_name = away_team.get('full_name')
        home_team_name = home_team.get('full_name')
        
        # Find team stats
        away_stats = merged_df[merged_df['TEAM_NAME'] == away_team_name]
        home_stats = merged_df[merged_df['TEAM_NAME'] == home_team_name]
        
        if away_stats.empty or home_stats.empty:
            print(f"Game {game_id}: {away_team_name} @ {home_team_name} - Missing stats, skipping")
            continue
        
        away_stats = away_stats.iloc[0]
        home_stats = home_stats.iloc[0]
        
        # Create feature vectors
        try:
            away_features = away_stats[FEATURES].values.reshape(1, -1)
            home_features = home_stats[FEATURES].values.reshape(1, -1)
        except KeyError as e:
            print(f"Game {game_id}: Missing feature {e}, skipping")
            continue
        
        # Predict total points from both perspectives and average
        away_prediction = model.predict(away_features)[0]
        home_prediction = model.predict(home_features)[0]
        predicted_total = (away_prediction + home_prediction) / 2
        
        # Find best total line from markets
        best_line, best_over_odds, best_under_odds, best_book_id = find_best_total_line(game)
        
        # Calculate difference and recommendation
        if best_line is not None:
            difference = predicted_total - best_line
            difference_pct = (difference / best_line) * 100 if best_line > 0 else 0
            
            # Determine recommendation (over/under)
            if difference > 2:  # Model predicts significantly higher
                recommendation = 'over'
                recommended_odds = format_odds(best_over_odds)
            elif difference < -2:  # Model predicts significantly lower
                recommendation = 'under'
                recommended_odds = format_odds(best_under_odds)
            else:
                recommendation = None
                recommended_odds = None
        else:
            best_line = None
            difference = None
            difference_pct = None
            recommendation = None
            recommended_odds = None
        
        book_name = BOOK_NAMES.get(best_book_id, f"Book {best_book_id}") if best_book_id else None
        
        prediction_entry = {
            'game_id': game_id,
            'away_team': away_team_name,
            'home_team': home_team_name,
            'away_team_id': away_team_id,
            'home_team_id': home_team_id,
            'start_time': start_time,
            'predicted_total': round(predicted_total, 2),
            'market_line': round(best_line, 1) if best_line is not None else None,
            'difference': round(difference, 2) if difference is not None else None,
            'difference_pct': round(difference_pct, 2) if difference_pct is not None else None,
            'recommendation': recommendation,
            'odds': recommended_odds,
            'book_id': best_book_id,
            'book_name': book_name
        }
        
        predictions.append(prediction_entry)
        
        if best_line:
            print(f"{away_team_name} @ {home_team_name}: Predicted {predicted_total:.2f}, Line {best_line:.1f}, Diff {difference:.2f} ({difference_pct:+.1f}%)")
        else:
            print(f"{away_team_name} @ {home_team_name}: Predicted {predicted_total:.2f} (no line available)")
    
    print(f"\nTotal predictions: {len(predictions)}")
    
    # Write to JSON file
    output_data = {
        'last_updated': datetime.now().isoformat(),
        'predictions': predictions
    }
    
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\nPredictions written to {OUTPUT_PATH}")

if __name__ == '__main__':
    main()

