import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
} from "@mui/material";
import { palette } from "../../constants/colors";
import { CancelRounded } from "@mui/icons-material";
import { validateInput } from "../../services/validate.service";

const PaymentModal = (props: any) => {
  const { open, onClose, onConfirm, paymentMethod } = props;
  const [reach, setReach] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [amount, setAmount] = useState("");
  const [voucherName, setVoucherName] = useState("");
  const [voucherNumber, setVoucherNumber] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({
    reach: false,
    paymentType: false,
    amount: false,
    voucherName: false,
    voucherNumber: false,
    reason: false,
  });

  const handleFieldChange = (field: any, value: any) => {
    setErrors({ ...errors, [field]: false });
    switch (field) {
      case "reach":
        setReach(value);
        break;
      case "paymentType":
        setPaymentType(value);
        break;
      case "amount":
        if (validateInput(value, 10)) {
          setAmount(value);
        }
        break;
      case "voucherName":
        setVoucherName(value);
        break;
      case "voucherNumber":
        setVoucherNumber(value);
        break;
      case "reason":
        setReason(value);
        break;
      default:
        break;
    }
  };

  const handleConfirm = () => {
    const requiredFields = ["reach"];
    if (paymentMethod.method === "Paid") {
      requiredFields.push("paymentType", "amount");
      if (paymentType === "Voucher") {
        requiredFields.push("voucherName", "voucherNumber");
      }
    } else if (paymentMethod.method === "Dispute") {
      requiredFields.push("reason");
    }

    let hasError = false;
    const newErrors: any = { ...errors };
    requiredFields.forEach((field) => {
      if (!eval(field)) {
        newErrors[field] = true;
        hasError = true;
      }
    });
    if (!hasError) {
      onConfirm(paymentMethod.id, {
        reach,
        paymentType,
        amount,
        voucherName,
        voucherNumber,
        reason,
        status: paymentMethod.method,
      });
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  const isCashPayment = paymentType === "Cash";
  const isVoucherPayment = paymentType === "Voucher";

  // Check if all fields are filled to show "Save" button
  const isSaveEnabled =
    reach &&
    (paymentMethod.method === "Dispute"
      ? reason
      : paymentType &&
        amount &&
        (isCashPayment || (isVoucherPayment && voucherName && voucherNumber)));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <IconButton
          edge="end"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 9,
            top: 7,
            color: palette.primary,
          }}
        >
          <CancelRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Reach*
        </Typography>
        <TextField
          placeholder="Reach"
          size="small"
          fullWidth
          value={reach}
          onChange={(e) => handleFieldChange("reach", e.target.value)}
          error={errors.reach}
          inputProps={{ maxLength: 10 }}
        />
        {paymentMethod.method === "Paid" && (
          <>
            <Box sx={{ display: "flex", gap: "1rem", mt: "1rem" }}>
              <Box sx={{ width: "50%" }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Type of Payment*
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel
                    id="paymentTypeLabel"
                    sx={{ color: palette.grey }}
                  >
                    Select Payment
                  </InputLabel>
                  <Select
                    labelId="paymentTypeLabel"
                    value={paymentType}
                    onChange={(e) =>
                      handleFieldChange("paymentType", e.target.value)
                    }
                    label="Select Payment"
                    error={errors.paymentType}
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Voucher">Voucher</MenuItem>
                    {/* Add more payment methods as needed */}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: "50%" }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Amount*
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Amount"
                  size="small"
                  value={amount}
                  onChange={(e) => handleFieldChange("amount", e.target.value)}
                  error={errors.amount}
                />
              </Box>
            </Box>
            {isVoucherPayment && (
              <Box sx={{ display: "flex", gap: "1rem", mt: "1rem" }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Voucher Name*
                  </Typography>
                  <TextField
                    placeholder="Voucher Name"
                    size="small"
                    fullWidth
                    value={voucherName}
                    inputProps={{ maxLength: 30 }}
                    onChange={(e) =>
                      handleFieldChange("voucherName", e.target.value)
                    }
                    error={errors.voucherName}
                  />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Voucher Number*
                  </Typography>
                  <TextField
                    label="Voucher Number"
                    size="small"
                    fullWidth
                    value={voucherNumber}
                    inputProps={{ maxLength: 30 }}
                    onChange={(e) =>
                      handleFieldChange("voucherNumber", e.target.value)
                    }
                    error={errors.voucherNumber}
                  />
                </Box>
              </Box>
            )}
          </>
        )}
        {paymentMethod.method === "Dispute" && (
          <>
            <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
              Reason for Dispute*
            </Typography>
            <TextField
              placeholder="Reason for Dispute"
              size="small"
              fullWidth
              value={reason}
              error={errors.reason}
              onChange={(e) => handleFieldChange("reason", e.target.value)}
            />
          </>
        )}

        <Button
          onClick={handleConfirm}
          variant={isSaveEnabled ? "contained" : "outlined"}
          fullWidth
          sx={{ mt: "1rem" }}
        >
          {isSaveEnabled ? "Save" : "Add Payment Record"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
