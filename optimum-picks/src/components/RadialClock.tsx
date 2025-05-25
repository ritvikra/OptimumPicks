import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const RadialClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate rotation angles
  const hourDegrees = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;
  const minuteDegrees = (minutes / 60) * 360;
  const secondDegrees = (seconds / 60) * 360;
  
  // Generate hour marks
  const hourMarks = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i / 12) * 360;
    const radians = (angle - 90) * (Math.PI / 180);
    const x = 150 + 130 * Math.cos(radians);
    const y = 150 + 130 * Math.sin(radians);
    
    hourMarks.push(
      <text
        key={`hour-${i}`}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="rgba(255, 255, 255, 0.7)"
        fontSize="12"
        fontWeight="300"
      >
        {i}
      </text>
    );
  }
  
  // Generate minute marks
  const minuteMarks = [];
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) { // Skip positions where hour marks are
      const angle = (i / 60) * 360;
      const radians = (angle - 90) * (Math.PI / 180);
      const outerRadius = 145;
      const innerRadius = 140;
      const x1 = 150 + outerRadius * Math.cos(radians);
      const y1 = 150 + outerRadius * Math.sin(radians);
      const x2 = 150 + innerRadius * Math.cos(radians);
      const y2 = 150 + innerRadius * Math.sin(radians);
      
      minuteMarks.push(
        <line
          key={`minute-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
        />
      );
    }
  }

  // Generate circles for the days
  const dayCircles = [];
  for (let i = 1; i <= 31; i++) {
    const angle = (i / 31) * 360;
    const radians = (angle - 90) * (Math.PI / 180);
    const radius = 100;
    const x = 150 + radius * Math.cos(radians);
    const y = 150 + radius * Math.sin(radians);
    
    // Highlight the current day
    const currentDay = time.getDate();
    const isCurrentDay = i === currentDay;
    
    dayCircles.push(
      <g key={`day-${i}`}>
        <circle
          cx={x}
          cy={y}
          r={isCurrentDay ? 3 : 1}
          fill={isCurrentDay ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.3)"}
        />
        {i % 5 === 0 && (
          <text
            x={x}
            y={y + 15}
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.5)"
            fontSize="8"
          >
            {i}
          </text>
        )}
      </g>
    );
  }

  // Generate month names
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthMarks = [];
  const currentMonth = time.getMonth();
  
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * 360;
    const radians = (angle - 90) * (Math.PI / 180);
    const radius = 70;
    const x = 150 + radius * Math.cos(radians);
    const y = 150 + radius * Math.sin(radians);
    
    monthMarks.push(
      <text
        key={`month-${i}`}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={i === currentMonth ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)"}
        fontSize="8"
        fontWeight={i === currentMonth ? "500" : "300"}
      >
        {monthNames[i]}
      </text>
    );
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        height: 300,
        opacity: 0.2,
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Circular tracks */}
        <circle cx="150" cy="150" r="145" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <circle cx="150" cy="150" r="100" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        
        {/* Day marks */}
        {dayCircles}
        
        {/* Month marks */}
        {monthMarks}
        
        {/* Minute marks */}
        {minuteMarks}
        
        {/* Hour marks */}
        {hourMarks}
        
        {/* Current year */}
        <text
          x="150"
          y="50"
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.6)"
          fontSize="10"
          fontWeight="300"
          letterSpacing="1"
        >
          {time.getFullYear()}
        </text>
        
        {/* Clock hands */}
        <line
          x1="150"
          y1="150"
          x2="150"
          y2="80"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${hourDegrees}, 150, 150)`}
        />
        <line
          x1="150"
          y1="150"
          x2="150"
          y2="60"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${minuteDegrees}, 150, 150)`}
        />
        <line
          x1="150"
          y1="150"
          x2="150"
          y2="55"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${secondDegrees}, 150, 150)`}
        />
        
        {/* Center dot */}
        <circle cx="150" cy="150" r="3" fill="rgba(255, 255, 255, 0.9)" />
      </svg>
    </Box>
  );
};

export default RadialClock; 