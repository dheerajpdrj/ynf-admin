import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { updateNewPassword } from "../../controllers/authController";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

const ChangePassword = (props: any) => {
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const isMediumScreen = useMediaQuery("(max-width: 600px)");
  const [oldPassError, setOldPassError] = React.useState(false);
  const [newPassError, setNewPassError] = React.useState(false);
  const [confirmPassError, setConfirmPassError] = React.useState(false);

  // Password validation regular expression
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/;

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      // Set error states for the corresponding fields
      setOldPassError(!oldPassword);
      setNewPassError(!newPassword);
      setConfirmPassError(!confirmPassword);

      toast.error("Please fill in all password fields.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      // Password doesn't meet criteria
      toast.error(
        <>
          Password must have:
          <br />
          - Length of 8-14 characters
          <br />
          - At least 1 uppercase letter (A-Z)
          <br />
          - At least 1 digit (0-9)
          <br />
          - At least 1 special character (!@#$%^)
          <br />
          <br />
          Example: Passw0rd!
        </>
      );

      return;
    }

    if (newPassword === confirmPassword) {
      try {
        setLoading(true)
        const auth = getAuth();
        let user = auth.currentUser;
        await updateNewPassword(user, oldPassword, newPassword);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password updated successfully");
        setLoading(false)
      } catch (error: any) {
        setLoading(false)
        console.error("Error updating password:", error);
        if (error.code === "auth/wrong-password") {
          toast.error("Old password is incorrect");
        } else {
          toast.error("Error while updating password");
        }
      }
    } else {
      toast.error("Password do not match");
    }
  };

  return (
    <>
      <Box>
        <Typography variant="h1">Change Password</Typography>
        {/* Old Password */}
        <Box sx={{ width: "100%", mt: 4 }}>
          <Typography variant="h6" sx={{ lineHeight: ".20" }}>
            Old Password*
          </Typography>
          <TextField
            placeholder="Old Password"
            variant="outlined"
            value={oldPassword}
            error={oldPassError}
            onChange={(e) => {
              setOldPassword(e.target.value);
              setOldPassError(false);
            }}
            fullWidth
            margin="normal"
            size="small"
            type={showOldPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    edge="end"
                  >
                    {showOldPassword ? (
                      <Visibility color="primary" />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {/* New Password */}
        <Box sx={{ width: "100%", mt: 2 }}>
          <Typography variant="h6" sx={{ lineHeight: ".20" }}>
            New Password*
          </Typography>
          <TextField
            placeholder="New Password"
            variant="outlined"
            value={newPassword}
            error={newPassError}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setNewPassError(false);
            }}
            fullWidth
            margin="normal"
            size="small"
            type={showNewPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? (
                      <Visibility color="primary" />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {/* Confirm Password */}
        <Box sx={{ width: "100%", mt: 2 }}>
          <Typography variant="h6" sx={{ lineHeight: ".20" }}>
            Confirm Password*
          </Typography>
          <TextField
            placeholder="Confirm Password"
            variant="outlined"
            value={confirmPassword}
            error={confirmPassError}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPassError(false);
            }}
            fullWidth
            margin="normal"
            size="small"
            type={showConfirmPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <Visibility color="primary" />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ padding: isMediumScreen ? "1rem" : "2rem" }}>
          <Button
            variant="contained"
            sx={{ color: "white", textTransform: "none" }}
            fullWidth
            onClick={handleSubmit}
          >
            {loading ? 'Loading' :'Change Password'}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ChangePassword;
