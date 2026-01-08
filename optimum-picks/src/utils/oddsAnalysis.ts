import { BettingData } from '../data/mockData';

type AnyObj = any;

const bookNames: Record<string, string> = {
  // NBA book IDs
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
  // NFL book IDs
  "270": "BetMGM",
  "282": "Caesars",
  "1797": "bet365",
  "279": "Fanatics",
  "2988": "BetMGM",
  "75": "Caesars",
  "123": "BetRivers",
  "71": "FanDuel",
};

// Convert American odds to decimal odds
function americanToDecimal(americanOdds: number): number {
  if (americanOdds > 0) {
    return (americanOdds / 100) + 1;
  } else {
    return (100 / Math.abs(americanOdds)) + 1;
  }
}

// Convert American odds to implied probability
function americanToImpliedProb(americanOdds: number): number {
  const decimal = americanToDecimal(americanOdds);
  return 1 / decimal;
}

// Format American odds as string
function fmtAmericanOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : String(odds);
}

// Format date/time
function fmtStartTime(iso: string | null | undefined): { date: string; time: string } {
  if (!iso) return { date: "—", time: "—" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: iso, time: "—" };

  const dateStr = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d);

  const timeStr = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);

  return { date: dateStr, time: timeStr };
}

// Calculate average odds across all books for a specific bet (excluding a specific book if provided)
function getAverageOdds(
  games: AnyObj[],
  marketType: 'moneyline' | 'spread' | 'total',
  side: 'home' | 'away' | 'over' | 'under',
  gameId: number,
  teamId?: number,
  lineValue?: number,
  excludeBookId?: string
): { avgOdds: number; oddsList: number[] } {
  const oddsList: number[] = [];
  
  for (const game of games) {
    if (game.id !== gameId) continue;
    
    const markets = game?.markets || {};
    for (const bookId of Object.keys(markets)) {
      if (excludeBookId && bookId === excludeBookId) continue; // Exclude current book from average
      
      const market = markets[bookId]?.event?.[marketType];
      if (!Array.isArray(market)) continue;
      
      const entry = market.find((e: AnyObj) => {
        if (e.side !== side) return false;
        if (marketType === 'moneyline' && teamId && e.team_id !== teamId) return false;
        if (marketType === 'spread' && teamId && e.team_id !== teamId) return false;
        if ((marketType === 'total') && lineValue !== undefined && Math.abs(e.value - lineValue) > 0.1) return false;
        return true;
      });
      
      if (entry?.odds != null) {
        oddsList.push(entry.odds);
      }
    }
  }
  
  if (oddsList.length === 0) return { avgOdds: 0, oddsList: [] };
  
  const avgOdds = oddsList.reduce((a, b) => a + b, 0) / oddsList.length;
  return { avgOdds, oddsList };
}

// Calculate Plus EV opportunities
export function calculatePlusEV(games: AnyObj[]): BettingData[] {
  const opportunities: BettingData[] = [];
  let id = 1;

  // Determine league from first game
  const firstGame = games[0];
  const isNFL = firstGame?.league_id === 1 || firstGame?.league_name === "nfl";
  const category = isNFL ? "Football" : "Basketball";
  const league = isNFL ? "NFL" : "NBA";

  for (const game of games) {
    const away = game?.teams?.find((t: AnyObj) => t.id === game.away_team_id);
    const home = game?.teams?.find((t: AnyObj) => t.id === game.home_team_id);
    const awayName = away?.display_name ?? "Away";
    const homeName = home?.display_name ?? "Home";
    const teams = `${awayName} @ ${homeName}`;
    const { date, time } = fmtStartTime(game?.start_time);

    const markets = game?.markets || {};
    
    // Check moneyline
    for (const bookId of Object.keys(markets)) {
      const moneyline = markets[bookId]?.event?.moneyline;
      if (!Array.isArray(moneyline)) continue;

      for (const entry of moneyline) {
        if (entry.odds == null) continue;
        
        const side = entry.side === 'away' ? 'away' : 'home';
        const teamId = entry.team_id;
        const { avgOdds, oddsList } = getAverageOdds(games, 'moneyline', side, game.id, teamId, undefined, bookId);
        
        if (oddsList.length < 1) continue; // Need at least 1 other book to compare
        
        // Calculate EV: if this book's odds are significantly better than average
        const oddsDiff = entry.odds - avgOdds;
        const decimalOdds = americanToDecimal(entry.odds);
        
        // EV = (implied prob from avg odds) * (payout from this book) - 1
        const impliedProbFromAvg = americanToImpliedProb(avgOdds);
        const payout = decimalOdds - 1;
        const expectedValue = (impliedProbFromAvg * payout - (1 - impliedProbFromAvg)) * 100;
        
        // Only include if EV > 5% and odds are at least 10 points better
        if (expectedValue > 5 && oddsDiff > 10) {
          const teamName = side === 'away' ? awayName : homeName;
          opportunities.push({
            id: id++,
            expectedValue: expectedValue,
            eventDate: date,
            eventTime: time,
            teams,
            category: category,
            league: league,
            market: 'Moneyline',
            books: bookNames[bookId] || `Book ${bookId}`,
            selection: `${teamName} ${side === 'away' ? 'Away' : 'Home'}`,
            odds: fmtAmericanOdds(entry.odds),
            probability: `${(impliedProbFromAvg * 100).toFixed(1)}%`,
            betSize: 100,
          });
        }
      }
    }

    // Check spread
    for (const bookId of Object.keys(markets)) {
      const spread = markets[bookId]?.event?.spread;
      if (!Array.isArray(spread)) continue;

      for (const entry of spread) {
        if (entry.odds == null || entry.value == null) continue;
        
        const side = entry.side === 'away' ? 'away' : 'home';
        const teamId = entry.team_id;
        const lineValue = entry.value;
        const { avgOdds, oddsList } = getAverageOdds(games, 'spread', side, game.id, teamId, lineValue, bookId);
        
        if (oddsList.length < 1) continue;
        
        const oddsDiff = entry.odds - avgOdds;
        const decimalOdds = americanToDecimal(entry.odds);
        const impliedProbFromAvg = americanToImpliedProb(avgOdds);
        const payout = decimalOdds - 1;
        const expectedValue = (impliedProbFromAvg * payout - (1 - impliedProbFromAvg)) * 100;
        
        if (expectedValue > 5 && oddsDiff > 10) {
          const teamName = side === 'away' ? awayName : homeName;
          const lineStr = lineValue > 0 ? `+${lineValue}` : String(lineValue);
          opportunities.push({
            id: id++,
            expectedValue: expectedValue,
            eventDate: date,
            eventTime: time,
            teams,
            category: category,
            league: league,
            market: 'Spread',
            books: bookNames[bookId] || `Book ${bookId}`,
            selection: `${teamName} ${lineStr}`,
            odds: fmtAmericanOdds(entry.odds),
            probability: `${(impliedProbFromAvg * 100).toFixed(1)}%`,
            betSize: 100,
          });
        }
      }
    }

    // Check total (over/under)
    for (const bookId of Object.keys(markets)) {
      const total = markets[bookId]?.event?.total;
      if (!Array.isArray(total)) continue;

      for (const entry of total) {
        if (entry.odds == null || entry.value == null) continue;
        
        const side = entry.side === 'over' ? 'over' : 'under';
        const lineValue = entry.value;
        const { avgOdds, oddsList } = getAverageOdds(games, 'total', side, game.id, undefined, lineValue, bookId);
        
        if (oddsList.length < 1) continue;
        
        const oddsDiff = entry.odds - avgOdds;
        const decimalOdds = americanToDecimal(entry.odds);
        const impliedProbFromAvg = americanToImpliedProb(avgOdds);
        const payout = decimalOdds - 1;
        const expectedValue = (impliedProbFromAvg * payout - (1 - impliedProbFromAvg)) * 100;
        
        if (expectedValue > 5 && oddsDiff > 10) {
          opportunities.push({
            id: id++,
            expectedValue: expectedValue,
            eventDate: date,
            eventTime: time,
            teams,
            category: category,
            league: league,
            market: 'Total',
            books: bookNames[bookId] || `Book ${bookId}`,
            selection: `${side === 'over' ? 'Over' : 'Under'} ${lineValue}`,
            odds: fmtAmericanOdds(entry.odds),
            probability: `${(impliedProbFromAvg * 100).toFixed(1)}%`,
            betSize: 100,
          });
        }
      }
    }
  }

  return opportunities.sort((a, b) => (b.expectedValue || 0) - (a.expectedValue || 0));
}

// Calculate Arbitrage opportunities
export function calculateArbitrage(games: AnyObj[]): BettingData[] {
  const opportunities: BettingData[] = [];
  let id = 1;

  // Determine league from first game
  const firstGame = games[0];
  const isNFL = firstGame?.league_id === 1 || firstGame?.league_name === "nfl";
  const category = isNFL ? "Football" : "Basketball";
  const league = isNFL ? "NFL" : "NBA";

  for (const game of games) {
    const away = game?.teams?.find((t: AnyObj) => t.id === game.away_team_id);
    const home = game?.teams?.find((t: AnyObj) => t.id === game.home_team_id);
    const awayName = away?.display_name ?? "Away";
    const homeName = home?.display_name ?? "Home";
    const teams = `${awayName} @ ${homeName}`;
    const { date, time } = fmtStartTime(game?.start_time);

    const markets = game?.markets || {};
    
    // Check moneyline arbitrage
    const moneylineOdds: Record<string, { away?: number; home?: number; bookId: string }> = {};
    
    for (const bookId of Object.keys(markets)) {
      const moneyline = markets[bookId]?.event?.moneyline;
      if (!Array.isArray(moneyline)) continue;
      
      const awayEntry = moneyline.find((e: AnyObj) => e.side === 'away');
      const homeEntry = moneyline.find((e: AnyObj) => e.side === 'home');
      
      if (awayEntry?.odds != null && homeEntry?.odds != null) {
        moneylineOdds[bookId] = {
          away: awayEntry.odds,
          home: homeEntry.odds,
          bookId,
        };
      }
    }
    
    // Find best odds for each side across all books
    let bestAwayOdds = -Infinity;
    let bestAwayBook = '';
    let bestHomeOdds = -Infinity;
    let bestHomeBook = '';
    
    for (const [bookId, odds] of Object.entries(moneylineOdds)) {
      if (odds.away != null && odds.away > bestAwayOdds) {
        bestAwayOdds = odds.away;
        bestAwayBook = bookId;
      }
      if (odds.home != null && odds.home > bestHomeOdds) {
        bestHomeOdds = odds.home;
        bestHomeBook = bookId;
      }
    }
    
    // Check if arbitrage exists
    if (bestAwayOdds !== -Infinity && bestHomeOdds !== -Infinity && bestAwayBook && bestHomeBook) {
      const awayDecimal = americanToDecimal(bestAwayOdds);
      const homeDecimal = americanToDecimal(bestHomeOdds);
      const totalImpliedProb = (1 / awayDecimal) + (1 / homeDecimal);
      
      if (totalImpliedProb < 1) {
        const arbPercentage = (1 - totalImpliedProb) * 100;
        
        // Calculate bet sizes for $100 total
        const awayBetSize = (100 * (1 / awayDecimal)) / totalImpliedProb;
        const homeBetSize = (100 * (1 / homeDecimal)) / totalImpliedProb;
        const profit = 100 - (awayBetSize + homeBetSize);
        
        if (arbPercentage > 0.5) { // Only show if > 0.5% arbitrage
          opportunities.push({
            id: id++,
            arbPercentage: arbPercentage,
            eventDate: date,
            eventTime: time,
            teams,
            category: category,
            league: league,
            market: 'Moneyline',
            books: `${bookNames[bestAwayBook] || bestAwayBook} / ${bookNames[bestHomeBook] || bestHomeBook}`,
            selection: `${awayName} / ${homeName}`,
            odds: `${fmtAmericanOdds(bestAwayOdds)} / ${fmtAmericanOdds(bestHomeOdds)}`,
            betSize: Math.round(awayBetSize + homeBetSize),
            betSizeRatio: `${Math.round(awayBetSize)}:${Math.round(homeBetSize)}`,
          });
        }
      }
    }

    // Check spread arbitrage (same line, different odds)
    for (const bookId1 of Object.keys(markets)) {
      const spread1 = markets[bookId1]?.event?.spread;
      if (!Array.isArray(spread1)) continue;
      
      for (const entry1 of spread1) {
        if (entry1.odds == null || entry1.value == null) continue;
        
        const lineValue = entry1.value;
        const side1 = entry1.side;
        const teamId1 = entry1.team_id;
        
        // Find opposite side with same line
        for (const bookId2 of Object.keys(markets)) {
          if (bookId1 === bookId2) continue;
          
          const spread2 = markets[bookId2]?.event?.spread;
          if (!Array.isArray(spread2)) continue;
          
          const entry2 = spread2.find((e: AnyObj) => 
            e.side !== side1 && 
            e.team_id !== teamId1 && 
            Math.abs(e.value + lineValue) < 0.1 // Opposite line
          );
          
          if (entry2?.odds != null) {
            const odds1 = entry1.odds;
            const odds2 = entry2.odds;
            const decimal1 = americanToDecimal(odds1);
            const decimal2 = americanToDecimal(odds2);
            const totalImpliedProb = (1 / decimal1) + (1 / decimal2);
            
            if (totalImpliedProb < 1) {
              const arbPercentage = (1 - totalImpliedProb) * 100;
              const bet1Size = (100 * (1 / decimal1)) / totalImpliedProb;
              const bet2Size = (100 * (1 / decimal2)) / totalImpliedProb;
              
              if (arbPercentage > 0.5) {
                const team1Name = side1 === 'away' ? awayName : homeName;
                const team2Name = side1 === 'away' ? homeName : awayName;
                const lineStr = lineValue > 0 ? `+${lineValue}` : String(lineValue);
                const oppLineStr = -lineValue > 0 ? `+${-lineValue}` : String(-lineValue);
                
                opportunities.push({
                  id: id++,
                  arbPercentage: arbPercentage,
                  eventDate: date,
                  eventTime: time,
                  teams,
                  category: category,
                  league: league,
                  market: 'Spread',
                  books: `${bookNames[bookId1] || bookId1} / ${bookNames[bookId2] || bookId2}`,
                  selection: `${team1Name} ${lineStr} / ${team2Name} ${oppLineStr}`,
                  odds: `${fmtAmericanOdds(odds1)} / ${fmtAmericanOdds(odds2)}`,
                  betSize: Math.round(bet1Size + bet2Size),
                  betSizeRatio: `${Math.round(bet1Size)}:${Math.round(bet2Size)}`,
                });
              }
            }
          }
        }
      }
    }

    // Check total arbitrage (over/under)
    for (const bookId1 of Object.keys(markets)) {
      const total1 = markets[bookId1]?.event?.total;
      if (!Array.isArray(total1)) continue;
      
      for (const entry1 of total1) {
        if (entry1.odds == null || entry1.value == null) continue;
        
        const lineValue = entry1.value;
        const side1 = entry1.side;
        
        // Find opposite side with same line
        for (const bookId2 of Object.keys(markets)) {
          if (bookId1 === bookId2) continue;
          
          const total2 = markets[bookId2]?.event?.total;
          if (!Array.isArray(total2)) continue;
          
          const entry2 = total2.find((e: AnyObj) => 
            e.side !== side1 && 
            Math.abs(e.value - lineValue) < 0.1 // Same line
          );
          
          if (entry2?.odds != null) {
            const odds1 = entry1.odds;
            const odds2 = entry2.odds;
            const decimal1 = americanToDecimal(odds1);
            const decimal2 = americanToDecimal(odds2);
            const totalImpliedProb = (1 / decimal1) + (1 / decimal2);
            
            if (totalImpliedProb < 1) {
              const arbPercentage = (1 - totalImpliedProb) * 100;
              const bet1Size = (100 * (1 / decimal1)) / totalImpliedProb;
              const bet2Size = (100 * (1 / decimal2)) / totalImpliedProb;
              
              if (arbPercentage > 0.5) {
                opportunities.push({
                  id: id++,
                  arbPercentage: arbPercentage,
                  eventDate: date,
                  eventTime: time,
                  teams,
                  category: category,
                  league: league,
                  market: 'Total',
                  books: `${bookNames[bookId1] || bookId1} / ${bookNames[bookId2] || bookId2}`,
                  selection: `Over ${lineValue} / Under ${lineValue}`,
                  odds: `${fmtAmericanOdds(odds1)} / ${fmtAmericanOdds(odds2)}`,
                  betSize: Math.round(bet1Size + bet2Size),
                  betSizeRatio: `${Math.round(bet1Size)}:${Math.round(bet2Size)}`,
                });
              }
            }
          }
        }
      }
    }
  }

  return opportunities.sort((a, b) => (b.arbPercentage || 0) - (a.arbPercentage || 0));
}

