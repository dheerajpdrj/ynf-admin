import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  useMediaQuery,
  Box,
  Pagination,
} from "@mui/material";
import Layout from "../../layouts/Layout";
import { palette } from "../../constants/colors";
import { Add } from "@mui/icons-material";
import InfluencersTable from "../../components/influencers/InfluencersTable";
import AddInfluencerModal from "../../components/influencers/AddInfluencerModal";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteInfluencer,
  fetchAllInfluencers,
} from "../../controllers/influencersController";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import BulkInfluencerModal from "../../components/influencers/BulkInfluencerModal";
import SearchField from "../../components/Toolbar/SearchField";
import Loader from "../../components/loader/Loader";
import NoDataError from "../../error_component/NoDataError";

export default function Influencers() {
  const isMediumScreen = useMediaQuery("(max-width: 400px)");
  const dispatch = useDispatch();
  const allInfluencers = useSelector(
    (state: any) => state.influencers.allInfluencers
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    influencerId: "",
  });

  useEffect(() => {
    const fetchInfleuncers = async () => {
      setLoading(true);
      await fetchAllInfluencers(dispatch);
      setLoading(false);
    };

    fetchInfleuncers();
  }, [dispatch]);

  const handleEditInfluencer = (editItem: any) => {
    setEditItem(editItem);
    setIsModalOpen(true);
  };

  const handleDeleteConfirmationOpen = (influencerId: any) => {
    setDeleteConfirmation({ open: true, influencerId });
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmation({ open: false, influencerId: "" });
  };

  const handleDeleteConfirmed = async () => {
    const { influencerId } = deleteConfirmation;
    setLoading(true);
    await deleteInfluencer(influencerId); // Call the delete function
    await fetchAllInfluencers(dispatch); // Call
    setLoading(false);
    handleDeleteConfirmationClose();
  };

  const filteredInfluencers = allInfluencers.filter(
    (influencer: any) =>
      influencer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = filteredInfluencers.slice(
    filteredInfluencers.length < itemsPerPage ? 0 : startIndex,
    endIndex
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setEditItem({});
  };
  const handleBulkUploadClick = () => {
    setIsBulkModalOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Layout>
      <Grid container spacing={2} sx={{ pt: 3 }}>
        <Grid item xs={12} lg={5}>
          <Typography variant="h1" gutterBottom>
            Influencers
          </Typography>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Grid
            container
            spacing={2}
            justifyContent={isMediumScreen ? "flex-start" : "flex-end"}
          >
            <Grid item>
              <SearchField
                placeholder="Search Influencers..."
                variant="outlined"
                size="small"
                fullWidth
                sx={{ width: isMediumScreen ? "100%" : "18.75rem" }}
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                onClear={clearSearch}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{
                  color: palette.white,
                  textTransform: "none",
                }}
                onClick={() => setIsModalOpen(true)}
              >
                <Add fontSize="small" sx={{ mr: 0.5 }} /> Add Influencer
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{
                  color: palette.white,
                  textTransform: "none",
                  bgcolor: palette.secondary,
                }}
                onClick={handleBulkUploadClick}
              >
                Bulk Upload
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {loading ? (
        <Loader />
      ) : displayedData.length > 0 ? (
        <>
          <Box sx={{ overflowX: "auto", mt: 2 }}>
            <InfluencersTable
              data={displayedData}
              onEdit={handleEditInfluencer}
              onDelete={handleDeleteConfirmationOpen}
            />
          </Box>
          <Pagination
            count={Math.ceil(filteredInfluencers.length / itemsPerPage)}
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
        </>
      ) : (
        <NoDataError text="No Influencers Found" />
      )}

      {isModalOpen && (
        <AddInfluencerModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          editItem={editItem}
        />
      )}
      {isBulkModalOpen && (
        <BulkInfluencerModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
        />
      )}

      <ConfirmationModal
        open={deleteConfirmation.open}
        onClose={handleDeleteConfirmationClose}
        onConfirm={handleDeleteConfirmed}
        message="Hey if you delete this information then user will lost all the data related to this influencer. Are you sure you want to delete this influencer?"
        buttonName="Delete"
        loading={loading}
      />
    </Layout>
  );
}
