import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box, 
  Typography, 
  Chip
} from '@mui/material';
import { BettingData } from '../data/mockData';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface BettingTableProps {
  data: BettingData[];
  tableType: 'ev' | 'arb';
  isLightMode?: boolean;
}

const BettingTable: React.FC<BettingTableProps> = ({ data, tableType, isLightMode = false }) => {
  // Sort data based on either EV% or ARB% (depending on tableType)
  const sortedData = [...data].sort((a, b) => {
    if (tableType === 'ev' && a.expectedValue && b.expectedValue) {
      return b.expectedValue - a.expectedValue;
    } else if (tableType === 'arb' && a.arbPercentage && b.arbPercentage) {
      return b.arbPercentage - a.arbPercentage;
    }
    return 0;
  });

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        background: isLightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.4)', 
        color: isLightMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
        boxShadow: 'none',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        border: isLightMode ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)',
        overflowX: 'auto',
        overflowY: 'auto',
        width: '100%',
        height: 'auto',
        minHeight: 'fit-content',
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        '&::-webkit-scrollbar': {
          height: '8px',
        },
      }}
    >
      <Table 
        aria-label="betting table" 
        stickyHeader
        sx={{ 
          width: '100%', 
          tableLayout: { xs: 'auto', sm: 'fixed' },
          minWidth: { xs: '600px', sm: 'auto' } // Ensure table doesn't get too narrow on mobile
        }}
      >
        <TableHead>
          <TableRow sx={{ borderBottom: isLightMode ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
            {/* First column changes based on table type */}
            <TableCell sx={{ 
              color: isLightMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '10%',
              background: isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.5)'
            }}>
              {tableType === 'ev' ? '+EV%' : 'ARB%'}
            </TableCell>
            <TableCell sx={{ 
              color: isLightMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '30%',
              background: isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.5)'
            }}>EVENT</TableCell>
            <TableCell sx={{ 
              color: isLightMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '14%',
              background: isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.5)'
            }}>MARKET</TableCell>
            <TableCell sx={{ 
              color: isLightMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '12%',
              background: isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.5)'
            }}>BOOKS</TableCell>
            <TableCell sx={{ 
              color: isLightMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '14%',
              background: isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.5)'
            }}>ODDS</TableCell>
            {/* Show Probability only in EV table */}
            {tableType === 'ev' && (
              <TableCell sx={{ 
                color: isLightMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)', 
                fontSize: '0.75rem', 
                letterSpacing: '1px', 
                fontWeight: 300, 
                width: '10%',
                background: isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.5)'
              }}>PROBABILITY</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow 
              key={row.id}
              sx={{ 
                '&:nth-of-type(odd)': { background: isLightMode ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.2)' },
                '&:nth-of-type(even)': { background: isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)' },
                '&:hover': { background: isLightMode ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.05)' },
                borderBottom: 'none',
                transition: 'background 0.2s ease',
              }}
            >
              <TableCell sx={{ border: 'none', py: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'start',
                  gap: 1
                }}>
                  <Box sx={{ 
                    background: isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    px: 1.5,
                    py: 0.75,
                    border: isLightMode ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {tableType === 'ev' ? (
                      <Typography sx={{ 
                        color: row.expectedValue && row.expectedValue > 10 ? 'rgba(0, 255, 171, 0.9)' : (isLightMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'), 
                        fontWeight: 500,
                        letterSpacing: '0.5px'
                      }}>
                        {row.expectedValue ? row.expectedValue.toFixed(2) : '0.00'}%
                      </Typography>
                    ) : (
                      <Typography sx={{ 
                        color: row.arbPercentage && row.arbPercentage > 2.5 ? 'rgba(255, 200, 50, 0.9)' : (isLightMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'), 
                        fontWeight: 500,
                        letterSpacing: '0.5px'
                      }}>
                        {row.arbPercentage ? row.arbPercentage.toFixed(2) : '0.00'}%
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ 
                    color: isLightMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 300,
                    letterSpacing: '0.5px',
                    fontSize: '0.7rem'
                  }}>
                    {row.category} | {row.league}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ color: isLightMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)', border: 'none' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2" sx={{ 
                    color: isLightMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)', 
                    fontSize: '0.7rem',
                    fontWeight: 300,
                    letterSpacing: '0.5px'
                  }}>
                    {row.eventDate} at {row.eventTime}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: isLightMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
                    fontWeight: 400,
                    letterSpacing: '0.5px'
                  }}>
                    {row.teams}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ 
                color: isLightMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
                border: 'none',
                fontWeight: 300,
                letterSpacing: '0.3px'
              }}>
                {row.market}
              </TableCell>
              <TableCell sx={{ border: 'none' }}>
                <Typography 
                  sx={{ 
                    color: isLightMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
                    fontSize: '0.85rem',
                    fontWeight: 400,
                    letterSpacing: '0.3px'
                  }}
                >
                  {row.books}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ 
                    color: row.odds.startsWith('+') ? 'rgba(0, 255, 171, 0.9)' : 'rgba(255, 133, 133, 0.9)', 
                    fontWeight: 500,
                    letterSpacing: '0.5px'
                  }}>
                    {row.odds}
                  </Typography>
                  <Chip
                    label={tableType === 'ev' 
                      ? (row.expectedValue && row.expectedValue > 10 ? "BET" : "GAME")
                      : (row.arbPercentage && row.arbPercentage > 2.5 ? "ARB" : "GAME")
                    }
                    sx={{ 
                      bgcolor: tableType === 'ev'
                        ? (row.expectedValue && row.expectedValue > 10 ? 'rgba(0, 255, 171, 0.2)' : (isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'))
                        : (row.arbPercentage && row.arbPercentage > 2.5 ? 'rgba(255, 200, 50, 0.2)' : (isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)')),
                      color: tableType === 'ev'
                        ? (row.expectedValue && row.expectedValue > 10 ? 'rgba(0, 255, 171, 0.9)' : (isLightMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'))
                        : (row.arbPercentage && row.arbPercentage > 2.5 ? 'rgba(255, 200, 50, 0.9)' : (isLightMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)')),
                      fontWeight: 400,
                      letterSpacing: '0.5px',
                      fontSize: '0.7rem',
                      height: 24,
                      border: tableType === 'ev'
                        ? (row.expectedValue && row.expectedValue > 10 ? '1px solid rgba(0, 255, 171, 0.3)' : (isLightMode ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)'))
                        : (row.arbPercentage && row.arbPercentage > 2.5 ? '1px solid rgba(255, 200, 50, 0.3)' : (isLightMode ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)')),
                      borderRadius: '12px'
                    }}
                    size="small"
                    icon={<ArrowForwardIcon style={{ 
                      color: tableType === 'ev'
                        ? (row.expectedValue && row.expectedValue > 10 ? 'rgba(0, 255, 171, 0.9)' : (isLightMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'))
                        : (row.arbPercentage && row.arbPercentage > 2.5 ? 'rgba(255, 200, 50, 0.9)' : (isLightMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)')),
                      fontSize: '14px' 
                    }} />}
                  />
                </Box>
              </TableCell>
              {/* Show Probability only in EV table */}
              {tableType === 'ev' && (
                <TableCell sx={{ 
                  color: isLightMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
                  border: 'none',
                  fontWeight: 300,
                  letterSpacing: '0.5px'
                }}>
                  {row.probability || '-'}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BettingTable; 