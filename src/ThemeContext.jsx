import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeContext } from './theme';

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light Mode Palette
                primary: { main: '#2B62D9' },
                secondary: { main: '#3CE0E6' },
                background: {
                  default: '#F3F5FB',
                  paper: '#FFFFFF',
                },
                text: {
                  primary: '#0B1233',
                  secondary: '#58627A',
                },
                divider: 'rgba(11, 18, 51, 0.11)',
              }
            : {
                // Dark Mode Palette
                primary: { main: '#3CE0E6' },
                secondary: { main: '#2B62D9' },
                background: {
                  default: '#06070D',
                  paper: '#0B1233',
                },
                text: {
                  primary: '#FFFFFF',
                  secondary: '#AAB4D4',
                },
                divider: 'rgba(255, 255, 255, 0.13)',
              }),
        },
        typography: {
          fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
          h1: { fontFamily: "'Fraunces', serif" },
          h2: { fontFamily: "'Fraunces', serif" },
          h3: { fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 },
          h4: { fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 },
          button: { textTransform: 'none', fontWeight: 500 },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 8 },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                boxShadow: mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(11,18,51,0.08)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
