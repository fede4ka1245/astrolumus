import { Component, JSX, createContext, useContext } from 'solid-js';

interface Theme {
  palette?: {
    mode?: 'light' | 'dark';
  };
  [key: string]: any;
}

interface ThemeProviderProps {
  theme: Theme;
  children: JSX.Element;
}

const ThemeContext = createContext<Theme>();

export const ThemeProvider: Component<ThemeProviderProps> = (props) => {
  return (
    <ThemeContext.Provider value={props.theme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    return { palette: { mode: 'light' as const } };
  }
  return theme;
};

export function createTheme(theme: Theme): Theme {
  return theme;
}
