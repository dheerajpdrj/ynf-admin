import { createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#FF6600",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#FEFEFE",
    },
    error: {
      main: "#FF6565",
    },
    text: {
      primary: "#1B1918",
      secondary: "#344054",
    },
    common: {
      black: "#1B1918",
    },
  },

  typography: {
    h1: {
      fontFamily: "Inter",
      fontSize: "30px",
      fontWeight: 700,
      lineHeight: "normal",
      fontStyle: "normal",
    },
    h2: {
      fontFamily: "Inter",
      fontSize: "26px",
      fontWeight: 600,
      lineHeight: "normal",
      fontStyle: "normal",
    },
    h3: {
      fontFamily: "Inter",
      fontSize: "24px",
      fontWeight: 600,
      lineHeight: "normal",
      fontStyle: "normal",
    },
    h4: {
      fontFamily: "Inter",
      fontSize: "20px", // Adjusted font size for h4
      fontWeight: 600,
      lineHeight: "normal",
      fontStyle: "normal",
      color: "var(--text, #1B1918)",
    },
    h5: {
      fontFamily: "Inter",
      fontSize: "18px",
      fontWeight: 600,
      lineHeight: "normal",
      fontStyle: "normal",
    },
    h6: {
      fontFamily: "Inter",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "20px",
      fontStyle: "normal",
      color: "var(--gray-700, #344054)",
    },
    body1: {
      fontFamily: "Inter",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "20px",
    },
    subtitle1: {
      fontFamily: "Inter",
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: "normal",
      fontStyle: "normal",
    },
    subtitle2: {
      fontFamily: "Inter",
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: "normal",
      fontStyle: "normal",
    },
  },

  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
          input: {
            fontFamily: "Inter",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "24px",
          },
          label: {
            color: "#C5CDD2",
            fontFamily: "Inter",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "24px",
          },
          "& .MuiInputBase-input::placeholder": {
            fontFamily: "Inter",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "24px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontFamily: "Inter",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "20px",
          padding: "10px 16px",
          boxShadow: "none",
        },
        contained: {
          backgroundColor: "#FF6600", // Background color for contained button
          color: "white", // Text color for contained button
        },
        outlined: {
          color: "#FF6600", // Text color for outlined button
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontFamily: "Inter",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "24px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: "Inter",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "24px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#a9a9a9",
          fontFamily: "Inter",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "24px",
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#a9a9a9",
          fontFamily: "Inter",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "24px",
        },
      },
    },

    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
