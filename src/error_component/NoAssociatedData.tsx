import React from "react";
import { Box, Typography } from "@mui/material";
import { palette } from "../constants/colors";
import NoAssociatedDataSVG from "../assets/svgs/NoAssociatedDataSVG";

const NoAssociatedData: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        rowGap: "2rem",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <NoAssociatedDataSVG />
      <Typography variant="h4" style={{ color: palette.primary , marginTop:'-3rem'}}>
        This brand does not have any projects associated with it.
      </Typography>
    </Box>
  );
};

export default NoAssociatedData;
