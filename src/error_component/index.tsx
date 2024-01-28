import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { palette } from "../constants/colors";

const ErrorScreen: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        rowGap: "2rem",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h1" style={{ color: palette.error }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: palette.error }}>
        The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        sx={{ backgroundColor: palette.success }}
        onClick={() => window.history.back()}
      >
        Back Home
      </Button>
    </Box>
  );
};

export default ErrorScreen;
