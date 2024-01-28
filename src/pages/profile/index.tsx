import { Tab, Tabs, Typography, Grid, useMediaQuery } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import Layout from "../../layouts/Layout";
import PersonalInformation from "../../components/profile/PersonalInformation";
import ChangePassword from "../../components/profile/ChangePassword";

const Profile = () => {
  const [value, setValue] = React.useState("1");
  const isMediumScreen = useMediaQuery("(max-width: 600px)");
  const admin = useSelector((state: any) => state.auth.admin);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Layout>
      <Typography variant="h1" sx={{ p: 2 }}>
        Profile
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            orientation={isMediumScreen ? "vertical" : "horizontal"}
          >
            <Tab
              value="1"
              sx={{ textTransform: "none" }}
              label="Personal Information"
            />
            <Tab
              value="2"
              sx={{ textTransform: "none" }}
              label="Change Password"
            />
          </Tabs>
        </Grid>
        <Grid item xs={12} sm={7} md={5}>
          {value === "1" && <PersonalInformation admin={admin} />}
          {value === "2" && <ChangePassword admin={admin} />}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile;
