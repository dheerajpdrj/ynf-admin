import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

const Layout = ({ children }: any) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, minWidth: "80vw", padding: "0 1.5rem" }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
