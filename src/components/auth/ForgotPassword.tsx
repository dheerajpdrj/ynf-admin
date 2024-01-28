import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  Box,
} from "@mui/material";
import YnFLogo from "../../assets/svgs/YnFLogo";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import logo from "../../assets/images/login.png";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();
  const isMobileScreen = useMediaQuery("(max-width: 600px)");
  const regEmail = new RegExp(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,5}$/);
  const [helperText, setHelperText] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(false);
  };

  const handleProceed = () => {
    if (!email) {
      // Email is not entered
      setEmailError(true);
      setHelperText("Please enter an email");
    } else if (!regEmail.test(email)) {
      // Email is not in valid format
      setEmailError(true);
      setHelperText("Please enter a valid email");
    } else {
      // Email is valid, send password reset email
      setLoading(true);
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success("Password reset email sent");
          setEmailError(false);
          setLoading(false);
          navigate("/");
        })
        .catch((error) => {
          setEmailError(true);
          toast.error("User not found");
          setLoading(false);
          console.error("Error sending password reset email", error);
        });
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={4}
        sx={{
          backgroundImage: "url(" + logo + ")",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {!isMobileScreen && (
          <Link to="/">
            <YnFLogo />
          </Link>
        )}
      </Grid>
      <Grid item xs={12} sm={8} md={8} component={Box}>
        <Box
          sx={{
            my: isMobileScreen ? 4 : 26,
            mx: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {isMobileScreen && (
            <Link to="/">
              <YnFLogo />
            </Link>
          )}

          {/* Right Part (65%) */}
          <Box>
            <Typography component="h1" variant="h1">
              Please enter your Email to Proceed.
            </Typography>
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <Box>
                <Typography variant="h6" color="text.secondary">
                  Email*
                </Typography>
                <TextField
                  placeholder="Email"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  fullWidth
                  autoFocus
                  error={emailError}
                  helperText={emailError ? helperText : ""}
                  onChange={handleEmailChange}
                />
              </Box>
              <Box sx={{ p: 2 }}>
                <Button
                  size="large"
                  variant={email ? "contained" : "outlined"}
                  style={{
                    color: email ? "background" : "",
                    textTransform: "none",
                  }}
                  fullWidth
                  onClick={handleProceed}
                >
                  {loading ? "Loading" : "Proceed"}
                </Button>
              </Box>
              <Grid item sx={{ textAlign: "right", mt: 1 }}>
                <Typography variant="h6">
                  <Box
                    component="span"
                    color={"error.main"}
                    sx={{ cursor: "pointer", borderBottom: "1px solid" }}
                    onClick={() => navigate("/")}
                  >
                    Back to Login
                  </Box>
                </Typography>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
