import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { CancelRounded, UploadFile, Cancel } from "@mui/icons-material";
import { palette } from "../../constants/colors";
import * as XLSX from "xlsx";
import CSVDataTable from "../table/CSVDataTable";
import SearchField from "../Toolbar/SearchField";
import { validateData } from "../../services/validate.service";
import {
  addBulkInfluencers,
  fetchAllInfluencers,
} from "../../controllers/influencersController";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import ConfirmationModal from "../modal/ConfirmationModal";

const BulkInfluencerModal = (props: any) => {
  const { isOpen, onClose } = props;
  const isMediumScreen = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const onDrop = useCallback((acceptedFiles: any) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  const downloadDummyCSV = () => {
    const csvContent =
      "First Name, Last Name, Email Address, Mobile Number, Category, Instagram, Facebook, Youtube, Twitter";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "BulkUpload.csv";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleNextClick = () => {
    if (selectedFile) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const data = e.target.result as string;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const parsedData: any[] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });

          // const filteredData = parsedData.filter((row) =>
          //   row.some(
          //     (cell: any) =>
          //       cell !== null &&
          //       cell !== undefined &&
          //       (typeof cell === "string" ? cell.trim() !== "" : true)
          //   )
          // );

          // Convert all data to strings
          const filteredData = parsedData.map((row) =>
            row.map((cell: any) => (cell != null ? String(cell) : ""))
          );

          const validationErrors = validateData(filteredData);

          if (validationErrors.length > 0) {
            toast.error(
              <div>
                {validationErrors.map((err) => (
                  <div key={err}>{err}</div>
                ))}
              </div>
            );
            setIsLoading(false);
          } else {
            setTimeout(() => {
              setTableData(filteredData);
              setIsLoading(false);
            }, 1000);
          }
        }
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const handleDelete = (rowIndex: any) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(rowIndex + 1, 1);
    setTableData(updatedTableData);
  };

  const handleAddInfluencersClick = async () => {
    setIsLoading(true);
    try {
      if (tableData.length === 1) {
        toast.error("Please add the data to continue");
        return;
      }

      const addedInfluencers = await addBulkInfluencers(tableData);
      if (addedInfluencers.length > 0) {
        toast.success("Influencers added successfully");
        await fetchAllInfluencers(dispatch);
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const filteredTableData = tableData.slice(1).filter((row: any) => {
    const joinedRow = row.join("").toLowerCase();
    return joinedRow.includes(searchQuery.toLowerCase());
  });

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedData = filteredTableData?.slice(
    filteredTableData.length < itemsPerPage ? 0 : startIndex,
    endIndex
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth={tableData.length > 0 ? "lg" : "md"}
    >
      <DialogTitle sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            onClick={onClose}
            sx={{
              fontSize: "2rem",
              color: palette.primary,
              cursor: "pointer",
              position: "absolute",
              top: -2,
              right: 0,
              zIndex: 1,
            }}
          >
            <CancelRounded />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <CircularProgress size={80} />
          </Box>
        )}
        {tableData.length > 0 ? (
          <Box display="flex" flexDirection="column">
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
              }}
            >
              <SearchField
                placeholder="Search"
                variant="outlined"
                size="small"
                sx={{
                  width: isMediumScreen ? "100%" : "30%",
                  marginTop: "1rem",
                }}
                onChange={handleSearchChange}
                value={searchQuery}
                onClear={() => setSearchQuery("")}
              />
            </Box>
            <CSVDataTable
              heading={tableData[0]}
              tableData={displayedData}
              onDelete={handleDelete}
            />
            <Pagination
              count={Math.ceil(tableData.length / itemsPerPage)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
              shape="rounded"
              sx={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "center",
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  textTransform: "none",
                  width: "25rem",
                }}
                onClick={openConfirmationModal}
              >
                {isLoading ? "Loading" : "Add & Send Email Invitation"}
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Paper
              elevation={3}
              sx={{
                padding: "3rem",
                textAlign: "center",
                border: "2px dashed var(--primary, #F60)",
                borderRadius: "8px",
                cursor: "pointer",
                bgcolor: palette.shades.orange.shade5,
              }}
            >
              {selectedFile ? (
                <Box>
                  <UploadFile
                    sx={{ fontSize: "5rem", color: palette.primary }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: "13px" }}
                      color="primary"
                    >
                      {selectedFile?.name}
                    </Typography>
                    <IconButton
                      onClick={clearSelectedFile}
                      sx={{ fontSize: "1rem", color: palette.grey }}
                    >
                      <Cancel color="primary" />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Box>
                    <UploadFile
                      sx={{ fontSize: "5rem", color: palette.grey }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ color: palette.neutral100 }}
                    >
                      Drag and Drop Your Files Here
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        marginTop: "1rem",
                        color: "white",
                        textTransform: "none",
                      }}
                    >
                      Upload
                    </Button>
                  </Box>
                </div>
              )}
            </Paper>

            {selectedFile ? (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  variant="outlined"
                  sx={{ mr: 1, textTransform: "none" }}
                  onClick={handleNextClick}
                >
                  Next
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMediumScreen ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 3,
                  gap: "1rem",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    ml: isMediumScreen ? 3 : 0,
                    color: palette.shades.black.shade1,
                  }}
                >
                  Please click on "Download CSV" in order to download the file
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ color: "white", textTransform: "none" }}
                  onClick={downloadDummyCSV}
                >
                  Download CSV
                </Button>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={() => {
          handleAddInfluencersClick();
          closeConfirmationModal();
        }}
        buttonName="Yes, add"
        message="Are you sure you want to Add Influencers?"
      />
    </Dialog>
  );
};

export default BulkInfluencerModal;
