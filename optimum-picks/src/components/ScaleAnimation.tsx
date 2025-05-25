import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const ScaleAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = 400 * dpr;
      ctx.scale(dpr, dpr);
      
      // Make sure the canvas display size matches the CSS size
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = '400px';
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Animation variables
    let angle = 0;
    let balance = 0;
    let targetBalance = 0;
    const balanceSpeed = 0.05;
    
    // Scale dimensions
    const center = { x: window.innerWidth / 2, y: 130 };
    const scaleWidth = Math.min(window.innerWidth * 0.5, 500);
    const scaleHeight = 3;
    const pivotHeight = 70;
    const plateRadius = scaleWidth * 0.2;
    const chainLength = 60;
    
    const draw = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Randomly change target balance
      if (Math.random() < 0.01) {
        targetBalance = (Math.random() * 2 - 1) * 0.2;
      }
      
      // Move current balance towards target
      balance += (targetBalance - balance) * balanceSpeed;
      
      // Calculate rotation angle based on balance
      angle = balance * 0.3;
      
      // Draw scale stand (triangle base)
      const baseWidth = 100;
      ctx.beginPath();
      ctx.moveTo(center.x - baseWidth/2, center.y + pivotHeight + 20);
      ctx.lineTo(center.x + baseWidth/2, center.y + pivotHeight + 20);
      ctx.lineTo(center.x, center.y + 10);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fill();
      
      // Draw pivot point
      ctx.beginPath();
      ctx.arc(center.x, center.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
      
      // Draw scale beam
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(angle);
      
      // Beam
      ctx.beginPath();
      ctx.rect(-scaleWidth / 2, -scaleHeight / 2, scaleWidth, scaleHeight);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
      
      // Left chain
      ctx.beginPath();
      ctx.moveTo(-scaleWidth / 2, 0);
      ctx.lineTo(-scaleWidth / 2, chainLength);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Right chain
      ctx.beginPath();
      ctx.moveTo(scaleWidth / 2, 0);
      ctx.lineTo(scaleWidth / 2, chainLength);
      ctx.stroke();
      
      // Left plate (highlighted for Plus EV)
      ctx.beginPath();
      ctx.arc(-scaleWidth / 2, chainLength, plateRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 171, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 255, 171, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Right plate (highlighted for Arbitrage)
      ctx.beginPath();
      ctx.arc(scaleWidth / 2, chainLength, plateRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 200, 50, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 200, 50, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add some "coins" or weights in the plates
      // Left plate coins (EV)
      const leftCoins = 5;
      for (let i = 0; i < leftCoins; i++) {
        const coinX = -scaleWidth / 2 + (Math.random() * 2 - 1) * plateRadius * 0.6;
        const coinY = chainLength + (Math.random() * 2 - 1) * plateRadius * 0.6;
        const coinSize = 5 + Math.random() * 7;
        
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 171, 0.7)';
        ctx.fill();
      }
      
      // Right plate coins (Arbitrage)
      const rightCoins = 5;
      for (let i = 0; i < rightCoins; i++) {
        const coinX = scaleWidth / 2 + (Math.random() * 2 - 1) * plateRadius * 0.6;
        const coinY = chainLength + (Math.random() * 2 - 1) * plateRadius * 0.6;
        const coinSize = 5 + Math.random() * 7;
        
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 200, 50, 0.7)';
        ctx.fill();
      }
      
      // Scale labels
      ctx.font = '14px Inter';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText('Plus EV', -scaleWidth / 2, chainLength + plateRadius + 25);
      ctx.fillText('Arbitrage', scaleWidth / 2, chainLength + plateRadius + 25);
      
      ctx.restore();
      
      requestAnimationFrame(draw);
    };
    
    const animationId = requestAnimationFrame(draw);
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 70,
        left: 0,
        width: '100%',
        height: 400,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.3
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default ScaleAnimation; 