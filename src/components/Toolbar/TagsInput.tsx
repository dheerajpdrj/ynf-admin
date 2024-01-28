import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import { palette } from "../../constants/colors";
import { Cancel } from "@mui/icons-material";

function TagsInput(props: any) {
  const { tags, setTags, error, setError } = props;
  const [inputValue, setInputValue] = useState<string>("");

  const handleTagAddition = (event: any, newTags: string[]) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      const newCategory = inputValue.trim();
      if (newCategory.length > 14) {
        setError("Only 14 characters allowed");
      } else {
        setTags([...tags, newCategory]);
        setInputValue("");
        setError(null); // Clear any previous category error
      }
      event.preventDefault();
    }
  };

  const handleTagDelete = (tagToDelete: string) => () => {
    setTags(tags.filter((tag: any) => tag !== tagToDelete));
  };

  return (
    <Autocomplete
      multiple
      id="tags-input"
      options={[]}
      value={tags}
      size="small"
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      freeSolo
      disableClearable
      renderTags={(value: string[], getTagProps) =>
        value.map((tag: string, index: number) => (
          <Chip
            label={tag}
            {...getTagProps({ index })}
            onDelete={handleTagDelete(tag)}
            sx={{
              backgroundColor: palette.primary,
              color: palette.white,
              fontFamily: "Inter",
            }}
            deleteIcon={<Cancel style={{ color: palette.errorLight }} />}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder={"Type Category press enter"}
          error={error}
          helperText={error}
          onKeyDown={(event) => handleTagAddition(event, tags)}
        />
      )}
    />
  );
}

export default TagsInput;
