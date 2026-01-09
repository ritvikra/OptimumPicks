// src/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, AppBar, Toolbar, Typography, Button, IconButton,
  createTheme, ThemeProvider, CssBaseline
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import BettingTable from './components/BettingTable';
import OptimumTable from './components/OptimumTable';
import Dashboard from './components/Dashboard';
import { mockData, optimumData, BettingData, OptimumData } from './data/mockData';
import './App.css';
import NBAOdds from './components/NBAOdds';
import NFLOdds from './components/NFLOdds';
import { calculatePlusEV, calculateArbitrage } from './utils/oddsAnalysis';

// Define light and dark themes
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00FFAB',
    },
    background: {
      default: '#121212',
      paper: 'rgba(0, 0, 0, 0.4)',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(255, 255, 255, 0.6)',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00BFA5',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  // Load saved tab from localStorage, default to 'ev'
  const [activeTab, setActiveTab] = useState<'ev' | 'arb' | 'opt' | 'nba' | 'nfl'>(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab && ['ev', 'arb', 'opt', 'nba', 'nfl'].includes(savedTab)) {
      return savedTab as 'ev' | 'arb' | 'opt' | 'nba' | 'nfl';
    }
    return 'ev';
  });

  // Save tab to localStorage whenever it changes
  const handleTabChange = (tab: 'ev' | 'arb' | 'opt' | 'nba' | 'nfl') => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };
  const [nbaData, setNbaData] = useState<any>(null);
  const [nbaLoading, setNbaLoading] = useState(true);
  const [nflData, setNflData] = useState<any>(null);
  const [nflLoading, setNflLoading] = useState(true);
  const [predictionsData, setPredictionsData] = useState<any>(null);

  // Fetch NBA odds data
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/nbaodds.json", { 
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" }
        });        
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 180)}`);
        const json = JSON.parse(text);
        if (!cancelled) {
          setNbaData(json);
          setNbaLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error("Failed to load NBA odds:", e);
          setNbaLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch NFL odds data
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/nflodds.json", { 
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" }
        });        
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 180)}`);
        const json = JSON.parse(text);
        if (!cancelled) {
          setNflData(json);
          setNflLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error("Failed to load NFL odds:", e);
          setNflLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch NBA predictions
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/nba_predicted_totals.json", { 
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" }
        });        
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 180)}`);
        const json = JSON.parse(text);
        if (!cancelled) {
          setPredictionsData(json);
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error("Failed to load NBA predictions:", e);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Calculate plus EV opportunities from NBA and NFL data
  const plusEVOpportunities = useMemo(() => {
    const allOpportunities: BettingData[] = [];
    
    // NBA opportunities
    if (nbaData?.games && Array.isArray(nbaData.games)) {
      try {
        const nbaOpps = calculatePlusEV(nbaData.games);
        allOpportunities.push(...nbaOpps);
      } catch (e) {
        console.error("Error calculating NBA plus EV:", e);
      }
    }
    
    // NFL opportunities
    if (nflData?.games && Array.isArray(nflData.games)) {
      try {
        const nflOpps = calculatePlusEV(nflData.games);
        allOpportunities.push(...nflOpps);
      } catch (e) {
        console.error("Error calculating NFL plus EV:", e);
      }
    }
    
    if (allOpportunities.length > 0) {
      return allOpportunities.sort((a, b) => (b.expectedValue || 0) - (a.expectedValue || 0));
    }
    
    return mockData;
  }, [nbaData, nflData]);

  // Calculate arbitrage opportunities from NBA and NFL data
  const arbitrageOpportunities = useMemo(() => {
    const allOpportunities: BettingData[] = [];
    
    // NBA opportunities
    if (nbaData?.games && Array.isArray(nbaData.games)) {
      try {
        const nbaOpps = calculateArbitrage(nbaData.games);
        allOpportunities.push(...nbaOpps);
      } catch (e) {
        console.error("Error calculating NBA arbitrage:", e);
      }
    }
    
    // NFL opportunities
    if (nflData?.games && Array.isArray(nflData.games)) {
      try {
        const nflOpps = calculateArbitrage(nflData.games);
        allOpportunities.push(...nflOpps);
      } catch (e) {
        console.error("Error calculating NFL arbitrage:", e);
      }
    }
    
    if (allOpportunities.length > 0) {
      return allOpportunities.sort((a, b) => (b.arbPercentage || 0) - (a.arbPercentage || 0));
    }
    
    return mockData;
  }, [nbaData, nflData]);

  // Convert predictions to OptimumData format
  const optimumOpportunities = useMemo(() => {
    if (!predictionsData?.predictions || !Array.isArray(predictionsData.predictions)) {
      return optimumData; // Fallback to mock data
    }

    const opportunities: OptimumData[] = [];
    let id = 1;

    for (const pred of predictionsData.predictions) {
      // Only include predictions with recommendations (over/under)
      if (!pred.recommendation || !pred.market_line || !pred.difference_pct) {
        continue;
      }

      // Format start time
      let eventDate = '';
      let eventTime = '';
      if (pred.start_time) {
        try {
          const date = new Date(pred.start_time);
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const compareDate = new Date(date);
          compareDate.setHours(0, 0, 0, 0);
          const isToday = compareDate.getTime() === today.getTime();
          
          if (isToday) {
            eventDate = 'Today';
          } else {
            eventDate = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
          }
          
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          eventTime = `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
        } catch (e) {
          // Invalid date, skip formatting
        }
      }

      const marketLine = `${pred.recommendation === 'over' ? 'Over' : 'Under'} ${pred.market_line}`;
      
      // Calculate confidence based on difference magnitude
      const absDiff = Math.abs(pred.difference_pct);
      let confidence = Math.min(95, Math.max(50, 50 + absDiff * 2)); // Scale 0-22.5% diff to 50-95% confidence

      opportunities.push({
        id: id++,
        gameId: pred.game_id,
        teams: `${pred.away_team} @ ${pred.home_team}`,
        propType: 'Game Total',
        marketLine: marketLine,
        modelPrediction: pred.predicted_total.toFixed(1),
        differencePercentage: pred.difference_pct,
        confidence: Math.round(confidence),
        odds: pred.odds || '-110',
        startTime: pred.start_time
      });
    }

    // Sort by absolute difference percentage (highest first)
    opportunities.sort((a, b) => Math.abs(b.differencePercentage) - Math.abs(a.differencePercentage));

    return opportunities.length > 0 ? opportunities : optimumData;
  }, [predictionsData]);

  // Always use dark theme
  const getCurrentTheme = () => darkTheme;

  return (
    <ThemeProvider theme={getCurrentTheme()}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', zIndex: 1 }}>
        <AppBar position="static" sx={{ 
          background: 'transparent', 
          boxShadow: 'none', 
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ 
              flexGrow: 0, 
              fontWeight: 300, 
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.9)', 
              mr: 4 
            }}>
              OPTIMUM PICKS
            </Typography>
            
            <Button 
              onClick={() => handleTabChange('ev')}
              sx={{ 
                color: activeTab === 'ev' 
                  ? 'rgba(255,255,255,0.9)' 
                  : 'rgba(255,255,255,0.5)', 
                textTransform: 'none', 
                mr: 2,
                fontWeight: 300,
                letterSpacing: '0.5px',
                fontSize: '0.9rem',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }
              }}
            >
              Plus EV
            </Button>
            
            <Button 
              onClick={() => handleTabChange('arb')}
              sx={{ 
                color: activeTab === 'arb' 
                  ? 'rgba(255,255,255,0.9)' 
                  : 'rgba(255,255,255,0.5)', 
                textTransform: 'none',
                fontWeight: 300,
                letterSpacing: '0.5px',
                fontSize: '0.9rem',
                marginRight: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }
              }}
            >
              Arbitrage
            </Button>
            
            <Button 
              onClick={() => handleTabChange('opt')}
              sx={{ 
                color: activeTab === 'opt' 
                  ? 'rgba(255,255,255,0.9)' 
                  : 'rgba(255,255,255,0.5)', 
                textTransform: 'none',
                fontWeight: 300,
                letterSpacing: '0.5px',
                fontSize: '0.9rem',
                marginRight: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }
              }}
            >
              Optimums
            </Button>
            <Button 
              onClick={() => handleTabChange('nba')}
              sx={{ 
                color: activeTab === 'nba' 
                  ? 'rgba(255,255,255,0.9)' 
                  : 'rgba(255,255,255,0.5)', 
                textTransform: 'none',
                fontWeight: 300,
                letterSpacing: '0.5px',
                fontSize: '0.9rem',
                marginRight: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }
              }}
            >
              NBA Odds
            </Button>
            <Button 
              onClick={() => handleTabChange('nfl')}
              sx={{ 
                color: activeTab === 'nfl' 
                  ? 'rgba(255,255,255,0.9)' 
                  : 'rgba(255,255,255,0.5)', 
                textTransform: 'none',
                fontWeight: 300,
                letterSpacing: '0.5px',
                fontSize: '0.9rem',
                marginRight: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }
              }}
            >
              NFL Odds
            </Button>

            {/*<Button 
              onClick={() => handleTabChange('analytics')}
              sx={{ 
                color: activeTab === 'analytics' ? '#00FFAB' : 'rgba(255,255,255,0.5)', 
                textTransform: 'none',
                fontWeight: activeTab === 'analytics' ? 500 : 300,
                letterSpacing: '0.5px',
                fontSize: '0.9rem',
                bgcolor: activeTab === 'analytics' ? 'rgba(0, 255, 171, 0.1)' : 'transparent',
                border: activeTab === 'analytics' ? '1px solid rgba(0, 255, 171, 0.3)' : 'none',
                borderRadius: '8px',
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 171, 0.05)'
                }
              }}
              startIcon={<BarChartIcon />}
            >
              Analytics
            </Button>*/}
            
            <Box sx={{ flexGrow: 1 }} />
            
            <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <Box
              component="img"
              src="/theta.png"
              alt="Optimum Picks Logo"
              sx={{
                width: 38,
                height: 38,
                mr: 0,
                borderRadius: 2,
                boxShadow: '0 1px 6px 0 rgba(0,0,0,0.13)'
              }}
            />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ 
          width: '100%',
          px: 2, 
          py: 2, 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          zIndex: 2,
          maxWidth: '100vw',
          backgroundColor: 'background.default'
        }}>
          {(
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 200, 
                letterSpacing: '1px',
                color: 'text.primary', 
                flexGrow: 1 
              }}>
                {activeTab === 'ev' 
                  ? 'Positive Expected Value (EV) Bets' 
                  : activeTab === 'arb' 
                    ? 'Arbitrage Opportunities' 
                    : activeTab === 'opt'
                      ? 'Optimum Prediction Differences'
                      : activeTab === 'nba'
                        ? 'NBA Odds'
                        : activeTab === 'nfl'
                          ? 'NFL Odds'
                          : ''
                }
              </Typography>
            </Box>
          )}
          
          {/*{activeTab === 'analytics' && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 200, 
                letterSpacing: '1px',
                color: 'text.primary', 
                flexGrow: 1 
              }}>
                Analytics Dashboard
              </Typography>
            </Box>
          )}*/}
          
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', width: '100%' }}>
            {activeTab === 'ev' && (
              <BettingTable data={plusEVOpportunities} tableType="ev" isLightMode={false} />
            )}
            
            {activeTab === 'arb' && (
              <BettingTable data={arbitrageOpportunities} tableType="arb" />
            )}
            
            {activeTab === 'opt' && (
              <OptimumTable data={optimumOpportunities} />
            )}
            {activeTab === 'nba' && (
              <NBAOdds />
            )}
            {activeTab === 'nfl' && (
              <NFLOdds />
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;