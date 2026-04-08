"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

function MuiThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const muiTheme = React.useMemo(() => createTheme({
    palette: {
      mode: mounted && resolvedTheme === 'light' ? 'light' : 'dark',
      primary: {
        main: '#0ea5e9', // Cor do Tailwind sky-500
      },
      background: {
        paper: mounted && resolvedTheme === 'light' ? '#ffffff' : '#000000',
        default: mounted && resolvedTheme === 'light' ? '#ffffff' : '#000000',
      }
    },
    typography: {
      fontFamily: "inherit",
    }
  }), [resolvedTheme, mounted]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      {children}
    </MuiThemeProvider>
  );
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <MuiThemeProviderWrapper>
        {children}
      </MuiThemeProviderWrapper>
    </NextThemesProvider>
  );
}
