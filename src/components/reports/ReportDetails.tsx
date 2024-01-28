import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { styled } from "@mui/system";
import { palette } from "../../constants/colors";
import {
  tableReportHeadings,
  tableReportProjectsHeadings,
} from "../../constants/tableConstants";
import GenericTable from "../table/GenericTable";
import {
  getProjectByBrand,
  updateSavedProject,
} from "../../controllers/projectControllers";
import NoAssociatedData from "../../error_component/NoAssociatedData";
import Loader from "../loader/Loader";

const ChartContainer = styled(Box)({
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
});

const PaperContainer = styled(Paper)({
  backgroundColor: palette.neutral300,
  borderRadius: "10px",
  border: "1px solid var(--Greys, #C5CDD2);",
});

const ReportDetails = (props: any) => {
  const { brandData } = props;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data: any = await getProjectByBrand(brandData.id);
    setProjects(data && data.length > 0 ? data : []);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandData.id]);
  const getTotalInfluencersAssigned = (data: any) => {
    let totalInfluencers = 0;

    for (const project of data) {
      if (project.influencersAssigned) {
        totalInfluencers += project.influencersAssigned.length;
      }
    }

    return totalInfluencers;
  };

  const countActiveAndClosedProjects = (data: any): any[] => {
    const counts: any = {};
    data.forEach((project: any) => {
      const status = project.status || "Unknown";
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.values(counts);
  };
  const getAllTasks = (data: any) => {
    const allTasks: any = [];
    data.forEach((project: any) => {
      if (project.tasks && Array.isArray(project.tasks)) {
        allTasks.push(...project.tasks);
      }
    });
    return allTasks;
  };
  const countProgressValues = (taskArray: any): any => {
    const progressCounts: any = {};

    // Count the occurrences of each progress value
    taskArray.forEach((task: any) => {
      const progress = task.progress;
      if (progressCounts[progress]) {
        progressCounts[progress]++;
      } else {
        progressCounts[progress] = 1;
      }
    });

    // Define the order in which you want the values
    const progressOrder = ["To Do", "In Progress", "Completed"];

    // Create an array with counts in the specified order
    const progressNumbers = progressOrder.map(
      (progress) => progressCounts[progress] || 0
    );

    return progressNumbers;
  };
  const chartData1 = {
    labels: ["Active", "Inactive"],
    series: countActiveAndClosedProjects(projects),
  };

  const chartData2 = {
    labels: ["To Do", "In progress", "Completed"],
    series: countProgressValues(getAllTasks(projects)),
  };
  let noOfTasks: any = countProgressValues(getAllTasks(projects)).reduce(
    function (a: any, b: any) {
      return a + b;
    }
  );

  let tasksPayment: any = getAllTasks(projects).reduce(
    (a: any, b: any) => a + (Number(b.amount) || 0),
    0
  );

  const chartOptions1: ApexOptions = {
    labels: chartData1.labels,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Project",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
              color: palette.text.secondary,
            },
            value: {
              color: palette.primary,
            },
          },
          size: "70%",
        },
      },
    },
    legend: {
      position: "bottom",
    },
    colors: [palette.primary, "rgba(255, 102, 0, 0.60)"],
  } as ApexOptions;

  const chartOptions2: ApexOptions = {
    labels: chartData2.labels,
    type: "donut",
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Tasks",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
              color: palette.text.secondary,
            },
            value: {
              color: palette.primary,
            },
          },
          size: "70%",
        },
      },
    },
    legend: {
      position: "bottom",
    },
    colors: [palette.primary, "rgba(255, 102, 0, 0.60)", palette.success],
  } as ApexOptions;
  const handleStatusChange = async (projectId: any, newStatus: any) => {
    await updateSavedProject(projectId, { status: newStatus });
    await fetchData();
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {projects.length === 0 ? (
            <NoAssociatedData />
          ) : (
            <>
              <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="h3" sx={{ mb: 2, color: palette.primary }}>
                  {brandData?.brandName || "Brand Name"}{" "}
                  {/* Add your brand name here */}
                </Typography>
                <Grid container spacing={2} justifyContent={"center"}>
                  <Grid item md={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <PaperContainer elevation={2} sx={{ padding: 2 }}>
                          <Typography
                            variant="h5"
                            sx={{ color: palette.text.secondary }}
                            gutterBottom
                          >
                            Projects
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{ lineHeight: "normal" }}
                          >
                            {projects.length || 0}
                          </Typography>
                        </PaperContainer>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <PaperContainer elevation={2} sx={{ padding: 2 }}>
                          <Typography
                            variant="h5"
                            sx={{ color: palette.text.secondary }}
                            gutterBottom
                          >
                            Influencers
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{ lineHeight: "normal" }}
                          >
                            {getTotalInfluencersAssigned(projects) || 0}
                          </Typography>
                        </PaperContainer>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <PaperContainer elevation={2} sx={{ padding: 2 }}>
                          <Typography
                            variant="h5"
                            sx={{ color: palette.text.secondary }}
                            gutterBottom
                          >
                            Task Created
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{ lineHeight: "normal" }}
                          >
                            {noOfTasks || 0}
                          </Typography>
                        </PaperContainer>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <PaperContainer elevation={2} sx={{ padding: 2 }}>
                          <Typography
                            variant="h5"
                            sx={{ color: palette.text.secondary }}
                            gutterBottom
                          >
                            Task Paid
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{ lineHeight: "normal" }}
                          >
                            {tasksPayment || 0}
                          </Typography>
                        </PaperContainer>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item md={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <ChartContainer>
                          <ReactApexChart
                            options={chartOptions1}
                            series={countActiveAndClosedProjects(projects)}
                            type="donut"
                          />
                        </ChartContainer>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ChartContainer>
                          <ReactApexChart
                            options={chartOptions2}
                            series={chartData2.series}
                            type="donut"
                          />
                        </ChartContainer>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={12}>
                    <TableContainer
                      component={Paper}
                      sx={{
                        width: "100%",
                      }}
                    >
                      <Table>
                        <TableHead sx={{ bgcolor: palette.grey }}>
                          <TableRow>
                            {tableReportHeadings?.map((heading, index) => (
                              <TableCell
                                key={index}
                                sx={{ color: palette.text.secondary }}
                              >
                                {heading}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Add your table data here */}
                          <TableRow>
                            <TableCell>{brandData.dateOfJoining}</TableCell>
                            <TableCell>
                              {brandData.spocFirstName + brandData.spocLastName}
                            </TableCell>
                            <TableCell>{brandData.mobile}</TableCell>
                            <TableCell>{brandData.email}</TableCell>
                            <TableCell>
                              {brandData.categories.join(",")}
                            </TableCell>
                          </TableRow>
                          {/* Add more rows as needed */}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Paper>

              <Grid container sx={{ mt: 3, flexDirection: "column" }}>
                <Typography variant="h3" sx={{ color: palette.text.secondary }}>
                  Projects
                </Typography>
                <Grid item xs={12} lg={12} sx={{ mt: 2 }}>
                  <div style={{ overflowY: "auto" }}>
                    <GenericTable
                      headings={tableReportProjectsHeadings}
                      data={projects}
                      handleStatusChange={handleStatusChange}
                    />
                  </div>
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ReportDetails;
