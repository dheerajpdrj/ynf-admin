import React, { useEffect, useState } from "react";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  FormControl,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import { palette } from "../../constants/colors";
import { sortData } from "../../helpers/sortHelpers";
import { FilterList } from "@mui/icons-material";
import {
  getColorForBackground,
  getColorForText,
} from "../../helpers/colorHelpers";
import PaymentModal from "../modal/PaymentModal";
import Ellipsis from "../loader/Ellipsis";
import { paymentStatus } from "../../constants/tableConstants";
import { updateTask } from "../../controllers/projectControllers";
import NoDataError from "../../error_component/NoDataError";
import { toast } from "react-toastify";

const TasksPaymentsTable = (props: any) => {
  const { headings, page, result, fetchData, onInfoClick } = props;
  const [sortConfig, setSortConfig] = useState<any>({
    key: "",
    direction: "",
  });
  // State for the payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>({});
  const [taskId, setTaskId] = useState<any>("");

  // Initialize selectedPaymentMethods with an empty object for each task
  useEffect(() => {
    const initialPaymentMethods: any = {};
    result.forEach((task: any) => {
      initialPaymentMethods[task.taskId] = {
        id: task.taskId,
        method: task.status,
      };
    });
    setSelectedPaymentMethod(initialPaymentMethods);
  }, [result]);

  const handleSort = (key: any, sortKey: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction, sortKey }); // Pass the correct sortKey here
  };

  const getSortedData = () => {
    let sortedData = [...result];
    if (sortConfig.key && sortConfig.direction) {
      sortedData = sortData(
        sortedData,
        sortConfig.sortKey,
        sortConfig.direction,
        page === "payments" ? "payment" : "tasks"
      );
    }

    return sortedData;
  };

  // Function to handle payment status change and open the payment modal
  const handlePaymentStatusChange = (
    event: any,
    taskId: any,
    progress: any
  ) => {
    const value = event.target.value;
    setTaskId(taskId);
    setSelectedPaymentMethod((prevMethods: any) => ({
      ...prevMethods,
      [taskId]: { id: taskId, method: value },
    }));
    if (value === "Dispute") setShowPaymentModal(true);
    else if (value === "Paid" && progress === "Completed") {
      setShowPaymentModal(true);
    } else if (value === "Paid" && progress !== "Completed") {
      toast.error("Payment can be done only for the completed tasks");
      setSelectedPaymentMethod({ id: "", method: "" });
      return;
    } else
      updateTask(taskId, { status: value })
        .then(() => {
          fetchData();
          // Clear the selected payment method for the specific task
          setSelectedPaymentMethod((prevMethods: any) => ({
            ...prevMethods,
            [taskId]: { id: "", method: "" },
          }));
        })
        .catch((error) => {
          console.error(error);
        });
  };

  // Function to confirm the payment status change
  const handleConfirmPayment = (id: any, data: any) => {
    // Update the data based on the new payment status, note, and amount
    updateTask(id, data)
      .then(() => {
        fetchData();
        setSelectedPaymentMethod((prevMethods: any) => ({
          ...prevMethods,
          [id]: { id: "", method: "" },
        }));
      })
      .catch((error) => {
        console.error(error);
      });
    // You can use selectedPaymentIndex to access the selected payment and update its data
  };

  const FormattedText = ({ text }: any) => {
    return (
      <Typography
        sx={{
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "14px",
          fontWeight: 400,
        }}
      >
        {text}
      </Typography>
    );
  };
  return (
    <>
      {getSortedData().length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headings.map((heading: any) => (
                  <TableCell
                    key={heading.label}
                    sx={{
                      backgroundColor: palette.bgTableHeading,
                      color: palette.text.secondary,
                      fontFamily: "Inter",
                      fontSize: "12px",
                      fontWeight: 500,
                      fontStyle: "normal",
                      lineHeight: "18px",
                    }}
                  >
                    {heading.label}
                    {heading.sort ? (
                      <TableSortLabel
                        active={true}
                        direction={
                          sortConfig.key === heading.label
                            ? sortConfig.direction
                            : "desc"
                        }
                        onClick={() =>
                          handleSort(heading.label, heading.sortKey)
                        }
                      />
                    ) : heading.icon ? (
                      <FilterList
                        sx={{
                          verticalAlign: "middle",
                          marginLeft: "0.5rem",
                          color: palette.neutral500,
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          </Table>
          {page !== "payments" &&
            getSortedData().map((row: any, rowIndex: number) => (
              <Box
                sx={{
                  display: "flex",
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontWeight: 400,
                  fontStyle: "normal",
                  lineHeight: "20px",
                }}
              >
                <Grid container className="pb" sx={{ width: "100%" }}>
                  <Grid item xs={0.9} className="p-1">
                    {rowIndex + 1}
                  </Grid>
                  <Grid item xs={1.4} className="p-1">
                    <span
                      style={{
                        color: palette.links,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => onInfoClick(row)}
                    >
                      <Ellipsis text={row.brandName} />
                    </span>
                  </Grid>
                  <Grid item xs={9.7}>
                    {row.projects && row.projects.length > 0 ? (
                      row.projects.map((project: any, ind: any) => (
                        <Grid
                          container
                          className={
                            ind === row.projects.length - 1 ? "" : "pb"
                          }
                        >
                          <Grid
                            item
                            xs={1.4}
                            className="p-1"
                            sx={{ wordWrap: "break-word" }}
                          >
                            {project.projectName}
                          </Grid>
                          <Grid item xs={10.6} sx={{ margin: "auto" }}>
                            {project.influencersAssigned &&
                            project.influencersAssigned.length > 0 ? (
                              project.influencersAssigned.map(
                                (inf: any, inInd: any) => (
                                  <Grid
                                    container
                                    className={
                                      inInd ===
                                      project.influencersAssigned.length - 1
                                        ? ""
                                        : "pb"
                                    }
                                  >
                                    <Grid item xs={2.5} className="p-1 ">
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        {inf?.influencer?.profileUrl ? (
                                          <Avatar
                                            alt={inf?.influencer?.firstName}
                                            src={inf?.influencer?.profileUrl}
                                          />
                                        ) : (
                                          <>
                                            <Avatar
                                              sx={{
                                                bgcolor:
                                                  palette.shades.orange.shade4,
                                                color:
                                                  palette.shades.blue.shade4,
                                              }}
                                            >
                                              {inf?.influencer?.firstName?.charAt(
                                                0
                                              )}
                                              {inf?.influencer?.lastName?.charAt(
                                                0
                                              )}
                                            </Avatar>
                                          </>
                                        )}
                                        <Ellipsis
                                          text={inf?.influencer?.firstName}
                                        />
                                      </Stack>
                                    </Grid>
                                    <Grid item xs={9.5} sx={{ margin: "auto" }}>
                                      {inf?.tasks && inf?.tasks.length > 0 ? (
                                        inf?.tasks.map(
                                          (task: any, index: number) => (
                                            <Grid
                                              container
                                              className={
                                                index === inf?.tasks.length - 1
                                                  ? ""
                                                  : "pb"
                                              }
                                            >
                                              <Grid
                                                item
                                                xs={3.3}
                                                className="p-1"
                                                sx={{
                                                  margin: "auto",
                                                  wordWrap: "break-word",
                                                }}
                                              >
                                                {task.taskName}
                                              </Grid>
                                              <Grid
                                                item
                                                xs={2.7}
                                                sx={{
                                                  wordWrap: "break-word",
                                                }}
                                                className="p-1"
                                              >
                                                <Ellipsis
                                                  text={task.description}
                                                />
                                              </Grid>
                                              <Grid item xs={3} className="p-1">
                                                {task.dueDate}
                                              </Grid>
                                              <Grid item xs={3} className="p-1">
                                                <Chip
                                                  label={task.progress}
                                                  sx={{
                                                    color: getColorForText(
                                                      task.progress
                                                    ),
                                                    fontFamily: "Inter",
                                                    fontSize: "14px",
                                                    fontWeight: 400,
                                                    fontStyle: "normal",
                                                    lineHeight: "20px",
                                                    backgroundColor:
                                                      getColorForBackground(
                                                        task.progress
                                                      ),
                                                  }}
                                                  size="small"
                                                />
                                              </Grid>
                                            </Grid>
                                          )
                                        )
                                      ) : (
                                        <Grid item xs={12} className="p-1">
                                          <FormattedText
                                            text={"No task assigned"}
                                          />
                                        </Grid>
                                      )}
                                    </Grid>
                                  </Grid>
                                )
                              )
                            ) : (
                              <Grid item xs={12} className="p-1">
                                <FormattedText
                                  text={"No influencers assinged"}
                                />
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12} className="p-1">
                        <FormattedText text={"No projects assinged"} />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ))}

          {page === "payments" &&
            getSortedData().map((row: any, rowIndex: number) => (
              <Box
                sx={{
                  display: "flex",
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontWeight: 400,
                  fontStyle: "normal",
                  lineHeight: "20px",
                }}
              >
                <Grid container className="pb">
                  <Grid item xs={0.7} className="p-1">
                    {rowIndex + 1}
                  </Grid>
                  <Grid item xs={1.1} className="p-1">
                    <span
                      style={{
                        color: palette.links,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => onInfoClick(row)}
                    >
                      <Ellipsis text={row.brandName} />
                    </span>
                  </Grid>
                  <Grid item xs={10.2}>
                    {row.projects && row.projects.length > 0 ? (
                      row.projects.map((project: any, ind: any) => (
                        <Grid
                          container
                          className={
                            ind === row.projects.length - 1 ? "" : "pb"
                          }
                        >
                          <Grid
                            item
                            xs={1.02}
                            className="p-1"
                            sx={{ wordWrap: "break-word" }}
                          >
                            {project.projectName}
                          </Grid>
                          <Grid item xs={10.98} sx={{ margin: "auto" }}>
                            {project.influencersAssigned &&
                            project.influencersAssigned.length > 0 ? (
                              project.influencersAssigned.map(
                                (inf: any, inInd: any) => (
                                  <Grid
                                    container
                                    className={
                                      inInd ===
                                      project.influencersAssigned.length - 1
                                        ? ""
                                        : "pb"
                                    }
                                  >
                                    <Grid item xs={1.8} className="p-1 ">
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        {inf?.influencer?.profileUrl ? (
                                          <Avatar
                                            alt={inf?.influencer?.firstName}
                                            src={inf?.influencer?.profileUrl}
                                          />
                                        ) : (
                                          <>
                                            <Avatar
                                              sx={{
                                                bgcolor:
                                                  palette.shades.orange.shade4,
                                                color:
                                                  palette.shades.blue.shade4,
                                              }}
                                            >
                                              {inf?.influencer?.firstName?.charAt(
                                                0
                                              )}
                                              {inf?.influencer?.lastName?.charAt(
                                                0
                                              )}
                                            </Avatar>
                                          </>
                                        )}
                                        <Ellipsis
                                          text={inf?.influencer.firstName}
                                        />
                                      </Stack>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={10.2}
                                      sx={{ margin: "auto" }}
                                    >
                                      {inf?.tasks && inf?.tasks.length > 0 ? (
                                        inf?.tasks.map(
                                          (task: any, index: number) => (
                                            <Grid
                                              container
                                              className={
                                                index === inf?.tasks.length - 1
                                                  ? ""
                                                  : "pb"
                                              }
                                            >
                                              <Grid
                                                item
                                                xs={2.2}
                                                className="p-1"
                                                sx={{
                                                  margin: "auto",
                                                  wordWrap: "break-word",
                                                }}
                                              >
                                                {task.taskName}
                                              </Grid>
                                              <Grid
                                                item
                                                className="p-1"
                                                xs={1.8}
                                                sx={{
                                                  wordWrap: "break-word",
                                                  margin: "auto",
                                                }}
                                              >
                                                <Ellipsis
                                                  text={task.description}
                                                />
                                              </Grid>
                                              <Grid
                                                item
                                                className="p-1"
                                                xs={2}
                                                sx={{ margin: "auto" }}
                                              >
                                                {task.dueDate}
                                              </Grid>
                                              <Grid
                                                item
                                                xs={2.75}
                                                className="p-1"
                                              >
                                                <FormControl fullWidth>
                                                  <Select
                                                    size="small"
                                                    value={
                                                      selectedPaymentMethod[
                                                        task.taskId
                                                      ]?.method || task.status
                                                    }
                                                    onChange={(event) =>
                                                      handlePaymentStatusChange(
                                                        event,
                                                        task.taskId,
                                                        task.progress
                                                      )
                                                    }
                                                    sx={{
                                                      color: getColorForText(
                                                        selectedPaymentMethod[
                                                          task.taskId
                                                        ]?.method || task.status
                                                      ),
                                                      textTransform:
                                                        "capitalize",
                                                      backgroundColor:
                                                        getColorForBackground(
                                                          selectedPaymentMethod[
                                                            task.taskId
                                                          ]?.method ||
                                                            task.status
                                                        ),
                                                    }}
                                                  >
                                                    {paymentStatus.map(
                                                      (paymentItem: any) => (
                                                        <MenuItem
                                                          value={paymentItem}
                                                        >
                                                          {paymentItem}
                                                        </MenuItem>
                                                      )
                                                    )}
                                                  </Select>
                                                </FormControl>
                                              </Grid>
                                              <Grid
                                                item
                                                xs={1.83}
                                                className="p-1"
                                                sx={{ margin: "auto" }}
                                              >
                                                {task.paymentType || "N/A"}
                                              </Grid>
                                              <Grid
                                                item
                                                xs={1.42}
                                                className="p-1"
                                                title={task.amount || 0}
                                                sx={{
                                                  wordWrap: "break-word",
                                                  whiteSpace: "nowrap",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  margin: "auto",
                                                  cursor: "pointer",
                                                }}
                                              >
                                                {task.amount || 0}
                                              </Grid>
                                            </Grid>
                                          )
                                        )
                                      ) : (
                                        <Grid item xs={12} className="p-1">
                                          <FormattedText
                                            text={"No task assigned"}
                                          />
                                        </Grid>
                                      )}
                                    </Grid>
                                  </Grid>
                                )
                              )
                            ) : (
                              <Grid item xs={12} className="p-1">
                                <FormattedText
                                  text={"No influencers assinged"}
                                />
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12} className="p-1">
                        <FormattedText text={"No projects assinged"} />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ))}
          {showPaymentModal && (
            <PaymentModal
              open={showPaymentModal}
              onClose={() => {
                setShowPaymentModal(false);
                setSelectedPaymentMethod({});
                setTaskId("");
              }}
              onConfirm={handleConfirmPayment}
              paymentMethod={selectedPaymentMethod[taskId]}
            />
          )}
        </TableContainer>
      ) : (
        <NoDataError text="No Tasks Found" />
      )}
    </>
  );
};

export default TasksPaymentsTable;
