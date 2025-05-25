import React, { useState } from 'react';
import { 
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalculateIcon from '@mui/icons-material/Calculate';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { BettingData } from '../data/mockData';

interface DashboardProps {
  data: BettingData[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bet-tabpanel-${index}`}
      aria-labelledby={`bet-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ pt: 3, width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calculate EV distribution data
  const evDistribution = [
    { name: '0-2%', value: 0 },
    { name: '2-5%', value: 0 },
    { name: '5-10%', value: 0 },
    { name: '10-15%', value: 0 },
    { name: '15%+', value: 0 },
  ];

  // Calculate ARB distribution data
  const arbDistribution = [
    { name: '0-1%', value: 0 },
    { name: '1-2%', value: 0 },
    { name: '2-3%', value: 0 },
    { name: '3-4%', value: 0 },
    { name: '4%+', value: 0 },
  ];

  // Calculate category distribution
  const categoryMap: Record<string, number> = {};

  // Calculate book distribution
  const bookMap: Record<string, number> = {};

  // Calculate Kelly criterion data
  const kellyData: { id: number; name: string; ev: number; kelly: number; odds: number; probability: number }[] = [];

  // Process data for visualizations
  data.forEach(bet => {
    // EV Distribution
    if (bet.expectedValue) {
      if (bet.expectedValue < 2) evDistribution[0].value++;
      else if (bet.expectedValue < 5) evDistribution[1].value++;
      else if (bet.expectedValue < 10) evDistribution[2].value++;
      else if (bet.expectedValue < 15) evDistribution[3].value++;
      else evDistribution[4].value++;
    }

    // ARB Distribution
    if (bet.arbPercentage) {
      if (bet.arbPercentage < 1) arbDistribution[0].value++;
      else if (bet.arbPercentage < 2) arbDistribution[1].value++;
      else if (bet.arbPercentage < 3) arbDistribution[2].value++;
      else if (bet.arbPercentage < 4) arbDistribution[3].value++;
      else arbDistribution[4].value++;
    }

    // Category Distribution
    if (bet.category) {
      categoryMap[bet.category] = (categoryMap[bet.category] || 0) + 1;
    }

    // Book Distribution
    if (bet.books) {
      bookMap[bet.books] = (bookMap[bet.books] || 0) + 1;
    }

    // Kelly Criterion calculation
    if (bet.expectedValue && bet.probability) {
      // Parse the American odds to decimal
      const oddsStr = bet.odds;
      let decimalOdds = 0;
      if (oddsStr.startsWith('+')) {
        decimalOdds = Number(oddsStr.substring(1)) / 100 + 1;
      } else {
        decimalOdds = 100 / Number(oddsStr.substring(1)) + 1;
      }

      // Parse probability string to number
      const probStr = bet.probability;
      const prob = parseFloat(probStr) / 100;

      // Calculate Kelly percentage: (bp - q) / b
      // where b = decimal odds - 1, p = probability, q = 1 - p
      const b = decimalOdds - 1;
      const p = prob;
      const q = 1 - p;
      const kelly = ((b * p) - q) / b;

      // Only add positive Kelly values 
      if (kelly > 0) {
        kellyData.push({
          id: bet.id,
          name: bet.selection.substring(0, 20) + (bet.selection.length > 20 ? '...' : ''),
          ev: bet.expectedValue,
          kelly: kelly * 100, // Convert to percentage
          odds: decimalOdds,
          probability: p * 100
        });
      }
    }
  });

  // Sort Kelly data by Kelly value descending
  kellyData.sort((a, b) => b.kelly - a.kelly);

  // Convert maps to arrays for visualization
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  const bookData = Object.entries(bookMap).map(([name, value]) => ({ name, value }));

  // Colors for charts
  const COLORS = ['#00FFAB', '#33D1FF', '#FFD166', '#FF6868', '#8884d8'];

  // Calculate betting simulation data
  const simulationData: { day: number; bankroll: number; profit: number }[] = [];
  let bankroll = 1000;
  const betSize = 50;
  const simulationDays = 30;

  // Generate simulation for EV betting
  for (let i = 0; i < simulationDays; i++) {
    const totalBets = Math.floor(Math.random() * 5) + 3; // 3-7 bets per day
    let dayProfit = 0;
    
    for (let j = 0; j < totalBets; j++) {
      // Pick a random bet from data
      const betIndex = Math.floor(Math.random() * data.length);
      const bet = data[betIndex];
      
      if (bet.expectedValue && bet.expectedValue > 0) {
        const winProb = bet.probability ? parseFloat(bet.probability) / 100 : 0.5;
        
        // Simulate bet outcome
        const isWin = Math.random() < winProb;
        
        // Calculate profit/loss
        let profit = 0;
        if (isWin) {
          const oddsStr = bet.odds;
          if (oddsStr.startsWith('+')) {
            profit = (betSize * Number(oddsStr.substring(1)) / 100);
          } else {
            profit = (betSize * 100 / Number(oddsStr.substring(1)));
          }
        } else {
          profit = -betSize;
        }
        
        dayProfit += profit;
      }
    }
    
    bankroll += dayProfit;
    simulationData.push({
      day: i + 1,
      bankroll: bankroll,
      profit: dayProfit
    });
  }

  // Common styling for all chart cards
  const chartCardSx = {
    p: 2, 
    background: 'rgba(0, 0, 0, 0.4)', 
    color: 'rgba(255, 255, 255, 0.85)', 
    boxShadow: 'none',
    backdropFilter: 'blur(10px)',
    borderRadius: 3,
    border: '1px solid rgba(255, 255, 255, 0.05)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  // Chart container style to fill space
  const chartContainerSx = {
    flex: 1,
    minHeight: { xs: '300px', md: '350px' },
    width: '100%'
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Paper sx={{ 
        background: 'rgba(0, 0, 0, 0.4)', 
        color: 'rgba(255, 255, 255, 0.85)', 
        boxShadow: 'none',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mb: 3,
            '& .MuiTabs-indicator': {
              backgroundColor: '#00FFAB',
              height: 3,
            },
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '1rem',
              fontWeight: 400,
              letterSpacing: '1px',
              py: 2.5,
              '&.Mui-selected': {
                color: '#00FFAB',
                fontWeight: 500,
              },
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            },
          }}
        >
          <Tab 
            label="Bet Distribution" 
            icon={<BarChartIcon />} 
            iconPosition="start"
            sx={{ 
              textTransform: 'none',
              fontSize: '0.95rem',
            }}
          />
          <Tab 
            label="Kelly Criterion" 
            icon={<CalculateIcon />} 
            iconPosition="start"
            sx={{ 
              textTransform: 'none',
              fontSize: '0.95rem',
            }}
          />
          <Tab 
            label="Simulations" 
            icon={<ShowChartIcon />} 
            iconPosition="start"
            sx={{ 
              textTransform: 'none',
              fontSize: '0.95rem',
            }}
          />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          {/* EV Distribution Chart */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={chartCardSx}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 300, 
                letterSpacing: '1px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Expected Value Distribution
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.2 }} />
              <Box sx={chartContainerSx}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={evDistribution}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)'
                      }} 
                    />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
                    <Bar dataKey="value" name="Number of Bets" fill="#00FFAB" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* ARB Distribution Chart */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={chartCardSx}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 300, 
                letterSpacing: '1px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Arbitrage Distribution
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.2 }} />
              <Box sx={chartContainerSx}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={arbDistribution}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)'
                      }} 
                    />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
                    <Area type="monotone" dataKey="value" name="Number of Arbs" fill="#FFD166" fillOpacity={0.6} stroke="#FFD166" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Sports Category Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={chartCardSx}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 300, 
                letterSpacing: '1px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Sports Category Distribution
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.2 }} />
              <Box sx={chartContainerSx}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)'
                      }} 
                    />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Sportsbook Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={chartCardSx}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 300, 
                letterSpacing: '1px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Sportsbook Distribution
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.2 }} />
              <Box sx={chartContainerSx}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bookData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)'
                      }} 
                    />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          {/* Kelly Criterion visualization */}
          <Grid size={12}>
            <Paper sx={chartCardSx}>
              <Typography variant="h6" sx={{ 
                mb: 1, 
                fontWeight: 300, 
                letterSpacing: '1px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Kelly Criterion Bankroll Allocation
              </Typography>
              <Typography variant="body2" sx={{ 
                mb: 2, 
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 300,
              }}>
                Shows optimal bet sizing as a percentage of bankroll for each opportunity
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.2 }} />
              <Box sx={{ ...chartContainerSx, minHeight: { xs: '400px', md: '450px' } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={kellyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.7)" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.7)" 
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'Kelly %' ? `${(Number(value)).toFixed(2)}%` : (Number(value)).toFixed(2), 
                        name
                      ]}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)'
                      }} 
                      labelStyle={{ color: 'rgba(255,255,255,0.9)' }}
                    />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
                    <Bar dataKey="kelly" name="Kelly %" fill="#00FFAB" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* EV vs Kelly Correlation */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={chartCardSx}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 300, 
                letterSpacing: '1px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Expected Value vs Kelly Correlation
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.2 }} />
              <Box sx={chartContainerSx}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      type="number" 
                      dataKey="ev" 
                      name="Expected Value" 
                      stroke="rgba(255,255,255,0.7)"
                      label={{
                        value: 'Expected Value %',
                        position: 'insideBottom',
                        offset: -5,
                        fill: 'rgba(255,255,255,0.7)'
                      }} 
                    />
                    <YAxis 
                      type="number" 
                      dataKey="kelly" 
                      name="Kelly Criterion" 
                      stroke="rgba(255,255,255,0.7)"
                      label={{
                        value: 'Kelly %',
                        angle: -90,
                        position: 'insideLeft',
                        fill: 'rgba(255,255,255,0.7)'
                      }} 
                    />
                    <ZAxis 
                      type="number" 
                      dataKey="probability" 
                      range={[50, 400]} 
                      name="Probability" 
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value, name) => [(Number(value)).toFixed(2) + '%', name]}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)'
                      }}
                    />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
                    <Scatter 
                      name="Bets" 
                      data={kellyData} 
                      fill="#00FFAB" 
                      fillOpacity={0.7}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Odds vs Kelly Correlation */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={chartCardSx}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 300, 
                letterSpacing: '1px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Odds vs Probability Correlation
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.2 }} />
              <Box sx={chartContainerSx}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      type="number" 
                      dataKey="odds" 
                      name="Decimal Odds" 
                      stroke="rgba(255,255,255,0.7)"
                      label={{
                        value: 'Decimal Odds',
                        position: 'insideBottom',
                        offset: -5,
                        fill: 'rgba(255,255,255,0.7)'
                      }} 
                    />
                    <YAxis 
                      type="number" 
                      dataKey="probability" 
                      name="Probability" 
                      stroke="rgba(255,255,255,0.7)"
                      label={{
                        value: 'Probability %',
                        angle: -90,
                        position: 'insideLeft',
                        fill: 'rgba(255,255,255,0.7)'
                      }} 
                    />
                    <ZAxis 
                      type="number" 
                      dataKey="kelly" 
                      range={[50, 400]} 
                      name="Kelly" 
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value, name) => [
                        name === 'Probability' ? (Number(value)).toFixed(2) + '%' : (Number(value)).toFixed(2), 
                        name
                      ]}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)'
                      }}
                    />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
                    <Scatter 
                      name="Bets" 
                      data={kellyData} 
                      fill="#FFD166" 
                      fillOpacity={0.7}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          {/* Bankroll Simulation */}
          <Grid size={12}>
            <Paper sx={chartCardSx}>
              <Typography variant="h6" sx={{ 
                mb: 1, 
                fontWeight: 300, 
                letterSpacing: '1px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Bankroll Simulation (30 Days)
              </Typography>
              <Typography variant="body2" sx={{ 
                mb: 2, 
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 300,
              }}>
                Projected bankroll growth using the current betting opportunities
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.2 }} />
              <Box sx={{ ...chartContainerSx, minHeight: { xs: '400px', md: '450px' } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={simulationData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      formatter={(value) => [`$${(Number(value)).toFixed(2)}`, 'Bankroll']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)'
                      }}
                    />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
                    <Line 
                      type="monotone" 
                      dataKey="bankroll" 
                      name="Bankroll" 
                      stroke="#00FFAB" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          
          {/* Daily Profit/Loss */}
          <Grid size={12}>
            <Paper sx={chartCardSx}>
              <Typography variant="h6" sx={{ 
                mb: 1, 
                fontWeight: 300, 
                letterSpacing: '1px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Daily Profit/Loss
              </Typography>
              <Typography variant="body2" sx={{ 
                mb: 2, 
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 300,
              }}>
                Daily returns from the bankroll simulation
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.2 }} />
              <Box sx={chartContainerSx}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={simulationData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      formatter={(value) => [`$${(Number(value)).toFixed(2)}`, 'Daily P/L']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)'
                      }}
                    />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
                    <Bar 
                      dataKey="profit" 
                      name="Daily P/L" 
                    >
                      {simulationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? "#00FFAB" : "#FF6868"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Dashboard;   