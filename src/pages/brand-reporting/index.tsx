import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { palette } from "../../constants/colors";
import ReportDetails from "../../components/reports/ReportDetails";
import { fetchBrandsData } from "../../controllers/brandsController";
import SelectField from "../../error_component/SelectField";

const BrandReporting = () => {
  const [selectedBrand, setSelectedBrand]: any = useState(null);
  const [brands, setBrands] = useState([]);
  const isMediumScreen = useMediaQuery("(max-width: 600px)");

  const handleBrandChange = (data: any) => {
    setSelectedBrand(data);
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBrandsData();
      setBrands(data.length > 0 ? data : []);
    };
    fetchData();
  }, []);
  return (
    <Layout>
      <Grid container spacing={2} sx={{ pt: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h1" gutterBottom>
            Report
          </Typography>
        </Grid>
        <Grid container item xs={12} alignItems="center">
          <Grid
            item
            xs={12}
            sm={isMediumScreen ? 4 : 4}
            md={3}
            lg={2}
            sx={{
              textAlign: isMediumScreen ? "center" : "left",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "24px",
                color: palette.text.secondary,
                lineHeight: "normal",
                mb: isMediumScreen ? 2 : 0,
              }}
            >
              Select Brand:
            </Typography>
          </Grid>

          <Grid item xs={12} sm={5} md={4} lg={3}>
            <FormControl variant="outlined" size="medium" fullWidth>
              <InputLabel
                htmlFor="brandSelect"
                sx={{
                  ...inputLabelStyles,
                }}
              >
                Select Brand
              </InputLabel>
              <Select
                labelId="brandSelectLabel"
                id="brandSelect"
                size="medium"
                color="primary"
                sx={{
                  ...selectStyles,
                }}
                value={selectedBrand?.brandName}
                label="Select Brand"
              >
                {brands?.map((option: any) => (
                  <MenuItem
                    key={option.brandName}
                    value={option.brandName}
                    sx={{ textTransform: "capitalize" }}
                    onClick={() => handleBrandChange(option)}
                    style={{
                      ...menuItemStyles,
                    }}
                  >
                    {option.brandName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      {selectedBrand ? (
        <ReportDetails brandData={selectedBrand} />
      ) : (
        <SelectField />
      )}
    </Layout>
  );
};

// CSS-in-JS styles
const inputLabelStyles = {
  fontFamily: "Inter",
  fontSize: "24px",
  fontStyle: "normal",
  fontWeight: 400,
  color: palette.primary,
};

const selectStyles = {
  borderColor: palette.primary,
  fontFamily: "Inter",
  fontSize: "24px",
  fontStyle: "normal",
  fontWeight: 400,
  color: palette.primary,
};

const menuItemStyles = {
  fontFamily: "Inter",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "24px",
};

export default BrandReporting;
