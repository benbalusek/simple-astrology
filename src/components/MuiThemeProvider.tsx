"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@mui/x-date-pickers/themeAugmentation";

const theme = createTheme({
  typography: {
    fontFamily:
      "var(--font-poppins), system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },
  components: {
    MuiInputBase: { styleOverrides: { root: { fontFamily: "inherit" } } },
    MuiPickersDay: { styleOverrides: { root: { fontFamily: "inherit" } } },
  },
});
export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
