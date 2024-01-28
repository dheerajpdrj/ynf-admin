import React from "react";
import { Grid, Tab, Tabs, useMediaQuery } from "@mui/material";
import Layout from "../../layouts/Layout";
import { palette } from "../../constants/colors";
import TasksTable from "../../components/tasks/TasksTable";
import PaymentsTable from "../../components/payments/PaymentsTable";

const TasksAndPayments = () => {
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
                  value !== "1" ? `2px solid ${palette.grey}` : "none",
              }}
              label="Tasks"
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
                  value !== "2" ? `2px solid ${palette.grey}` : "none",
              }}
              label="Payments"
            />
          </Tabs>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <div>
            {value === "1" && (
              <>
                <TasksTable />
              </>
            )}
            {value === "2" && (
              <>
                <PaymentsTable />
              </>
            )}
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default TasksAndPayments;
