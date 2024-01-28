import React from "react";
import { Box, Typography } from "@mui/material";
import { palette } from "../constants/colors";
import SelectedField from "../assets/svgs/SelectedField";

const SelectField: React.FC = (props: any) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        rowGap: "2rem",
        alignItems: "center",
        minHeight: "80vh",
        maxWidth: "100%",
      }}
    >
      <SelectedField />
      <Typography variant="h4" style={{ color: palette.primary }}>
        Please select the brand to see the reports
      </Typography>
    </Box>
  );
};

export default SelectField;
