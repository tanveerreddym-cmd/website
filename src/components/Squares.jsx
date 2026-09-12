import React, { useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

const Squares = ({
  direction = 'diagonal',
  speed = 0.5,
  squareSize = 40,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let gridOffset = { x: 0, y: 0 };
    let mousePos = { x: -1000, y: -1000 };
    // We will keep a map of fading squares so they trail
    const fadingSquares = new Map();
    
    const handleResize = () => {
      // Setup High DPI support for Retina displays
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mousePos.x = -1000;
      mousePos.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    const drawGrid = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      ctx.clearRect(0, 0, width, height);
      
      const cols = Math.ceil(width / squareSize) + 2;
      const rows = Math.ceil(height / squareSize) + 2;

      // Update offset for animation
      if (direction === 'diagonal') {
        gridOffset.x = (gridOffset.x + speed) % squareSize;
        gridOffset.y = (gridOffset.y + speed) % squareSize;
      }
      
      ctx.lineWidth = 1;
      ctx.strokeStyle = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
      
      const currentHoveredCol = Math.floor((mousePos.x - gridOffset.x) / squareSize);
      const currentHoveredRow = Math.floor((mousePos.y - gridOffset.y) / squareSize);

      if (mousePos.x !== -1000) {
        const key = `${currentHoveredCol}-${currentHoveredRow}`;
        fadingSquares.set(key, 1.0); // opacity
      }

      // Decrement opacities
      for (const [key, opacity] of fadingSquares.entries()) {
        if (opacity <= 0) {
          fadingSquares.delete(key);
        } else {
          fadingSquares.set(key, opacity - 0.02);
        }
      }

      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * squareSize + gridOffset.x;
          const y = j * squareSize + gridOffset.y;
          const key = `${i}-${j}`;
          
          if (fadingSquares.has(key)) {
             const opacity = fadingSquares.get(key);
             const r = theme.palette.mode === 'dark' ? 255 : 43;
             const g = theme.palette.mode === 'dark' ? 255 : 98;
             const b = theme.palette.mode === 'dark' ? 255 : 217;
             
             ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.15})`;
             ctx.fillRect(x, y, squareSize, squareSize);
          }
          
          ctx.strokeRect(x, y, squareSize, squareSize);
        }
      }
      
      animationFrameId = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, speed, squareSize, theme.palette.mode]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }} className={className}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'auto'
        }}
      />
    </div>
  );
};

export default Squares;
