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
  IconButton,
  Chip,
  LinearProgress
} from '@mui/material';
import { OptimumData } from '../data/mockData';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface OptimumTableProps {
  data: OptimumData[];
}

const OptimumTable: React.FC<OptimumTableProps> = ({ data }) => {
  // Sort data by difference magnitude (abs value of difference)
  const sortedData = [...data].sort((a, b) => {
    return Math.abs(b.differencePercentage) - Math.abs(a.differencePercentage);
  });

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        background: 'rgba(0, 0, 0, 0.4)', 
        color: 'rgba(255, 255, 255, 0.85)', 
        boxShadow: 'none',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        overflowX: 'auto',
        overflowY: 'auto',
        flex: 1,
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        '&::-webkit-scrollbar': {
          height: '8px',
        },
      }}
    >
      <Table aria-label="optimum table" stickyHeader sx={{ 
        minWidth: { xs: '700px', sm: 'auto' },
        transform: { xs: 'scale(0.9)', sm: 'scale(1)' },
        transformOrigin: 'top left',
      }}>
        <TableHead>
          <TableRow sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <TableCell sx={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '20%',
              background: 'rgba(0, 0, 0, 0.5)'
            }}>GAME / PLAYER</TableCell>
            <TableCell sx={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '15%',
              background: 'rgba(0, 0, 0, 0.5)'
            }}>PROP</TableCell>
            <TableCell sx={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '15%',
              background: 'rgba(0, 0, 0, 0.5)'
            }}>MARKET LINE</TableCell>
            <TableCell sx={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '15%',
              background: 'rgba(0, 0, 0, 0.5)'
            }}>MODEL PREDICTION</TableCell>
            <TableCell sx={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '15%',
              background: 'rgba(0, 0, 0, 0.5)'
            }}>DIFFERENCE</TableCell>
            <TableCell sx={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '10%',
              background: 'rgba(0, 0, 0, 0.5)'
            }}>CONFIDENCE</TableCell>
            <TableCell sx={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.75rem', 
              letterSpacing: '1px', 
              fontWeight: 300, 
              width: '10%',
              background: 'rgba(0, 0, 0, 0.5)'
            }}>ODDS</TableCell>
            <TableCell sx={{ width: '5%', background: 'rgba(0, 0, 0, 0.5)' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow 
              key={row.id}
              sx={{ 
                '&:nth-of-type(odd)': { background: 'rgba(0, 0, 0, 0.2)' },
                '&:nth-of-type(even)': { background: 'rgba(255, 255, 255, 0.02)' },
                '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
                borderBottom: 'none',
                transition: 'background 0.2s ease',
              }}
            >
              <TableCell sx={{ border: 'none', py: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {row.teams ? (
                    <>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 400 }}>
                        {row.teams}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontWeight: 300,
                        fontSize: '0.7rem'
                      }}>
                        {row.propType}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 400 }}>
                        {row.player}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontWeight: 300,
                        fontSize: '0.7rem'
                      }}>
                        {row.team} | {row.position}
                      </Typography>
                    </>
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ 
                color: 'rgba(255, 255, 255, 0.85)', 
                border: 'none',
                fontWeight: 300,
              }}>
                {row.propType}
              </TableCell>
              <TableCell sx={{ 
                color: 'rgba(255, 255, 255, 0.85)', 
                border: 'none',
                fontWeight: 400,
              }}>
                {row.marketLine}
              </TableCell>
              <TableCell sx={{ 
                color: 'rgba(255, 255, 255, 0.85)', 
                border: 'none',
                fontWeight: 400,
              }}>
                {row.modelPrediction}
              </TableCell>
              <TableCell sx={{ border: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {row.differencePercentage > 0 ? (
                    <ArrowUpwardIcon fontSize="small" sx={{ color: 'rgba(0, 255, 171, 0.9)' }} />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" sx={{ color: 'rgba(255, 133, 133, 0.9)' }} />
                  )}
                  <Typography sx={{ 
                    color: row.differencePercentage > 0 ? 'rgba(0, 255, 171, 0.9)' : 'rgba(255, 133, 133, 0.9)', 
                    fontWeight: 500,
                  }}>
                    {Math.abs(row.differencePercentage).toFixed(1)}%
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ border: 'none' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={row.confidence} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: row.confidence > 70 
                          ? 'rgba(0, 255, 171, 0.9)' 
                          : row.confidence > 50 
                            ? 'rgba(255, 200, 50, 0.9)' 
                            : 'rgba(255, 133, 133, 0.9)',
                      }
                    }} 
                  />
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 300,
                    fontSize: '0.7rem',
                    display: 'block',
                    textAlign: 'center',
                    mt: 0.5
                  }}>
                    {row.confidence}%
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ border: 'none' }}>
                <Chip
                  label={row.odds}
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: row.odds.startsWith('+') ? 'rgba(0, 255, 171, 0.9)' : 'rgba(255, 133, 133, 0.9)',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    fontSize: '0.75rem',
                    height: 28,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px'
                  }}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ border: 'none' }}>
                <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.4)', '&:hover': { color: 'rgba(255, 255, 255, 0.8)' } }}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OptimumTable; 