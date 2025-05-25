import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dateNum = date.getDate();
    const year = date.getFullYear();
    return `${day}, ${month} ${dateNum}, ${year}`;
  };

  return (
    <Box sx={{ 
      position: 'absolute',
      bottom: '5%',
      left: 0, 
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      pointerEvents: 'none'
    }}>
      <Typography sx={{ 
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: { xs: '2rem', sm: '3rem', md: '5rem' },
        fontWeight: 200,
        letterSpacing: '2px',
        textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
      }}>
        {formatTime(currentTime)}
      </Typography>
      <Typography sx={{ 
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: { xs: '0.8rem', sm: '1rem', md: '1.25rem' },
        fontWeight: 300,
        letterSpacing: '1px',
        mt: 1,
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
      }}>
        {formatDate(currentTime)}
      </Typography>
    </Box>
  );
};

export default Clock; 