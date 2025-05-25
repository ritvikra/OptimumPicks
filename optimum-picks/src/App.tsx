import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Paper, InputBase, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import BettingTable from './components/BettingTable';
import OptimumTable from './components/OptimumTable';
import Dashboard from './components/Dashboard';
import { mockData, optimumData } from './data/mockData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'ev' | 'arb' | 'opt' | 'analytics'>('ev');

  return (
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
            onClick={() => setActiveTab('ev')}
            sx={{ 
              color: activeTab === 'ev' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', 
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
            onClick={() => setActiveTab('arb')}
            sx={{ 
              color: activeTab === 'arb' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', 
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
            onClick={() => setActiveTab('opt')}
            sx={{ 
              color: activeTab === 'opt' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', 
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
            onClick={() => setActiveTab('analytics')}
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
          </Button>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <PersonIcon />
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
      }}>
        {activeTab !== 'analytics' && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 200, 
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.9)', 
              flexGrow: 1 
            }}>
              {activeTab === 'ev' 
                ? 'Positive Expected Value (EV) Bets' 
                : activeTab === 'arb' 
                  ? 'Arbitrage Opportunities' 
                  : 'Optimum Prediction Differences'
              }
            </Typography>
          
          <Chip 
            label="Pre-Match" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)', 
              color: 'rgba(255,255,255,0.9)', 
              fontWeight: 300,
              letterSpacing: '0.5px',
              mr: 1,
              height: 30,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.15)'
              }
            }} 
          />
          
          <Chip 
            label="Live" 
            sx={{ 
              bgcolor: 'transparent', 
              color: 'rgba(255,255,255,0.7)', 
              border: '1px solid rgba(255,255,255,0.2)',
              fontWeight: 300,
              letterSpacing: '0.5px',
              mr: 2,
              height: 30,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.05)'
              }
            }} 
          />
          
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 250,
              bgcolor: 'rgba(255,255,255,0.05)',
              borderRadius: 2,
              height: 36,
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <IconButton sx={{ p: '10px', color: 'rgba(255,255,255,0.7)' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, color: 'rgba(255,255,255,0.9)' }}
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Paper>
          
          <IconButton sx={{ 
            ml: 1, 
            color: 'rgba(255,255,255,0.7)', 
            bgcolor: 'rgba(255,255,255,0.05)', 
            '&:hover': { 
              bgcolor: 'rgba(255,255,255,0.1)' 
            } 
          }}>
            <RefreshIcon />
          </IconButton>
        </Box>
        )}
        
        {activeTab === 'analytics' && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 200, 
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.9)', 
              flexGrow: 1 
            }}>
              Analytics Dashboard
            </Typography>
            
            <IconButton sx={{ 
              ml: 1, 
              color: 'rgba(255,255,255,0.7)', 
              bgcolor: 'rgba(255,255,255,0.05)', 
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.1)' 
              } 
            }}>
              <RefreshIcon />
            </IconButton>
          </Box>
        )}
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', width: '100%' }}>
          {activeTab === 'ev' && (
            <BettingTable data={mockData} tableType="ev" />
          )}
          
          {activeTab === 'arb' && (
            <BettingTable data={mockData} tableType="arb" />
          )}
          
          {activeTab === 'opt' && (
            <OptimumTable data={optimumData} />
          )}
          
          {activeTab === 'analytics' && (
            <Dashboard data={mockData} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default App;
