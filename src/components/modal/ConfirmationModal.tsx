import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { palette } from "../../constants/colors";

const ConfirmationModal = (props: any) => {
  const { open, onClose, onConfirm, buttonName, message, loading } = props;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>
        <ErrorOutlineOutlined
          sx={{
            color: palette.shades.red.shade1,
            backgroundColor: palette.shades.orange.shade6,
            borderRadius: "50%", // Make it rounded
          }}
        />
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <DialogContentText variant="h4">{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "white",
            color: palette.text.secondary,
            textTransform: "none",
            flex: "1", // 50% width
            marginRight: "8px", // Add some spacing between buttons
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            color: "white",
            flex: "1", // 50% width
          }}
          autoFocus
        >
          {loading ? "Loading" : buttonName}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
