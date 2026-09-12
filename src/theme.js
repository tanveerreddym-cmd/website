import { createContext, useContext } from 'react';

export const ThemeContext = createContext({
  mode: 'dark',
  toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ThemeContext);
