import React from "react";
import { Box, Typography } from "@mui/material";
import { palette } from "../constants/colors";
import NoData from "../assets/svgs/NoData";

const NoDataError:any = (props:any) => {
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
      <NoData />
      <Typography variant="h4" textAlign={'center'} style={{ color: palette.shades.black.shade1,width:'70%' }}>
        {props.text}
      </Typography>
    </Box>
  );
};

export default NoDataError;
