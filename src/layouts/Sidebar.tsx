import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Button,
  Typography,
} from "@mui/material";
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  Dashboard,
  PersonOutline,
  PaymentOutlined,
  DescriptionOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { palette } from "../constants/colors";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import { allowedRouteUser } from "../services/user.service";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase/firebaseConfig";
import { logout } from "../store/slice/authSlice";
import YnFLogo from "../assets/svgs/YnFLogo";

const drawerWidth = 240;
const closedWidth = "3.5rem";

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: closedWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const linkStyle = {
  textDecoration: "none",
  color: palette.primary,
  borderRadius: "4px",
};
const linkTextStyle = {
  fontFamily: "Inter",
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "19.6px",
};

export default function Sidebar() {
  const [open, setOpen] = React.useState(false);
  const admin = useSelector((state: any) => state.auth.admin);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(logout());
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const links = [
    {
      href: "/",
      icon: <Dashboard width="1.5rem" height="1.5rem" />,
      text: "Brands & Projects",
      allowedUserRoles: allowedRouteUser("/"),
    },
    {
      href: "/influencers",
      icon: <PersonOutline width="1.5rem" height="1.5rem" />,
      text: "Influencers",
      allowedUserRoles: allowedRouteUser("/influencers"),
    },
    {
      href: "/tasks-payments",
      icon: <PaymentOutlined width="1.5rem" height="1.5rem" />,
      text: "Tasks & Payments",
      allowedUserRoles: allowedRouteUser("/tasks-payments"),
    },
    {
      href: "/brandreporting",
      icon: <DescriptionOutlined width="1.5rem" height="1.5rem" />,
      text: "Report",
      allowedUserRoles: allowedRouteUser("/report"),
    },
  ];

  // Filter the links based on the user's role
  //   const filteredLinks = links.filter((link) =>
  //     link.allowedUserRoles.includes("Admin")
  //   );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: palette.white,
            color: palette.primary,
          },
        }}
        sx={
          open
            ? {
                "& .MuiPaper-root": {
                  width: "15rem",
                  padding: "0 1.5rem",
                },
              }
            : {}
        }
        variant={"permanent"}
        open={open}
      >
        <DrawerHeader>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ ":hover": { backgroundColor: "transparent" } }}
          >
            {open ? (
              <Box sx={{ display: "flex", gap: "1.5rem" }}>
                <YnFLogo />
                <KeyboardDoubleArrowLeft
                  sx={{ margin: "auto auto", color: palette.primary }}
                />
              </Box>
            ) : (
              <KeyboardDoubleArrowRight
                sx={{ margin: "auto auto", color: palette.primary }}
              />
            )}
          </IconButton>
        </DrawerHeader>
        <p
          style={{
            textAlign: open ? "left" : "center",
            color: palette.neutral500,
            fontSize: "0.5rem",
          }}
        >
          Menu
        </p>

        <Box sx={{ display: "flex", flexDirection: "column", rowGap: "5rem" }}>
          <List
            sx={{
              overflowX: open ? "auto" : "hidden",
              display: "flex",
              flexDirection: "column",
              rowGap: "1.5rem",
            }}
          >
            {links.map((item) => (
              <Link to={item.href} key={item.text} style={linkStyle}>
                <div
                  style={
                    location.pathname === item.href
                      ? {
                          backgroundColor: palette.primary,
                          color: palette.white,
                          borderRadius: "0.25rem",
                        }
                      : {
                          color: palette.primary,
                          backgroundColor: palette.white,
                          borderRadius: "0.25rem",
                        }
                  }
                >
                  <ListItem sx={{ cursor: "pointer", padding: "12px" }}>
                    <ListItemIcon
                      sx={{ color: "inherit", minWidth: "1.8rem" }}
                      title={item.text}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText>
                        <Typography variant="body1" style={linkTextStyle}>
                          {item.text}
                        </Typography>
                      </ListItemText>
                    )}
                  </ListItem>
                </div>
              </Link>
            ))}
          </List>

          {/* FOOTER */}
          <Box
            sx={{
              textAlign: open ? "left" : "center",
              paddingTop: "1rem",
              borderTop: `1px solid ${palette.neutral200}`,
              cursor: "pointer",
            }}
          >
            {/* PROFILE */}
            <Box onClick={() => navigate("/profile")} title={`${admin?.email}`}>
              <p
                style={{
                  color: palette.neutral500,
                  margin: "0 auto",
                  fontSize: "0.5rem",
                }}
              >
                Profile
              </p>
              <p style={{ color: palette.primary, fontSize: "1rem" }}>
                {open ? "Admin" : "Adm..."}
              </p>
              <Typography
                variant="body1"
                sx={{
                  color: palette.neutral500,
                  fontFamily: "inherit",
                  pb: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {open ? admin?.email : `${admin?.email.slice(0, 3)}...`}
              </Typography>
            </Box>

            {/* LOGOUT */}

            <Button
              startIcon={<LogoutOutlined />}
              sx={{
                backgroundColor: palette.neutral50,
                width: "100%",
                textTransform: "none",
                borderRadius: "4px",
              }}
              onClick={handleLogout}
            >
              {open && "Logout"}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
