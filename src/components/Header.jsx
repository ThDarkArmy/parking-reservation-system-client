import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TitleLogo from "../images/TitleLogo.png";
import { useNavigate } from "react-router-dom";
import CallIcon from '@mui/icons-material/Call';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import OwnerPanelIcon from '@mui/icons-material/MedicalServices';
import BookOnlineIcon from '@mui/icons-material/BookOnline';


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
} from "@mui/material";

export default function Header() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [logOutAnchorEl, setLogOutAnchorEl] = useState(null);

  const openLogout = Boolean(logOutAnchorEl);

  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: "#000" }}>
        <Toolbar>
          <IconButton
            onClick={() => navigate("/")}
            disableRipple
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 2 }}
          >
            <Box
              component="img"
              sx={{
                height: 30,
              }}
              alt="Park Me"
              src={TitleLogo}
            />
          </IconButton>
          <Box sx={{flexGrow: 1}}></Box>
          {role && role.toUpperCase() === "USER" && (
            <IconButton
              title="My Bookings"
              onClick={() => navigate("/my-bookings")}
              color="inherit"
              sx={{ marginLeft: 0 }}
            >
             <BookOnlineIcon sx={{color: "green"}}/>
            </IconButton>
          )}
          {role && role.toUpperCase() === "ADMIN" && (
            <IconButton
              title="Admin Panel"
              onClick={() => navigate("/admin-panel")}
              color="inherit"
              sx={{ marginLeft: 0 }}
            >
             <AdminPanelSettingsIcon sx={{color: "green"}}/>
            </IconButton>
          )}

          {role && role.toUpperCase() === "OWNER" && (
            <IconButton
              title="Owner Panel"
              onClick={() => navigate("/owner-panel")}
              color="inherit"
              sx={{ marginLeft: 0 }}
            >
             <OwnerPanelIcon sx={{color: "green"}}/>
            </IconButton>
          )}

          <IconButton
             title="Contact Us"
            onClick={() => setContactDialogOpen(true)}
            color="inherit"
            sx={{ marginLeft: 3 }}
          >
           <CallIcon sx={{color: ""}}/>
          </IconButton>

          <Box sx={{ flexGrow: 0, marginTop: -5, float: "right" }}>
            {loggedInUser ? (
              <Box
                onClick={(event) => setLogOutAnchorEl(event.currentTarget)}
                title="Profile"
                sx={{
                  background: "red",
                  paddingRight: 1,
                  paddingLeft: 1,
                  borderRadius: 3,
                  marginLeft: 4,
                  cursor: "pointer"
                }}
              >
                {" "}
                <Typography
                  variant="h6"
                  sx={{ color: "ThreeDFace", marginTop: 5 }}
                >
                  {" "}
                  {loggedInUser}
                </Typography>
              </Box>
            ) : (
              <Button
                onClick={() => navigate("/login-register")}
                sx={{ color: "blue", marginTop: 5 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Contact Us</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Phone Number : +91 6756437890
            <br />
            Phone Number : +91 6756437891
          </DialogContentText>
          <br />
          <br />
          <DialogContentText id="alert-dialog-description">
            Email : helpdesk@parkme.com
            <br />
            Email : parkme@hotmail.com
          </DialogContentText>
          <br />
          <br />
          <DialogContentText id="alert-dialog-description">
            Address: Sarkar nagar, Pune
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Menu
        id="basic-menu"
        anchorEl={logOutAnchorEl}
        open={openLogout}
        onClose={() => setLogOutAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {role==="USER" && <MenuItem
          onClick={() => {
            navigate("/my-bookings");
          }}
        >
          My Bookings
        </MenuItem>}
        <MenuItem
          onClick={() => {
            navigate("/profile");
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            localStorage.clear();
            setLogOutAnchorEl(null);
            navigate("/login-register");
          }}
        >
          Log Out
        </MenuItem>

      </Menu>
    </Box>
  );
}
