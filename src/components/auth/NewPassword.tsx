import React, { useState } from "react";
import { Grid, Typography, TextField, Button, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const NewPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSavePassword = () => {
    if (newPassword === confirmPassword) {
      // Implement logic to update the password
      // You might want to send an API request to update the password
    } else {
      setPasswordMismatch(true);
    }
  };

  return (
    <Grid container direction="column" sx={{ maxWidth: "36.5rem" }}>
      <Typography variant="h1" align="left">
        Please enter the One-Time Password to verify your account
      </Typography>
      <Grid item sx={{ mt: 3 }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          New Password*
        </Typography>
        <TextField
          label="New Password"
          value={newPassword}
          error={passwordMismatch}
          size="small"
          type={showNewPassword ? "text" : "password"}
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton
                edge="end"
                onClick={handleToggleNewPassword}
                size="small"
              >
                {showNewPassword ? (
                  <Visibility color="primary" />
                ) : (
                  <VisibilityOff />
                )}
              </IconButton>
            ),
          }}
          onChange={handleNewPasswordChange}
        />
      </Grid>
      <Grid item sx={{ mt: 3 }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Confirm Password*
        </Typography>
        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          size="small"
          value={confirmPassword}
          error={passwordMismatch}
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton
                edge="end"
                onClick={handleToggleConfirmPassword}
                size="small"
              >
                {showConfirmPassword ? (
                  <Visibility color="primary" />
                ) : (
                  <VisibilityOff />
                )}
              </IconButton>
            ),
          }}
          onChange={handleConfirmPasswordChange}
        />
      </Grid>
      {passwordMismatch && (
        <Typography color="error">Passwords do not match.</Typography>
      )}
      <Grid item sx={{ p: 2, mt: 4 }}>
        <Button
          size="large"
          variant={newPassword && confirmPassword ? "contained" : "outlined"}
          style={{
            color: newPassword && confirmPassword ? "background" : "",
            textTransform: "none",
          }}
          fullWidth
          onClick={handleSavePassword}
        >
          Change Password
        </Button>
      </Grid>
    </Grid>
  );
};

export default NewPassword;
