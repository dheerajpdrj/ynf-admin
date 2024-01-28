import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import YnFLogo from "../../assets/svgs/YnFLogo";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../controllers/authController";
import { useNavigate } from "react-router-dom";
import { loggedIn } from "../../store/slice/authSlice";
import { toast } from "react-toastify";
import logo from "../../assets/images/login.png";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobileScreen = useMediaQuery("(max-width: 600px)");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const handleLogin = async () => {
    if (email && password) {
      try {
        setLoading(true);
        const userDetails = await login(email, password);

        if (userDetails) {
          toast.success("Logged in successfully");
          setEmailError(false);
          setPasswordError(false);
          dispatch(loggedIn(userDetails));
          setLoading(false);
          navigate("/");
        } else {
          toast.error("Invalid credentials");
          setLoading(false);
        }
      } catch (error) {
        console.error("Login Error", error);
        setLoading(false);
        toast.error("Invalid credentials");
      }
    } else {
      setEmailError(!email);
      setPasswordError(!password);
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
            my: isMobileScreen ? 4 : 20,
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
          <Box>
            <Typography component="h1" variant="h1">
              Welcome back, Admin! <br /> Managing digital success starts here
            </Typography>
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <Box>
                <Typography variant="h6" color="text.secondary">
                  Email*
                </Typography>
                <TextField
                  placeholder="Enter your email id"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  fullWidth
                  autoFocus
                  error={emailError}
                  helperText={emailError ? "Please enter the email" : ""}
                  onChange={handleEmailChange}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography variant="h6" color="text.secondary">
                  Password*
                </Typography>
                <TextField
                  placeholder="Enter your password"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  error={passwordError}
                  helperText={passwordError ? "Please enter the password" : ""}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        edge="end"
                        onClick={handleTogglePassword}
                        size="small"
                      >
                        {showPassword ? (
                          <Visibility color="primary" />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    ),
                  }}
                  onChange={handlePasswordChange}
                />
              </Box>
              <Grid item sx={{ textAlign: "right", mt: 1 }}>
                <Typography variant="h6">
                  <Box
                    component="span"
                    color={"error.main"}
                    sx={{ cursor: "pointer", borderBottom: "1px solid" }}
                    onClick={() => navigate("/forgotPassword")}
                  >
                    Forgot password?
                  </Box>
                </Typography>
              </Grid>
              <Box sx={{ p: "0 1rem" }}>
                <Button
                  type="button"
                  fullWidth
                  variant={email && password ? "contained" : "outlined"}
                  style={{
                    color: email && password ? "background" : "",
                    textTransform: "none",
                  }}
                  onClick={handleLogin}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? "Loading" : "Login"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
