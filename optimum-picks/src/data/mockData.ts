export interface BettingData {
  id: number;
  expectedValue?: number;
  arbPercentage?: number;
  eventDate: string;
  eventTime: string;
  teams: string;
  category: string;
  league: string;
  market: string;
  books: string;
  selection: string;
  odds: string;
  probability?: string;
  betSize: number;
  betSizeRatio?: string;
}

export interface OptimumData {
  id: number;
  gameId?: number;
  player?: string;
  team?: string;
  teams?: string; // For game totals: "Away @ Home"
  position?: string;
  propType: string; // "Game Total" for totals, or player prop type
  marketLine: string; // e.g., "Over 232.5" or "Under 232.5"
  modelPrediction: string;
  differencePercentage: number;
  confidence: number;
  odds: string;
  startTime?: string;
}

export const mockData: BettingData[] = [
  {
    id: 1,
    expectedValue: 38.32,
    arbPercentage: 4.2,
    eventDate: 'Sat, May 24',
    eventTime: '9:40 AM',
    teams: 'CA Atletico vs Club de Gimnasia y Tiro de Salta',
    category: 'Soccer',
    league: 'Argentina - Primera Nacional',
    market: 'Team Total',
    books: 'BetMGM',
    selection: 'Club de Gimnasia y Tiro de Salta Under 0.5',
    odds: '+185',
    probability: '51.4%',
    betSize: 60,
    betSizeRatio: '60:40'
  },
  {
    id: 2,
    expectedValue: 13.54,
    arbPercentage: 3.8,
    eventDate: 'Wed, May 21',
    eventTime: '5:00 PM',
    teams: 'Dallas Wings vs Minnesota Lynx',
    category: 'Basketball',
    league: 'WNBA',
    market: 'Player Made Threes',
    books: 'DraftKings',
    selection: 'Bridget Carleton Over 1.5',
    odds: '-116',
    probability: '60.7%',
    betSize: 40,
    betSizeRatio: '55:45'
  },
  {
    id: 3,
    expectedValue: 10.18,
    arbPercentage: 2.9,
    eventDate: 'Today',
    eventTime: '7:05 PM',
    teams: 'Los Angeles Angels vs Oakland Athletics',
    category: 'Baseball',
    league: 'MLB',
    market: 'Player Runs',
    books: 'FanDuel',
    selection: 'Tyler Soderstrom Under 0.5',
    odds: '+118',
    probability: '50.5%',
    betSize: 20,
    betSizeRatio: '70:30'
  },
  {
    id: 4,
    expectedValue: 6.78,
    arbPercentage: 2.5,
    eventDate: 'Fri, May 23',
    eventTime: '10:30 AM',
    teams: 'WSG Tirol vs Grazer AK 1902',
    category: 'Soccer',
    league: 'Austria - Bundesliga',
    market: 'Both Teams To Score',
    books: 'DraftKings',
    selection: 'Yes',
    odds: '-133',
    probability: '60.9%',
    betSize: 20,
    betSizeRatio: '65:35'
  },
  {
    id: 5,
    expectedValue: 6.70,
    arbPercentage: 2.3,
    eventDate: 'Wed, May 21',
    eventTime: '5:00 PM',
    teams: 'Indiana Pacers vs New York Knicks',
    category: 'Basketball',
    league: 'NBA',
    market: 'Player Blocks',
    books: 'FanDuel',
    selection: 'Myles Turner Under 2.5',
    odds: '-139',
    probability: '62.0%',
    betSize: 25,
    betSizeRatio: '50:50'
  },
  {
    id: 6,
    expectedValue: 6.58,
    arbPercentage: 2.1,
    eventDate: 'Today',
    eventTime: '7:05 PM',
    teams: 'Los Angeles Angels vs Oakland Athletics',
    category: 'Baseball',
    league: 'MLB',
    market: 'Player Runs',
    books: 'FanDuel',
    selection: 'Brent Rooker Under 0.5',
    odds: '+112',
    probability: '50.3%',
    betSize: 15,
    betSizeRatio: '58:42'
  },
  {
    id: 7,
    expectedValue: 5.51,
    arbPercentage: 1.8,
    eventDate: 'Thu, May 22',
    eventTime: '2:50 AM',
    teams: 'Dolphins vs Canterbury Bulldogs',
    category: 'Rugby League',
    league: 'Australia - NRL',
    market: 'Total Points',
    books: 'DraftKings',
    selection: 'Over 42.5',
    odds: '+112',
    probability: '49.8%',
    betSize: 10,
    betSizeRatio: '45:55'
  },
  {
    id: 8,
    expectedValue: 5.30,
    arbPercentage: 1.6,
    eventDate: 'Wed, May 21',
    eventTime: '5:40 PM',
    teams: 'Philadelphia Phillies vs Colorado Rockies',
    category: 'Baseball',
    league: 'MLB',
    market: '1st Half Total Runs',
    books: 'DraftKings',
    selection: 'Over 7.5',
    odds: '+175',
    probability: '38.3%',
    betSize: 10,
    betSizeRatio: '62:38'
  }
];

export const optimumData: OptimumData[] = [
  {
    id: 1,
    player: 'LeBron James',
    team: 'Los Angeles Lakers',
    position: 'SF',
    propType: 'Points',
    marketLine: 'Over 26.5',
    modelPrediction: '29.8',
    differencePercentage: 12.5,
    confidence: 82,
    odds: '-110'
  },
  {
    id: 2,
    player: 'Nikola Jokić',
    team: 'Denver Nuggets',
    position: 'C',
    propType: 'Rebounds',
    marketLine: 'Over 11.5',
    modelPrediction: '13.2',
    differencePercentage: 14.8,
    confidence: 76,
    odds: '-120'
  },
  {
    id: 3,
    player: 'Stephen Curry',
    team: 'Golden State Warriors',
    position: 'PG',
    propType: 'Three Pointers',
    marketLine: 'Over 4.5',
    modelPrediction: '5.3',
    differencePercentage: 17.8,
    confidence: 85,
    odds: '-135'
  },
  {
    id: 4,
    player: 'Luka Dončić',
    team: 'Dallas Mavericks',
    position: 'PG',
    propType: 'Assists',
    marketLine: 'Under 9.5',
    modelPrediction: '7.8',
    differencePercentage: -17.9,
    confidence: 79,
    odds: '+105'
  },
  {
    id: 5,
    player: 'Joel Embiid',
    team: 'Philadelphia 76ers',
    position: 'C',
    propType: 'Points + Rebounds',
    marketLine: 'Over 38.5',
    modelPrediction: '44.2',
    differencePercentage: 14.8,
    confidence: 73,
    odds: '-115'
  },
  {
    id: 6,
    player: 'Jayson Tatum',
    team: 'Boston Celtics',
    position: 'SF',
    propType: 'Points',
    marketLine: 'Under 28.5',
    modelPrediction: '24.3',
    differencePercentage: -14.7,
    confidence: 68,
    odds: '+100'
  },
  {
    id: 7,
    player: 'Anthony Edwards',
    team: 'Minnesota Timberwolves',
    position: 'SG',
    propType: 'Points',
    marketLine: 'Over 25.5',
    modelPrediction: '29.7',
    differencePercentage: 16.5,
    confidence: 77,
    odds: '-115'
  },
  {
    id: 8,
    player: 'Rudy Gobert',
    team: 'Minnesota Timberwolves',
    position: 'C',
    propType: 'Blocks',
    marketLine: 'Over 1.5',
    modelPrediction: '2.1',
    differencePercentage: 40.0,
    confidence: 88,
    odds: '-105'
  },
  {
    id: 9,
    player: 'Tyrese Haliburton',
    team: 'Indiana Pacers',
    position: 'PG',
    propType: 'Assists',
    marketLine: 'Over 9.5',
    modelPrediction: '12.3',
    differencePercentage: 29.5,
    confidence: 90,
    odds: '-130'
  },
  {
    id: 10,
    player: 'Shai Gilgeous-Alexander',
    team: 'Oklahoma City Thunder',
    position: 'SG',
    propType: 'Points',
    marketLine: 'Under 30.5',
    modelPrediction: '26.2',
    differencePercentage: -14.1,
    confidence: 65,
    odds: '+110'
  },
  {
    id: 11,
    player: 'Giannis Antetokounmpo',
    team: 'Milwaukee Bucks',
    position: 'PF',
    propType: 'Rebounds',
    marketLine: 'Under 12.5',
    modelPrediction: '10.3',
    differencePercentage: -17.6,
    confidence: 71,
    odds: '-105'
  },
  {
    id: 12,
    player: 'Bam Adebayo',
    team: 'Miami Heat',
    position: 'C',
    propType: 'Points + Rebounds',
    marketLine: 'Over 29.5',
    modelPrediction: '34.8',
    differencePercentage: 18.0,
    confidence: 75,
    odds: '-110'
  }
]; 