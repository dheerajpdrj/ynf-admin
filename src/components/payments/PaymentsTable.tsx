import React, { useEffect, useState } from "react";
import TasksPaymentsTable from "../table/TasksPaymentsTable";
import {
  paymentsTableDummybody,
  paymentsTableHeadings,
} from "../../constants/tableConstants";
import { getAllBrandsWithData } from "../../controllers/projectControllers";
import DetailsModal from "../modal/InfoModal/DetailsModal";
import { Pagination } from "@mui/material";
import Loader from "../loader/Loader";

const PaymentsTable = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetils] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    const data: any = await getAllBrandsWithData();
    setResult(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleInfoClick = (data: any) => {
    setIsModalOpen(true);
    setDetils(data);
  };

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = result.slice(
    result.length < itemsPerPage ? 0 : startIndex,
    endIndex
  );

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <TasksPaymentsTable
            headings={paymentsTableHeadings}
            data={paymentsTableDummybody}
            page="payments"
            result={displayedData}
            loading={loading}
            fetchData={fetchData}
            onInfoClick={handleInfoClick}
          />
          <Pagination
            count={Math.ceil(result.length / itemsPerPage)}
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
      )}
      <DetailsModal
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        details={details}
      />
    </div>
  );
};

export default PaymentsTable;
