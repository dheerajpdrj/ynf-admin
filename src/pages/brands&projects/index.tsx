import React from "react";
import { Grid, Tab, Tabs, useMediaQuery } from "@mui/material";
import Layout from "../../layouts/Layout";
import { palette } from "../../constants/colors";
import BrandsTable from "../../components/brands/BrandsTable";
import ProjectsTable from "../../components/projects/ProjectsTable";

const Brands = () => {
  const [value, setValue] = React.useState("1");
  const isMediumScreen = useMediaQuery("(max-width: 600px)");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{
              "& .MuiTabs-flexContainer": {
                justifyContent: isMediumScreen ? "center" : "space-evenly",
              },
            }}
          >
            <Tab
              value="1"
              sx={{
                textTransform: "none",
                color: value === "1" ? palette.primary : palette.text.secondary,
                fontWeight: "600",
                fontSize: isMediumScreen ? "1.2rem" : "1.87rem",
                textAlign: "center",
                width: isMediumScreen ? "auto" : "100%",
                borderBottom:
                  value !== "1"
                    ? `2px solid ${palette.grey}`
                    : "none",
              }}
              label="Brands"
            />
            <Tab
              value="2"
              sx={{
                textTransform: "none",
                color: value === "2" ? palette.primary : palette.text.secondary,
                fontWeight: "600",
                fontSize: isMediumScreen ? "1.2rem" : "1.87rem",
                textAlign: "center",
                width: isMediumScreen ? "auto" : "100%",
                borderBottom:
                  value !== "2"
                    ? `2px solid ${palette.grey}`
                    : "none",
              }}
              label="Projects"
            />
          </Tabs>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <div>
            {value === "1" && (
              <>
                <BrandsTable />
              </>
            )}
            {value === "2" && (
              <>
                <ProjectsTable />
              </>
            )}
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Brands;
