"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0ea5e9', // Cor do Tailwind sky-500
    },
    background: {
      paper: '#000000', // Cor de fundo do card
      default: '#000000',
    }
  },
  typography: {
    fontFamily: "inherit",
  }
});

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <MuiThemeProvider theme={darkTheme}>
        {children}
      </MuiThemeProvider>
    </NextThemesProvider>
  );
}
