import React from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { palette } from "../../constants/colors";
import { useSelector } from "react-redux";
import TagsInput from "../Toolbar/TagsInput";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { validateInput } from "../../services/validate.service";

const ProjectDetails = (props: any) => {
  const {
    setProjectDetails,
    projectDetails,
    categories,
    setCategories,
    isSubmitted,
    categoryError,
    setCategoryError,
  } = props;

  const isMediumScreen = useMediaQuery("(max-width: 600px)");
  const brands = useSelector((state: any) => state.brands.allBrands);

  const handleBrandChange = (selectedBrandId: string) => {
    setProjectDetails({
      ...projectDetails,
      brand: selectedBrandId,
    });
  };

  return (
    <>
      <Grid container spacing={3} sx={{ padding: isMediumScreen ? 0 : 3 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Project Name*
          </Typography>
          <TextField
            name="projectName"
            placeholder="Enter Project name"
            type="text"
            size="small"
            fullWidth
            value={projectDetails.projectName || ""}
            error={isSubmitted && !projectDetails.projectName}
            onChange={(e) =>
              setProjectDetails({
                ...projectDetails,
                projectName: e.target.value,
              })
            }
            inputProps={{
              maxLength: 40, // Maximum length of 40 characters
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Select Brand*
          </Typography>
          <FormControl size="small" fullWidth>
            <InputLabel
              id="demo-select-small-label"
              sx={{ color: palette.grey }}
            >
              Select Brand name
            </InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="Select Brand name"
              value={projectDetails.brand || ""}
              error={isSubmitted && !projectDetails.brand}
              onChange={(e) => handleBrandChange(e.target.value)}
            >
              {brands?.map((brand: any) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.brandName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Date Of Creation*
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ width: "100%" }}
              format="DD-MM-YYYY"
              slotProps={{
                textField: {
                  InputProps: {
                    placeholder: "Date Of Joining*",
                    error: isSubmitted && !projectDetails.dateOfCreation,
                    size: "small",
                    name: "dateOfCreation",
                    fullWidth: true,
                    sx: {
                      color: projectDetails.dateOfCreation
                        ? palette.shades.black
                        : palette.placeHolder,
                    },
                  },
                },
              }}
              value={dayjs(projectDetails.dateOfCreation, "DD-MM-YYYY") || null}
              onChange={(newValue) => {
                setProjectDetails({
                  ...projectDetails,
                  dateOfCreation: dayjs(newValue).format("DD-MM-YYYY"),
                });
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Status*
          </Typography>
          <FormControl size="small" fullWidth>
            <InputLabel
              id="demo-select-small-label"
              sx={{ color: palette.grey }}
            >
              Enter Select Status
            </InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="Enter Select Status"
              value={projectDetails.status || ""}
              error={isSubmitted && !projectDetails.status}
              onChange={(e) =>
                setProjectDetails({
                  ...projectDetails,
                  status: e.target.value,
                })
              }
            >
              <MenuItem value={"Active"}>Active</MenuItem>
              <MenuItem value={"Closed"}>Closed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Category*
          </Typography>
          <TagsInput
            tags={categories}
            setTags={setCategories}
            error={categoryError}
            setError={setCategoryError}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Subscription*
          </Typography>
          <TextField
            name="subscription"
            placeholder="Enter Amount"
            type="number"
            size="small"
            fullWidth
            value={projectDetails.subscription || ""}
            error={isSubmitted && !projectDetails.subscription}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Use the validateInput function
              if (validateInput(inputValue, 10)) {
                setProjectDetails({
                  ...projectDetails,
                  subscription: inputValue,
                });
              }
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectDetails;
