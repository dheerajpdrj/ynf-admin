import React from "react";
import { Cancel, Search } from "@mui/icons-material"; // Import the search icon
import { IconButton, TextField, InputAdornment } from "@mui/material";
import { palette } from "../../constants/colors";

const SearchField = (props: any) => {
  const { value, onChange, onClear, ...rest } = props;

  const handleClear = () => {
    onClear && onClear();
  };

  return (
    <TextField
      {...rest}
      value={value}
      onChange={onChange}
      InputProps={{
        // Add the search icon as the start adornment
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ color: palette.grey }} />
          </InputAdornment>
        ),
        endAdornment:
          value && value.length > 0 ? (
            <IconButton aria-label="Clear" onClick={handleClear} edge="end">
              <Cancel color="primary" />
            </IconButton>
          ) : null,
      }}
    />
  );
};

export default SearchField;
