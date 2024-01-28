import React, { useEffect, useState } from "react";
import { Box, Button, Pagination, useMediaQuery } from "@mui/material";
import { tableProjectsHeadings } from "../../constants/tableConstants";
import { Add } from "@mui/icons-material";
import { palette } from "../../constants/colors";
import CreateProjectModal from "./CreateProjectModal";
import GenericTable from "../table/GenericTable";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProjects,
  updateSavedProject,
} from "../../controllers/projectControllers";
import SearchField from "../Toolbar/SearchField";
import Loader from "../loader/Loader";
import NoDataError from "../../error_component/NoDataError";

const ProjectsTable = () => {
  const isMediumScreen = useMediaQuery("(max-width: 600px)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const allProjects = useSelector((state: any) => state.projects.allProjects);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      await fetchAllProjects(dispatch);
      setLoading(false);
    };

    fetchProjects();
  }, [dispatch]);

  const handleEditProject = (item: any) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (projectId: any, newStatus: any) => {
    await updateSavedProject(projectId, { status: newStatus });
    await fetchAllProjects(dispatch);
  };

  // Filter brandsData based on the search query
  const filteredProjectsData = allProjects.filter(
    (project: any) =>
      project?.projectName
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      project?.brand?.brandName
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase())
  );

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = filteredProjectsData?.slice(
    filteredProjectsData.length < itemsPerPage ? 0 : startIndex,
    endIndex
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMediumScreen ? "column" : "row",
              alignItems: "flex-end",
              justifyContent: isMediumScreen ? "space-between" : "flex-end",
              width: "100%",
              mb: 2,
              gap: isMediumScreen ? "0.3rem" : "1rem",
            }}
          >
            <SearchField
              placeholder="Search for Projects or Brands"
              variant="outlined"
              size="small"
              sx={{
                width: isMediumScreen ? "100%" : "30%",
              }}
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              onClear={clearSearch}
            />
            <Button
              variant="contained"
              sx={{ color: palette.white, textTransform: "none" }}
              onClick={() => setIsModalOpen(true)}
            >
              <Add fontSize="small" sx={{ mr: 0.5 }} />
              Create Project
            </Button>
          </Box>

          <CreateProjectModal
            closeModal={closeModal}
            isModalOpen={isModalOpen}
            editItem={editItem}
            setEditItem={setEditItem}
          />

          {displayedData.length > 0 ? (
            <>
              <div style={{ overflowX: "auto" }}>
                {/* Wrap the GenericTable component */}
                <GenericTable
                  headings={tableProjectsHeadings}
                  data={displayedData}
                  onEdit={handleEditProject}
                  handleStatusChange={handleStatusChange}
                />
              </div>
              <Pagination
                count={Math.ceil(filteredProjectsData?.length / itemsPerPage)}
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
            <NoDataError text="With no existing projects, let's accelerate your data journey with a new Project. Let's dive into data analysis together!" />
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsTable;
