import React, { useEffect, useState } from "react";
import { Box, Button, Pagination, useMediaQuery } from "@mui/material";
import { tableBrandHeadings } from "../../constants/tableConstants";
import { Add } from "@mui/icons-material";
import { palette } from "../../constants/colors";
import AddBrandsModal from "./AddBrandsModal";
import GenericTable from "../table/GenericTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrandsData } from "../../controllers/brandsController";
import { setBrands } from "../../store/slice/brandsSlice";
import SearchField from "../Toolbar/SearchField";
import Loader from "../loader/Loader";
import NoDataError from "../../error_component/NoDataError";

const BrandsTable = () => {
  const isMediumScreen = useMediaQuery("(max-width: 600px)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const brandsData = useSelector((state: any) => state.brands.allBrands);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchBrandsData();
      dispatch(setBrands(data));
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditItem({});
  };

  const handleEditBrand = (editItem: any) => {
    setEditItem(editItem);
    setIsModalOpen(true);
  };

  // Filter brandsData based on the search query for brandName, spocFirstName, and spocLastName
  const filteredBrandsData = brandsData.filter(
    (brand: any) =>
      brand.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.spocFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.spocLastName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedData = filteredBrandsData?.slice(
    filteredBrandsData.length < itemsPerPage ? 0 : startIndex,
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
              placeholder="Search for Brands or SPOC Name"
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
              <Add fontSize="small" sx={{ mr: 0.5 }} /> Add Brand
            </Button>
          </Box>
          {isModalOpen && (
            <AddBrandsModal
              closeModal={closeModal}
              isModalOpen={isModalOpen}
              editItem={editItem}
            />
          )}
          {displayedData.length > 0 ? (
            <>
              <div style={{ overflowX: "auto" }}>
                {/* Wrap the GenericTable component */}
                <GenericTable
                  headings={tableBrandHeadings}
                  data={displayedData}
                  onEdit={handleEditBrand}
                />
              </div>
              <Pagination
                count={Math.ceil(filteredBrandsData?.length / itemsPerPage)}
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
            <NoDataError text="With no existing projects, let's accelerate your data journey with a new brand. Let's dive into data analysis together!" />
          )}
        </>
      )}
    </div>
  );
};

export default BrandsTable;
