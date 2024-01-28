import { CancelRounded } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { palette } from "../../../constants/colors";
import DetailsTable from "./DetailsTable";

const DetailsModal = (props: any) => {
  const { closeModal, isModalOpen, details } = props;

  const brandData = [
    {
      label: "Brand Name",
      value: details?.brandName,
    },
    {
      label: "SPOC Name",
      value: `${details?.spocFirstName} ${details?.spocLastName}`,
    },
    { label: "Mobile Number", value: details?.mobile },
    { label: "Email", value: details?.email },
    { label: "Category", value: details?.categories },
  ];

  return (
    <Dialog
      open={isModalOpen}
      onClose={() => {
        closeModal();
      }}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <IconButton
          onClick={() => {
            closeModal();
          }}
          sx={{
            fontSize: "2rem",
            color: palette.primary,
            cursor: "pointer",
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CancelRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DetailsTable data={brandData} />
      </DialogContent>
    </Dialog>
  );
};

export default DetailsModal;
