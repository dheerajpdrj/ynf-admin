// SowModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { CancelRounded } from "@mui/icons-material";
import { palette } from "../../constants/colors";

const SowDetailsModal = (props: any) => {
  const { isOpen, onClose, sowData } = props;
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Scope of Work
        <IconButton
          onClick={onClose}
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
        <Typography
          variant="h6"
          sx={{
            wordWrap: "break-word",
            maxWidth: "100%",
          }}
        >
          {sowData ? (
            <span dangerouslySetInnerHTML={{ __html: sowData }} />
          ) : (
            ""
          )}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default SowDetailsModal;
